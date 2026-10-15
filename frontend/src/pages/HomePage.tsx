import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../types';
import { api } from '../api/client';
import { CourseCard } from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Search, Sparkles, BookOpen, Users, Award, ShieldCheck } from 'lucide-react';

const CATEGORIES = [
  'Tất cả',
  'Lập trình Web',
  'Backend',
  'AI & Data',
  'UI/UX Design',
  'Mobile App',
];

export const HomePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [isLoading, setIsLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchCourses = async (query?: string, category?: string) => {
    setIsLoading(true);
    try {
      const data = await api.getCourses(query, category);
      setCourses(data);
    } catch (err: any) {
      showToast(err.message || 'Không thể tải danh sách khóa học', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(searchQuery, activeCategory);
  }, [activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses(searchQuery, activeCategory);
  };

  const handleQuickEnroll = async (courseId: number) => {
    if (!user) {
      showToast('Vui lòng đăng nhập để đăng ký khóa học', 'info');
      navigate(`/login?redirect=${encodeURIComponent(`/courses/${courseId}`)}`);
      return;
    }

    setEnrollingId(courseId);
    try {
      const res = await api.enroll(courseId);
      showToast(res.message, 'success');
      // Refresh list to update capacity and enrolled state
      fetchCourses(searchQuery, activeCategory);
    } catch (err: any) {
      showToast(err.message || 'Đăng ký thất bại', 'error');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} /> Nền Tảng Đào Tạo Chuyên Sâu 2026
          </div>
          <h1 className="hero-title">
            Khám Phá Tri Thức Mới <br />
            <span className="gradient-text">Nâng Tầm Sự Nghiệp Số</span>
          </h1>
          <p className="hero-desc">
            Tham gia các chương trình đào tạo công nghệ hàng đầu cùng đội ngũ giảng viên giàu kinh
            nghiệm. Đăng ký dễ dàng, quản lý sĩ số lớp học chặt chẽ và học tập hiệu quả.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="hero-search-form" id="search-form">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên khóa học, giảng viên, từ khóa..."
                className="hero-search-input"
                id="search-input"
              />
            </div>
            <button type="submit" className="hero-search-btn" id="btn-search-submit">
              Tìm kiếm
            </button>
          </form>

          {/* Highlights */}
          <div className="hero-stats-row">
            <div className="stat-pill">
              <BookOpen size={16} className="stat-icon" />
              <span>Chương trình thực chiến</span>
            </div>
            <div className="stat-pill">
              <Users size={16} className="stat-icon" />
              <span>Giới hạn sĩ số tối ưu</span>
            </div>
            <div className="stat-pill">
              <Award size={16} className="stat-icon" />
              <span>Chứng chỉ tốt nghiệp</span>
            </div>
            <div className="stat-pill">
              <ShieldCheck size={16} className="stat-icon" />
              <span>Bảo lưu & Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog Section */}
      <section className="catalog-section" id="courses">
        <div className="catalog-header">
          <div>
            <h2 className="catalog-title">Danh Sách Khóa Học Mở Đăng Ký</h2>
            <p className="catalog-subtitle">
              Lựa chọn khóa học phù hợp với định hướng nghề nghiệp của bạn
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="category-pills-list">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="loading-grid">
            <div className="spinner"></div>
            <p>Đang tải danh sách khóa học từ hệ thống...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-catalog-state">
            <BookOpen size={48} className="empty-icon" />
            <h3>Không tìm thấy khóa học nào phù hợp</h3>
            <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('Tất cả');
                fetchCourses('', 'Tất cả');
              }}
              className="btn-secondary"
            >
              Xem tất cả khóa học
            </button>
          </div>
        ) : (
          <div className="courses-grid" id="courses-grid">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={handleQuickEnroll}
                isEnrolling={enrollingId === course.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
