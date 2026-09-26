// Input validation and sanitization helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 200;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-+()]{7,}$/;
  return phoneRegex.test(phone) && phone.length <= 40;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.length <= 200;
};

export const validateMessage = (msg: string): boolean => {
  return msg.trim().length >= 5 && msg.length <= 5000;
};

// Strip potentially dangerous characters (basic sanitization)
export const sanitizeText = (text: string): string => {
  return text
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[<>]/g, '') // remove angle brackets
    .trim();
};

export const sanitizeEmail = (email: string): string => {
  return sanitizeText(email).toLowerCase();
};

export const validateFormData = (data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!validateName(data.name)) {
    errors.name = 'Name must be 2-200 characters';
  }

  if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number (7+ digits)';
  }

  if (!validateMessage(data.message)) {
    errors.message = 'Message must be 5-5000 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
