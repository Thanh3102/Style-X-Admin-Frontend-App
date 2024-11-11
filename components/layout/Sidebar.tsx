"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaTruckLoading } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight, FaUsers, FaWarehouse } from "react-icons/fa6";
import { IoBagHandleSharp } from "react-icons/io5";
import { MdDashboardCustomize } from "react-icons/md";
import { GoChecklist } from "react-icons/go";
import { GrConfigure } from "react-icons/gr";
import SidebarItem from "./SidebarItem";
import { TbPackageImport, TbRosetteDiscount } from "react-icons/tb";
import { BsPersonFillGear } from "react-icons/bs";
import { HiOutlineDocumentReport } from "react-icons/hi";
import {
  AccountsRoute,
  CustomizeRoute,
  DashboardRoute,
  DiscountsRoute,
  InventoriesRoute,
  OrdersRoute,
  ProductRoute,
  ReportsRoute,
  SuppliersRoute,
} from "@/constants/route";
import { cn } from "@/libs/utils";
import { LuClipboardList } from "react-icons/lu";

const items = [
  {
    title: "Tổng quan",
    icon: <MdDashboardCustomize size={18} />,
    url: DashboardRoute,
  },
  {
    title: "Sản phẩm",
    icon: <IoBagHandleSharp size={18} />,
    url: ProductRoute,
  },
  {
    title: "Đơn hàng",
    icon: <GoChecklist size={18} />,
    url: OrdersRoute,
  },
  {
    title: "Tồn kho",
    icon: <FaWarehouse size={18} />,
    url: InventoriesRoute,
  },
  {
    title: "Đặt hàng nhập",
    icon: <LuClipboardList size={18} />,
    url: InventoriesRoute,
  },
  {
    title: "Nhập hàng",
    icon: <TbPackageImport size={18} />,
    url: InventoriesRoute,
  },
  {
    title: "Nhà cung cấp",
    icon: <FaTruckLoading size={18} />,
    url: SuppliersRoute,
  },
  {
    title: "Khách hàng",
    icon: <FaUsers size={18} />,
    url: DiscountsRoute,
  },
  {
    title: "Khuyến mại",
    icon: <TbRosetteDiscount size={18} />,
    url: DiscountsRoute,
  },
  {
    title: "Báo cáo",
    icon: <HiOutlineDocumentReport size={18} />,
    url: ReportsRoute,
  },
  {
    title: "Nhân viên",
    icon: <BsPersonFillGear size={18} />,
    url: AccountsRoute,
  },
  {
    title: "Tùy chỉnh",
    icon: <GrConfigure size={18} />,
    url: CustomizeRoute,
  },
];

const Sidebar = () => {
  const [isExtend, setIsExtend] = useState(true);
  const pathname = usePathname();
  const sidebarWidth = "220px";
  const variants = {
    extend: {
      width: sidebarWidth,
    },
    notExtend: {
      width: "fit-content",
    },
  };

  return (
    <motion.div
      className={`h-full min-h-screen sticky top-0 bg-[#182537] text-white`}
      initial={{
        width: sidebarWidth,
      }}
      animate={`${isExtend ? "extend" : "notExtend"}`}
      variants={variants}
      transition={{
        duration: 0.3,
        ease: "linear",
      }}
    >
      <div
        className={cn(
          "h-[var(--header-height)] flex items-center justify-between border-b-1 border-white px-2", {
            "justify-center": !isExtend
          }
        )}
      >
        <div className={cn("text-lg", { hidden: !isExtend })}>StyleX</div>
        <div
          className="hover:cursor-pointer"
          onClick={() => setIsExtend(!isExtend)}
        >
          {isExtend ? <FaAngleLeft /> : <FaAngleRight />}
        </div>
      </div>
      <div className="h-screen relative px-2 overflow-y-auto">
        <ul className="text-sm">
          {items.map((item, index) => (
            <SidebarItem
              item={item}
              isExtend={isExtend}
              pathName={pathname}
              key={index}
            />
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Sidebar;
