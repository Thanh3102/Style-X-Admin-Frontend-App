"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineViewColumns } from "react-icons/hi2";
import {
  ReportProductRevenueDetailResponse,
  ReportRevenueDetailResponse,
} from "@/app/api/report/report.type";
import { FaAngleDown } from "react-icons/fa6";
import { CurrencyFormatter } from "@/libs/format-helper";
import { useImmer } from "use-immer";
import { Compare } from "@/libs/helper";
import { useRouter } from "next/navigation";
import { ProductDetailRoute } from "@/constants/route";
import { log } from "node:console";
import Link from "next/link";
import { ProductRevenueDetailTable } from "./ProductRevenueDetailTable";

type Props = {
  data: ReportProductRevenueDetailResponse;
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
    key: "name",
    label: "Tên sản phẩm",
    isSortable: true,
    className: "min-w-[200px]",
  },
  {
    key: "totalNumberOfOrder",
    label: "SL đơn hàng",
    isSortable: true,
  },
  {
    key: "totalNumberOfItem",
    label: "SL đặt hàng",
    isSortable: true,
  },
  {
    key: "totalGoodValue",
    label: "Tiền hàng",
    isSortable: true,
  },

  {
    key: "totalDiscount",
    label: "Giảm giá",
    isSortable: true,
  },
  {
    key: "totalNetRevenue",
    label: "Doanh thu thuần",
    isSortable: true,
  },
  {
    key: "totalCost",
    label: "Tiền vốn",
    isSortable: true,
  },
  {
    key: "totalGrossProfit",
    label: "Lợi nhuận gộp",
    isSortable: true,
  },
  {
    key: "totalAverageOrderValue",
    label: "Giá trị đơn hàng trung bình",
    isSortable: true,
  },
];

const ProductRevenueTable = ({ data }: Props) => {
  const [displayColumns, setDisplayColumns] = useState<string[]>([
    "name",
    "totalNumberOfOrder",
    "totalNumberOfItem",
    "totalGoodValue",
    "totalDiscount",
    "totalNetRevenue",
    "totalGrossProfit",
    "totalAverageOrderValue",
    "totalCost",
  ]);
  const [descriptor, setDescriptor] = useState<SortDescriptor | undefined>();
  const [items, setItems] = useImmer<ReportProductRevenueDetailResponse>(data);
  const [lastClickedProduct, setLastClickedProduct] =
    useState<ReportProductRevenueDetailResponse[0]>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const sortTable = useCallback(() => {
    if (!descriptor) return;

    const { column, direction } = descriptor;

    setItems((items) => {
      switch (column) {
        case "name":
        case "totalNumberOfOrder":
        case "totalNumberOfItem":
        case "totalGoodValue":
        case "totalDiscount":
        case "totalNetRevenue":
        case "totalCost":
        case "totalGrossProfit":
        case "totalAverageOrderValue":
          const newArray = items.sort((a, b) => {
            const first =
              a[column as keyof ReportProductRevenueDetailResponse[0]];
            const second =
              b[column as keyof ReportProductRevenueDetailResponse[0]];
            let cmp = Compare(
              first as string | number | null | undefined,
              second as string | number | null | undefined
            );
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
    (item: ReportProductRevenueDetailResponse[0], key: string) => {
      switch (key) {
        case "name":
          return (
            <TableCell>
              <Link href={ProductDetailRoute(item.product.id)}>
                <span className="label-link">{item.product.name}</span>
              </Link>
            </TableCell>
          );
        case "totalNumberOfOrder":
          return <TableCell>{item.totalNumberOfOrder}</TableCell>;
        case "totalNumberOfItem":
          return <TableCell>{item.totalNumberOfItem}</TableCell>;
        case "totalGoodValue":
          return (
            <TableCell>
              {CurrencyFormatter().format(item.totalGoodValue)}
            </TableCell>
          );
        case "totalDiscount":
          return (
            <TableCell>
              {CurrencyFormatter().format(item.totalDiscount)}
            </TableCell>
          );
        case "totalNetRevenue":
          return (
            <TableCell>
              {CurrencyFormatter().format(item.totalNetRevenue)}
            </TableCell>
          );
        case "totalCost":
          return (
            <TableCell>{CurrencyFormatter().format(item.totalCost)}</TableCell>
          );
        case "totalGrossProfit":
          return (
            <TableCell>
              {CurrencyFormatter().format(item.totalGrossProfit)}
            </TableCell>
          );
        case "totalAverageOrderValue":
          return (
            <TableCell>
              {CurrencyFormatter().format(item.totalAverageOrderValue)}
            </TableCell>
          );
        default:
          return <TableCell>---</TableCell>;
      }
    },
    []
  );

  const handleOpenDetail = (id: string) => {
    const product = items.find((item) => item.product.id.toString() === id);
    if (product) {
      setLastClickedProduct(product);
      onOpen();
    }
  };

  useEffect(() => {
    setItems(data);
  }, [data]);

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
          onRowAction={(key) => {
            handleOpenDetail(key as string);
          }}
          onSortChange={(descriptor) => {
            setDescriptor(descriptor);
            sortTable();
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
              <TableRow key={item.product.id}>
                {(key) => renderCell(item, key.toString())}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {lastClickedProduct && (
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={false}
          radius="sm"
          backdrop="blur"
          classNames={{
            base: "min-w-[80vw] min-h-[90vh]",
          }}
        >
          <ModalContent>
            <ModalHeader>
              Chi tiết doanh thu sản phẩm {lastClickedProduct.product.name}
            </ModalHeader>
            <ModalBody>
              <ProductRevenueDetailTable data={lastClickedProduct.reports} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export { ProductRevenueTable };
