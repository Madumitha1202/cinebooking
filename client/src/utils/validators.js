// Reusable form validators – each returns an error string or "" when valid.

export const required = (value, label = "This field") =>
  String(value ?? "").trim() ? "" : `${label} is required`;

export const validateEmail = (value) => {
  if (!String(value ?? "").trim()) return "Email is required";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Enter a valid email address";
};

export const validatePhone = (value) => {
  if (!String(value ?? "").trim()) return "Phone number is required";
  return /^[6-9]\d{9}$/.test(value) ? "" : "Enter a valid 10-digit mobile number";
};

export const validatePassword = (value) => {
  if (!value) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters";
  return "";
};

// Stronger rule used on the registration form
export const validateStrongPassword = (value) => {
  if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value)) {
    return "Use upper case, lower case and a number";
  }
  return "";
};

export const validateSeats = (seats) => {
  if (!seats || seats.length === 0) return "Please select your seats";
  if (seats.length > 8) return "You can book a maximum of 8 seats";
  return "";
};

export const validateCardNumber = (value) => {
  const digits = String(value ?? "").replace(/\s/g, "");
  if (!digits) return "Card number is required";
  return /^\d{16}$/.test(digits) ? "" : "Card number must be 16 digits";
};

export const validateExpiry = (value) => {
  if (!value) return "Expiry date is required";
  const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!m) return "Use MM/YY format";
  const expiry = new Date(2000 + Number(m[2]), Number(m[1]), 0, 23, 59, 59);
  return expiry >= new Date() ? "" : "Card has expired";
};

export const validateCvv = (value) => (/^\d{3}$/.test(value ?? "") ? "" : "CVV must be 3 digits");

export const validateUpi = (value) => {
  if (!value?.trim()) return "UPI ID is required";
  return /^[\w.\-]+@[\w]+$/.test(value) ? "" : "Enter a valid UPI ID (e.g. name@bank)";
};

// ---------- Form-level validators (return an errors object) ----------
export const validateLoginForm = ({ email, password }) => {
  const errors = { email: validateEmail(email), password: validatePassword(password) };
  return pruneEmpty(errors);
};

export const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
  const errors = {
    name: required(name, "Name"),
    email: validateEmail(email),
    password: validateStrongPassword(password),
    confirmPassword: confirmPassword === password ? "" : "Passwords do not match",
  };
  return pruneEmpty(errors);
};

export const validateBookingForm = ({ customer, seats }) => {
  const errors = {
    name: required(customer.name, "Name"),
    email: validateEmail(customer.email),
    phone: validatePhone(customer.phone),
    seats: validateSeats(seats),
  };
  return pruneEmpty(errors);
};

export const validatePaymentForm = (payment) => {
  const errors = {};
  if (payment.method === "card") {
    errors.cardNumber = validateCardNumber(payment.cardNumber);
    errors.cardName = required(payment.cardName, "Name on card");
    errors.expiry = validateExpiry(payment.expiry);
    errors.cvv = validateCvv(payment.cvv);
  } else if (payment.method === "upi") {
    errors.upiId = validateUpi(payment.upiId);
  } else {
    errors.method = "Select a payment method";
  }
  return pruneEmpty(errors);
};

function pruneEmpty(errors) {
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => v));
}
