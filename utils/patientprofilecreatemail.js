require("dotenv").config();
const nodemailer = require("nodemailer");

/**
 * Sends a welcome HTML email using Gmail and nodemailer.
 * @param {object} user - Object containing patient details.
 */
const sendWelcomePatientEmail = async (user) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">👋 Welcome, ${user.name || "User"}!</h2>
        <p>Thank you for registering with <strong>Mini Health Tracker</strong>.</p>

        <h3 style="margin-top: 20px;">📝 Your Health Details:</h3>
        <ul style="line-height: 1.6; color: #333;">
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Age:</strong> ${user.age}</li>
          <li><strong>Weight:</strong> ${user.weight} kg</li>
          <li><strong>Fat %:</strong> ${user.fatPercent}%</li>
        </ul>

        <a href="https://yourapp.com/dashboard" 
           style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
          Go to Dashboard
        </a>

        <p style="color: #888; margin-top: 20px;">If you did not register, please ignore this email.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Mini Health Tracker" <${process.env.USER}>`,
      to: user.email,
      subject: "Welcome to Mini Health Tracker!",
      html,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

module.exports = { sendWelcomePatientEmail };
