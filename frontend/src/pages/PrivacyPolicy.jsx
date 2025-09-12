import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        Trang chủ &gt; Chính sách bảo mật
      </nav>

      <h1 className="text-3xl font-bold text-emerald-800 mb-6">
        Chính sách bảo mật
      </h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Giới thiệu</h2>
          <p>
            Trang web của chúng tôi cam kết bảo vệ thông tin cá nhân của khách
            hàng. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và
            bảo mật dữ liệu.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Thông tin thu thập</h2>
          <p>
            Chúng tôi có thể thu thập các thông tin như: họ tên, số điện thoại,
            email, lịch sử đặt hẹn và phản hồi của khách hàng.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Mục đích sử dụng</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Hỗ trợ tư vấn và đặt lịch khám.</li>
            <li>Cải thiện chất lượng dịch vụ.</li>
            <li>Gửi thông tin khuyến mãi, ưu đãi.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Bảo mật dữ liệu</h2>
          <p>
            Dữ liệu cá nhân được lưu trữ an toàn và chỉ sử dụng cho mục đích đã
            nêu. Chúng tôi không chia sẻ dữ liệu với bên thứ ba nếu không có sự
            đồng ý của khách hàng.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Liên hệ</h2>
          <p>
            Nếu có bất kỳ thắc mắc nào liên quan đến chính sách bảo mật, vui
            lòng liên hệ qua email:{" "}
            <a
              href="mailto:it@nhakhoaou.com"
              className="text-blue-600 underline"
            >
              it@nhakhoaou.com
            </a>{" "}
            hoặc hotline:{" "}
            <a href="tel:19001234" className="text-blue-600 underline">
              1900 1234
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
