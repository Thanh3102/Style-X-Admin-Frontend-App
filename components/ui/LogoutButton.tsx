"use client";
import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <Button onClick={() => signOut({ redirect: true, callbackUrl: "/" })} size="sm">
      Logout
    </Button>
  );
};

export default LogoutButton;
