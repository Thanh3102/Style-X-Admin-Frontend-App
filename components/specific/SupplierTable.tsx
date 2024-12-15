"use client";
import { updateSearchParams } from "@/libs/helper";
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
import { CreateSupplierRoute, SuppliersRoute } from "@/constants/route";
import { useCallback } from "react";
import { Status } from "../ui/Status";
import { cn } from "@/libs/utils";
import { SupplierFilter } from "./SupplierFilter";
import LinkButton from "../ui/LinkButton";
import { FaPlus } from "react-icons/fa6";
import { SupplierResponse } from "@/app/api/suppliers/suppliers.type";

type SupplierTableProps = {
  page: number;
  limit: number;
  suppliers: SupplierResponse[];
  total: number;
  count: number;
};

type ColumnKey = keyof Pick<
  SupplierResponse,
  "code" | "name" | "active" | "phoneNumber" | "email"
>;

type Column = {
  key: ColumnKey;
  label: string;
  isSortable: boolean;
};

const columns: Column[] = [
  {
    key: "code",
    label: "Mã NCC",
    isSortable: false,
  },
  {
    key: "name",
    label: "Tên NCC",
    isSortable: false,
  },
  {
    key: "active",
    label: "Trạng thái",
    isSortable: false,
  },
  {
    key: "phoneNumber",
    label: "Số điện thoại",
    isSortable: false,
  },
  {
    key: "email",
    label: "Email",
    isSortable: false,
  },
];

const SupplierTable = ({
  suppliers,
  total,
  count,
  page,
  limit,
}: SupplierTableProps) => {
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

  const renderCell = useCallback((supplier: SupplierResponse, key: any) => {
    const cellValue = supplier[key as ColumnKey];

    switch (key as ColumnKey) {
      case "code":
        return (
          <span className={cn("label-link", "font-medium text-sm")}>
            {cellValue}
          </span>
        );
      case "active":
        return (
          <Status
            color={cellValue ? "success" : "default"}
            content={cellValue ? "Đang hoạt động" : "Ngừng hoạt động"}
          />
        );
      default:
        return <span className="text-sm">{cellValue}</span>;
    }
  }, []);

  if (suppliers.length === 0) {
    return (
      <>
        <SupplierFilter />
        <EmptyTableContent
          title="Cửa hàng chưa có nhà cung cấp nào"
          subTitle="Tạo nhà cung cấp để lưu thông tin các nhà cung cấp"
          addButton={
            <LinkButton
              href={`${CreateSupplierRoute}`}
              buttonProps={{ startContent: <FaPlus size={18} /> }}
            >
              Thêm nhà cung cấp mới
            </LinkButton>
          }
        />
      </>
    );
  }

  return (
    <>
      <SupplierFilter />
      <Table
        removeWrapper
        isHeaderSticky
        onRowAction={(key) => router.push(`${SuppliersRoute}/${key}`)}
        classNames={{
          tr: ["group-data-[hover=true]:bg-gray-100 hover:cursor-pointer"],
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
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={suppliers}>
          {(supplier) => (
            <TableRow key={supplier.id}>
              {(key) => <TableCell>{renderCell(supplier, key)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
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

export { SupplierTable };
