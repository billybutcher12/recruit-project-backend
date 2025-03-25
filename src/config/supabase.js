const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Kiểm tra xem các biến môi trường có được đọc đúng không
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase URL or Anon Key in environment variables');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = supabase;