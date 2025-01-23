"use client";
import { updateSearchParams } from "@/libs/helper";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import DateFilterButton from "./DateFilterButton";
import { OrderStatus } from "@/app/api/order/order.type";
import { FilterParam } from "@/libs/types/backend";
import { MdOutlineFilterAltOff } from "react-icons/md";
import { TfiReload } from "react-icons/tfi";

const OrderFilter = () => {
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(
    searchParams.get(FilterParam.ORDER_STATUS) ?? ""
  );

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

  const handleOrderStatusChange = (status: string) => {
    setStatus(status);
    const search = new URLSearchParams(searchParams.toString());

    if (!status) {
      search.delete(FilterParam.ORDER_STATUS);
      router.replace(`${pathname}?${search.toString()}`);
      return;
    }

    search.set(FilterParam.ORDER_STATUS, status);
    router.replace(`${pathname}?${search.toString()}`);
  };

  const handleDeleteFilter = () => {
    router.replace(`${pathname}`);
  };

  useEffect(() => {
    setStatus(searchParams.get(FilterParam.ORDER_STATUS) ?? "");
  }, [searchParams]);

  return (
    <div className="p-5 flex gap-4 rounded-t-md bg-white flex-wrap">
      <Input
        placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, số điện thoại"
        className="w-full"
        startContent={<IoMdSearch />}
        radius="sm"
        variant="bordered"
        onChange={handleInputChange}
      />

      <DateFilterButton
        buttonProps={{
          variant: "bordered",
          radius: "sm",
        }}
      />
      <div className="w-1/3 min-w-[200px] max-w-[400px]o">
        <Select
          variant="bordered"
          radius="sm"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[status]}
          onSelectionChange={(key) =>
            handleOrderStatusChange(Array.from(key)[0] as string)
          }
        >
          <SelectItem key={""}>Trạng thái xử lý: Tất cả</SelectItem>
          <SelectItem key={OrderStatus.COMPLETE}>Đã hoàn thành</SelectItem>
          <SelectItem key={OrderStatus.IN_TRANSIT}>Đang giao hàng</SelectItem>
          <SelectItem key={OrderStatus.PENDING_PROCESSING}>
            Chờ xử lý
          </SelectItem>
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
      <Button
        color="primary"
        variant="bordered"
        radius="sm"
        endContent={<TfiReload size={18} />}
        className="text-blue-500"
        onClick={() => router.refresh()}
      >
        Làm mới
      </Button>
    </div>
  );
};

export { OrderFilter };
