"use client";
import { ReactNode } from "react";
import { Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/libs/utils";

type SidebarItem = {
  title: string;
  icon: ReactNode;
  url: string;
};

type Props = {
  item: SidebarItem;
  isExtend: boolean;
  pathName: string;
};

const SidebarItem = ({ item, isExtend, pathName }: Props) => {
  const variants = {
    extend: {
      width: "auto",
      display: "inline-block",
    },
    notExtend: {
      width: "0",
      display: "none",
    },
  };
  return (
    <Link href={item.url}>
      <Tooltip content={item.title} showArrow placement="right">
        <li
          className={cn(
            "p-2 my-1 flex gap-3 items-center font-medium rounded-md hover:bg-[#2B4263]",
            {
              "bg-[#2B4263]": pathName.startsWith(item.url),
            }
          )}
        >
          {item.icon}
          <motion.span
            className="overflow-hidden whitespace-nowrap"
            animate={`${isExtend ? "extend" : "notExtend"}`}
            variants={variants}
            transition={{ duration: 0.2, ease: "linear" }}
          >
            {item.title}
          </motion.span>
        </li>
      </Tooltip>
    </Link>
  );
};

export default SidebarItem;
