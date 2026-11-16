export const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

export const FREE_SHIPPING_AT = 20000;
export const SHIPPING_FEE = 500;
export const COD_LIMIT = 50000; // Cash on Delivery allowed up to this order value (keep in sync with backend)
