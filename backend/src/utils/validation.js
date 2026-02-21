const validateUniversityEmail = (email) => {
  const domain = process.env.UNIVERSITY_EMAIL_DOMAIN || "@ul.edu.lb";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.toLowerCase().endsWith(domain.toLowerCase()) && emailRegex.test(email);
};

const validateUniversityId = (id) => {
  return /^\d{5,7}$/.test(id);
};

// const validatePassword = (password) => {
//   return password.length >= 8 && 
//          /[A-Z]/.test(password) && 
//          /[a-z]/.test(password) && 
//          /[0-9]/.test(password);
// };

module.exports = {
  validateUniversityEmail,
  validateUniversityId,
};