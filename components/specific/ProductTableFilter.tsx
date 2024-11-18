"use client";
import { updateSearchParams } from "@/libs/helper";
import { Button, ButtonGroup, Input } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useRef } from "react";
import { IoMdSearch } from "react-icons/io";
import { RxTriangleDown } from "react-icons/rx";
import DateFilterButton from "../common/filters/DateFilterButton";
import { AssignedFilterButton } from "../common/filters/AssignedFilter";
import { FiFilter } from "react-icons/fi";

const ProductTableFilter = () => {
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
    }, 300);
  };

  return (
    <div className="p-5 flex gap-4 rounded-t-md bg-white">
      <Input
        placeholder="Tìm kiếm theo mã sản phẩm, tên sản phẩm, barcode"
        className="flex-1"
        startContent={<IoMdSearch />}
        radius="sm"
        variant="bordered"
        onChange={handleInputChange}
      />
      <ButtonGroup radius="sm" variant="bordered">
        <DateFilterButton />
        <Button
          endContent={<RxTriangleDown size={16} className="text-gray-500" />}
          disableRipple
        >
          Loại sản phẩm
        </Button>
        <Button
          endContent={<RxTriangleDown size={16} className="text-gray-500" />}
          disableRipple
        >
          Tag
        </Button>
        <Button
          startContent={<FiFilter size={16} className="text-gray-500" />}
          disableRipple
        >
          Bộ lọc khác
        </Button>
      </ButtonGroup>
    </div>
  );
};

export { ProductTableFilter };
