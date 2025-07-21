const { sendReportQueue, reminderQueue, addWhatsAppJob } = require('../utils/queues');
const Patient = require('../Models/Patient');

exports.sendReportJob = async (req, res, next) => {
  try {
    const { patientId } = req.body;
    const patient = await Patient.findById(patientId);

    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    await sendReportQueue.add('send-patient-report', {
      patientId,
      name: patient.name,
      email: patient.email,
      message: 'Your nutrition report is ready',
    });

    await addWhatsAppJob(patient.email, `${patient.name}, your nutrition report is ready`);

    res.status(200).json({ message: 'Report job queued successfully' });
  } catch (err) {
    next(err);
  }
};

exports.sendReminderJob = async (req, res, next) => {
  try {
    const { patientId } = req.body;
    const patient = await Patient.findById(patientId);

    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    await reminderQueue.add('send-coach-reminder', {
      patientId,
      name: patient.name,
      email: patient.email,
      message: 'Reminder: You have a scheduled coach call tomorrow',
    });

    await addWhatsAppJob(patient.email, `${patient.name}, you have a coach call reminder`);

    res.status(200).json({ message: 'Reminder job queued successfully' });
  } catch (err) {
    next(err);
  }
};
