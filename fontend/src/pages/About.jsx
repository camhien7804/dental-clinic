// src/pages/About.jsx
import React from "react";
import Section from "../components/common/Section";

export default function About() {
  return (
    <div className="bg-gray-50">
      {/* Section 1: Giới thiệu mở đầu */}
      <Section
        breadcrumbs={["Trang chủ", "Giới thiệu"]}
        title="Giới thiệu nha khoa OU"
        subtitle="Người bạn trọn đời"
        description={`Nha khoa OU là hệ thống nha khoa chuyên sâu theo tiêu chuẩn quốc tế, hướng tới điều trị tổng thể và toàn diện. Với đội ngũ bác sĩ giỏi, công nghệ hiện đại và sự tận tâm trong từng trải nghiệm, chúng tôi luôn đồng hành cùng bạn trên hành trình chăm sóc nụ cười khỏe mạnh.`}
        imageSrc="/images/about/sanh_nha_khoa.png"
        imageAlt="Giới thiệu nha khoa"
        imagePosition="right"
      />

      {/* Section 2: Đạt hạng Red Diamond Provider */}
      <Section
        title="Đạt hạng Red Diamond Provider 2024 – Hàng đầu châu Á"
        description={`Nha khoa OU tự hào là đối tác kim cương đỏ của Invisalign – mức vinh danh cao nhất cho các đơn vị chỉnh nha trong khu vực châu Á. Giải thưởng này phản ánh uy tín và chất lượng điều trị mà chúng tôi không ngừng hoàn thiện.`}
        imageSrc="/images/about/award_02.png"
        imageAlt="Red Diamond Provider"
        imagePosition="left"
      />

      {/* Section 3: Số hoá nha khoa */}
      <Section
        title="Đi đầu về số hoá nha khoa"
        description={`Chúng tôi ứng dụng toàn diện công nghệ số: Scan 3D, thiết kế nụ cười CAD/CAM, trí tuệ nhân tạo AI chẩn đoán. Quy trình số hóa giúp điều trị chính xác, nhanh chóng và trải nghiệm thoải mái hơn cho khách hàng.`}
        imageSrc="/images/about/Digital-Work.jpg"
        imageAlt="Nha khoa số hoá"
        imagePosition="right"
      />

      {/* Section 4: Triết lý chăm sóc */}
      <Section
        title="Triết lý chăm sóc nụ cười khoẻ đẹp từ gốc"
        description={`Chúng tôi tin rằng một nụ cười khoẻ đẹp bắt nguồn từ sự chăm sóc toàn diện. Triết lý điều trị tại OU không chỉ xử lý triệu chứng, mà tập trung vào nguyên nhân gốc rễ để mang lại hiệu quả lâu dài và bền vững.`}
        imageSrc="/images/about/nho_rang.png"
        imageAlt="Triết lý chăm sóc"
        imagePosition="left"
      />

      {/* Section 5: Cam kết tiêu chuẩn 5C */}
      <Section
        title="Cam kết tiêu chuẩn 5C"
        description={`Chúng tôi cam kết thực hiện 5 tiêu chuẩn vàng:\n
1. Chăm sóc trải nghiệm khách hàng chu đáo.\n
2. Dịch vụ chất lượng, chuyên môn cao.\n
3. Vệ sinh vô trùng tuyệt đối.\n
4. Quan tâm từng cá nhân.\n
5. Gắn kết cộng đồng.`}
        imageSrc="/images/about/banner_06.png"
        imageAlt="Cam kết 5C"
        imagePosition="right"
      />
    </div>
  );
}
