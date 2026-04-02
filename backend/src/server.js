require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./db');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const APP_NAME = process.env.APP_NAME || 'Expense Tracker';

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await testConnection();
    return res.json({ status: 'ok', app: APP_NAME, database: 'connected' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/expenses', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, amount, category, expense_date, note, created_at, updated_at
       FROM expenses
       ORDER BY expense_date DESC, id DESC`
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const { amount, category, expense_date, note } = req.body;

    if (!amount || !category || !expense_date) {
      return res.status(400).json({ message: 'amount, category, expense_date là bắt buộc.' });
    }

    const [result] = await pool.query(
      `INSERT INTO expenses (amount, category, expense_date, note)
       VALUES (?, ?, ?, ?)`,
      [amount, category, expense_date, note || null]
    );

    const [rows] = await pool.query(
      `SELECT id, amount, category, expense_date, note, created_at, updated_at
       FROM expenses
       WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, expense_date, note } = req.body;

    if (!amount || !category || !expense_date) {
      return res.status(400).json({ message: 'amount, category, expense_date là bắt buộc.' });
    }

    const [result] = await pool.query(
      `UPDATE expenses
       SET amount = ?, category = ?, expense_date = ?, note = ?
       WHERE id = ?`,
      [amount, category, expense_date, note || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khoản chi.' });
    }

    const [rows] = await pool.query(
      `SELECT id, amount, category, expense_date, note, created_at, updated_at
       FROM expenses
       WHERE id = ?`,
      [id]
    );

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM expenses WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khoản chi.' });
    }

    return res.json({ message: 'Xóa thành công.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`${APP_NAME} backend đang chạy tại cổng ${PORT}`);
});
