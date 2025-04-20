// server/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/today-sales', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT IFNULL(SUM(Total_cost), 0) AS todaySales 
      FROM transaction 
      WHERE DATE(sale_time) = CURDATE()
    `);
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/total-products', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT COUNT(*) AS totalProducts 
      FROM item 
      WHERE is_deleted = 0
    `);
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/low-stock-items', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT COUNT(*) AS lowStockItems 
      FROM item 
      WHERE stock_quantity <= reorder_Threshold 
      AND is_deleted = 0
    `);
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/active-suppliers', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT COUNT(*) AS activeSuppliers 
      FROM supplier 
      WHERE is_deleted = 0
    `);
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/recent-transactions', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT t.Transaction_ID, t.sale_time, t.Total_cost, t.Payment_method
      FROM transaction t
      ORDER BY t.sale_time DESC
      LIMIT 5
    `);
    res.json({ recentTransactions: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/inventory-status', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT i.Item_ID, i.Name, i.stock_quantity, i.reorder_Threshold
      FROM item i
      WHERE i.is_deleted = 0
      ORDER BY i.stock_quantity ASC
      LIMIT 5
    `);
    res.json({ inventoryStatus: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/sales-trend', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        DATE(sale_time) AS date,
        SUM(Total_cost) AS total
      FROM transaction
      WHERE sale_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(sale_time)
      ORDER BY date DESC
      LIMIT 2
    `);
    res.json({ salesTrend: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;