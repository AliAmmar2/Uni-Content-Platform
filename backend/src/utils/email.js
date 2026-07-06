// const nodemailer = require("nodemailer");
//
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });
//
// exports.sendVerificationEmail = async (
//   email,
//   link
// ) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Verify your university account",
//     html: `
//       <h2>Email Verification</h2>
//       <p>Click below to verify your account:</p>
//       <a href="${link}">
//         Verify Email
//       </a>
//     `
//   });
// };
//
// exports.sendPasswordResetEmail = async (
//   email,
//   link
// ) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Reset your password",
//     html: `
//       <h2>Password Reset</h2>
//
//       <p>
//         A request was made to reset your password.
//       </p>
//
//       <p>
//         Click the link below to choose a new password:
//       </p>
//
//       <a href="${link}">
//         Reset Password
//       </a>
//
//       <p>
//         This link expires in 30 minutes.
//       </p>
//
//       <p>
//         If you did not request this reset,
//         you can safely ignore this email.
//       </p>
//     `
//   });
// };
// const nodemailer = require("nodemailer");
//
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   requireTLS: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });
//
// exports.sendVerificationEmail = async (email, link) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Verify your university account",
//     html: `
//       <h2>Email Verification</h2>
//       <p>Click below to verify your account:</p>
//       <a href="${link}">Verify Email</a>
//     `
//   });
// };
//
// exports.sendPasswordResetEmail = async (email, link) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Reset your password",
//     html: `
//       <h2>Password Reset</h2>
//       <p>A request was made to reset your password.</p>
//       <p>Click the link below to choose a new password:</p>
//       <a href="${link}">Reset Password</a>
//       <p>This link expires in 30 minutes.</p>
//       <p>If you did not request this reset, you can safely ignore this email.</p>
//     `
//   });
// };
const axios = require("axios");

const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "Lebanese University",
            email: process.env.EMAIL_FROM_BREVO
          },
          to: [
            {
              email: to
            }
          ],
          subject,
          htmlContent: html
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json"
          }
        }
    );

    return response.data;

  } catch (error) {
    console.error(
        "BREVO EMAIL ERROR:",
        error?.response?.data || error.message
    );

    throw error;
  }
};

exports.sendVerificationEmail = async (email, link) => {
  return sendEmail({
    to: email,
    subject: "Verify your university account",
    html: `
      <h2>Email Verification</h2>
      <p>Click below to verify your account:</p>
      <a href="${link}">Verify Email</a>
    `
  });
};

exports.sendPasswordResetEmail = async (email, link) => {
  return sendEmail({
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