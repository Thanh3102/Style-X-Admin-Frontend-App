"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { HiOutlineViewColumns } from "react-icons/hi2";
import {
  ReportLowStock,
  ReportRevenueDetailResponse,
} from "@/app/api/report/report.type";
import { GrFormNextLink } from "react-icons/gr";
import { FaAngleDown, FaWarehouse } from "react-icons/fa6";
import { CurrencyFormatter } from "@/libs/format-helper";
import { useImmer } from "use-immer";
import { Compare } from "@/libs/helper";

type Props = {
  data: ReportRevenueDetailResponse;
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
    key: "time",
    label: "Thời gian",
    isSortable: true,
    className: "min-w-[200px]",
  },
  {
    key: "numberOfOrder",
    label: "SL đơn hàng",
    isSortable: true,
  },
  {
    key: "numberOfOrderItem",
    label: "SL đặt hàng",
    isSortable: true,
  },
  {
    key: "goodValue",
    label: "Tiền hàng",
    isSortable: true,
  },

  {
    key: "discount",
    label: "Giảm giá",
    isSortable: true,
  },
  {
    key: "netRevenue",
    label: "Doanh thu thuần",
    isSortable: true,
  },
  {
    key: "cost",
    label: "Tiền vốn",
    isSortable: true,
  },
  {
    key: "grossProfit",
    label: "Lợi nhuận gộp",
    isSortable: true,
  },
  {
    key: "averageOrderValue",
    label: "Giá trị đơn hàng trung bình",
    isSortable: true,
  },
];

const RevenueDetailTable = ({ data }: Props) => {
  console.log("data", data);

  const [displayColumns, setDisplayColumns] = useState<string[]>([
    "time",
    "numberOfOrder",
    "numberOfOrderItem",
    "goodValue",
    "discount",
    "netRevenue",
    "grossProfit",
    "averageOrderValue",
    "cost",
  ]);
  const [descriptor, setDescriptor] = useState<SortDescriptor | undefined>();
  const [items, setItems] = useImmer<ReportRevenueDetailResponse["reports"]>(
    data.reports
  );

  const sortTable = useCallback(() => {
    if (!descriptor) return;

    const { column, direction } = descriptor;

    setItems((items) => {
      switch (column) {
        case "time":
          if (direction === "ascending") {
            return data.reports;
          } else {
            const initData = [...data.reports];
            const reverseData = initData.reverse();
            return reverseData;
          }
        case "numberOfOrder":
        case "numberOfOrderItem":
        case "goodValue":
        case "discount":
        case "netRevenue":
        case "cost":
        case "grossProfit":
        case "averageOrderValue":
          const newArray = items.sort((a, b) => {
            const first = a[column];
            const second = b[column];
            let cmp = Compare(first, second);
            if (direction === "descending") {
              cmp *= -1;
            }
            return cmp;
          });

          return newArray;

        default:
          return items;
      }
    });
  }, [descriptor]);

  const renderCell = useCallback(
    (item: ReportRevenueDetailResponse["reports"][0], key: string) => {
      switch (key) {
        case "time":
          return <TableCell className="">{item.time}</TableCell>;
        case "numberOfOrder":
          return <TableCell>{item.numberOfOrder}</TableCell>;
        case "numberOfOrderItem":
          return <TableCell>{item.numberOfOrderItem}</TableCell>;
        case "goodValue":
          return (
            <TableCell>{CurrencyFormatter().format(item.goodValue)}</TableCell>
          );
        case "discount":
          return (
            <TableCell>{CurrencyFormatter().format(item.discount)}</TableCell>
          );
        case "netRevenue":
          return (
            <TableCell>{CurrencyFormatter().format(item.netRevenue)}</TableCell>
          );
        case "cost":
          return <TableCell>{CurrencyFormatter().format(item.cost)}</TableCell>;
        case "grossProfit":
          return (
            <TableCell>
              {CurrencyFormatter().format(item.grossProfit)}
            </TableCell>
          );
        case "averageOrderValue":
          return (
            <TableCell>
              {CurrencyFormatter().format(item.averageOrderValue)}
            </TableCell>
          );
        default:
          return <TableCell>---</TableCell>;
      }
    },
    []
  );

  useEffect(() => {
    setItems(data.reports);
  }, [data.reports]);

  return (
    <>
      <div className="pb-5 flex justify-end">
        <Dropdown placement="bottom">
          <DropdownTrigger>
            <Button
              radius="sm"
              variant="bordered"
              startContent={<HiOutlineViewColumns />}
              endContent={<FaAngleDown />}
            >
              Cột hiển thị
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            selectionMode="multiple"
            selectedKeys={displayColumns}
            onSelectionChange={(keys) =>
              setDisplayColumns(Array.from(keys) as string[])
            }
            closeOnSelect={false}
            disallowEmptySelection
          >
            {columns.map((column) => (
              <DropdownItem key={column.key}>{column.label}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="max-w-full overflow-x-auto max-h-[600px]">
        <Table
          removeWrapper
          isHeaderSticky
          sortDescriptor={descriptor}
          onSortChange={(descriptor) => {
            setDescriptor(descriptor);
            sortTable();
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
          <TableHeader
            className="rounded-none"
            columns={columns.filter((column) =>
              displayColumns.includes(column.key)
            )}
          >
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
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.time}>
                {(key) => renderCell(item, key.toString())}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export { RevenueDetailTable };
