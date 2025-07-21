const Patient = require('../Models/Patient');
const { getJobStats } = require('../utils/queues');

exports.getAdminDashboard = async (req, res, next) => {
  try {
    const totalPatients = await Patient.countDocuments();

    const patients = await Patient.find();
    const totalBMI = patients.reduce((sum, p) => sum + (p.fatPercent || 0), 0);
    const avgBMI = patients.length ? (totalBMI / patients.length).toFixed(2) : 0;

    const { sentReports, whatsappDelivered, reminderCount, crmSynced} = await getJobStats();

    res.json({
      totalPatients,
      averageBMI: avgBMI,
      reportsSent: sentReports,
      whatsappMessagesDelivered: whatsappDelivered,
      remindercount: reminderCount,
      crmSynced,
    });
  } catch (err) {
    next(err);
  }
};
