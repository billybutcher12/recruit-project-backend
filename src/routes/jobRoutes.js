const express = require('express');
const { authenticate, isStaff } = require('../middleware/auth');
const setSupabaseAuth = require('../middleware/setSupabaseAuth');
const supabase = require('../config/supabase');
const router = express.Router();

router.use(setSupabaseAuth);

// Lấy danh sách công việc
router.get('/', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase.from('jobs').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Không thể tải danh sách công việc.' });
  }
});

// Thêm công việc mới (chỉ staff)
router.post('/', authenticate, isStaff, async (req, res) => {
  const { title, description, location, type, is_published } = req.body;
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert([{ title, description, location, type, is_published, created_by: req.user.id }])
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: 'Lỗi khi thêm công việc.' });
  }
});

// Lấy chi tiết công việc theo id
router.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Công việc không tồn tại.' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Không thể tải thông tin công việc.' });
  }
});

module.exports = router;