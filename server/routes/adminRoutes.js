// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all customers
router.get('/customers', (req, res, next) => {
    console.log('Attempting to fetch customers...'); // Debug log

    const query =`
        SELECT
    Customer_ID,
        first_name,
        last_Name,
        Email,
        DOB,
        Phone_Number
    FROM customer
    WHERE is_deleted = 0
    ORDER BY last_Name, first_name`
        ;

    db.query(query, (err, customers) => {
        if (err) {
            console.error('Database error details:', {
                message: err.message,
                sqlMessage: err.sqlMessage,
                code: err.code,
                sqlState: err.sqlState,
                sql: err.sql
            });
            return next(err);
        }


        res.json({
            success: true,
            data: customers
        });
    });
});

module.exports = router;