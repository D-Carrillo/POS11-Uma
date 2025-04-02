const db = require('../config/db');

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
    const { period, itemId } = req.query; // Added itemId here

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
