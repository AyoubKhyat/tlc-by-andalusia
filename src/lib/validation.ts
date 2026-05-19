export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message: string;
}

export type ValidationSchema = Record<string, ValidationRule[]>;

export function validate(
  data: Record<string, string>,
  schema: ValidationSchema
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = (data[field] || "").trim();

    for (const rule of rules) {
      if (rule.required && !value) {
        errors[field] = rule.message;
        break;
      }
      if (value && rule.minLength && value.length < rule.minLength) {
        errors[field] = rule.message;
        break;
      }
      if (value && rule.maxLength && value.length > rule.maxLength) {
        errors[field] = rule.message;
        break;
      }
      if (value && rule.pattern && !rule.pattern.test(value)) {
        errors[field] = rule.message;
        break;
      }
    }
  }

  return errors;
}

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePatternMA = /^(?:\+212|0)[5-7]\d{8}$/;

export const registrationSchema: ValidationSchema = {
  firstName: [
    { required: true, message: "First name is required" },
    { minLength: 2, message: "First name must be at least 2 characters" },
    { maxLength: 50, message: "First name must be under 50 characters" },
  ],
  lastName: [
    { required: true, message: "Last name is required" },
    { minLength: 2, message: "Last name must be at least 2 characters" },
    { maxLength: 50, message: "Last name must be under 50 characters" },
  ],
  email: [
    { required: true, message: "Email is required" },
    { pattern: emailPattern, message: "Please enter a valid email address" },
  ],
  phone: [
    { required: true, message: "Phone number is required" },
    {
      pattern: phonePatternMA,
      message: "Please enter a valid Moroccan phone number (e.g. 0643434382)",
    },
  ],
  programInterest: [
    { required: true, message: "Please select a program" },
  ],
};
