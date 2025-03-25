const { sendEmail } = require('../utils/email');

const applyJob = async (req, res) => {
  try {
    const { full_name, phone, email, position } = req.body;
    if (!full_name || !phone || !email || !position) {
      return res.status(400).json({ error: 'Thiếu thông tin ứng tuyển' });
    }

    const cv = req.file;
    if (!cv) {
      return res.status(400).json({ error: 'Vui lòng tải lên file CV (PDF)' });
    }
    const cv_url = `http://localhost:5000/uploads/${cv.filename}`;

    // Gửi email thông báo
    const emailSubject = `Ứng tuyển vị trí: ${position}`;
    const emailText = `
      Có một đơn ứng tuyển mới:
      - Họ và tên: ${full_name}
      - Số điện thoại: ${phone}
      - Email: ${email}
      - Vị trí: ${position}
      - CV: ${cv_url}
    `;
    await sendEmail('nguyenthuantai00@gmail.com', emailSubject, emailText);

    res.status(201).json({ message: 'Ứng tuyển thành công' });
  } catch (error) {
    console.error('Lỗi khi ứng tuyển:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

module.exports = { applyJob };
