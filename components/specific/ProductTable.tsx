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
import { CreateProductRoute, ProductRoute } from "@/constants/route";
import { useCallback } from "react";
import { cn } from "@/libs/utils";
import Image from "next/image";
import { ProductTableFilter } from "./ProductTableFilter";
import { ImagePlaceholderPath } from "@/constants/filepath";
import LinkButton from "../ui/LinkButton";
import { FaPlus } from "react-icons/fa6";
import { ProductResponse } from "@/app/api/products/products.type";

type Props = {
  products: ProductResponse[];
  page: number;
  limit: number;
  total: number;
  count: number;
};

type ColumnKey = keyof Pick<
  ProductResponse,
  "name" | "avaiable" | "type" | "vendor" | "createdAt"
>;

type Column = {
  key: ColumnKey;
  label: string;
  isSortable: boolean;
  className?: string;
};

const columns: Column[] = [
  {
    key: "name",
    label: "Sản phẩm",
    isSortable: false,
    className: "w-2/5",
  },
  {
    key: "avaiable",
    label: "Có thể bán",
    isSortable: false,
  },
  {
    key: "type",
    label: "Loại",
    isSortable: false,
  },
  {
    key: "vendor",
    label: "Nhãn hiệu",
    isSortable: false,
  },
  {
    key: "createdAt",
    label: "Ngày khởi tạo",
    isSortable: false,
  },
];

const ProductTable = (props: Props) => {
  const { products, total, count, page, limit } = props;

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

  const renderCell = useCallback((product: ProductResponse, key: any) => {
    const cellValue = product[key as ColumnKey];
    switch (key as ColumnKey) {
      case "name":
        return (
          <TableCell>
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 relative rounded-lg min-w-10 min-h-10">
                <Image
                  fill
                  className="object-cover rounded-lg"
                  src={product.image ?? ImagePlaceholderPath}
                  alt=""
                />
              </div>
              <span
                className={cn(
                  "label-link",
                  "font-medium text-sm line-clamp-1 text-left"
                )}
              >
                {product.name}
              </span>
            </div>
          </TableCell>
        );
      case "avaiable":
        return (
          <TableCell>
            <div className="flex flex-col gap-1">
              <span className="font-medium">{product.avaiable}</span>
              <span className="text-gray-500">
                {product.variants.length > 0 &&
                  `(${product.variants.length} phiên bản)`}
              </span>
            </div>
          </TableCell>
        );
      case "createdAt":
        return (
          <TableCell>
            {convertDateToString(product.createdAt, { getTime: false })}
          </TableCell>
        );
      default:
        return (
          <TableCell>
            <span className="text-sm">
              {cellValue !== null && cellValue.toString()}
            </span>
          </TableCell>
        );
    }
  }, []);

  if (products.length === 0) {
    return (
      <>
        <ProductTableFilter />
        <EmptyTableContent
          title="Cửa hàng hiện tại chưa có sản phẩm nào"
          subTitle="Thêm sản phẩm để lưu trữ và hiển thị thông tin sản phẩm"
          addButton={
            <LinkButton
              href={`${CreateProductRoute}`}
              buttonProps={{
                startContent: <FaPlus size={18} />,
                variant: "ghost",
              }}
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
      <ProductTableFilter />
      <Table
        removeWrapper
        isHeaderSticky
        onRowAction={(key) => router.push(`${ProductRoute}/${key}`)}
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
            <TableColumn
              key={column.key}
              className={column.className}
              align="center"
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={products}>
          {(product) => (
            <TableRow key={product.id}>
              {(key) => renderCell(product, key)}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div
        className={cn(
          "flex justify-between items-center p-4 bg-white rounded-b-md shadow-md flex-col gap-1",
          "md:flex-row md:gap-0"
        )}
      >
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
          <span className="whitespace-nowrap">kết quả</span>
        </div>
      </div>
    </>
  );
};

export { ProductTable };
