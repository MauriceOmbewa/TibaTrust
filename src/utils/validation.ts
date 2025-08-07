export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+254|0)[17]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter' });
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter' });
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one number' });
  }
  
  return errors;
};

export const validateLoginForm = (email: string, password: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!email.trim()) {
    errors.push({ field: 'email', message: 'Email or phone number is required' });
  } else if (!validateEmail(email) && !validatePhone(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email or phone number' });
  }
  
  if (!password.trim()) {
    errors.push({ field: 'password', message: 'Password is required' });
  }
  
  return errors;
};

export const validateRegistrationForm = (formData: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!formData.firstName.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }
  
  if (!formData.lastName.trim()) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }
  
  if (!formData.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(formData.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }
  
  if (!formData.phone.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!validatePhone(formData.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid Kenyan phone number' });
  }
  
  if (!formData.idNumber.trim()) {
    errors.push({ field: 'idNumber', message: 'ID number is required' });
  }
  
  const passwordErrors = validatePassword(formData.password);
  errors.push(...passwordErrors);
  
  if (formData.password !== formData.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }
  
  if (!formData.terms) {
    errors.push({ field: 'terms', message: 'You must accept the terms and conditions' });
  }
  
  return errors;
};

export const validateContactForm = (formData: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!formData.firstName.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }
  
  if (!formData.lastName.trim()) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }
  
  if (!formData.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(formData.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }
  
  if (!formData.phone.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!validatePhone(formData.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid Kenyan phone number' });
  }
  
  if (!formData.subject.trim()) {
    errors.push({ field: 'subject', message: 'Please select a subject' });
  }
  
  if (!formData.message.trim()) {
    errors.push({ field: 'message', message: 'Message is required' });
  } else if (formData.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
  }
  
  return errors;
};