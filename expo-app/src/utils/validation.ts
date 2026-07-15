export const isRequired = (value: string): boolean => value.trim().length > 0;

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidPhone = (phone: string): boolean =>
  /^\d{10}$/.test(phone.replace(/\D/g, '').slice(-10));

export const isValidDateOfBirth = (dob: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob.trim())) return false;
  const date = new Date(dob);
  return !Number.isNaN(date.getTime()) && date < new Date();
};

export const isStrongPassword = (password: string): boolean =>
  password.length >= 8 &&
  /\d/.test(password) &&
  /[!@#$%^&*(),.?":{}|<>]/.test(password);

export const passwordsMatch = (a: string, b: string): boolean =>
  a.length > 0 && a === b;
