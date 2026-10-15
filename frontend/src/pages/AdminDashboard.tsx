import React, { useState, useEffect } from 'react';
import type { Course, Enrollment } from '../types';
import { api } from '../api/client';
import { useToast } from '../components/Toast';
import {
  LayoutDashboard,
  Plus,
  Edit2,
  Trash2,
  Users,
  BookOpen,
  TrendingUp,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Calendar,
  Mail,
  Phone,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    price: 0,
    capacity: 30,
    thumbnail: '',
    category: 'Lập trình Web',
  });

  // Enrollments Roster Modal State
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [rosterData, setRosterData] = useState<{
    course: any;
    enrollments: Enrollment[];
  } | null>(null);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCourses();
      setCourses(data);
    } catch (err: any) {
      showToast(err.message || 'Không thể tải danh sách khóa học', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      instructor: '',
      price: 1500000,
      capacity: 30,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      category: 'Lập trình Web',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: course.price,
      capacity: course.capacity,
      thumbnail: course.thumbnail || '',
      category: course.category || 'Lập trình Web',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.instructor.trim() || !formData.description.trim()) {
      showToast('Vui lòng điền đầy đủ tiêu đề, giảng viên và mô tả', 'error');
      return;
    }

    if (formData.capacity < 1) {
      showToast('Sĩ số tối đa phải lớn hơn hoặc bằng 1', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCourse) {
        const res = await api.updateCourse(editingCourse.id, formData);
        showToast(res.message, 'success');
      } else {
        const res = await api.createCourse(formData);
        showToast(res.message, 'success');
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      showToast(err.message || 'Thao tác không thành công', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: number, title: string) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${title}"? Tất cả thông tin đăng ký của lớp này sẽ bị xóa!`);
    if (!confirmed) return;

    try {
      const res = await api.deleteCourse(id);
      showToast(res.message, 'success');
      fetchCourses();
    } catch (err: any) {
      showToast(err.message || 'Xóa khóa học thất bại', 'error');
    }
  };

  const openRosterModal = async (courseId: number) => {
    setIsRosterModalOpen(true);
    setIsLoadingRoster(true);
    try {
      const data = await api.getCourseEnrollments(courseId);
      setRosterData(data);
    } catch (err: any) {
      showToast(err.message || 'Không thể tải danh sách học viên', 'error');
      setIsRosterModalOpen(false);
    } finally {
      setIsLoadingRoster(false);
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

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q) ||
      (c.category && c.category.toLowerCase().includes(q))
    );
  });

  // Calculate System Statistics
  const totalCourses = courses.length;
  const totalEnrollments = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
  const totalCapacity = courses.reduce((acc, c) => acc + (c.capacity || 0), 0);
  const fillRate = totalCapacity > 0 ? Math.round((totalEnrollments / totalCapacity) * 100) : 0;

  return (
    <div className="admin-dashboard-container">
      {/* Dashboard Top Header */}
      <div className="admin-header-row">
        <div>
          <div className="admin-badge-strip">
            <LayoutDashboard size={16} /> Bảng Điều Khiển Quản Trị
          </div>
          <h1 className="admin-page-title">Quản Lý Hệ Thống Khóa Học & Đăng Ký</h1>
          <p className="admin-page-subtitle">
            Cấu hình khóa học, thiết lập học phí, giảng viên, quản lý chỉ tiêu sĩ số và theo dõi danh sách học viên
          </p>
        </div>

        <button onClick={openCreateModal} className="btn-primary" id="btn-create-course">
          <Plus size={18} />
          <span>Thêm khóa học mới</span>
        </button>
      </div>

      {/* KPI Stats Widgets */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon icon-blue">
            <BookOpen size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-label">Tổng số khóa học</span>
            <strong className="stat-card-value">{totalCourses}</strong>
            <span className="stat-card-sub">Đang vận hành</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon icon-emerald">
            <Users size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-label">Lượt học viên đăng ký</span>
            <strong className="stat-card-value">{totalEnrollments}</strong>
            <span className="stat-card-sub">Đã ghi danh các lớp</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon icon-purple">
            <TrendingUp size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-label">Tỷ lệ lấp đầy sĩ số</span>
            <strong className="stat-card-value">{fillRate}%</strong>
            <span className="stat-card-sub">{totalEnrollments} / {totalCapacity} chỗ</span>
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="admin-table-controls">
        <div className="admin-search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm theo tên khóa học, giảng viên, danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
            id="admin-search-input"
          />
        </div>
        <div className="table-count-badge">
          Hiển thị: <strong>{filteredCourses.length}</strong> / {totalCourses} khóa học
        </div>
      </div>

      {/* Courses Management Table */}
      <div className="admin-table-card">
        {isLoading ? (
          <div className="loading-grid">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu khóa học...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="admin-empty-table">
            <BookOpen size={40} />
            <h4>Chưa có khóa học nào</h4>
            <p>Nhấn nút "Thêm khóa học mới" để bắt đầu khởi tạo lớp học</p>
          </div>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="admin-courses-table" id="admin-courses-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Khóa học</th>
                  <th>Giảng viên</th>
                  <th>Danh mục</th>
                  <th>Học phí</th>
                  <th>Sĩ số (Đã ĐK / Tối đa)</th>
                  <th>Tình trạng</th>
                  <th className="text-right">Thao tác quản lý</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((c) => {
                  const enrolled = c.enrolledCount || 0;
                  const capacity = c.capacity || 30;
                  const isFull = enrolled >= capacity;
                  const pct = Math.min(100, Math.round((enrolled / capacity) * 100));

                  return (
                    <tr key={c.id} id={`course-row-${c.id}`}>
                      <td className="cell-id">#{c.id}</td>
                      <td className="cell-title">
                        <div className="table-course-item">
                          <img
                            src={
                              c.thumbnail ||
                              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
                            }
                            alt=""
                            className="table-course-thumb"
                          />
                          <div>
                            <strong className="table-course-name">{c.title}</strong>
                            <span className="table-course-desc-short">
                              {c.description.substring(0, 50)}...
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="cell-instructor">
                        <span className="instructor-cell-wrap">
                          <strong>{c.instructor}</strong>
                        </span>
                      </td>
                      <td>
                        <span className="badge-category-small">{c.category || 'Lập trình'}</span>
                      </td>
                      <td className="cell-price">
                        <strong>{formatPrice(c.price)}</strong>
                      </td>
                      <td className="cell-capacity">
                        <div className="capacity-cell-box">
                          <div className="capacity-text-row">
                            <span className={isFull ? 'text-danger font-bold' : ''}>
                              {enrolled} / {capacity}
                            </span>
                            <span className="capacity-pct-text">{pct}%</span>
                          </div>
                          <div className="capacity-mini-bar">
                            <div
                              className={`capacity-mini-fill ${isFull ? 'fill-full' : pct >= 80 ? 'fill-warning' : 'fill-normal'}`}
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {isFull ? (
                          <span className="table-status-badge badge-danger">
                            <AlertCircle size={12} /> Đã đủ sĩ số
                          </span>
                        ) : (
                          <span className="table-status-badge badge-success">
                            <CheckCircle2 size={12} /> Còn {capacity - enrolled} chỗ
                          </span>
                        )}
                      </td>
                      <td className="text-right">
                        <div className="table-action-buttons">
                          {/* View Registrations / Students list button */}
                          <button
                            onClick={() => openRosterModal(c.id)}
                            className="btn-action btn-roster"
                            title="Theo dõi danh sách học viên đã đăng ký lớp này"
                            id={`btn-view-roster-${c.id}`}
                          >
                            <Eye size={15} />
                            <span>Học viên ({enrolled})</span>
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => openEditModal(c)}
                            className="btn-action btn-edit"
                            title="Chỉnh sửa thông tin khóa học"
                            id={`btn-edit-course-${c.id}`}
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteCourse(c.id, c.title)}
                            className="btn-action btn-delete"
                            title="Xóa khóa học"
                            id={`btn-delete-course-${c.id}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL 1: CREATE / EDIT COURSE ================= */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog-card">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  {editingCourse ? 'Chỉnh Sửa Khóa Học' : 'Tạo Khóa Học Mới'}
                </h3>
                <p className="modal-subtitle">
                  {editingCourse
                    ? `Cập nhật thông tin cho khóa học #${editingCourse.id}`
                    : 'Nhập thông tin khóa học, giảng viên, học phí và thiết lập sĩ số tối đa'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="modal-close-btn"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form" id="course-form">
              <div className="form-group">
                <label className="form-label">
                  Tên khóa học <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lập trình Web Fullstack với Next.js & NestJS"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-control"
                  id="input-course-title"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">
                    Giảng viên phụ trách <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: TS. Nguyễn Hoàng Nam"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="form-control"
                    id="input-course-instructor"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Danh mục đào tạo</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-control"
                    id="select-course-category"
                  >
                    <option value="Lập trình Web">Lập trình Web</option>
                    <option value="Backend">Backend & Cloud</option>
                    <option value="AI & Data">AI & Khoa học Dữ liệu</option>
                    <option value="UI/UX Design">Thiết kế UI/UX</option>
                    <option value="Mobile App">Lập trình Di động</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">
                    Học phí (VND) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50000"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="form-control"
                    id="input-course-price"
                  />
                  <small className="form-hint">
                    Hiển thị: {formatPrice(formData.price)}
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Sĩ số tối đa (Capacity) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="form-control"
                    id="input-course-capacity"
                  />
                  <small className="form-hint">
                    Hệ thống sẽ từ chối đăng ký khi lớp đạt sĩ số này
                  </small>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Đường dẫn ảnh Thumbnail (URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="form-control"
                  id="input-course-thumbnail"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Mô tả chi tiết khóa học <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Mô tả mục tiêu, đối tượng tham gia và nội dung đào tạo..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-control"
                  id="input-course-desc"
                ></textarea>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  id="btn-submit-course-form"
                >
                  {isSubmitting
                    ? 'Đang lưu...'
                    : editingCourse
                    ? 'Cập nhật khóa học'
                    : 'Tạo khóa học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ROSTER / ENROLLED STUDENTS LIST ================= */}
      {isRosterModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog-card modal-large">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  Danh Sách Học Viên Đã Ghi Danh Lớp Học
                </h3>
                {rosterData && (
                  <p className="modal-subtitle">
                    Khóa học: <strong>{rosterData.course.title}</strong> — Giảng viên: {rosterData.course.instructor}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsRosterModalOpen(false)}
                className="modal-close-btn"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {isLoadingRoster ? (
              <div className="loading-grid">
                <div className="spinner"></div>
                <p>Đang tải danh sách học viên đăng ký...</p>
              </div>
            ) : rosterData ? (
              <div className="roster-modal-body">
                {/* Capacity Summary Bar */}
                <div className="roster-capacity-summary">
                  <div className="roster-stat-item">
                    <span className="roster-stat-label">Sĩ số hiện tại:</span>
                    <strong className="roster-stat-val">
                      {rosterData.course.enrolledCount} / {rosterData.course.capacity} học viên
                    </strong>
                  </div>
                  <div className="roster-stat-item">
                    <span className="roster-stat-label">Chỗ trống còn lại:</span>
                    <strong className="roster-stat-val text-emerald">
                      {rosterData.course.availableSpots} suất
                    </strong>
                  </div>
                  <div className="roster-stat-item">
                    <span className="roster-stat-label">Trạng thái lớp:</span>
                    <span
                      className={`badge-status ${rosterData.course.enrolledCount >= rosterData.course.capacity ? 'badge-danger' : 'badge-success'}`}
                    >
                      {rosterData.course.enrolledCount >= rosterData.course.capacity
                        ? 'Đã đủ sĩ số'
                        : 'Đang mở đăng ký'}
                    </span>
                  </div>
                </div>

                {/* Table of Enrolled Students */}
                {rosterData.enrollments.length === 0 ? (
                  <div className="roster-empty-state">
                    <Users size={36} />
                    <p>Chưa có học viên nào ghi danh khóa học này.</p>
                  </div>
                ) : (
                  <div className="table-responsive-wrapper">
                    <table className="roster-table" id="roster-students-table">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Học viên</th>
                          <th>Email</th>
                          <th>Số điện thoại</th>
                          <th>Thời gian đăng ký</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rosterData.enrollments.map((enr, idx) => (
                          <tr key={enr.id}>
                            <td>#{idx + 1}</td>
                            <td>
                              <div className="roster-user-cell">
                                <div className="roster-avatar-circle">
                                  {enr.user?.fullName?.charAt(0).toUpperCase() || 'H'}
                                </div>
                                <strong className="roster-user-name">
                                  {enr.user?.fullName || 'Học viên'}
                                </strong>
                              </div>
                            </td>
                            <td>
                              <span className="roster-email-cell">
                                <Mail size={13} /> {enr.user?.email}
                              </span>
                            </td>
                            <td>
                              <span className="roster-phone-cell">
                                <Phone size={13} /> {enr.user?.phone || 'Chưa cập nhật'}
                              </span>
                            </td>
                            <td className="cell-date">
                              <span className="roster-date-cell">
                                <Calendar size={13} /> {formatDate(enr.enrolledAt)}
                              </span>
                            </td>
                            <td>
                              <span className="table-status-badge badge-success">
                                <CheckCircle2 size={12} /> Đã ghi danh
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : null}

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setIsRosterModalOpen(false)}
                className="btn-primary"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
