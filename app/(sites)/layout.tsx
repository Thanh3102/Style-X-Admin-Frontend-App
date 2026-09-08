import dynamic from "next/dynamic";
import React from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import ScrollToTopButton from "../../components/ui/ScrollToTopButton";
// const ScrollToTopButton = dynamic(
//   import("../components/ui/ScrollToTopButton"),
//   {
//     ssr: false,
//   }
// );

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  return (
    <div className="flex items-start">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header />
        <main className="min-w-0 flex-1 bg-stone-100">{children}</main>
      </div>
    </div>
  );
}
