const db = require('../config/db');
const { subDays } = require('date-fns');


exports.getCustomerReports = async (req, res) => {
    const { period, customerId } = req.params;

    if (!customerId || !period) {
        return res.status(400).json({ error: 'Missing customer ID or period' });
    }

    // Set date format based on period
    let dateFormat, dateCondition;
    const now = new Date(); // Current date/time
    
    switch (period) {
        case 'weekly':
            dateFormat = '%Y-%u'; // Year-Week number
            const oneWeekAgo = new Date(now); // Clone the date
            oneWeekAgo.setDate(now.getDate() - 7);
            dateCondition = `t.sale_time >= '${oneWeekAgo.toISOString().slice(0, 19).replace('T', ' ')}'`;
            break;
            
        case 'monthly':
            dateFormat = '%Y-%m';
            const oneMonthAgo = new Date(now); // Clone the date
            oneMonthAgo.setMonth(now.getMonth() - 1);
            dateCondition = `t.sale_time >= '${oneMonthAgo.toISOString().slice(0, 19).replace('T', ' ')}'`;
            break;
            
        case 'yearly':
            dateFormat = '%Y';
            const oneYearAgo = new Date(now); // Clone the date
            oneYearAgo.setFullYear(now.getFullYear() - 1);
            dateCondition = `t.sale_time >= '${oneYearAgo.toISOString().slice(0, 19).replace('T', ' ')}'`;
            break;
            
        default:
            return res.status(400).json({ error: 'Invalid period' });
    }

    const query = `
        SELECT 
            DATE_FORMAT(t.sale_time, ?) AS period, 
            SUM(t.Total_cost) AS total_spent,
            COUNT(t.Transaction_ID) AS transaction_count, 
            SUM(t.Total_items) AS total_items_purchased, 
            AVG(t.Total_cost) AS average_order_value 
        FROM transaction AS t
        WHERE t.Customer_ID = ? 
        AND ${dateCondition}
        GROUP BY period
        ORDER BY period DESC
    `;

    db.query(query, [dateFormat, customerId], (err, results) => {
        if (err) {
            console.error('Report error:', err);
            return res.status(500).json({ error: 'Failed to generate report' });
        }
        res.json(results);
    });
};

exports.getSupplierReport = async (req, res) => {
    const { supplierId } = req.params;
    const { period, itemId } = req.query;

    if (!supplierId) {
        return res.status(400).json({ error: 'Supplier ID is required' });
    }

    let dateCondition = '';
    let queryParams = [supplierId];

    if (period) {
        const now = new Date();
        let startDate;

        switch (period) {
            case 'weekly':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                break;
            case 'yearly':
                startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                break;
            default:
                return res.status(400).json({ error: 'Invalid period specified' });
        }

        dateCondition = `AND t.sale_time >= ?`;
        queryParams.push(startDate);
    }

    const itemCondition = itemId ? `AND i.Item_ID = ?` : '';
    if (itemId) queryParams.push(itemId);

    const query = `
        SELECT 
            i.Item_ID,
            i.Name AS item_name,
            COUNT(t.Transaction_ID) AS times_sold,
            SUM(ti.Quantity) AS total_quantity,
            SUM(ti.Subtotal) AS total_revenue
        FROM transaction_item AS ti
        JOIN transaction t ON ti.Transaction_ID = t.Transaction_ID
        JOIN item AS i ON ti.Item_ID = i.Item_ID
        WHERE i.supplier_ID = ?
        ${itemCondition}
        ${dateCondition}
        GROUP BY i.Item_ID
        ORDER BY total_revenue DESC
    `;

    try {
        const [results] = await db.query(query, queryParams);
        res.json(results);
    } catch (err) {
        console.error('Supplier report error:', err);
        res.status(500).json({ error: 'Failed to generate supplier report', details: err.message });
    }
};


