require("dotenv").config();
const nodemailer = require("nodemailer");

/**
 * Sends a welcome HTML email using Gmail and nodemailer.
 * @param {object} user - Object containing user details (email, name).
 */
const sendWelcomeEmail = async (user) => {
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
        <h2 style="color: #333;">Welcome to Mini Health Tracker, ${user.name || "User"}!</h2>
        <p>Thank you for registering with us, <strong>${user.email}</strong>.</p>
        <a href="https://yourapp.com/dashboard" 
           style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
          Go to Dashboard
        </a>
        <p style="color: #888; margin-top: 20px;">If you did not sign up, please ignore this email.</p>
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

module.exports = { sendWelcomeEmail };
