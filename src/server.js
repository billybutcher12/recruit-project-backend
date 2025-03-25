require('dotenv').config({ path: './src/.env' }); // Thêm dòng này để tải biến môi trường từ .env
const express = require('express');
const cors = require('cors');
const app = express();
const { createClient } = require('@supabase/supabase-js');
const ExcelJS = require('exceljs');

// Import routes
const applyRoutes = require('./routes/applyRoutes');

// Khởi tạo Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Cấu hình CORS
const allowedOrigins = [
  'http://localhost:5173', // Để chạy local
  'https://your-frontend.vercel.app' // Thay bằng URL thực tế của frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Dữ liệu giả lập cho công việc (giữ nguyên)
let jobs = [
  {
    id: 1,
    title: 'Lập trình viên Full-Stack',
    salary: '20-30 triệu VND/tháng',
    description: 'Phát triển và duy trì các ứng dụng web full-stack sử dụng React và Node.js.',
    requirements: 'Tốt nghiệp ĐH chuyên ngành CNTT, có ít nhất 2 năm kinh nghiệm với React và Node.js, hiểu biết về cơ sở dữ liệu SQL và NoSQL.',
    postedDate: '2023-10-01'
  },
  {
    id: 2,
    title: 'Nhân viên Marketing Online',
    salary: '15-25 triệu VND/tháng',
    description: 'Lên kế hoạch và thực hiện các chiến dịch quảng cáo trên các nền tảng số như Google Ads, Facebook Ads.',
    requirements: 'Tốt nghiệp ĐH chuyên ngành Marketing, có kinh nghiệm 1-2 năm trong lĩnh vực quảng cáo số, kỹ năng phân tích dữ liệu tốt.',
    postedDate: '2023-10-02'
  },
  {
    id: 3,
    title: 'Kỹ sư DevOps',
    salary: '25-40 triệu VND/tháng',
    description: 'Quản lý và tối ưu hóa hạ tầng đám mây, triển khai CI/CD pipeline cho các dự án.',
    requirements: 'Có kinh nghiệm với AWS hoặc Azure, thành thạo Docker và Kubernetes, hiểu biết về các công cụ CI/CD như Jenkins hoặc GitLab CI.',
    postedDate: '2023-10-03'
  },
  {
    id: 4,
    title: 'Intern Frontend Developer',
    salary: '3 triệu VND/tháng',
    description: 'Thành thạo lập trình front-end 3D với Three.js, phát triển các ứng dụng web 3D.',
    requirements: 'Có kinh nghiệm với AWS hoặc Azure, thành thạo Docker và Kubernetes, hiểu biết về các công cụ CI/CD như Jenkins hoặc GitLab CI.',
    postedDate: '2023-10-03'
  },
  {
    id: 5,
    title: 'Intern Backend Developer',
    salary: '5 triệu VND/tháng',
    description: 'Master Node.js và Express, tham gia phát triển các dự án backend.',
    requirements: 'Thành thạo Node.js và Express, có kiến thức về cơ sở dữ liệu SQL và NoSQL, có khả năng làm việc nhóm tốt.',
    postedDate: '2023-10-03'
  },
  {
    id: 6,
    title: 'Intern DevOps',
    salary: '2-4 triệu VND/tháng',
    description: 'Quản lý và tối ưu hóa hạ tầng đám mây, triển khai CI/CD pipeline cho các dự án.',
    requirements: 'Có kinh nghiệm với Docker và Kubernetes, hiểu biết về các công cụ CI/CD như Jenkins hoặc GitLab CI.',
    postedDate: '2023-10-03'
  }
];

// Dữ liệu tĩnh cho ứng viên (lấy từ AdminPage.jsx)
const applicants = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "nguyenvana@example.com",
    position: "Developer",
    status: "Chưa đánh giá",
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0987654321",
    email: "tranthib@example.com",
    position: "Designer",
    status: "Đậu",
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0369852147",
    email: "levanc@example.com",
    position: "Marketing",
    status: "Trượt",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    phone: "0912345678",
    email: "phamthid@example.com",
    position: "HR Manager",
    status: "Đậu",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    phone: "0987654321",
    email: "hoangvane@example.com",
    position: "Product Manager",
    status: "Chưa đánh giá",
  },
];

