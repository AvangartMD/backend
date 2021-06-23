const express = require('express');
const seeders = require('./seeders/seedersRoute');
const userRoute = require('./modules/user/userRoute');
const adminRoute = require('./modules/admin/adminRoute');
const nftRoute = require('./modules/nft/nftRoute');
const categoryRoute = require('./modules/category/categoryRoute');
const notificationRoute = require('./modules/notification/notificationRoute');
const likeRoute = require('./modules/like/likeRoute');
// Routes Path

const app = express.Router();

// Routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/seeders', seeders);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/nft', nftRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/notification', notificationRoute);
app.use('/api/v1/like', likeRoute);
app.all('/*', (req, res) =>
  res.status(404).json({ message: 'Invalid Request' })
);

module.exports = app;
