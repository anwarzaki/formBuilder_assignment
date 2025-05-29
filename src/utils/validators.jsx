// Validate form field
export function validateField(field, value) {
  const errors = [];

  if (field.required && !value) {
    errors.push(`${field.label} is required`);
  }

  if (typeof value === 'string') {
    if (field.minLength && value.length < field.minLength) {
      errors.push(`${field.label} must be at least ${field.minLength} characters`);
    }
    if (field.maxLength && value.length > field.maxLength) {
      errors.push(`${field.label} must be at most ${field.maxLength} characters`);
    }
    if (field.pattern) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        errors.push(`${field.label} is invalid`);
      }
    }
  }

  return errors;
}