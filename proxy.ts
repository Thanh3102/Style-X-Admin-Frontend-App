
// export { default } from "next-auth/middleware";

// Old NextAuth Config

// export const config = {
//   matcher: [
//     "/dashboard(.*)",
//     "/product(.*)",
//     "/suppliers(.*)",
//     "/receive-inventory(.*)",
//     "/discounts(.*)",
//     "/customers(.*)",
//     "/employees(.*)",
//     "/profile(.*)",
//   ],
// };

export { auth as proxy } from "@/auth";
