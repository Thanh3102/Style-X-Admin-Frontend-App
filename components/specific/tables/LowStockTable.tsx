"use client";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useCallback } from "react";
import Link from "next/link";
import { ReportLowStock } from "@/app/api/report/report.type";
import {
  EditVariantRoute,
  ProductDetailRoute,
  ReceiveInventoryRoute,
} from "@/constants/route";
import { TbPackageImport } from "react-icons/tb";
import { GrFormNextLink } from "react-icons/gr";
import { FaWarehouse } from "react-icons/fa6";

type Props = {
  data: ReportLowStock;
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
    key: "product",
    label: "Sản phẩm",
    isSortable: false,
  },
  {
    key: "skuCode",
    label: "Mã SKU",
    isSortable: false,
  },
  {
    key: "barCode",
    label: "Mã vạch/Barcode",
    isSortable: false,
  },
  {
    key: "stock",
    label: "Số lượng tồn kho",
    isSortable: false,
  },
  {
    key: "vendor",
    label: "Nhãn hiệu",
    isSortable: false,
  },
  {
    key: "type",
    label: "Loại sản phẩm",
    isSortable: false,
  },
];

const LowStockTable = ({ data }: Props) => {
  const renderCell = useCallback((item: ReportLowStock[0], key: any) => {
    switch (key) {
      case "product":
        return (
          <TableCell>
            <Link
              href={`${EditVariantRoute(item.product.id, item.variant.id)}`}
            >
              <div className="flex flex-col">
                <span className="label-link">{item.product.name}</span>
                <span className="text-zinc-400">
                  {item.variant.title === "Default Title"
                    ? "Mặc định"
                    : item.variant.title}
                </span>
              </div>
            </Link>
          </TableCell>
        );
      case "skuCode":
        return <TableCell>{item.variant.skuCode ?? "---"}</TableCell>;
      case "barCode":
        return <TableCell>{item.variant.barCode ?? "---"}</TableCell>;
      case "stock":
        return <TableCell>{item.onHand}</TableCell>;
      case "vendor":
        return <TableCell>{item.product.vendor ?? "---"}</TableCell>;
      case "type":
        return <TableCell>{item.product.type ?? "---"}</TableCell>;
      default:
        return <TableCell>No data</TableCell>;
    }
  }, []);

  return (
    <>
      <div className="font-semibold text-lg flex justify-between">
        <span>Sản phẩm sắp hết hàng</span>
        <Button
          radius="sm"
          variant="light"
          color="primary"
          href={ReceiveInventoryRoute}
          as={Link}
          startContent={<GrFormNextLink size={20} />}
          endContent={<FaWarehouse size={20} />}
        >
          Nhập hàng
        </Button>
      </div>
      <div className="max-w-full overflow-x-auto max-h-[500px] mt-5">
        <Table
          removeWrapper
          isHeaderSticky
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
          <TableBody items={data}>
            {(item) => (
              <TableRow key={item.variant.id}>
                {(key) => renderCell(item, key.toString())}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export { LowStockTable };
