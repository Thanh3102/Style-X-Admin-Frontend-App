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
import { EditDiscountRoute } from "@/constants/route";
import { useCallback } from "react";
import { EmptyTableContent } from "../EmptyTableContent";
import { GetDiscountResponse } from "@/app/api/discount/discount.type";
import { TbRosetteDiscount } from "react-icons/tb";
import { Status } from "@/components/ui/Status";
import RenderIf from "@/components/ui/RenderIf";
import CreateDiscountButton from "@/components/ui/CreateDiscountButton";
import { PiSpeakerHighLight } from "react-icons/pi";

type SupplierTableProps = {
  page: number;
  limit: number;
  total: number;
  count: number;
  discount: GetDiscountResponse["discounts"];
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
    key: "discount",
    label: "Khuyến mại",
    isSortable: false,
    className: "min-w-[30vw] sticky left-0 bg-white",
  },
  {
    key: "type",
    label: "Loại khuyến mại",
    isSortable: false,
    className: "min-w-[200px]",
    align: "center",
  },
  {
    key: "active",
    label: "Trạng thái",
    isSortable: false,
    className: "min-w-[200px]",
    align: "start",
  },
  {
    key: "usage",
    label: "Đã dùng",
    isSortable: false,
    align: "end",
  },
  {
    key: "combines",
    label: "Kết hợp với",
    isSortable: false,
    className: "min-w-[170px]",
    align: "start",
  },
  {
    key: "start",
    label: "Ngày bắt đầu",
    isSortable: false,
    className: "min-w-[200px]",
    align: "center",
  },
  {
    key: "end",
    label: "Ngày kết thúc",
    isSortable: false,
    className: "min-w-[200px]",
    align: "center",
  },
];

const DiscountTable = ({
  discount,
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

  const renderCell = useCallback(
    (discount: GetDiscountResponse["discounts"][number], key: any) => {
      switch (key) {
        case "discount":
          return (
            <TableCell className="sticky left-0 z-50">
              <div className="flex gap-2 items-center">
                <RenderIf condition={discount.mode === "coupon"}>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <TbRosetteDiscount className="text-blue-500" size={18} />
                  </div>
                </RenderIf>
                <RenderIf condition={discount.mode === "promotion"}>
                  <div className="bg-green-100 p-2 rounded-full">
                    <PiSpeakerHighLight className="text-green-500" size={18} />
                  </div>
                </RenderIf>
                <div className="flex flex-col gap-2">
                  <span className="label-link">{discount.title}</span>
                  <span className="line-clamp-1">{discount.summary}</span>
                </div>
              </div>
            </TableCell>
          );
        case "type":
          return (
            <TableCell>
              {discount.type === "order" && <span>Giảm giá đơn hàng</span>}
              {discount.type === "product" && <span>Giảm giá sản phẩm</span>}
            </TableCell>
          );
        case "active":
          return (
            <TableCell>
              {discount.active ? (
                <Status color="success" content="Đang áp dụng" />
              ) : (
                <Status content="Chưa kích hoạt" />
              )}
            </TableCell>
          );
        case "usage":
          return (
            <TableCell>
              <span>{discount.usage}</span>
            </TableCell>
          );
        case "combines":
          return (
            <TableCell>
              <div className="flex flex-col gap-1">
                <RenderIf
                  condition={
                    !discount.combinesWithOrderDiscount &&
                    !discount.combinesWithProductDiscount
                  }
                >
                  <span>---</span>
                </RenderIf>
                <RenderIf condition={discount.combinesWithOrderDiscount}>
                  <span>Giảm giá đơn hàng</span>
                </RenderIf>
                <RenderIf condition={discount.combinesWithProductDiscount}>
                  <span>Giảm giá sản phẩm</span>
                </RenderIf>
              </div>
            </TableCell>
          );
        case "start":
          return (
            <TableCell>
              <span>{convertDateToString(discount.startOn, {getTime: false})}</span>
            </TableCell>
          );
        case "end":
          return (
            <TableCell>
              {discount.endOn ? (
                <span>
                  {convertDateToString(discount.endOn, { getTime: false })}
                </span>
              ) : (
                <span>---</span>
              )}
            </TableCell>
          );
        default:
          return <></>;
      }
    },
    []
  );

  if (discount.length === 0) {
    return (
      <>
        {/* <SupplierFilter /> */}
        <EmptyTableContent
          title="Cửa hàng chưa có khuyến mại"
          subTitle="Tạo khuyến mại để thêm các ưu đãi cho khách hàng"
          addButton={<CreateDiscountButton />}
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
          onRowAction={(key) =>
            router.push(`${EditDiscountRoute(key as string)}`)
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
          <TableBody items={discount}>
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

export { DiscountTable };
