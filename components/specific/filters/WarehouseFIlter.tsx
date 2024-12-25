"use client";
import { updateSearchParams } from "@/libs/helper";
import { FilterParam } from "@/libs/types/backend";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { MdOutlineFilterAltOff } from "react-icons/md";

const WarehouseFilter = () => {
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sortBy, setSortBy] = useState(
    searchParams.get(FilterParam.SORTBY) ?? ""
  );
  const [direction, setDirection] = useState(
    searchParams.get(FilterParam.DIRECTION) ?? ""
  );

  const handleSortByChange = (key: string) => {
    const search = new URLSearchParams(searchParams);
    search.set(FilterParam.ORDER_BY, key);
    router.replace(`${pathname}?${search.toString()}`);
    setSortBy(key);
  };

  const handleDirectionChange = (key: string) => {
    const search = new URLSearchParams(searchParams);
    search.set(FilterParam.DIRECTION, key);
    router.replace(`${pathname}?${search.toString()}`);
    setDirection(key);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

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
    }, 1000);
  };

  const handleDeleteFilter = () => {
    router.replace(`${pathname}`);
  };

  useEffect(() => {
    setSortBy(searchParams.get(FilterParam.ORDER_BY) ?? "");
    setDirection(searchParams.get(FilterParam.DIRECTION) ?? "");
  }, [searchParams]);

  return (
    <div className="p-5 rounded-md bg-white">
      <div className="flex flex-wrap gap-y-4 -mx-2 [&>*]:px-2 items-center">
        <Input
          placeholder="Tìm kiếm theo tên sản phẩm"
          className="w-full"
          startContent={<IoMdSearch />}
          radius="sm"
          variant="bordered"
          onChange={handleInputChange}
        />

        <div className="min-w-[200px] w-1/4">
          <Select
            label="Sắp xếp theo"
            variant="bordered"
            radius="sm"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[sortBy]}
            onSelectionChange={(key) =>
              handleSortByChange(Array.from(key)[0] as string)
            }
          >
            <SelectItem key={"product"}>Tên sản phẩm</SelectItem>
            <SelectItem key={"onHand"}>Tồn kho</SelectItem>
            <SelectItem key={"avaiable"}>Có thể bán</SelectItem>
            <SelectItem key={"onReceive"}>Hàng đang về</SelectItem>
            <SelectItem key={"onTransaction"}>Đang giao dịch</SelectItem>
          </Select>
        </div>
        <div className="min-w-[200px] w-1/4">
          <Select
            label="Hướng sắp xếp"
            variant="bordered"
            radius="sm"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[direction]}
            onSelectionChange={(key) =>
              handleDirectionChange(Array.from(key)[0] as string)
            }
          >
            <SelectItem key={"asc"}>Tăng dần</SelectItem>
            <SelectItem key={"desc"}>Giảm dần</SelectItem>
          </Select>
        </div>
        <Button
          color="warning"
          variant="bordered"
          radius="sm"
          endContent={<MdOutlineFilterAltOff size={18} />}
          className="text-yellow-500"
          onClick={handleDeleteFilter}
        >
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  );
};

export { WarehouseFilter };
