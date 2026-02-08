import express from 'express';
import cors from 'cors';
import { sequelize } from './models/index.js';

import productRoutes from './routes/products.js';
import deliveryOptionRoutes from './routes/deliveryOptions.js';
import cartItemRoutes from './routes/cartItems.js';
import orderRoutes from './routes/orders.js';
import resetRoutes from './routes/reset.js';
import paymentSummaryRoutes from './routes/paymentSummary.js';

import { Product } from './models/Product.js';
import { DeliveryOption } from './models/DeliveryOption.js';
import { CartItem } from './models/CartItem.js';
import { Order } from './models/Order.js';

import { defaultProducts } from './defaultData/defaultProducts.js';
import { defaultDeliveryOptions } from './defaultData/defaultDeliveryOptions.js';
import { defaultCart } from './defaultData/defaultCart.js';
import { defaultOrders } from './defaultData/defaultOrders.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API routes
app.use('/api/products', productRoutes);
app.use('/api/delivery-options', deliveryOptionRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reset', resetRoutes);
app.use('/api/payment-summary', paymentSummaryRoutes);

// Health check (important for Render)
app.get('/', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database sync & seed
await sequelize.sync();

if (await Product.count() === 0) {
  const timestamp = Date.now();

  await Product.bulkCreate(defaultProducts.map((p, i) => ({
    ...p,
    createdAt: new Date(timestamp + i),
    updatedAt: new Date(timestamp + i)
  })));

  await DeliveryOption.bulkCreate(defaultDeliveryOptions.map((o, i) => ({
    ...o,
    createdAt: new Date(timestamp + i),
    updatedAt: new Date(timestamp + i)
  })));

  await CartItem.bulkCreate(defaultCart.map((c, i) => ({
    ...c,
    createdAt: new Date(timestamp + i),
    updatedAt: new Date(timestamp + i)
  })));

  await Order.bulkCreate(defaultOrders.map((o, i) => ({
    ...o,
    createdAt: new Date(timestamp + i),
    updatedAt: new Date(timestamp + i)
  })));

  console.log('Default data seeded.');
}

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
