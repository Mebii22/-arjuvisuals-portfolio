/**
 * Inquiry Form Validation Engine for ArjuVisuals.co
 * Provides real-time field validation, formatted error messaging,
 * and comprehensive form-level integrity checks.
 */

/**
 * Validates a single field within the inquiry form.
 * Returns an error string if invalid, or null if valid.
 *
 * @param {string} fieldName - The key name of the input field
 * @param {string} value - The current value of the field
 * @returns {string | null} Error message or null
 */
export function validateField(fieldName, value) {
  const val = (value ?? "").toString().trim();

  switch (fieldName) {
    case "name": {
      if (!val) {
        return "Full name is required.";
      }
      if (val.length < 2) {
        return "Name must be at least 2 characters.";
      }
      if (val.length > 80) {
        return "Name cannot exceed 80 characters.";
      }
      // Must contain at least one Unicode letter character
      if (!/[\p{L}]/u.test(val)) {
        return "Name must contain letters.";
      }
      // Only permit letters, spaces, hyphens, periods, and apostrophes
      if (!/^[\p{L}\s.'\-]+$/u.test(val)) {
        return "Name should only contain letters, spaces, and hyphens.";
      }
      return null;
    }

    case "email": {
      if (!val) {
        return "Email address is required.";
      }
      // RFC 5322 compliant regex for practical web forms
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailRegex.test(val)) {
        return "Please enter a valid email address (e.g. name@example.com).";
      }
      if (val.length > 120) {
        return "Email address is too long.";
      }
      return null;
    }

    case "phone": {
      if (!val) return null; // Phone is optional
      // Check permitted telephone characters: numbers, spaces, +, -, parentheses
      if (!/^[\d\s+\-()]{7,25}$/.test(val)) {
        return "Phone can only contain digits, spaces, +, -, and ( ).";
      }
      const digits = val.replace(/\D/g, "");
      if (digits.length < 8 || digits.length > 15) {
        return "Phone number must have between 8 and 15 digits.";
      }
      return null;
    }

    case "service": {
      if (!val) {
        return "Please choose a service for your inquiry.";
      }
      return null;
    }

    case "eventDate": {
      if (!val) return null; // Date is optional
      // Validate date parsing
      const chosen = new Date(`${val}T00:00:00`);
      if (isNaN(chosen.getTime())) {
        return "Please choose a valid calendar date.";
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (chosen < today) {
        return "Event date cannot be in the past. Please select today or a future date.";
      }
      return null;
    }

    case "location": {
      if (!val) return null; // Location is optional
      if (val.length < 2) {
        return "Location must be at least 2 characters.";
      }
      if (val.length > 100) {
        return "Location cannot exceed 100 characters.";
      }
      return null;
    }

    case "budget": {
      if (!val) return null; // Budget is optional
      if (val.length > 60) {
        return "Budget description cannot exceed 60 characters.";
      }
      // Must contain at least one alphanumeric character
      if (!/[0-9a-zA-Z]/.test(val)) {
        return "Please enter a valid estimate (e.g. ₹50,000 or $1,500).";
      }
      return null;
    }

    case "message": {
      if (!val) {
        return "Please tell us a little about your project or idea.";
      }
      if (val.length < 10) {
        const remaining = 10 - val.length;
        return `A short description helps (${remaining} more char${remaining > 1 ? "s" : ""} needed).`;
      }
      if (val.length > 1500) {
        return "Message cannot exceed 1500 characters.";
      }
      return null;
    }

    default:
      return null;
  }
}

/**
 * Validates the entire inquiry form object.
 * Returns an errors map where keys are field names and values are error messages.
 *
 * @param {Record<string, any>} form - Form fields object
 * @returns {Record<string, string>} Map of invalid fields to error strings
 */
export function validateInquiryForm(form) {
  const errors = {};
  const fields = ["name", "email", "phone", "service", "eventDate", "location", "budget", "message"];

  for (const field of fields) {
    const error = validateField(field, form[field]);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}
