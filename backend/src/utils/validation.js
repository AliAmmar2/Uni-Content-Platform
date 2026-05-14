exports.validateUniversityEmail = (email) => {

  if (!email) return false;

  const normalizedEmail =
    email.toLowerCase().trim();

  // simple email format validation
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(normalizedEmail);
};

exports.validateUniversityId = (universityId) => {
  if (!universityId) return false;

  const regex = /^[A-Za-z0-9]{1,12}$/;
  return regex.test(universityId);
};