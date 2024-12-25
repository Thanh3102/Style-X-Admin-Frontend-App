import nextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      username: string;
      name: string;
      email: string;
      //   image: string;
    };
    accessToken: string | null;
    refreshToken: string | null;
    expiredIn: number;
    terminate: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: number;
      username: string;
      name: string;
      email: string;
      //   image: string;
    };
    accessToken: string | null;
    refreshToken: string | null;
    expiredIn: number;
    terminate: boolean;
  }
}
