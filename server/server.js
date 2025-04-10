
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const reportRoutes = require('./routes/reportRoutes');
const itemsRoutes = require('./routes/itemsRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const discountRoutes = require('./routes/discountRoutes');
require('./config/db'); // Initialize DB connection

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api', customerRoutes);
app.use('/api', supplierRoutes);
app.use('/api', reportRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/', transactionRoutes);
app.use('/api', discountRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));