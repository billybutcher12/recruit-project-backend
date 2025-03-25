const supabase = require('../config/supabase');
const bcrypt = require('bcrypt');

const createUser = async (full_name, email, password, staff_code = null, role = 'candidate') => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from('users')
    .insert([{ full_name, email, password: hashedPassword, staff_code, role }])
    .select();
  if (error) throw new Error(error.message);
  return data[0];
};

const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

module.exports = { createUser, findUserByEmail };