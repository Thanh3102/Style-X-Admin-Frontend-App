import { REFRESH_TOKEN_ROUTE, SIGN_IN_ROUTE } from "@/constants/api-routes";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Tên đăng nhập",
          type: "text",
          placeholder: "Nhập tên đăng nhập",
        },
        password: {
          label: "Mật khẩu",
          type: "password",
          placeholder: "Nhập mật khẩu",
        },
        isRemember: {
          label: "Ghi nhớ đăng nhập",
          type: "checkbox",
        },
      },
      async authorize(credentials) {
        const response = await fetch(SIGN_IN_ROUTE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
            isRemember: credentials?.isRemember === "true",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            terminate: false,
            ...data,
          };
        } else {
          const res = await response.json();
          throw new Error(res.error);
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log("[NextAuth] JWT Callback");
      // console.log("[NextAuth] JWT Token Access", token.accessToken);

      if (user) {
        // console.log("[NextAuth] JWT User", user);
        return { ...token, ...user };
      }

      if (new Date().getTime() > token.expiredIn) {
        // console.log("[NextAuth] Token expired");
        const newToken = await refreshToken(token);
        return newToken;
      }

      return token;
    },
    async session({ session, token }) {
      // console.log("[NextAuth-Session] Session", session);
      // console.log("[NextAuth-Session] Token", token);
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiredIn = token.expiredIn;
      session.terminate = token.terminate;
      return session;
    },
  },
};

async function refreshToken(token: JWT) {
  const response = await fetch(REFRESH_TOKEN_ROUTE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    }),
  });

  if (response.ok) {
    const data = await response.json();

    // console.log("[NextAuth-Refresh] New access token", data.accessToken);
    // console.log("[NextAuth-Refresh] New expire time", data.expiredIn);

    return {
      ...token,
      accessToken: data.accessToken,
      expiredIn: data.expiredIn,
    };
  }
  return {
    ...token,
    terminate: true,
  };
}
