"use client";
import { Provider } from "react-redux";
import store from "../libs/redux/store";
import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <HeroUIProvider locale="en-GB">{children}</HeroUIProvider>
      </SessionProvider>
    </Provider>
  );
}
