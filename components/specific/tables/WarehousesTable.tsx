"use client";
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useCallback } from "react";
import { EmptyTableContent } from "../EmptyTableContent";
import {
  GetWarehousesResponse,
  WarehousesResponse,
} from "@/app/api/warehouses/warehouses.type";
import UpdateWarehouseButton from "@/components/ui/UpdateWarehouseButton";
import { FilterParam } from "@/libs/types/backend";
import { WarehouseRoute } from "@/constants/route";
import { Status } from "@/components/ui/Status";

type WarehouseTableProps = {
  warehouses: GetWarehousesResponse;
  //   page: number;
  //   limit: number;
  //   total: number;
  //   count: number;
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
    label: "Mã kho hàng",
    isSortable: false,
  },
  {
    key: "name",
    label: "Tên kho hàng",
    isSortable: false,
  },
  // {
  //   key: "email",
  //   label: "Email",
  //   isSortable: false,
  // },
  {
    key: "active",
    label: "Trạng thái",
    isSortable: false,
    align: "center",
  },
  {
    key: "phoneNumber",
    label: "Số điện thoại",
    isSortable: false,
    align: "center",
  },
  {
    key: "address",
    label: "Địa chỉ",
    isSortable: false,
    className: "w-[220px]",
  },
  {
    key: "history",
    label: "Lịch sử tồn kho",
    isSortable: false,
    align: "center",
  },
  {
    key: "action",
    label: "Thay đổi",
    isSortable: false,
    align: "center",
  },
];

const WarehouseTable = ({ warehouses }: WarehouseTableProps) => {
  //   const router = useRouter();
  //   const pathname = usePathname();
  //   const searchParams = useSearchParams();

  //   const handlePageChange = (page: number) => {
  //     const current = new URLSearchParams(Array.from(searchParams.entries()));
  //     const newUrl = updateSearchParams(
  //       current,
  //       [{ name: "page", value: page.toString() }],
  //       pathname
  //     );
  //     router.replace(newUrl);
  //   };

  //   const handleLimitChange = (limit: string) => {
  //     const current = new URLSearchParams(Array.from(searchParams.entries()));
  //     const newUrl = updateSearchParams(
  //       current,
  //       [
  //         { name: "limit", value: limit },
  //         {
  //           name: "page",
  //           value: "1",
  //         },
  //       ],
  //       pathname
  //     );
  //     router.replace(newUrl);
  //   };

  const renderCell = useCallback((warehouse: WarehousesResponse, key: any) => {
    switch (key) {
      case "code":
        return (
          <TableCell className="">
            <Link href={`${WarehouseRoute}/${warehouse.id}`}>
              <span className="label-link">{warehouse.code}</span>
            </Link>
          </TableCell>
        );
      case "name":
        return <TableCell>{warehouse.name}</TableCell>;
      case "email":
        return <TableCell>{warehouse.email ?? "---"}</TableCell>;
      case "active":
        return (
          <TableCell>
            <div className="flex items-center justify-center">
              {warehouse.active ? (
                <Status content="Đang sử dụng" color="success" />
              ) : (
                <Status content="Không sử dụng" />
              )}
            </div>
          </TableCell>
        );
      case "phoneNumber":
        return <TableCell>{warehouse.phoneNumber ?? "---"}</TableCell>;
      case "address":
        return (
          <TableCell>{`${[
            warehouse.address,
            warehouse.ward,
            warehouse.district,
            warehouse.province,
          ]
            .filter((item) => item)
            .join(", ")}`}</TableCell>
        );
      case "history":
        return (
          <TableCell className="">
            <Link
              href={`/inventories/history?${FilterParam.WAREHOUSE_IDS}=${warehouse.id}`}
              target="_blank"
            >
              <span className="label-link">{"Xem"}</span>
            </Link>
          </TableCell>
        );
      case "action":
        return (
          <TableCell>
            <div className="flex items-center justify-center gap-4">
              <UpdateWarehouseButton warehouse={warehouse} />
            </div>
          </TableCell>
        );
      default:
        return <TableCell>---</TableCell>;
    }
  }, []);

  if (warehouses.length === 0) {
    return (
      <>
        <EmptyTableContent
          title="Cửa hàng chưa có kho hàng nào"
          subTitle="Tạo kho hàng để quản lý tồn kho sản phẩm"
        />
      </>
    );
  }

  return (
    <>
      <div className="max-w-full overflow-x-auto max-h-[70vh] mt-2">
        <Table
          removeWrapper
          isHeaderSticky
          classNames={{
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
          <TableBody items={warehouses}>
            {(item) => (
              <TableRow key={item.id}>
                {(key) => renderCell(item, key.toString())}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <div className="flex justify-between items-center p-4 bg-white rounded-b-md shadow-md">
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
      </div> */}
    </>
  );
};

export { WarehouseTable };
