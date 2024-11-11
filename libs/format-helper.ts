export const CurrencyFormatter = (options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    ...options,
  });
};
