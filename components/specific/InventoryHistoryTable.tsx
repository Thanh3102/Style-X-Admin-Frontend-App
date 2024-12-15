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
import { EmptyTableContent } from "./EmptyTableContent";

import { useCallback } from "react";
import { GetInventoriesHistoryResponse } from "@/app/api/inventories/inventories.type";
import { ReceiveInventoryDetailRoute } from "@/constants/route";
import Link from "next/link";
type InventoryHistory =
  GetInventoriesHistoryResponse["inventoryHistory"][number];

type Props = {
  inventoryHistory: InventoryHistory[];
  page: number;
  limit: number;
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
    key: "changeOn",
    label: "Thời gian",
    isSortable: false,
    className: "min-w-[200px] sticky left-0 bg-white !z-[9999]",
  },
  {
    key: "transactionType",
    label: "Giao dịch",
    isSortable: false,
    className: "min-w-[200px]",
  },
  {
    key: "transactionAction",
    label: "Hành động",
    isSortable: false,
    className: "min-w-[200px]",
  },
  {
    key: "warehouse",
    label: "Kho lưu trữ",
    isSortable: false,
    className: "min-w-[200px]",
  },
  {
    key: "variant",
    label: "Sản phẩm",
    isSortable: false,
    className: "min-w-[200px]",
  },
  {
    key: "changeUser",
    label: "Thay đổi bởi",
    isSortable: false,
    className: "min-w-[200px]",
    align: "center",
  },
  {
    key: "onHand",
    label: "Tồn kho",
    isSortable: false,
    align: "center",
    className: "min-w-[100px]",
  },
  {
    key: "avaiable",
    label: "Có thể bán",
    isSortable: false,
    align: "center",
    className: "min-w-[100px]",
  },
  {
    key: "onTransaction",
    label: "Đang giao dịch",
    isSortable: false,
    align: "center",
    className: "min-w-[100px]",
  },
  {
    key: "onReceive",
    label: "Đang về kho",
    isSortable: false,
    align: "center",
    className: "min-w-[100px]",
  },
];

const InventoryHistoryTable = (props: Props) => {
  const { inventoryHistory, total, count, page, limit } = props;

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

  const renderCell = useCallback((item: InventoryHistory, key: string) => {
    switch (key) {
      case "changeOn":
        return (
          <TableCell className="sticky left-0 z-20">
            <span>{convertDateToString(item.changeOn)}</span>
          </TableCell>
        );
      case "transactionType":
        return (
          <TableCell className="text-gray-500">
            <div className="flex flex-col">
              {item.receiveInventory && (
                <Link
                  href={`${ReceiveInventoryDetailRoute(
                    item.receiveInventory.id
                  )}`}
                >
                  <span className="label-link text-sm">
                    {item.receiveInventory.code}
                  </span>
                </Link>
              )}
              <span>
                Loại: <span className="text-black">{item.transactionType}</span>
              </span>
            </div>
          </TableCell>
        );
      case "transactionAction":
        return (
          <TableCell>
            <span>{item.transactionAction}</span>
          </TableCell>
        );
      case "warehouse":
        return (
          <TableCell>
            <span>{item.inventory.warehouse.name}</span>
          </TableCell>
        );
      case "variant":
        return (
          <TableCell>
            <span>{`${item.inventory.productVariant.product.name}-${item.inventory.productVariant.title}`}</span>
          </TableCell>
        );
      case "changeUser":
        return (
          <TableCell>
            <span>{item.changeUser?.name ? item.changeUser.name : ""}</span>
          </TableCell>
        );
      case "onHand":
        return (
          <TableCell>
            <div className="flex items-center justify-center flex-col">
              {item.onHandQuantityChange !== 0 ? (
                <>
                  <span>{item.onHandQuantityChange}</span>
                  <span className="text-gray-500">{`( ${item.newOnHand} )`}</span>
                </>
              ) : (
                <span>---</span>
              )}
            </div>
          </TableCell>
        );
      case "avaiable":
        return (
          <TableCell>
            <div className="flex items-center justify-center flex-col">
              {item.avaiableQuantityChange !== 0 ? (
                <>
                  <span>{item.avaiableQuantityChange}</span>
                  <span className="text-gray-500">{`( ${item.newAvaiable} )`}</span>
                </>
              ) : (
                <span>---</span>
              )}
            </div>
          </TableCell>
        );
      case "onTransaction":
        return (
          <TableCell>
            <div className="flex items-center justify-center flex-col">
              {item.OnTransactionQuantityChange !== 0 ? (
                <>
                  <span>{item.OnTransactionQuantityChange}</span>
                  <span className="text-gray-500">{`( ${item.newOnTransaction} )`}</span>
                </>
              ) : (
                <span>---</span>
              )}
            </div>
          </TableCell>
        );
      case "onReceive":
        return (
          <TableCell>
            <div className="flex items-center justify-center flex-col">
              {item.onReceiveQuantityChange !== 0 ? (
                <>
                  <span>{item.onReceiveQuantityChange}</span>
                  <span className="text-gray-500">{`( ${item.newOnReceive} )`}</span>
                </>
              ) : (
                <span>---</span>
              )}
            </div>
          </TableCell>
        );
      default:
        return <TableCell>{null}</TableCell>;
    }
  }, []);

  if (inventoryHistory.length === 0) {
    return (
      <>
        <EmptyTableContent
          title="Hiện tại chưa có giao dịch nào"
          subTitle="Khi thực hiện thay đổi về tồn kho, lịch sử sẽ được lưu lại"
        />
      </>
    );
  }

  return (
    <>
      {/* <ProductTableFilter /> */}
      <div className="max-w-full overflow-x-auto max-h-[80vh] overflow-y-auto">
        <Table
          removeWrapper
          isHeaderSticky
          // onRowAction={(key) => router.push(`${ProductRoute}/${key}`)}
          classNames={{
            // table: "border-separate",
            tr: ["group-data-[hover=true]:bg-gray-100"],
            th: [
              "bg-transparent text-base text-black font-medium rounded-none bg-gray-200 border-b-1",
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
          <TableBody items={inventoryHistory}>
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

export { InventoryHistoryTable };
