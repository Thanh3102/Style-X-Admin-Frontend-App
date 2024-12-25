"use client";
import { convertDateToString, updateSearchParams } from "@/libs/helper";
import {
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CreateReceiveInventoryRoute,
  ReceiveInventoryDetailRoute,
} from "@/constants/route";
import { useCallback } from "react";
import { cn } from "@/libs/utils";
import { FaPlus } from "react-icons/fa6";
import { ReceiveInventoryResponse } from "@/app/api/receive-inventory/receive-inventory.type";
import { EmptyTableContent } from "../EmptyTableContent";
import LinkButton from "@/components/ui/LinkButton";
import ReceiveInventoryStatusCard from "@/components/ui/ReceiveInventoryStatusCard";
import ReceiveTransactionStatusCard from "@/components/ui/ReceiveTransactionStatusCard";
import { CurrencyFormatter } from "@/libs/format-helper";
import { ReceiveInventoryFilter } from "../filters/ReceiveInventoryFilter";

type ReceiveTableProps = {
  page: number;
  limit: number;
  receives: ReceiveInventoryResponse["receiveInventory"];
  total: number;
  count: number;
};

type Column = {
  key: string;
  label: string;
  isSortable: boolean;
  className?: string;
  align?: "start" | "center" | "end";
};

const columns: Column[] = [
  {
    key: "code",
    label: "Mã đơn nhập",
    isSortable: false,
    className: "min-w-[200px] sticky left-0 bg-white",
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    isSortable: false,
    className: "min-w-[200px]",
    align: "center",
  },
  {
    key: "warehouse",
    label: "Kho nhập",
    isSortable: false,
    className: "min-w-[200px]",
  },
  {
    key: "status",
    label: "Trạng thái",
    isSortable: false,
    className: "min-w-[170px]",
    align: "center",
  },
  {
    key: "transactionStatus",
    label: "Trạng thái thanh toán",
    isSortable: false,
    className: "min-w-[170px]",
    align: "center",
  },
  {
    key: "supplier",
    label: "Nhà cung cấp",
    isSortable: false,
    className: "min-w-[200px]",
    align: "center",
  },
  {
    key: "createdUser",
    label: "Nhân viên tạo",
    isSortable: false,
    className: "min-w-[200px]",
    align: "center",
  },
  {
    key: "totalItems",
    label: "Số lượng nhập",
    isSortable: false,
    className: "min-w-[200px]",
    align: "center",
  },
  {
    key: "totalReceipt",
    label: "Giá trị đơn",
    isSortable: false,
    className: "min-w-[200px]",
    align: "end",
  },
];

const ReceiveInventoryTable = ({
  receives,
  total,
  count,
  page,
  limit,
}: ReceiveTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const newUrl = updateSearchParams(
      current,
      [{ name: "page", value: page.toString() }],
      pathname
    );
    router.replace(newUrl);
  };

  const handleLimitChange = (limit: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const newUrl = updateSearchParams(
      current,
      [
        { name: "limit", value: limit },
        {
          name: "page",
          value: "1",
        },
      ],
      pathname
    );
    router.replace(newUrl);
  };

  const renderCell = useCallback(
    (
      receive: ReceiveInventoryResponse["receiveInventory"][number],
      key: any
    ) => {
      switch (key) {
        case "code":
          return (
            <TableCell className="sticky left-0 z-50">
              <span className="label-link">{receive.code}</span>
            </TableCell>
          );
        case "createdAt":
          return (
            <TableCell>
              <span>{convertDateToString(receive.createdAt)}</span>
            </TableCell>
          );
        case "warehouse":
          return (
            <TableCell>
              <span>{receive.warehouse.name}</span>
            </TableCell>
          );
        case "status":
          return (
            <TableCell>
              <ReceiveInventoryStatusCard status={receive.status} />
            </TableCell>
          );
        case "transactionStatus":
          return (
            <TableCell>
              <ReceiveTransactionStatusCard
                status={receive.transactionStatus}
              />
            </TableCell>
          );
        case "supplier":
          return (
            <TableCell>
              <span>{receive.supplier.name}</span>
            </TableCell>
          );
        case "createdUser":
          return (
            <TableCell>
              <span>{receive.createUser.name}</span>
            </TableCell>
          );
        case "totalItems":
          return (
            <TableCell>
              <span>{receive.totalItems}</span>
            </TableCell>
          );
        case "totalReceipt":
          return (
            <TableCell>
              <span>{CurrencyFormatter().format(receive.totalReceipt)}</span>
            </TableCell>
          );
        default:
          return <>Invalid Data</>;
      }
    },
    []
  );

  if (receives.length === 0) {
    return (
      <>
        <ReceiveInventoryFilter />
        <EmptyTableContent
          title="Cửa hàng chưa có đơn nhập hàng nào"
          subTitle="Tạo đơn nhập hàng để nhập hàng hóa vào kho hàng của cửa hàng"
          addButton={
            <LinkButton
              href={`${CreateReceiveInventoryRoute}`}
              buttonProps={{ startContent: <FaPlus size={18} /> }}
            >
              Tạo đơn nhập hàng
            </LinkButton>
          }
        />
      </>
    );
  }

  return (
    <>
      <ReceiveInventoryFilter />
      <div className="max-w-full overflow-x-auto max-h-[70vh] mt-2">
        <Table
          removeWrapper
          isHeaderSticky
          onRowAction={(key) =>
            router.push(`${ReceiveInventoryDetailRoute(key as string)}`)
          }
          classNames={{
            tr: ["group-data-[hover=true]:bg-gray-100 hover:cursor-pointer"],
            th: [
              "bg-transparent text-base text-black font-medium rounded-none bg-gray-200 border-b-1 z-80",
            ],
            td: [
              "group-data-[first=true]:first:before:rounded-none border-b-1 border-gray-200",
              "group-data-[first=true]:last:before:rounded-none border-b-1 border-gray-200",
              "group-data-[middle=true]:before:rounded-none bg-white border-b-1 border-gray-200",
              "group-data-[last=true]:first:before:rounded-none",
              "group-data-[last=true]:last:before:rounded-none",
            ],
          }}
        >
          <TableHeader className="rounded-none" columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className={column.className}
                align={column.align}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={receives}>
            {(item) => (
              <TableRow key={item.id}>
                {(key) => renderCell(item, key.toString())}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center p-4 bg-white rounded-b-md shadow-md">
        <span className="">
          {`Từ ${page === 1 ? 1 : (page - 1) * limit + 1} tới
          ${page * limit > count ? count : page * limit} trên tổng ${count}`}
        </span>

        <Pagination
          total={total}
          initialPage={page}
          showControls
          onChange={handlePageChange}
        />

        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">Hiển thị</span>
          <Select
            size="sm"
            className="w-[80px]"
            selectionMode="single"
            onSelectionChange={(key) =>
              handleLimitChange(key.currentKey as string)
            }
            defaultSelectedKeys={[limit.toString()]}
          >
            <SelectItem key={"20"}>20</SelectItem>
            <SelectItem key={"50"}>50</SelectItem>
            <SelectItem key={"100"}>100</SelectItem>
          </Select>
          <span className="whitespace-nowrap">Kết quả</span>
        </div>
      </div>
    </>
  );
};

export { ReceiveInventoryTable };
