// src/utils/email.js
const sendMagicLinkEmail = async (email, magicLink) => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    // In development/test, just log the magic link
    console.log('\n========================================');
    console.log('MAGIC LINK EMAIL (DEV MODE)');
    console.log(`To: ${email}`);
    console.log(`Link: ${magicLink}`);
    console.log('========================================\n');
    return { success: true };
  }

  // In production, integrate with actual email service
  // e.g., SendGrid, AWS SES, Nodemailer
  // For now, we'll skip actual email sending
  return { success: true };
};

module.exports = {
  sendMagicLinkEmail
};