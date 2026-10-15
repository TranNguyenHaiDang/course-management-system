import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { LogIn, GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Vui lòng nhập email và mật khẩu', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Chào mừng bạn quay trở lại, ${user.fullName}!`, 'success');
      navigate(redirectUrl);
    } catch (err: any) {
      showToast(err.message || 'Đăng nhập không thành công', 'error');
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
          <h1 className="auth-title">Đăng Nhập Tài Khoản</h1>
          <p className="auth-subtitle">
            Truy cập hệ thống đào tạo và quản lý khóa học EduPro
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form" id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Địa chỉ Email
            </label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="login-email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>
                Mật khẩu
              </label>
              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Vui lòng liên hệ Quản trị viên để đặt lại mật khẩu', 'info');
                }}
                className="auth-link"
                style={{ fontSize: '0.8rem' }}
              >
                Quên mật khẩu?
              </a>
            </div>
            <div className="input-with-icon" style={{ position: 'relative' }}>
              <Lock className="input-icon" size={18} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted, #94a3b8)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                }}
                tabIndex={-1}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0 16px 0' }}>
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: 'var(--primary-color, #4f46e5)', cursor: 'pointer' }}
            />
            <label
              htmlFor="remember-me"
              style={{ fontSize: '0.875rem', color: 'var(--text-muted, #94a3b8)', cursor: 'pointer' }}
            >
              Ghi nhớ đăng nhập trên thiết bị này
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary btn-auth-submit"
            id="btn-login-submit"
          >
            <LogIn size={18} />
            <span>{isLoading ? 'Đang xác thực...' : 'Đăng nhập ngay'}</span>
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Chưa có tài khoản?{' '}
            <Link to="/register" className="auth-link">
              Đăng ký tài khoản mới
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
