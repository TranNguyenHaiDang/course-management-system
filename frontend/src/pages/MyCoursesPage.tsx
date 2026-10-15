import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Enrollment } from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
  GraduationCap,
  Calendar,
  UserCheck,
  ArrowRight,
  BookOpen,
  Trash2,
  Mail,
  Phone,
  CheckCircle2,
} from 'lucide-react';

export const MyCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchMyEnrollments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getMyEnrollments();
      setEnrollments(data);
    } catch (err: any) {
      showToast(err.message || 'Không thể tải danh sách khóa học của bạn', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const handleCancelEnrollment = async (courseId: number, courseTitle: string) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn hủy đăng ký khóa học "${courseTitle}"?`);
    if (!confirmed) return;

    setCancellingId(courseId);
    try {
      const res = await api.cancelEnrollment(courseId);
      showToast(res.message, 'success');
      // Refresh list
      fetchMyEnrollments();
    } catch (err: any) {
      showToast(err.message || 'Hủy đăng ký thất bại', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="my-courses-container">
      {/* User Profile Card Banner */}
      <div className="profile-banner-card">
        <div className="profile-avatar-wrap">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.fullName} className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-placeholder">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>

        <div className="profile-details-wrap">
          <div className="profile-title-row">
            <h1 className="profile-name">{user?.fullName}</h1>
            <span className="profile-role-badge">Học viên EduPro</span>
          </div>

          <div className="profile-contact-row">
            <span className="profile-info-item">
              <Mail size={15} /> {user?.email}
            </span>
            {user?.phone && (
              <span className="profile-info-item">
                <Phone size={15} /> {user.phone}
              </span>
            )}
          </div>
        </div>

        <div className="profile-stats-card">
          <span className="stats-number">{enrollments.length}</span>
          <span className="stats-label">Khóa học đã đăng ký</span>
        </div>
      </div>

      {/* Courses List Section */}
      <div className="my-courses-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Khóa Học Đã Ghi Danh Thành Công</h2>
            <p className="section-desc">
              Theo dõi lịch sử và thông tin các lớp học bạn đang tham gia
            </p>
          </div>
          <Link to="/" className="btn-secondary" id="btn-explore-more">
            <BookOpen size={16} /> Khám phá thêm khóa học
          </Link>
        </div>

        {isLoading ? (
          <div className="loading-grid">
            <div className="spinner"></div>
            <p>Đang tải danh sách các khóa học đã ghi danh...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="empty-enrollments-card">
            <div className="empty-icon-circle">
              <GraduationCap size={44} />
            </div>
            <h3>Bạn chưa đăng ký khóa học nào</h3>
            <p>
              Hãy khám phá các khóa học công nghệ chất lượng cao tại trang chủ để bắt đầu lộ trình
              học tập của mình ngay hôm nay.
            </p>
            <Link to="/" className="btn-primary" id="btn-empty-explore">
              <BookOpen size={16} /> Khám phá danh sách khóa học
            </Link>
          </div>
        ) : (
          <div className="enrolled-courses-list" id="enrolled-courses-list">
            {enrollments.map((item) => {
              const c = item.course;
              return (
                <div key={item.id} className="enrolled-course-item" id={`enrolled-item-${c.id}`}>
                  {/* Thumbnail */}
                  <div className="enrolled-thumb-wrap">
                    <img
                      src={
                        c.thumbnail ||
                        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
                      }
                      alt={c.title}
                      className="enrolled-thumb-img"
                    />
                    <span className="badge-category-small">{c.category || 'Khóa học'}</span>
                  </div>

                  {/* Course Info */}
                  <div className="enrolled-info-col">
                    <div className="enrolled-status-chip">
                      <CheckCircle2 size={13} /> Đã ghi danh thành công
                    </div>
                    <h3 className="enrolled-course-title">
                      <Link to={`/courses/${c.id}`}>{c.title}</Link>
                    </h3>

                    <div className="enrolled-meta-tags">
                      <span className="meta-tag">
                        <UserCheck size={14} /> Giảng viên: <strong>{c.instructor}</strong>
                      </span>
                      <span className="meta-tag">
                        <Calendar size={14} /> Ngày ghi danh: {formatDate(item.enrolledAt)}
                      </span>
                    </div>

                    <p className="enrolled-desc">
                      {c.description.length > 130
                        ? `${c.description.substring(0, 130)}...`
                        : c.description}
                    </p>
                  </div>

                  {/* Actions & Price */}
                  <div className="enrolled-actions-col">
                    <div className="enrolled-price">{formatPrice(c.price)}</div>

                    <div className="enrolled-buttons-wrap">
                      <Link
                        to={`/courses/${c.id}`}
                        className="btn-card-detail"
                        id={`btn-view-enrolled-${c.id}`}
                      >
                        <span>Vào khóa học</span>
                        <ArrowRight size={14} />
                      </Link>

                      <button
                        onClick={() => handleCancelEnrollment(c.id, c.title)}
                        disabled={cancellingId === c.id}
                        className="btn-cancel-enroll"
                        id={`btn-cancel-${c.id}`}
                        title="Hủy đăng ký khóa học này"
                      >
                        <Trash2 size={14} />
                        <span>{cancellingId === c.id ? 'Đang hủy...' : 'Hủy đăng ký'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
