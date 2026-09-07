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

import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLoginPage = req.nextUrl.pathname === "/";

  if (!isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl));
  }

  if (isLoggedIn && isOnLoginPage) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }
});

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
