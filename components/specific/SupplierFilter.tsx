"use client";
import { updateSearchParams } from "@/libs/helper";
import { Button, ButtonGroup, Input } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useRef } from "react";
import { IoMdSearch } from "react-icons/io";
import { RxTriangleDown } from "react-icons/rx";
import DateFilterButton from "../common/filters/DateFilterButton";
import { AssignedFilterButton } from "../common/filters/AssignedFilter";

const SupplierFilter = () => {
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchTimeoutRef.current) clearInterval(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      const newUrl = updateSearchParams(
        new URLSearchParams(Array.from(searchParams.entries())),
        [
          { name: "query", value: e.target.value },
          { name: "page", value: undefined },
        ],
        pathname
      );

      router.replace(newUrl);
    }, 300);
  };

  return (
    <div className="p-5 flex gap-4 rounded-t-md bg-white">
      <Input
        placeholder="Tìm kiếm theo mã đơn nhập, tên, SĐT, mã NCC"
        className="flex-1"
        startContent={<IoMdSearch />}
        radius="sm"
        variant="bordered"
        onChange={handleInputChange}
      />
      <ButtonGroup radius="sm" variant="bordered">
        <DateFilterButton />
        <AssignedFilterButton />
      </ButtonGroup>
    </div>
  );
};

export { SupplierFilter };
