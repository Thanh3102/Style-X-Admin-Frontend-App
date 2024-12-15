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
import { useCallback } from "react";
import { EmptyTableContent } from "../EmptyTableContent";
import { Order, OrderStatus } from "@/app/api/order/order.type";
import OrderStatusCard from "@/components/ui/OrderStatusCard";
import OrderTransactionStatusCard from "@/components/ui/OrderTransactionStatusCard";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  limit: number;
  orders: Order[];
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
    label: "Mã đơn hàng",
    isSortable: false,
    // className: "min-w-[200px]",
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    isSortable: false,
    // className: "min-w-[200px]",
    align: "center",
  },
  {
    key: "customer",
    label: "Khách hàng",
    isSortable: false,
    // className: "min-w-[200px]",
  },
  {
    key: "phoneNumber",
    label: "Số điện thoại",
    isSortable: false,
    align: "center",
    // className: "min-w-[200px]",
  },
  {
    key: "total",
    label: "Thành tiền",
    isSortable: false,
    // className: "min-w-[170px]",
    align: "end",
  },
  {
    key: "transactionStatus",
    label: "Trạng thái thanh toán",
    isSortable: false,
    className: "min-w-[170px]",
    align: "center",
  },

  {
    key: "status",
    label: "Trạng thái xử lý",
    isSortable: false,
    className: "min-w-[170px]",
    align: "center",
  },
];

const OrderTable = ({ orders, total, count, page, limit }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const CurrencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const handlePageChange = (page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const newUrl = updateSearchParams(
      current,
      [{ name: "page", value: page.toString() }],
      pathname
    );
    router.push(newUrl);
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
    router.push(newUrl);
  };

  const renderCell = useCallback((order: Order, key: any) => {
    switch (key) {
      case "code":
        return (
          <TableCell
            className={cn({
              "line-through": order.status === OrderStatus.CANCEL,
            })}
          >
            <Link href={`/orders/${order.id}`}>
              <span className="label-link">{order.code}</span>
            </Link>
          </TableCell>
        );
      case "createdAt":
        return (
          <TableCell>
            <span
              className={cn({
                "line-through": order.status === OrderStatus.CANCEL,
              })}
            >
              {convertDateToString(order.createdAt)}
            </span>
          </TableCell>
        );
      case "status":
        return (
          <TableCell>
            <div className="flex items-center justify-center">
              <OrderStatusCard status={order.status} />
            </div>
          </TableCell>
        );
      case "transactionStatus":
        return (
          <TableCell>
            <div className="flex items-center justify-center">
              <OrderTransactionStatusCard status={order.transactionStatus} />
            </div>
          </TableCell>
        );
      case "total":
        return (
          <TableCell>
            <span
              className={cn({
                "line-through": order.status === OrderStatus.CANCEL,
              })}
            >
              {CurrencyFormatter.format(order.total)}
            </span>
          </TableCell>
        );

      case "customer":
        return (
          <TableCell>
            <div
              className={cn({
                "line-through": order.status === OrderStatus.CANCEL,
              })}
            >
              {order.customerId ? (
                <Link
                  href={`/customers/${order.customerId}`}
                  className="label-link"
                >
                  {order.name}
                </Link>
              ) : (
                <span>{order.name}</span>
              )}
            </div>
          </TableCell>
        );

      case "phoneNumber":
        return (
          <TableCell>
            <div
              className={cn({
                "line-through": order.status === OrderStatus.CANCEL,
              })}
            >
              {order.phoneNumber}
            </div>
          </TableCell>
        );

      default:
        return <TableCell>No data</TableCell>;
    }
  }, []);

  if (orders.length === 0) {
    return (
      <>
        {/* <SupplierFilter /> */}
        <EmptyTableContent
          title="Cửa hàng chưa có đơn hàng nào"
          //   subTitle=""
        />
      </>
    );
  }

  return (
    <>
      {/* <SupplierFilter /> */}
      <div className="max-w-full overflow-x-auto max-h-[70vh]">
        <Table
          removeWrapper
          isHeaderSticky
          onRowAction={(key) => {
            router.push(`/orders/${key}`);
          }}
          classNames={{
            tr: ["group-data-[hover=true]:bg-gray-100"],
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
          <TableBody items={orders}>
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

export { OrderTable };
