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

const ReceiveInventoryFilter = () => {
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(
    searchParams.get(FilterParam.RECEIVE_STATUS) ?? ""
  );
  const [transactionStatus, setTransactionStatus] = useState(
    searchParams.get(FilterParam.RECEIVE_TRANSACTION_STATUS) ?? ""
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

  const handleReceiveStatusChange = (status: string) => {
    setStatus(status);
    const search = new URLSearchParams(searchParams.toString());

    if (!status) {
      search.delete(FilterParam.RECEIVE_STATUS);
      router.replace(`${pathname}?${search.toString()}`);
      return;
    }

    search.set(FilterParam.RECEIVE_STATUS, status);
    router.replace(`${pathname}?${search.toString()}`);
  };

  const handleReceiveStatusTransactionChange = (status: string) => {
    setTransactionStatus(status);
    const search = new URLSearchParams(searchParams.toString());

    if (!status) {
      search.delete(FilterParam.RECEIVE_TRANSACTION_STATUS);
      router.replace(`${pathname}?${search.toString()}`);
      return;
    }

    search.set(FilterParam.RECEIVE_TRANSACTION_STATUS, status);
    router.replace(`${pathname}?${search.toString()}`);
  };

  const handleDeleteFilter = () => {
    router.replace(`${pathname}`);
  };

  useEffect(() => {
    setStatus(searchParams.get(FilterParam.RECEIVE_STATUS) ?? "");
    setTransactionStatus(
      searchParams.get(FilterParam.RECEIVE_TRANSACTION_STATUS) ?? ""
    );
  }, [searchParams]);

  return (
    <div className="p-5 flex flex-col gap-4 rounded-md bg-white">
      <Input
        placeholder="Tìm kiếm theo mã đơn nhập hàng, kho nhập, nhà cung cấp, nhân viên tạo"
        className="w-full"
        startContent={<IoMdSearch />}
        radius="sm"
        variant="bordered"
        onChange={handleInputChange}
      />
      <div className="flex gap-2 flex-wrap">
        <DateFilterButton
          buttonProps={{
            variant: "bordered",
            radius: "sm",
          }}
        />
        <div className="min-w-[300px]">
          <Select
            variant="bordered"
            radius="sm"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[status]}
            onSelectionChange={(key) =>
              handleReceiveStatusChange(Array.from(key)[0] as string)
            }
          >
            <SelectItem key={""}>Trạng thái nhập hàng: Tất cả</SelectItem>
            <SelectItem key={ReceiveInventoryStatus.CANCEL}>Đã hủy</SelectItem>
            <SelectItem key={ReceiveInventoryStatus.RECEIVED}>
              Đã nhập hàng
            </SelectItem>
            <SelectItem key={ReceiveInventoryStatus.PARTIALLY_RECEIVED}>
              Nhập một phần
            </SelectItem>
          </Select>
        </div>
        <div className="min-w-[300px]">
          <Select
            variant="bordered"
            radius="sm"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[transactionStatus]}
            onSelectionChange={(key) =>
              handleReceiveStatusTransactionChange(Array.from(key)[0] as string)
            }
          >
            <SelectItem key={""}>Trạng thái thanh toán: Tất cả</SelectItem>
            <SelectItem key={ReceiveInventoryTransaction.PAID}>
              Đã thanh toán
            </SelectItem>
            <SelectItem key={ReceiveInventoryTransaction.PARTIALLY_PAID}>
              Thanh toán một phần
            </SelectItem>
            <SelectItem key={ReceiveInventoryTransaction.UN_PAID}>
              Chưa thanh toán
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
      </div>
    </div>
  );
};

export { ReceiveInventoryFilter };
