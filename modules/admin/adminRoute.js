const express = require('express');
const AdminCtr = require('./adminController');
const AdminMiddleware = require('./adminMiddleware');
const bannerRoute = require('./banner/bannerRoute');
const infoRoute = require('./info/infoRoute');
const frameRoute = require('./hall-frame-info/infoRoute');
const popularRoute = require('./popular-nft/popularRoute');
const dashbaordRoute = require('./dashboard/dashboardRoute');
const Auth = require('../../helper/auth');

const adminRoute = express.Router();
// get roles
const addNewAdmin = [
  AdminMiddleware.validateAdd,
  AdminMiddleware.checkAlreadyAdded,
  AdminCtr.addNewAdmin,
];
adminRoute.post('/add', addNewAdmin);

// login admin
const login = [AdminMiddleware.validateLogin, AdminCtr.login];
adminRoute.post('/login', login);

// banner route
adminRoute.use('/banner', bannerRoute);

// popular route
adminRoute.use('/popular', popularRoute);

// info route
adminRoute.use('/info', infoRoute);

// hall of frame info route
adminRoute.use('/hall-frame-info', frameRoute);

// dahborad route
adminRoute.use('/dashboard', dashbaordRoute);
module.exports = adminRoute;
