"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { memo, useState } from "react";
import { FaTruckLoading } from "react-icons/fa";
import {
  FaAngleLeft,
  FaAngleRight,
  FaUsers,
  FaWarehouse,
} from "react-icons/fa6";
import { IoBagHandleSharp } from "react-icons/io5";
import { MdDashboardCustomize } from "react-icons/md";
import { GoChecklist } from "react-icons/go";
import { GrConfigure } from "react-icons/gr";
import SidebarItem from "./SidebarItem";
import { TbPackageImport, TbRosetteDiscount } from "react-icons/tb";
import { BsPersonFillGear } from "react-icons/bs";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { CiBoxList } from "react-icons/ci";
import {
  CollectionRoute,
  DashboardRoute,
  DiscountsRoute,
  EmployeeRoute,
  InventoriesRoute,
  OrdersRoute,
  ProductRoute,
  PurchaseOrderRoute,
  ReceiveInventoryRoute,
  ReportsRoute,
  SuppliersRoute,
  WarehouseRoute,
} from "@/constants/route";
import { cn } from "@/libs/utils";
import { LuClipboardList } from "react-icons/lu";
import { DateFilterOptionValue, FilterParam } from "@/libs/types/backend";
import { Image } from "@nextui-org/react";

const items = [
  {
    title: "Tổng quan",
    icon: <MdDashboardCustomize size={18} />,
    url: `${DashboardRoute}?${FilterParam.REPORT_DATE}=${DateFilterOptionValue.DAY_LAST_30}`,
  },
  {
    title: "Sản phẩm",
    icon: <IoBagHandleSharp size={18} />,
    url: ProductRoute,
  },
  {
    title: "Danh mục",
    icon: <CiBoxList size={18} />,
    url: CollectionRoute,
  },
  {
    title: "Đơn hàng",
    icon: <GoChecklist size={18} />,
    url: OrdersRoute,
  },
  {
    title: "Kho hàng",
    icon: <FaWarehouse size={18} />,
    url: WarehouseRoute,
  },
  // {
  //   title: "Tồn kho",
  //   icon: <LuClipboardList size={18} />,
  //   url: PurchaseOrderRoute,
  // },
  {
    title: "Nhập hàng",
    icon: <TbPackageImport size={18} />,
    url: ReceiveInventoryRoute,
  },
  {
    title: "Nhà cung cấp",
    icon: <FaTruckLoading size={18} />,
    url: SuppliersRoute,
  },
  {
    title: "Khách hàng",
    icon: <FaUsers size={18} />,
    url: "customers",
  },
  {
    title: "Khuyến mại",
    icon: <TbRosetteDiscount size={18} />,
    url: DiscountsRoute,
  },
  // {
  //   title: "Báo cáo",
  //   icon: <HiOutlineDocumentReport size={18} />,
  //   url: ReportsRoute,
  // },
  {
    title: "Nhân viên",
    icon: <BsPersonFillGear size={18} />,
    url: EmployeeRoute,
  },
  // {
  //   title: "Tùy chỉnh",
  //   icon: <GrConfigure size={18} />,
  //   url: CustomizeRoute,
  // },
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
          "h-[var(--header-height)] flex items-center gap-2 border-b-1 border-white px-2",
          {
            "justify-center": !isExtend,
          }
        )}
      >
        <div
          className={cn("text-lg flex-1 flex justify-center", {
            hidden: !isExtend,
          })}
        >
          <Image
            src="/images/stylex-high-resolution-logo-grayscale-transparent.png"
            width={40}
            height={40}
            className="bg-white rounded-full"
          />
        </div>
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

export default memo(Sidebar);
