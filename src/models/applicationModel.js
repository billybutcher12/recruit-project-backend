const supabase = require('../config/supabase');

const createApplication = async (full_name, phone, email, position, cv_url) => {
  const { data, error } = await supabase.from('applications')
    .insert([{ full_name, phone, email, position, cv_url }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// Lấy danh sách ứng viên
const getApplications = async () => {
  const { data, error } = await supabase.from('applications').select('*');
  if (error) throw new Error(error.message);
  return data;
};

module.exports = { createApplication, getApplications };
