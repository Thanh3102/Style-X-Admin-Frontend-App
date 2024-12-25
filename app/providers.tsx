"use client";
import { Provider } from "react-redux";
import store from "../libs/redux/store";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <NextUIProvider locale="en-GB">{children}</NextUIProvider>
      </SessionProvider>
    </Provider>
  );
}
