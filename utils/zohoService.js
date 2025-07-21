const fs = require('fs');
const path = require('path');

const crmLogPath = path.join(__dirname, '../logs/zohoSyncLogs.json');
// Simulate WhatsApp API call
const sendZohoMessage = async (to, template) => {
  console.log(`[MOCK ZOHO] Sending message to ${to?.email} using template: ${template}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Log to local file
  const log = {
    to: to?.email,
    template,
    message: `CRM sync successful for ${to?.name}`,
    status: 'SENT',
    timestamp: new Date().toISOString()
  };

  let existingLogs = [];
  try {
    const content = fs.readFileSync(crmLogPath, 'utf-8');
    existingLogs = JSON.parse(content);
  } catch {
    existingLogs = [];
  }

  existingLogs.push(log);
  fs.writeFileSync(crmLogPath, JSON.stringify(existingLogs, null, 2));
};

module.exports = {
  sendZohoMessage
};
