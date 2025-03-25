const { supabase } = require('../config/supabase');

const setSupabaseAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    supabase.auth.setAuth(token);
  }
  next();
};

module.exports = setSupabaseAuth;