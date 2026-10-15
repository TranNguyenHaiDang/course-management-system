import 'dotenv/config';
import { PrismaClient, Role, EnrollmentStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('--- Bắt đầu khởi tạo dữ liệu mẫu (Seeding) ---');

  // Xóa dữ liệu cũ (theo thứ tự quan hệ)
  await prisma.enrollment.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash('Password123!', 10);

  // 1. Tạo Users (Admin, Students)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@course.vn',
      password: defaultPassword,
      fullName: 'Trần Quản Trị (Admin)',
      role: Role.ADMIN,
      phone: '0901234567',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: 'student@course.vn',
      password: defaultPassword,
      fullName: 'Nguyễn Văn An (Học viên)',
      role: Role.STUDENT,
      phone: '0987654321',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'student2@course.vn',
      password: defaultPassword,
      fullName: 'Lê Thị Bích (Học viên)',
      role: Role.STUDENT,
      phone: '0911223344',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  });

  console.log('Đã tạo tài khoản:');
  console.log(' - Admin:   admin@course.vn   / Password123!');
  console.log(' - Student: student@course.vn / Password123!');
  console.log(' - Student: student2@course.vn / Password123!');

  // 2. Tạo Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Lập trình Web Fullstack với React & NestJS',
      description: 'Khóa học trang bị toàn diện kiến trúc Web hiện đại từ Frontend React, TypeScript, TailwindCSS đến Backend RESTful API với NestJS, Prisma ORM và cơ sở dữ liệu PostgreSQL. Bao gồm đồ án thực chiến quản lý học tập.',
      instructor: 'TS. Nguyễn Hoàng Nam',
      price: 2500000,
      capacity: 30,
      category: 'Lập trình Web',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Khóa học Chuyên sâu TypeScript & Node.js Backend',
      description: 'Làm chủ kiến trúc Microservices, Clean Architecture, Dependency Injection, JWT Authentication, Redis Caching và Docker Deployment cho hệ thống hàng triệu người dùng.',
      instructor: 'ThS. Phạm Minh Tuấn',
      price: 1800000,
      capacity: 25,
      category: 'Backend',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'Thiết kế Giao diện UI/UX Hiện đại với Figma',
      description: 'Nắm vững quy trình thiết kế trải nghiệm người dùng (UX Research), xây dựng Design System đồng bộ, thiết kế wireframe, tương tác prototype chuyên nghiệp chuẩn quốc tế.',
      instructor: 'Designer Mai Thảo Vy',
      price: 1200000,
      capacity: 20,
      category: 'UI/UX Design',
      thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    },
  });

  const course4 = await prisma.course.create({
    data: {
      title: 'Nhập môn Trí tuệ Nhân tạo & Machine Learning',
      description: 'Khám phá thế giới AI qua Python, Pandas, Scikit-learn, TensorFlow và Deep Learning. Thực hành xây dựng mô hình dự đoán và thị giác máy tính với các bài toán thực tiễn.',
      instructor: 'PGS. Lê Quốc Cường',
      price: 3500000,
      capacity: 15,
      category: 'AI & Data',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    },
  });

  // Khóa học sĩ số chỉ 2 học viên (để kiểm tra điều kiện lớp đầy)
  const course5Full = await prisma.course.create({
    data: {
      title: 'Masterclass Lập trình Di động Flutter (Lớp VIP Giới Hạn)',
      description: 'Lớp học kèm đặc biệt quy mô tối đa 2 học viên. Trực tiếp thực chiến xây dựng ứng dụng di động đa nền tảng iOS & Android với Flutter và Firebase.',
      instructor: 'Kỹ sư Đặng Hải Đăng',
      price: 4900000,
      capacity: 2,
      category: 'Mobile App',
      thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80',
    },
  });

  const course6 = await prisma.course.create({
    data: {
      title: 'Khoa học Dữ liệu & Phân tích Kinh doanh (Data Analytics)',
      description: 'Biến dữ liệu thô thành chiến lược kinh doanh đắt giá với SQL, Power BI, Python và kỹ thuật trực quan hóa Dashboard phân tích xu hướng.',
      instructor: 'ThS. Hoàng Thu Trang',
      price: 2800000,
      capacity: 25,
      category: 'AI & Data',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    },
  });

  console.log('Đã tạo 6 khóa học mẫu.');

  // 3. Tạo Enrollments
  // Student 1 đăng ký Course 1 & Course 5 (VIP)
  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      courseId: course1.id,
      status: EnrollmentStatus.ENROLLED,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      courseId: course5Full.id,
      status: EnrollmentStatus.ENROLLED,
    },
  });

  // Student 2 đăng ký Course 5 (VIP) -> Course 5 đạt sĩ số tối đa 2/2!
  await prisma.enrollment.create({
    data: {
      userId: student2.id,
      courseId: course5Full.id,
      status: EnrollmentStatus.ENROLLED,
    },
  });

  console.log('Đã tạo enrollments mẫu: Course 5 hiện đã đầy (2/2 học viên)!');
  console.log('--- Hoàn tất Seeding thành công! ---');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error('Lỗi khi seed dữ liệu:', e);
  process.exit(1);
});
