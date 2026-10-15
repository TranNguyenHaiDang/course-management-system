import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  ShieldCheck,
  User,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-wrap">
            <GraduationCap className="logo-icon" size={26} />
          </div>
          <div className="logo-text-wrap">
            <span className="logo-title">Edu<span className="accent-text">Pro</span></span>
            <span className="logo-subtitle">Hệ Thống Khóa Học</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            id="nav-home"
          >
            <BookOpen size={18} />
            <span>Trang chủ</span>
          </Link>

          {user && (
            <Link
              to="/my-courses"
              className={`nav-link ${isActive('/my-courses') ? 'active' : ''}`}
              id="nav-my-courses"
            >
              <GraduationCap size={18} />
              <span>Khóa học của tôi</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className={`nav-link admin-nav-link ${isActive('/admin') ? 'active' : ''}`}
              id="nav-admin"
            >
              <LayoutDashboard size={18} />
              <span>Quản trị hệ thống</span>
              <span className="badge-admin">Admin</span>
            </Link>
          )}
        </nav>

        {/* User Actions (Desktop) */}
        <div className="desktop-actions">
          {user ? (
            <div className="user-profile-widget">
              <div className="user-avatar-badge">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="user-avatar-img" />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-meta">
                <span className="user-name">{user.fullName}</span>
                <span className={`user-role-tag ${isAdmin ? 'role-admin' : 'role-student'}`}>
                  {isAdmin ? (
                    <>
                      <ShieldCheck size={12} /> Quản trị viên
                    </>
                  ) : (
                    <>
                      <User size={12} /> Học viên
                    </>
                  )}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-logout"
                title="Đăng xuất"
                id="btn-logout"
              >
                <LogOut size={18} />
                <span>Thoát</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Link to="/login" className="btn-secondary" id="btn-nav-login">
                <LogIn size={16} />
                <span>Đăng nhập</span>
              </Link>
              <Link to="/register" className="btn-primary" id="btn-nav-register">
                <UserPlus size={16} />
                <span>Đăng ký</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          id="btn-mobile-menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-dropdown">
          <Link
            to="/"
            className={`mobile-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <BookOpen size={18} />
            <span>Trang chủ</span>
          </Link>

          {user && (
            <Link
              to="/my-courses"
              className={`mobile-link ${isActive('/my-courses') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <GraduationCap size={18} />
              <span>Khóa học của tôi</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className={`mobile-link ${isActive('/admin') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard size={18} />
              <span>Quản trị hệ thống</span>
              <span className="badge-admin">Admin</span>
            </Link>
          )}

          <div className="mobile-auth-divider"></div>

          {user ? (
            <div className="mobile-user-box">
              <div className="mobile-user-info">
                <span className="user-name">{user.fullName}</span>
                <span className="user-email">{user.email}</span>
                <span className={`user-role-tag ${isAdmin ? 'role-admin' : 'role-student'}`}>
                  {isAdmin ? 'Quản trị viên' : 'Học viên'}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-logout-mobile">
                <LogOut size={16} />
                <span>Đăng xuất tài khoản</span>
              </button>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <Link
                to="/login"
                className="btn-secondary full-width"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn size={16} />
                <span>Đăng nhập</span>
              </Link>
              <Link
                to="/register"
                className="btn-primary full-width"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserPlus size={16} />
                <span>Đăng ký tài khoản</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
