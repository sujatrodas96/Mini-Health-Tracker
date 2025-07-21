const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/whatsappLogs.json');
// Simulate WhatsApp API call
const sendWhatsAppMessage = async (to, template) => {
  console.log(`[MOCK WHATSAPP] Sending message to ${to?.phone} using template: ${template}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Log to local file
  const log = {
    to: to?.phone,
    template,
    message: `WhatsApp message sent to ${to?.name}`,
    status: 'SENT',
    timestamp: new Date().toISOString()
  };

  let existingLogs = [];
  try {
    const content = fs.readFileSync(LOG_FILE, 'utf-8');
    existingLogs = JSON.parse(content);
  } catch {
    existingLogs = [];
  }

  existingLogs.push(log);
  fs.writeFileSync(LOG_FILE, JSON.stringify(existingLogs, null, 2));
};

module.exports = {
  sendWhatsAppMessage
};
