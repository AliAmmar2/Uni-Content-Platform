const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

exports.sendVerificationEmail = async (email, link) => {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your university account",
      html: `
        <h2>Email Verification</h2>
        <p>Click below to verify your account:</p>
        <a href="${link}">Verify Email</a>
      `
    });
    console.log("EMAIL RESULT:", JSON.stringify(result));
  } catch (err) {
    console.log("EMAIL ERROR:", err.message);
  }
};

exports.sendPasswordResetEmail = async (email, link) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Password Reset</h2>
      <p>A request was made to reset your password.</p>
      <p>Click the link below to choose a new password:</p>
      <a href="${link}">Reset Password</a>
      <p>This link expires in 30 minutes.</p>
      <p>If you did not request this reset, you can safely ignore this email.</p>
    `
  });
};