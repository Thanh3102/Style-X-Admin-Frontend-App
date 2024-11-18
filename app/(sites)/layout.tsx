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
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <div className="bg-stone-100 flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
