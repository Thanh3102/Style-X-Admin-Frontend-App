"use client";
import { updateSearchParams } from "@/libs/helper";
import {
  Link,
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
import { WarehouseDetail } from "@/app/api/warehouses/warehouses.type";
import { EditVariantRoute, InventoriesHistoryRoute } from "@/constants/route";
import { FilterParam } from "@/libs/types/backend";
import { WarehouseFilter } from "../filters/WarehouseFIlter";

type WarehouseInventoryTableProps = {
  warehouseDetail: WarehouseDetail;
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
    key: "variant",
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
    label: "Mã vạch",
    isSortable: false,
  },
  {
    key: "onHand",
    label: "Tồn kho",
    isSortable: false,
    align: "center",
  },
  {
    key: "avaiable",
    label: "Có thể bán",
    isSortable: false,
    align: "center",
  },
  {
    key: "onReceive",
    label: "Hàng đang về",
    isSortable: false,
    align: "center",
  },
  {
    key: "onTransaction",
    label: "Đang giao dịch",
    isSortable: false,
    align: "center",
  },
  {
    key: "history",
    label: "Lịch sử thay đổi",
    isSortable: false,
    align: "center",
  },
];

const WarehouseInventoryTable = ({
  warehouseDetail,
}: WarehouseInventoryTableProps) => {
  const { count, limit, page, total } = warehouseDetail.paginition;
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

  const createHistoryURL = (variantId: number) => {
    const search = new URLSearchParams();
    search.append(FilterParam.VARIANT_IDS, variantId.toString());
    search.append(FilterParam.WAREHOUSE_IDS, warehouseDetail.id.toString());
    return `/inventories/history?${search.toString()}`;
  };

  const renderCell = useCallback(
    (inventory: WarehouseDetail["inventories"][0], key: any) => {
      switch (key) {
        case "variant":
          return (
            <TableCell>
              <Link
                href={`${EditVariantRoute(
                  inventory.productVariant.product.id,
                  inventory.productVariant.id
                )}`}
                target="_blank"
              >
                <div className="flex flex-col">
                  <span className="font-semibold line-clamp-1">
                    {inventory.productVariant.product.name}
                  </span>
                  <span className="text-zinc-400 text-sm">
                    {inventory.productVariant.title !== "Default Title"
                      ? inventory.productVariant.title
                      : "Mặc định"}
                  </span>
                </div>
              </Link>
            </TableCell>
          );
        case "skuCode":
          return <TableCell>{inventory.productVariant.skuCode}</TableCell>;
        case "barCode":
          return (
            <TableCell>{inventory.productVariant.barCode ?? "---"}</TableCell>
          );
        case "onHand":
          return <TableCell>{inventory.onHand}</TableCell>;
        case "avaiable":
          return <TableCell>{inventory.avaiable}</TableCell>;
        case "onReceive":
          return <TableCell>{inventory.onReceive}</TableCell>;
        case "onTransaction":
          return <TableCell>{inventory.onTransaction}</TableCell>;
        case "history":
          return (
            <TableCell>
              <Link
                href={createHistoryURL(inventory.productVariant.id)}
                target="_blank"
              >
                <span className="label-link">Xem</span>
              </Link>
            </TableCell>
          );
        default:
          return <TableCell>---</TableCell>;
      }
    },
    []
  );

  if (warehouseDetail.inventories.length === 0) {
    return (
      <>
        <WarehouseFilter />
        <EmptyTableContent
          title="Hiện tại kho không có sản phẩm nào"
          //   subTitle="Tạo kho hàng để quản lý tồn kho sản phẩm"
          //   addButton={
          //     <LinkButton
          //       href={`${CreateReceiveInventoryRoute}`}
          //       buttonProps={{ startContent: <FaPlus size={18} /> }}
          //     >
          //       Tạo đơn nhập hàng
          //     </LinkButton>
          //   }
        />
      </>
    );
  }

  return (
    <>
      <WarehouseFilter />
      <div className="max-w-full mt-2">
        <Table
          // isHeaderSticky
          classNames={{
            wrapper: "rounded-none",
            base: "overflow-x-auto max-h-[70vh]",
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
          <TableBody items={warehouseDetail.inventories}>
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

export { WarehouseInventoryTable };
