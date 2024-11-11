"use client";
import { Provider } from "react-redux";
import store from "../libs/redux/store";
import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NextUIProvider locale="en-GB">{children}</NextUIProvider>
    </Provider>
  );
}
