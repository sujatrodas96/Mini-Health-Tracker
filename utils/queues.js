const Bull = require('bull');
const { sendWhatsAppMessage } = require('./whatsappService');
const { sendZohoMessage } = require('./zohoService');

// ==================== Redis Queues ====================

const sendReportQueue = new Bull('sendReportQueue', {
  redis: { host: '127.0.0.1', port: 6379 },
});

const reminderQueue = new Bull('reminderQueue', {
  redis: { host: '127.0.0.1', port: 6379 },
});

const whatsappQueue = new Bull('whatsappQueue', {
  redis: { host: '127.0.0.1', port: 6379 },
});

const zohoQueue = new Bull('zohoQueue', {
  redis: { host: '127.0.0.1', port: 6379 },
});

// ==================== Delivery Trackers ====================

let whatsappDeliveryCount = 0;
let ZohoDeliveryCount = 0;

// ==================== Processors ====================

// 1. Send Patient Report
sendReportQueue.process('send-patient-report', async (job) => {
  const { name, email, message } = job.data;
  console.log(`Sending report to ${name} (${email}): ${message}`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(`Report sent to ${email}`);
});

// 2. Coach Reminder
reminderQueue.process('send-coach-reminder', async (job) => {
  const { name, email, message } = job.data;
  console.log(`Reminder to ${name} (${email}): ${message}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log(`Reminder delivered to ${email}`);
});

// 3. WhatsApp Message (Simulated)
whatsappQueue.process(async (job) => {
  const { to, template } = job.data;
  try {
    await sendWhatsAppMessage(to, template);
    whatsappDeliveryCount++;
  } catch (err) {
    console.error(`[WHATSAPP] Failed sending to ${to?.phone}:`, err.message);
    throw err;
  }
});

// 4. Zoho CRM Sync (Simulated)
zohoQueue.process('sync-crm', async (job) => {
  const { to, template } = job.data;
  try {
    await sendZohoMessage(to, template);
    ZohoDeliveryCount++;
  } catch (err) {
    console.error(`[ZOHO] Failed sending to ${to?.phone}:`, err.message);
    throw err;
  }
});

// ==================== Job Adders ====================

const addReportToQueue = async (data) => {
  await sendReportQueue.add('send-patient-report', data, {
    delay: 1000,
    attempts: 3,
  });
};

const addReminderToQueue = async (data) => {
  await reminderQueue.add('send-coach-reminder', data, {
    delay: 5000,
    attempts: 3,
  });
};

const addWhatsAppJob = async (to, template) => {
  await whatsappQueue.add({ to, template }, {
    attempts: 3,
    backoff: 5000,
  });
};

const addCRMSyncJob = async (to, template) => {
  await zohoQueue.add('sync-crm', { to, template }, {
    attempts: 3,
    backoff: 3000,
  });
};

// ==================== Job Stats ====================

const getJobStats = async () => {
  const [sentReports, whatsappDelivered, reminderCount, crmSynced] = await Promise.all([
    sendReportQueue.getCompletedCount(),
    whatsappQueue.getCompletedCount(),
    reminderQueue.getCompletedCount(),
    zohoQueue.getCompletedCount(),
  ]);

  let crmSuccess = 0, crmFailure = 0;
  try {
    ({ crmSuccess, crmFailure } = await getCRMSyncStats());
  } catch (err) {
    console.error('Failed to get CRM stats:', err.message);
  }

  return {
    sentReports,
    whatsappDelivered,
    reminderCount,
    crmSynced,
    crmSync: {
      success: crmSuccess,
      failure: crmFailure,
    },
  };
};

// ==================== Exports ====================

module.exports = {
  sendReportQueue,
  reminderQueue,
  whatsappQueue,
  zohoQueue,
  addReportToQueue,
  addReminderToQueue,
  addWhatsAppJob,
  addCRMSyncJob,
  getJobStats,
};
