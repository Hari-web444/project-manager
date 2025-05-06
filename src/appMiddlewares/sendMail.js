require("dotenv").config();
const nodemailer = require("nodemailer");
const templates = require("./template");

// Send Email Function
const sendEmail = async (email, payload) => {
  try {
    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: process.env.MAIL_PORT|| 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    if (!templates[payload.template]) {
      throw new Error("Invalid email template");
    }
    const emailContent = templates[payload.template]({payload});
    // Email options
    const mailOptions = {
      from: `${process.env.FROM_EMAIL} <${process.env.MAIL_USER}>`,
      to: email,
      ...emailContent
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return "Email sent successfully";
    
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { sendEmail };