"use client";
import DateFilterButton from "@/components/common/filters/DateFilterButton";
import { updateSearchParams } from "@/libs/helper";
import {
  FilterParam,
  ReceiveInventoryStatus,
  ReceiveInventoryTransaction,
} from "@/libs/types/backend";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { MdOutlineFilterAltOff } from "react-icons/md";

const CustomerFilter = () => {
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchTimeoutRef.current) clearInterval(searchTimeoutRef.current);

    setTimeout(() => {
      const newUrl = updateSearchParams(
        new URLSearchParams(Array.from(searchParams.entries())),
        [
          { name: "query", value: e.target.value },
          { name: "page", value: undefined },
        ],
        pathname
      );

      router.push(newUrl);
    }, 400);
  };

  return (
    <div className="p-5 flex flex-col gap-4 rounded-t-md bg-white">
      <Input
        placeholder="Tìm kiếm theo mã khách hàng, họ tên, email"
        className="w-full"
        startContent={<IoMdSearch />}
        radius="sm"
        variant="bordered"
        onChange={handleInputChange}
      />
    </div>
  );
};

export { CustomerFilter };
