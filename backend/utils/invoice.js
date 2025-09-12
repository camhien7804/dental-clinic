// backend/utils/invoice.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import QRCode from "qrcode"; // dùng bản async

export const generateInvoice = async (appointment) => {
  const doc = new PDFDocument({ margin: 50 });
  const invoicesDir = path.join(process.cwd(), "backend", "invoices");
  if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true });

  const filePath = path.join(invoicesDir, `invoice_${appointment._id}.pdf`);
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // ✅ Font paths (Windows)
  const arialRegular = "C:/Windows/Fonts/Arial.ttf";
  const arialBold = "C:/Windows/Fonts/Arialbd.ttf";
  const fontRegular = fs.existsSync(arialRegular) ? arialRegular : "Helvetica";
  const fontBold = fs.existsSync(arialBold) ? arialBold : "Helvetica-Bold";

  // ========== HEADER ==========
  const logoPath = path.join(process.cwd(), "backend", "public", "logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 60 }); // logo góc trái
  }

  doc.font(fontBold).fontSize(20).fillColor("#0E8040")
    .text("PHÒNG KHÁM NHA KHOA OU", 120, 50);

  doc.moveDown(0.5);
  doc.font(fontRegular).fontSize(16).fillColor("#000")
    .text("HÓA ĐƠN XÁC NHẬN LỊCH KHÁM", 120, 80);

  doc.moveDown();
  doc.font(fontRegular).fontSize(12).fillColor("#333")
    .text(`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`, { align: "right" });

  doc.moveDown(2);

  // ========== THÔNG TIN BỆNH NHÂN ==========
  doc.font(fontRegular).fontSize(12).fillColor("#000");
  doc.text(`Mã lịch hẹn: ${appointment._id}`);
  doc.text(`Tên bệnh nhân: ${appointment.patientName}`);
  doc.text(`Số điện thoại: ${appointment.patientPhone}`);
  if (appointment.patientEmail) doc.text(`Email: ${appointment.patientEmail}`);

  doc.moveDown();
  doc.font(fontRegular).fillColor("#333");
  doc.text("Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM");
  doc.text("Hotline: 1900 123 456");

  doc.moveDown(2);

  // ========== BẢNG CHI TIẾT ==========
  const tableTop = doc.y;
  const col1 = 50, col2 = 220, col3 = 370, col4 = 470;

  doc.rect(col1, tableTop, 500, 20).fill("#f0f0f0").stroke();
  doc.font(fontBold).fillColor("#0E8040").fontSize(12);
  doc.text("Dịch vụ", col1 + 5, tableTop + 5);
  doc.text("Bác sĩ", col2, tableTop + 5);
  doc.text("Thời gian", col3, tableTop + 5);
  doc.text("Giá (VND)", col4, tableTop + 5);

  doc.font(fontRegular).fillColor("#000").fontSize(12);
  const rowY = tableTop + 30;
  doc.text(appointment.service, col1 + 5, rowY);
  doc.text(appointment.dentist?.user?.name || "Chưa gán", col2, rowY);
  doc.text(appointment.timeSlot, col3, rowY);
  doc.text(appointment.servicePrice?.toLocaleString("vi-VN") || "0", col4, rowY);

  doc.moveTo(50, rowY + 20).lineTo(550, rowY + 20).stroke();
  doc.font(fontBold).text("Tổng cộng:", col3, rowY + 30);
  doc.font(fontRegular).text(
    (appointment.servicePrice?.toLocaleString("vi-VN") || "0") + " VND",
    col4, rowY + 30
  );

  doc.moveDown(2);

  // ========== GHI CHÚ ==========
  if (appointment.notes) {
    doc.font(fontRegular).fontSize(12).fillColor("#333")
      .text(`Ghi chú: ${appointment.notes}`);
    doc.moveDown();
  }

  if (appointment.status === "completed") {
    doc.moveDown(1);
    doc.font(fontBold).fontSize(14).fillColor("#0E8040")
      .text("Chi tiết điều trị", { underline: true });
    if (appointment.treatmentNotes) {
      doc.font(fontRegular).text(`Ghi chú điều trị: ${appointment.treatmentNotes}`);
    }
    if (appointment.prescriptions?.length) {
      doc.text(`Đơn thuốc: ${appointment.prescriptions.join(", ")}`);
    }
    if (appointment.followUpDate) {
      doc.text(`Ngày tái khám: ${new Date(appointment.followUpDate).toLocaleDateString("vi-VN")}`);
    }
  }

  // ========== QR CODE ==========
if (appointment._id) {
  const qrData = await QRCode.toDataURL(`http://localhost:5173/appointments/${appointment._id}`);
  const base64Data = qrData.replace(/^data:image\/png;base64,/, "");
  const qrPath = path.join(invoicesDir, `qr_${appointment._id}.png`);
  fs.writeFileSync(qrPath, base64Data, "base64");

  if (fs.existsSync(qrPath)) {
    const currentY = doc.y + 20;
    doc.image(qrPath, 50, currentY, { width: 100 });

    // 👇 Note nhỏ dưới QR
    doc.font(fontRegular).fontSize(10).fillColor("#555")
      .text("Quét mã QR để xem chi tiết lịch hẹn", 50, currentY + 105, {
        width: 100,
        align: "center"
      });

    doc.moveDown(6);
  }
}


  // Footer
  doc.moveDown(2);
  doc.font(fontRegular).fontSize(11).fillColor("#333")
    .text("Vui lòng đến đúng giờ hẹn. Chúc quý khách luôn mạnh khỏe và giữ nụ cười tươi đẹp!", {
      align: "center"
    });

  doc.end();

  return new Promise((resolve) => {
    stream.on("finish", () => resolve(filePath));
  });
};
