"use client";
import { GetCustomerResponse } from "@/app/api/customer/customer.type";
import { CurrencyFormatter } from "@/libs/format-helper";
import { convertDateToString, updateSearchParams } from "@/libs/helper";
import { FilterParam } from "@/libs/types/backend";
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
import { CustomerFilter } from "../filters/CustomerFilter";

type Props = {
  customers: GetCustomerResponse["customers"];
  paginition: GetCustomerResponse["paginition"];
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
    label: "Mã khách hàng",
    isSortable: false,
  },
  {
    key: "name",
    label: "Họ tên",
    isSortable: false,
  },
  {
    key: "email",
    label: "Email",
    isSortable: false,
  },
  {
    key: "numberOfOrder",
    label: "Số đơn hàng hoàn thành",
    isSortable: false,
    align: "center",
  },
  {
    key: "totalOrderRevenue",
    label: "Tổng giá trị",
    isSortable: false,
    align: "end",
  },
  // {
  //   key: "createdAt",
  //   label: "Ngày tạo",
  //   isSortable: false,
  // },
];

const CustomerTable = ({ customers, paginition }: Props) => {
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
    (item: GetCustomerResponse["customers"][0], key: string) => {
      switch (key) {
        case "code":
          return (
            <TableCell>
              <span className="label-link">{item.code}</span>
            </TableCell>
          );
        case "name":
          return <TableCell>{item.name}</TableCell>;
        case "email":
          return <TableCell>{item.email}</TableCell>;
        case "numberOfOrder":
          return <TableCell>{item.numberOfOrder}</TableCell>;
        case "totalOrderRevenue":
          return (
            <TableCell>
              {CurrencyFormatter().format(item.totalOrderRevenue)}
            </TableCell>
          );
        case "createdAt":
          return <TableCell>{convertDateToString(item.createdAt)}</TableCell>;
        default:
          return <TableCell>---</TableCell>;
      }
    },
    []
  );

  if (customers.length === 0) {
    return (
      <>
        <CustomerFilter />
        <EmptyTableContent
          title="Hiện tại chưa có khách hàng nào"
          // subTitle=""
        />
      </>
    );
  }

  return (
    <>
      <CustomerFilter />
      <div className="max-w-full overflow-x-auto max-h-[600px]">
        <Table
          removeWrapper
          isHeaderSticky
          onRowAction={(key) => {
            router.push(`/customers/${key}?${FilterParam.SORTBY}=latest`);
          }}
          classNames={{
            tr: ["hover:bg-gray-100 hover:cursor-pointer"],
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
                allowsSorting={column.isSortable}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={customers}>
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
          {`Từ ${
            paginition.count === 0
              ? 0
              : paginition.page === 1
              ? 1
              : (paginition.page - 1) * paginition.limit + 1
          } tới
          ${
            paginition.page * paginition.limit > paginition.count
              ? paginition.count
              : paginition.page * paginition.limit
          } trên tổng ${paginition.count}`}
        </span>

        <Pagination
          total={paginition.total}
          initialPage={paginition.page}
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
            defaultSelectedKeys={[paginition.limit.toString()]}
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
export default CustomerTable;
