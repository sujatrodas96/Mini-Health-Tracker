const axios = require('axios');
require('dotenv').config(); // if using .env file

const instanceId = process.env.ULTRA_INSTANCE_ID; // or hardcode for testing
const token = process.env.ULTRA_TOKEN;

const sendWhatsAppMessage = async (to, message) => {
  try {
    const response = await axios.post(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
      token: token,
      to: to, 
      body: message
    });

    console.log('✅ Message sent:', response.data);
  } catch (error) {
    console.error('❌ Failed to send message:', error.response?.data || error.message);
  }
};

module.exports = { sendWhatsAppMessage };