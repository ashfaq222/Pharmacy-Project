import { districts } from "@/data/districts";

/** Checkout form fields, in on-screen order (used to focus the first invalid one). */
export const CHECKOUT_FIELDS = ["fullName", "phone", "email", "district", "area", "address", "instructions"];

export const EMPTY_CHECKOUT = Object.fromEntries(CHECKOUT_FIELDS.map((field) => [field, ""]));

export const FIELD_LIMITS = { fullName: 80, email: 120, area: 80, address: 300, instructions: 300 };

/**
 * Bangladeshi mobile number in any common form — "01712345678",
 * "+880 1712-345678", "8801712345678" — returned as "01712345678", or null.
 */
export function normalizePhone(input) {
  const digits = input.replace(/[\s\-().]/g, "").replace(/^\+/, "");
  const match = digits.match(/^(?:880|0)?(1[3-9]\d{8})$/);
  return match ? `0${match[1]}` : null;
}

/** "01712345678" -> "01712 345678" */
export const formatPhone = (phone) => `${phone.slice(0, 5)} ${phone.slice(5)}`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;

/** Returns { field: message } for every invalid field; {} when the form is valid. */
export function validateCheckout(values) {
  const errors = {};
  const v = Object.fromEntries(CHECKOUT_FIELDS.map((field) => [field, (values[field] ?? "").trim()]));

  if (!v.fullName) errors.fullName = "Please enter your full name.";
  else if (v.fullName.length < 2) errors.fullName = "Name must be at least 2 characters.";
  else if (!NAME_PATTERN.test(v.fullName)) errors.fullName = "Use letters only (spaces, dots, apostrophes and hyphens are fine).";

  if (!v.phone) errors.phone = "Please enter your phone number.";
  else if (!normalizePhone(v.phone)) errors.phone = "Enter a valid Bangladeshi mobile number, e.g. 01712 345678.";

  if (v.email && !EMAIL_PATTERN.test(v.email)) errors.email = "Enter a valid email address, e.g. name@example.com.";

  if (!v.district) errors.district = "Please select your district.";
  else if (!districts.includes(v.district)) errors.district = "Please choose a district from the list.";

  if (!v.area) errors.area = "Please enter your area or city.";
  else if (v.area.length < 2) errors.area = "Area must be at least 2 characters.";

  if (!v.address) errors.address = "Please enter your full delivery address.";
  else if (v.address.length < 10) errors.address = "Please include house/flat, road and landmark (at least 10 characters).";

  for (const [field, max] of Object.entries(FIELD_LIMITS)) {
    if (!errors[field] && v[field].length > max) errors[field] = `Please keep this under ${max} characters.`;
  }
  return errors;
}

/** Trimmed, normalised values for a valid form. */
export function cleanCheckout(values) {
  const v = Object.fromEntries(CHECKOUT_FIELDS.map((field) => [field, (values[field] ?? "").trim()]));
  return { ...v, phone: normalizePhone(v.phone), email: v.email.toLowerCase() };
}
