"use server";

import { signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function authenticate(
  username: string,
  password: string,
  isRemember: boolean,
) {
  try {
    const url = await signIn("credentials", {
      username,
      password,
      isRemember,
      redirect: false,
    });

    return { ok: true, error: null, url };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof CredentialsSignin) {
      return {
        ok: false,
        error: error.code || "Đã xảy ra lỗi khi đăng nhập",
        url: null,
      };
    }

    return {
      ok: false,
      error: "Đã xảy ra lỗi khi đăng nhập",
      url: null,
    };
  }
}

