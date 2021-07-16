const DashboardModel = require('../modules/admin/dashboard/dashboardModel');
const Utils = require('../helper/utils');
const Dashboard = {};

Dashboard.inializeDashboard = async () => {
  try {
    await DashboardModel.insertMany([
      { name: 'Banner', slugtext: 'Banner', isActive: true },
      { name: 'Top Nft', slugtext: 'Top Nft', isActive: true },
      { name: 'Hall Of Frame', slugText: 'Hall Of Frame', isActive: true },
      { name: 'Collections', slugText: 'Collections', isActive: true },
      { name: 'Info', slugText: 'Info', isActive: true },
      { name: 'Profile Info', slugText: 'profile-info', isActive: true },
    ]);
  } catch (err) {
    Utils.echoLog('error in adding new roles');
  }
};

module.exports = Dashboard;
