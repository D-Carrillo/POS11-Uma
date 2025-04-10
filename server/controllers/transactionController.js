const db = require('../config/db');

const createTransaction = async (req, res) => {
    try {
        const { customer_id, total_cost, payment_method, total_items, transaction_status, total_discount } = req.body;
        
        const [result] = await db.promise().query(
          `INSERT INTO transaction 
           (Customer_ID, sale_time, Total_cost, Payment_method, Total_items, Transaction_Status, Total_Discount)
           VALUES (?, NOW(), ?, ?, ?, ?, ?)`,
          [customer_id, total_cost, payment_method, total_items, transaction_status, total_discount]
        );
    
        res.status(201).json({ 
          success: true,
          transactionId: result.insertId
        });
      } catch (err) {
        res.status(500).json({ error: 'Transaction creation failed' });
      }
};

const createTransactionItem = async (req, res) => {
    try {
        const { transaction_id, item_id, quantity, subtotal, discount_id, discounted_price } = req.body;
        
        await db.promise().query(
          `INSERT INTO transaction_item 
           (Transaction_ID, Item_ID, Quantity, Subtotal, Discount_ID, Discounted_Price)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [transaction_id, item_id, quantity, subtotal, discount_id, discounted_price]
        );
    
        res.status(201).json({ success: true });
      } catch (err) {
        res.status(500).json({ error: 'Transaction item creation failed' });
      }
};

const getUserTransactions = async (req, res) => {
    try {
        
        const [transactions] = await db.promise().query(`
            SELECT * from transaction
            WHERE Customer_ID = ?
            Order BY sale_time DESC`
            ,
            [req.params.userId]
        );

        let items = [];
        if (transactions.length > 0) {
            const transactionIds = transactions.map(t => t.Transaction_ID);
            const placeholders = transactionIds.map(() => '?').join(',');
        
            const [itemsResults] = await db.promise().query(`
                SELECT 
                ti.Transaction_ID,
                ti.Item_ID,
                ti.Quantity,
                ti.Subtotal,
                ti.Discounted_Price,
                i.Name AS item_name,
                i.description AS item_description,
                i.Price AS item_price
                FROM transaction_item ti
                JOIN item i ON ti.Item_ID = i.Item_ID
                WHERE ti.Transaction_ID IN (${placeholders})
                ORDER BY ti.Transaction_ID DESC
            `, transactionIds);
            
            items = itemsResults;
        }

        res.json({
            success: true,
            transactions: transactions,
            items: items
        });

    }catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch transactions',
            details: {
                message: err.message,
                sql: err.sql,
                stack: err.stack
            }
        });
    }
};

const returnItem = async (req, res) => {
  const { transaction_id, item_id, return_reason } = req.body;

  try {
    const[[item]] = await db.promise().query(`
      Select Quantity, Discounted_Price, Subtotal 
      From transaction_item
      where Transaction_ID = ? and Item_ID = ?`,
    [transaction_id, item_id]);

    if (!item) {
      throw new Error('Item not found in transaction');
    }
    
    const refund_amount = item.Discounted_Price !== null 
      ? item.Discounted_Price * item.Quantity 
      : item.Subtotal;

  

    await db.promise().query(`
      Insert Into return_item (Transaction_ID, Item_ID, return_reason, refund_amount, return_date)
      values (?,?,?,?,CURDATE())`, [transaction_id, item_id, return_reason, refund_amount]
    );
    
    await db.promise().query(`
      Update transaction
      Set Transaction_Status = 0
      Where Transaction_ID = ?
      `, [transaction_id]);

    res.json({
      success: true,
      refund_amount: Number(refund_amount).toFixed(2)
    });
  }catch (err){
    res.status(500).json({
      success: false, error: 'Return failed'
    });
  };
}

module.exports = {
    createTransaction,
    createTransactionItem,
    getUserTransactions,
    returnItem
}