import React from 'react';
import { GraduationCap, Heart, Shield, Award, Users } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <GraduationCap className="footer-logo-icon" size={24} />
              <span>Edu<span className="accent-text">Pro</span></span>
            </div>
            <p className="footer-desc">
              Hệ sinh thái đào tạo công nghệ thông tin và phát triển kỹ năng số thực chiến.
              Kết nối học viên với các giảng viên chuyên gia hàng đầu.
            </p>
            <div className="footer-badges">
              <span className="footer-badge"><Shield size={14} /> Bảo mật & Uy tín</span>
              <span className="footer-badge"><Award size={14} /> Chứng chỉ chuẩn</span>
              <span className="footer-badge"><Users size={14} /> Sĩ số giới hạn</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Danh mục khóa học</h4>
            <ul>
              <li>Lập trình Web Fullstack</li>
              <li>Backend & Cloud Architecture</li>
              <li>Trí tuệ nhân tạo (AI & Data)</li>
              <li>Thiết kế Giao diện UI/UX</li>
              <li>Lập trình Ứng dụng Di động</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Hệ thống & Nghiệp vụ</h4>
            <ul>
              <li>Phân quyền Admin / Student</li>
              <li>Kiểm soát sĩ số lớp tối đa</li>
              <li>Ngăn ngừa đăng ký trùng lặp</li>
              <li>Theo dõi tiến độ học tập cá nhân</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Hỗ trợ học viên</h4>
            <p className="footer-contact">Hotline: 1900 6868</p>
            <p className="footer-contact">Email: support@course.vn</p>
            <p className="footer-contact">Thời gian: 08:00 - 21:00 (T2 - CN)</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} EduPro Course Management System. All rights reserved.</p>
          <p className="made-with">
            Phát triển với sự tận tâm và tiêu chuẩn chất lượng cao <Heart size={14} className="heart-icon" />
          </p>
        </div>
      </div>
    </footer>
  );
};
