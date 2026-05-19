export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required.';
    if (!re.test(email)) return 'Please enter a valid email address.';
    return null;
  };
  
  export const validatePassword = (password) => {
    if (!password) return 'Password is required.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    return null;
  };
  
  export const validateRequired = (value, fieldName) => {
    if (!value || value.trim() === '') return `${fieldName} is required.`;
    return null;
  };
  
  export const validateDates = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 'Both check-in and check-out dates are required.';
    if (new Date(checkOut) <= new Date(checkIn)) return 'Check-out must be after check-in.';
    return null;
  };