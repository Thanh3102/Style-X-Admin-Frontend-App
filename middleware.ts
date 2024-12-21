export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard(.*)",
    "/product(.*)",
    "/suppliers(.*)",
    "/receive-inventory(.*)",
    "/discounts(.*)",
    "/customers(.*)",
    "/employees(.*)",
    "/profile(.*)",
  ],
};
