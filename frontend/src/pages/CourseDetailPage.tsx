import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Course } from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
  Users,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchCourseDetail = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await api.getCourse(Number(id));
      setCourse(data);
    } catch (err: any) {
      showToast(err.message || 'Không tìm thấy thông tin khóa học', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const handleEnroll = async () => {
    if (!course) return;

    if (!user) {
      showToast('Vui lòng đăng nhập trước khi đăng ký khóa học', 'info');
      navigate(`/login?redirect=${encodeURIComponent(`/courses/${course.id}`)}`);
      return;
    }

    setIsEnrolling(true);
    try {
      const res = await api.enroll(course.id);
      showToast(res.message, 'success');
      // Re-fetch to update accurate server numbers
      fetchCourseDetail();
    } catch (err: any) {
      showToast(err.message || 'Đăng ký không thành công', 'error');
    } finally {
      setIsEnrolling(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (isLoading) {
    return (
      <div className="detail-loading-page">
        <div className="spinner"></div>
        <p>Đang tải thông tin chi tiết khóa học...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="not-found-container">
        <h2>Không tìm thấy khóa học</h2>
        <p>Khóa học bạn yêu cầu không tồn tại hoặc đã bị gỡ bỏ.</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={16} /> Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const enrolled = course.enrolledCount || 0;
  const capacity = course.capacity || 30;
  const availableSpots = Math.max(0, capacity - enrolled);
  const isFull = course.isFull || enrolled >= capacity;
  const isEnrolled = course.isUserEnrolled;
  const percentFull = Math.min(100, Math.round((enrolled / capacity) * 100));

  const fallbackThumbnail =
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="course-detail-container">
      {/* Breadcrumb Navigation */}
      <nav className="detail-breadcrumb">
        <Link to="/" className="breadcrumb-link">
          <ArrowLeft size={16} /> Trang chủ
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{course.title}</span>
      </nav>

      {/* Hero Header Card */}
      <div className="detail-hero-card">
        <div className="detail-hero-left">
          <div className="detail-badge-row">
            <span className="badge-category">{course.category || 'Công nghệ'}</span>
            {isEnrolled && (
              <span className="badge-status badge-success">
                <CheckCircle2 size={14} /> Bạn đã ghi danh
              </span>
            )}
            {!isEnrolled && isFull && (
              <span className="badge-status badge-danger">
                <AlertCircle size={14} /> Đã đủ số lượng học viên
              </span>
            )}
            {!isEnrolled && !isFull && (
              <span className="badge-status badge-slots">
                Còn {availableSpots} suất đăng ký
              </span>
            )}
          </div>

          <h1 className="detail-title">{course.title}</h1>

          <div className="detail-instructor-strip">
            <div className="instructor-badge-icon">
              <UserCheck size={18} />
            </div>
            <div>
              <span className="instructor-title-label">Giảng viên phụ trách</span>
              <h4 className="instructor-title-name">{course.instructor}</h4>
            </div>
          </div>

          <p className="detail-lead-desc">{course.description}</p>
        </div>

        {/* Hero Image */}
        <div className="detail-hero-right">
          <img
            src={course.thumbnail || fallbackThumbnail}
            alt={course.title}
            className="detail-hero-img"
          />
        </div>
      </div>

      {/* Main Content Layout (2 columns) */}
      <div className="detail-body-grid">
        {/* Left Column: Description & Course Syllabus */}
        <div className="detail-main-info">
          <div className="info-card">
            <h2 className="info-card-title">Mô Tả Chi Tiết Khóa Học</h2>
            <div className="info-card-text">
              <p>{course.description}</p>
              <p>
                Khóa học được thiết kế theo lộ trình chuẩn, kết hợp giữa lý thuyết nền tảng vững
                chắc và các dự án thực tế giúp học viên tự tin làm việc tại các doanh nghiệp công nghệ
                lớn.
              </p>
            </div>
          </div>

          <div className="info-card">
            <h2 className="info-card-title">Nội Dung & Giá Trị Bạn Sẽ Đạt Được</h2>
            <ul className="learning-outcomes-list">
              <li>
                <Sparkles size={16} className="outcome-icon" />
                <span>Nắm vững toàn diện kiến thức cốt lõi và tư duy lập trình hiện đại.</span>
              </li>
              <li>
                <Sparkles size={16} className="outcome-icon" />
                <span>Thực hành xây dựng các sản phẩm thực chiến theo chuẩn doanh nghiệp.</span>
              </li>
              <li>
                <Sparkles size={16} className="outcome-icon" />
                <span>Được giảng viên <strong>{course.instructor}</strong> kèm cặp và giải đáp thắc mắc trực tiếp.</span>
              </li>
              <li>
                <Sparkles size={16} className="outcome-icon" />
                <span>Nhận chứng nhận hoàn thành khóa học từ học viện EduPro.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Sticky Registration & Capacity Box */}
        <div className="detail-sidebar">
          <div className="enroll-checkout-card">
            <div className="checkout-price-section">
              <span className="checkout-price-label">Học phí trọn khóa</span>
              <div className="checkout-price-value">{formatPrice(course.price)}</div>
            </div>

            {/* Capacity Meter */}
            <div className="detail-capacity-box">
              <div className="detail-capacity-header">
                <span className="detail-capacity-title">
                  <Users size={16} /> Tình trạng sĩ số
                </span>
                <span className={`detail-capacity-count ${isFull ? 'text-danger' : ''}`}>
                  {enrolled} / {capacity} học viên
                </span>
              </div>
              <div className="capacity-bar-track">
                <div
                  className={`capacity-bar-fill ${percentFull >= 100 ? 'fill-full' : percentFull >= 80 ? 'fill-warning' : 'fill-normal'}`}
                  style={{ width: `${percentFull}%` }}
                ></div>
              </div>
              <p className="detail-capacity-note">
                {isFull
                  ? '⚠️ Lớp học đã đạt sĩ số tối đa. Hệ thống tạm ngưng nhận thêm đăng ký.'
                  : `🎯 Hiện còn ${availableSpots} chỗ trống cho khóa học này.`}
              </p>
            </div>

            {/* Registration Action Button */}
            <div className="checkout-cta-wrap">
              {isEnrolled ? (
                <div className="already-enrolled-banner">
                  <CheckCircle2 size={20} />
                  <div>
                    <strong>Đã đăng ký thành công</strong>
                    <p>Khóa học đã có trong trang cá nhân của bạn</p>
                  </div>
                  <Link to="/my-courses" className="btn-secondary full-width mt-2">
                    Xem khóa học của tôi
                  </Link>
                </div>
              ) : isFull ? (
                <button
                  disabled
                  className="btn-enroll-submit btn-disabled"
                  id="btn-enroll-full"
                >
                  <AlertCircle size={18} /> Khóa học đã hết chỗ
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="btn-enroll-submit"
                  id="btn-direct-enroll"
                >
                  <GraduationCap size={20} />
                  <span>{isEnrolling ? 'Đang tiến hành ghi danh...' : 'Đăng ký tham gia ngay'}</span>
                </button>
              )}
            </div>

            {/* Extra assurance points */}
            <div className="checkout-perks">
              <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon" />
                <span>Hoàn tiền 100% trong 7 ngày đầu nếu không hài lòng</span>
              </div>
              <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon" />
                <span>Hỗ trợ kỹ thuật và giải đáp bài tập 1:1</span>
              </div>
              <div className="perk-item">
                <CheckCircle2 size={16} className="perk-icon" />
                <span>Truy cập tài liệu và video bài giảng trọn đời</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
