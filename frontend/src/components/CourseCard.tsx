import React from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../types';
import { Users, UserCheck, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: number) => void;
  isEnrolling?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, isEnrolling }) => {
  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const enrolled = course.enrolledCount || 0;
  const capacity = course.capacity || 30;
  const percentFull = Math.min(100, Math.round((enrolled / capacity) * 100));
  const isFull = course.isFull || enrolled >= capacity;
  const isEnrolled = course.isUserEnrolled;

  const fallbackThumbnail =
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';

  return (
    <div className={`course-card ${isFull ? 'card-full' : ''} ${isEnrolled ? 'card-enrolled' : ''}`}>
      {/* Thumbnail Header */}
      <div className="card-thumb-wrap">
        <img
          src={course.thumbnail || fallbackThumbnail}
          alt={course.title}
          className="card-thumb-img"
          loading="lazy"
        />
        <div className="card-overlay-badges">
          <span className="badge-category">{course.category || 'Khóa học'}</span>

          {isEnrolled && (
            <span className="badge-status badge-success">
              <CheckCircle2 size={13} /> Đã ghi danh
            </span>
          )}
          {!isEnrolled && isFull && (
            <span className="badge-status badge-danger">
              <AlertCircle size={13} /> Đã hết chỗ
            </span>
          )}
          {!isEnrolled && !isFull && (
            <span className="badge-status badge-slots">
              Còn {course.availableSpots ?? capacity - enrolled} chỗ
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body">
        <h3 className="card-title" title={course.title}>
          <Link to={`/courses/${course.id}`}>{course.title}</Link>
        </h3>

        <div className="card-instructor">
          <div className="instructor-avatar-icon">
            <UserCheck size={14} />
          </div>
          <span className="instructor-name">{course.instructor}</span>
        </div>

        <p className="card-desc">
          {course.description.length > 115
            ? `${course.description.substring(0, 115)}...`
            : course.description}
        </p>

        {/* Capacity Meter */}
        <div className="capacity-container">
          <div className="capacity-header">
            <span className="capacity-label">
              <Users size={14} /> Sĩ số lớp học
            </span>
            <span className={`capacity-value ${isFull ? 'text-danger' : ''}`}>
              <strong>{enrolled}</strong> / {capacity} học viên
            </span>
          </div>
          <div className="capacity-bar-track">
            <div
              className={`capacity-bar-fill ${percentFull >= 100 ? 'fill-full' : percentFull >= 80 ? 'fill-warning' : 'fill-normal'}`}
              style={{ width: `${percentFull}%` }}
            ></div>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="card-footer">
          <div className="price-tag">
            <span className="price-label">Học phí</span>
            <span className="price-amount">{formatPrice(course.price)}</span>
          </div>

          <div className="card-actions">
            <Link
              to={`/courses/${course.id}`}
              className="btn-card-detail"
              id={`btn-course-detail-${course.id}`}
            >
              <span>Chi tiết</span>
              <ArrowRight size={14} />
            </Link>

            {onEnroll && !isEnrolled && !isFull && (
              <button
                onClick={() => onEnroll(course.id)}
                disabled={isEnrolling}
                className="btn-card-enroll"
                id={`btn-quick-enroll-${course.id}`}
                title="Đăng ký ngay khóa học này"
              >
                {isEnrolling ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
