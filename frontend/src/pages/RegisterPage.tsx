import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { UserPlus, GraduationCap, Mail, Lock, User, Phone, ShieldCheck } from 'lucide-react';
import type { Role } from '../types';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' as Role,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
      showToast('Vui lòng điền đầy đủ các thông tin bắt buộc', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Mật khẩu phải chứa ít nhất 6 ký tự', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        role: formData.role,
      });

      showToast(`Đăng ký tài khoản thành công! Vui lòng đăng nhập để tiếp tục.`, 'success');
      navigate('/login');
    } catch (err: any) {
      showToast(err.message || 'Đăng ký tài khoản thất bại', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <GraduationCap size={28} />
          </div>
          <h1 className="auth-title">Đăng Ký Tài Khoản</h1>
          <p className="auth-subtitle">
            Khởi đầu hành trình học tập và làm chủ công nghệ cùng EduPro
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="auth-form" id="register-form">
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">
              Họ và tên <span className="text-danger">*</span>
            </label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                id="register-name"
                type="text"
                required
                placeholder="Ví dụ: Nguyễn Văn An"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Địa chỉ Email <span className="text-danger">*</span>
            </label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="register-email"
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-phone">
              Số điện thoại liên hệ
            </label>
            <div className="input-with-icon">
              <Phone className="input-icon" size={18} />
              <input
                id="register-phone"
                type="tel"
                placeholder="0987654321"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          {/* Role selector */}
          <div className="form-group">
            <label className="form-label">Vai trò tài khoản</label>
            <div className="role-selection-grid">
              <label
                className={`role-option-box ${formData.role === 'STUDENT' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="role"
                  value="STUDENT"
                  checked={formData.role === 'STUDENT'}
                  onChange={() => setFormData({ ...formData, role: 'STUDENT' })}
                  className="role-radio"
                />
                <User size={18} />
                <div>
                  <strong>Học viên (Student)</strong>
                  <small>Tra cứu, đăng ký và theo dõi khóa học</small>
                </div>
              </label>

              <label
                className={`role-option-box ${formData.role === 'ADMIN' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={formData.role === 'ADMIN'}
                  onChange={() => setFormData({ ...formData, role: 'ADMIN' })}
                  className="role-radio"
                />
                <ShieldCheck size={18} />
                <div>
                  <strong>Quản trị viên (Admin/Staff)</strong>
                  <small>Toàn quyền quản lý và thiết lập hệ thống</small>
                </div>
              </label>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="register-password">
                Mật khẩu <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input
                  id="register-password"
                  type="password"
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-confirm-password">
                Xác nhận mật khẩu <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input
                  id="register-confirm-password"
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary btn-auth-submit"
            id="btn-register-submit"
          >
            <UserPlus size={18} />
            <span>{isLoading ? 'Đang tạo tài khoản...' : 'Hoàn tất đăng ký'}</span>
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Đã có tài khoản?{' '}
            <Link to="/login" className="auth-link">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