exports.getSpendingReport = async (req, res) => {
    const { userID } = req.params;
    const { period, startDate, endDate } = req.query;

    console.log("thisistheback", { userID, period, startDate, endDate });

    const now = new Date();
    let dateFilter = {};

    if (period === 'custom' && startDate && endDate) {
        dateFilter = {
            gte: new Date(`${startDate}T00:00:00.000Z`),
            lte: new Date(`${endDate}T23:59:59.999Z`)
        };
    } else if (period === 'day') {
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        dateFilter = {
            gte: startOfDay,
            lte: endOfDay
        };
    } else if (period === 'week') {
        const startOfWeek = subDays(now, 6);
        startOfWeek.setHours(0, 0, 0, 0);

        dateFilter = {
            gte: startOfWeek,
            lte: now
        };
    } else if (period === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter = {
            gte: startOfMonth,
            lte: now
        };
    } else if (period === 'year') {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        dateFilter = {
            gte: startOfYear,
            lte: now
        };
    } else {
        // Fallback (last 30 days)
        dateFilter = {
            gte: subDays(now, 30),
            lte: now
        };
    }


    try {
        const [trend] = await db.promise().query(
            `SELECT 
                ANY_VALUE(CASE 
                    WHEN ? = 'day' THEN DATE_FORMAT(t.sale_time, '%H:00')
                    WHEN ? = 'week' THEN DATE_FORMAT(t.sale_time, '%Y-%m-%d')
                    WHEN ? = 'month' THEN DATE_FORMAT(t.sale_time, '%Y-%m')
                    WHEN ? = 'year' THEN DATE_FORMAT(t.sale_time, '%Y')
                    ELSE DATE_FORMAT(t.sale_time, '%Y-%m-%d')
                END) AS period,
                COUNT(t.Transaction_ID) AS transaction_count,
                SUM(COALESCE(t.Total_cost, 0)) AS total_spent,
                SUM(COALESCE(t.Total_items, 0)) AS total_items_sold,
                AVG(COALESCE(t.Total_cost, 0)) AS average_order_value
            FROM transaction t
            WHERE t.Customer_ID = ?
            AND t.sale_time BETWEEN ? AND ?
            AND t.Transaction_Status = 1
            GROUP BY 
                CASE 
                    WHEN ? = 'day' THEN DATE_FORMAT(t.sale_time, '%H')
                    WHEN ? = 'week' THEN DATE_FORMAT(t.sale_time, '%Y-%m-%d')
                    WHEN ? = 'month' THEN DATE_FORMAT(t.sale_time, '%Y-%m')
                    WHEN ? = 'year' THEN DATE_FORMAT(t.sale_time, '%Y')
                    ELSE DATE_FORMAT(t.sale_time, '%Y-%m-%d')
                END
            ORDER BY period`,
            [ period, period, period, period, userID, dateFilter.gte, dateFilter.lte, period, period, period, period ] );

        const [categories] = await db.promise().query(`
            SELECT 
                c.Category_Name AS category_name,
                SUM(COALESCE(t.Total_cost, 0)) AS total_spent
            FROM transaction t
            JOIN transaction_item ti ON t.Transaction_ID = ti.Transaction_ID
            JOIN item i ON ti.Item_ID = i.Item_ID
            JOIN category c ON i.Category_ID = c.Category_ID
            WHERE t.Customer_ID = ?
            AND t.Transaction_Status = 1
            AND t.sale_time BETWEEN ? AND ?
            GROUP BY c.Category_Name
        `, [userID, dateFilter.gte, dateFilter.lte]);

        // for the trend data
        const total_spent = trend.reduce((sum, row) => sum + parseFloat(row.total_spent || 0), 0);
        const total_items = trend.reduce((sum, row) => sum + parseInt(row.total_items_sold || 0), 0);
        const transaction_count = trend.reduce((sum, row) => sum + parseInt(row.transaction_count || 0), 0);
        const average_order_value = transaction_count > 0 ? total_spent / transaction_count : 0;

        console.log({
            total_spent,
            total_items,
            transaction_count,
            average_order_value,
        });

        res.json({
            total_spent,
            total_items,
            transaction_count,
            average_order_value,
            spending_trend: trend,
            category_breakdown: categories,
        });
    } catch (err) {
        console.error('Supplier report error:', err);
        res.status(500).json({ error: 'Failed to generate supplier report', details: err.message });
    }
};