// Route GET /api/jobs - Lấy danh sách công việc giả lập
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

// Route POST /api/jobs - Thêm công việc mới (giả lập)
app.post('/api/jobs', (req, res) => {
  const newJob = {
    id: jobs.length + 1,
    title: req.body.title,
    salary: req.body.salary,
    description: req.body.description,
    requirements: req.body.requirements,
    postedDate: new Date().toISOString().split('T')[0],
  };
  jobs.push(newJob);
  res.status(201).json(newJob);
});

// Route GET /api/jobs/:id - Lấy chi tiết công việc giả lập
app.get('/api/jobs/:id', (req, res) => {
  const jobId = parseInt(req.params.id);
  const job = jobs.find((j) => j.id === jobId);
  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ error: 'Công việc không tồn tại' });
  }
});

// Route POST /api/apply - Xử lý ứng tuyển thực tế
app.use('/api/apply', applyRoutes);

// Thêm Route GET /api/admin/dashboard - Lấy dữ liệu dashboard từ Supabase
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    // Lấy dữ liệu từ bảng applications trong Supabase
    const { data: applications, error } = await supabase
      .from('applications')
      .select('*');

    if (error) throw new Error(error.message);

    // Đảm bảo applications là một mảng, nếu không thì trả về mảng rỗng
    const safeApplications = Array.isArray(applications) ? applications : [];

    const today = new Date().toISOString().split('T')[0];
    const todayApps = safeApplications.filter(app => app.created_at && app.created_at.startsWith(today));
    const monthApps = safeApplications.filter(app => app.created_at && app.created_at.startsWith(today.slice(0, 7)));

    const report = {
      today: todayApps.length,
      month: monthApps.length,
      passed: safeApplications.filter(app => app.status === 'Đậu').length,
      potential: safeApplications.filter(app => app.status === 'Chưa đánh giá').length,
      failed: safeApplications.filter(app => app.status === 'Trượt').length,
    };

    res.json({ report, applications: safeApplications });
  } catch (error) {
    console.error('Error in getDashboard:', error);
    res.status(400).json({ error: error.message, stack: error.stack });
  }
});

// Thêm Route GET /api/export-static-report - Xuất báo cáo Excel từ dữ liệu tĩnh
app.get('/api/export-static-report', async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Báo cáo ứng viên');

    worksheet.columns = [
      { header: 'Họ và Tên', key: 'name', width: 20 },
      { header: 'Số điện thoại', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Vị trí', key: 'position', width: 20 },
      { header: 'Trạng thái', key: 'status', width: 15 },
    ];

    applicants.forEach(app => {
      worksheet.addRow({
        name: app.name || '',
        phone: app.phone || '',
        email: app.email || '',
        position: app.position || '',
        status: app.status || 'Chưa đánh giá',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=bao-cao-ung-vien-static.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error in export-static-report:', error);
    res.status(500).json({ error: error.message });
  }
});

// Thêm Route GET /api/export-report - Xuất báo cáo Excel từ Supabase (giữ nguyên)
app.get('/api/export-report', async (req, res) => {
  try {
    const { data: applications, error } = await supabase.from('applications').select('*');
    if (error) throw new Error(error.message);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Báo cáo ứng viên');

    worksheet.columns = [
      { header: 'Họ và Tên', key: 'full_name', width: 20 },
      { header: 'Số điện thoại', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Vị trí', key: 'position', width: 20 },
      { header: 'Trạng thái', key: 'status', width: 15 },
    ];

    applications.forEach(app => {
      worksheet.addRow({
        full_name: app.full_name || '',
        phone: app.phone || '',
        email: app.email || '',
        position: app.position || '',
        status: app.status || 'Chưa đánh giá',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=bao-cao-ung-vien.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error in export-report:', error);
    res.status(500).json({ error: error.message });
  }
});

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ error: 'Không tìm thấy endpoint' });
});

// Xử lý lỗi server
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Lỗi server nội bộ' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên http://localhost:${PORT}`);
});