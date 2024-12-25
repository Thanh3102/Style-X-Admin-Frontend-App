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

const DiscountFilter = () => {
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState(searchParams.get(FilterParam.MODE) ?? "");
  const [type, setType] = useState(searchParams.get(FilterParam.TYPE) ?? "");
  const [active, setActive] = useState(
    searchParams.get(FilterParam.ACTIVE) ?? ""
  );

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
    }, 400);
  };

  const handleModeChange = (mode: string) => {
    setMode(mode);
    const search = new URLSearchParams(searchParams.toString());

    if (!mode) {
      search.delete(FilterParam.MODE);
      router.replace(`${pathname}?${search.toString()}`);
      return;
    }

    search.set(FilterParam.MODE, mode);
    router.replace(`${pathname}?${search.toString()}`);
  };

  const handleTypeChange = (type: string) => {
    setType(type);
    const search = new URLSearchParams(searchParams.toString());

    if (!type) {
      search.delete(FilterParam.TYPE);
      router.replace(`${pathname}?${search.toString()}`);
      return;
    }

    search.set(FilterParam.TYPE, type);
    router.replace(`${pathname}?${search.toString()}`);
  };

  const handleActiveChange = (active: string) => {
    setActive(active);
    const search = new URLSearchParams(searchParams.toString());

    if (!active) {
      search.delete(FilterParam.ACTIVE);
      router.replace(`${pathname}?${search.toString()}`);
      return;
    }

    search.set(FilterParam.ACTIVE, active);
    router.replace(`${pathname}?${search.toString()}`);
  };

  const handleDeleteFilter = () => {
    router.replace(`${pathname}`);
  };

  useEffect(() => {
    setMode(searchParams.get(FilterParam.MODE) ?? "");
    setType(searchParams.get(FilterParam.TYPE) ?? "");
    setActive(searchParams.get(FilterParam.ACTIVE) ?? "");
  }, [searchParams]);

  return (
    <div className="p-5 flex flex-col gap-4 rounded-md shadow-md bg-white">
      <Input
        placeholder="Tìm kiếm theo mã giảm giá, chương trình khuyến mại"
        className="w-full"
        startContent={<IoMdSearch />}
        radius="sm"
        variant="bordered"
        onChange={handleInputChange}
      />
      <div className="flex gap-2 flex-wrap items-center">
        <div className="min-w-[300px]">
          <Select
            label="Kiểu khuyến mại"
            variant="bordered"
            radius="sm"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[mode]}
            onSelectionChange={(key) =>
              handleModeChange(Array.from(key)[0] as string)
            }
          >
            <SelectItem key={""}>Tất cả</SelectItem>
            <SelectItem key="coupon">Mã giảm giá</SelectItem>
            <SelectItem key="promotion">Chương trình khuyến mại</SelectItem>
          </Select>
        </div>
        <div className="min-w-[300px]">
          <Select
            label="Loại khuyến mại"
            variant="bordered"
            radius="sm"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[type]}
            onSelectionChange={(key) =>
              handleTypeChange(Array.from(key)[0] as string)
            }
          >
            <SelectItem key={""}>Tất cả</SelectItem>
            <SelectItem key={"product"}>Sản phẩm</SelectItem>
            <SelectItem key={"order"}>Đơn hàng</SelectItem>
          </Select>
        </div>
        <div className="min-w-[300px]">
          <Select
            label="Trạng thái"
            variant="bordered"
            radius="sm"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[active]}
            onSelectionChange={(key) =>
              handleActiveChange(Array.from(key)[0] as string)
            }
          >
            <SelectItem key={""}>Tất cả</SelectItem>
            <SelectItem key="true">Đang kích hoạt</SelectItem>
            <SelectItem key="false">Chưa kích hoạt</SelectItem>
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

export { DiscountFilter };
