const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const getDashboard = async (req, res) => {
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
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getDashboard };