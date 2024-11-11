"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Input,
  Select,
  SelectItem,
  Modal,
  Spinner,
  SortDescriptor,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { FaFilter, FaPlus } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { LuFilter } from "react-icons/lu";
import { MdDiscount, MdKeyboardArrowDown } from "react-icons/md";
import CategoryModal from "./CategoryModal";
import { cn } from "@/libs/utils";
import { Compare } from "@/libs/helper";
import Link from "next/link";
import { CreateProductRoute } from "@/constants/route";

type TableData = {
  [key: string]: any;
  id: number;
  name: string;
  username: string;
  email: string;
};

const columns = [
  {
    key: "id",
    label: "ID",
    sortable: true,
  },
  {
    key: "username",
    label: "Tên người dùng",
    sortable: true,
  },
  {
    key: "name",
    label: "Họ tên",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
];

const searchBy = ["id", "name", "username"];

const searchByColumns = columns.filter((column) => {
  return searchBy.includes(column.key);
});

const filterAnimateVariants = {
  open: {
    opacity: 1,
    y: 0,
    display: "block",
    height: "auto",
  },
  close: {
    y: -10,
    height: 0,
    opacity: 0,
    display: "none",
  },
};

const ProductTable = () => {
  const [products, setProducts] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [searchByKey, setSearchByKey] = useState(new Set(["id"]));
  const [selectedColumns, setSelectedColumns] = useState(
    new Set(columns.map((column) => column.key))
  );
  const [openModalCategory, setOpenModalCategory] = useState<boolean>(false);

  const getProducts = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users?p=${page}`,
      {
        next: {
          tags: ["users"],
        },
        cache: "no-cache",
      }
    );
    const data: TableData[] = await res.json();
    setIsLoading(false);
    setProducts(data);
  }, [page]);

  const sortProducts = useCallback(() => {
    const column = sortDescriptor?.column;
    if (!column) return;

    const sortProducts = products.sort((a, b) => {
      let cmp;

      switch (column) {
        case "id":
          cmp = Compare(a.id, b.id);
          break;
        case "username":
          cmp = Compare(a.username, b.username);
          break;
        case "name":
          cmp = Compare(a.name, b.name);
          break;
        case "email":
          cmp = Compare(a.email, b.email);
          break;
        default:
          cmp = 0;
      }

      return sortDescriptor.direction === "ascending" ? cmp : cmp * -1;
    });
    setProducts(sortProducts);
  }, [sortDescriptor]);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(selectedColumns).includes(column.key)
    );
  }, [selectedColumns]);

  useEffect(() => {
    getProducts();
  }, [page]);

  useEffect(() => {
    sortProducts();
  }, [sortDescriptor]);

  return (
    <>
      <div className="mt-2 flex flex-col gap-2">
        <div className="p-4 flex gap-4 items-center rounded-lg bg-white">
          <Button
            startContent={<MdDiscount size={18} />}
            radius="sm"
            onClick={() => setOpenModalCategory(true)}
            color="primary"
            className="text-white"
          >
            Danh mục sản phẩm
          </Button>

          <Input
            placeholder="Tìm kiếm"
            startContent={<IoMdSearch />}
            color="secondary"
            className="flex-1"
            radius="sm"
          />

          <Select
            aria-label="Search by select"
            selectionMode="single"
            selectedKeys={searchByKey}
            onSelectionChange={(keys) => setSearchByKey(keys as Set<string>)}
            disallowEmptySelection
            className="w-auto min-w-40"
            size="md"
            radius="sm"
            variant="flat"
          >
            {searchByColumns.map((column) => (
              <SelectItem key={column.key}>{column.label}</SelectItem>
            ))}
          </Select>

          <Dropdown>
            <DropdownTrigger>
              <Button
                size="md"
                radius="sm"
                variant="flat"
                endContent={<MdKeyboardArrowDown size={18} />}
              >
                Hiển thị
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="bordered"
              selectionMode="multiple"
              closeOnSelect={false}
              disallowEmptySelection
              selectedKeys={selectedColumns}
              onSelectionChange={(keys) =>
                setSelectedColumns(keys as Set<string>)
              }
            >
              {columns.map((column) => (
                <DropdownItem key={column.key}>{column.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Button
            endContent={<LuFilter size={14} />}
            radius="sm"
            color={`${openFilter ? "warning" : "secondary"}`}
            onClick={() => setOpenFilter(!openFilter)}
            className="text-white"
          >
            Bộ lọc
          </Button>
        </div>

        <motion.div
          initial={{
            y: -10,
            opacity: 0,
            height: 0,
            display: "none",
          }}
          animate={openFilter ? "open" : "close"}
          variants={filterAnimateVariants}
          className="p-4 rounded-lg bg-white overflow-hidden"
          transition={{
            duration: 0.3,
            ease: "linear",
          }}
        >
          <div className="flex -mx-4 gap-y-2 items-center flex-wrap">
            <div className="w-1/4 px-4">
              <Select
                aria-label="Label"
                label="Danh mục"
                labelPlacement="outside"
                selectedKeys={["1"]}
              >
                <SelectItem key={1}>Placeholder</SelectItem>
              </Select>
            </div>
            <div className="w-1/4 px-4">
              <Select
                aria-label="Label"
                label="Trạng thái"
                labelPlacement="outside"
                selectedKeys={["1"]}
              >
                <SelectItem key={1}>Placeholder</SelectItem>
              </Select>
            </div>
            <div className="w-1/4 px-4">
              <Select
                aria-label="Label"
                label="Danh mục"
                labelPlacement="outside"
                selectedKeys={["1"]}
              >
                <SelectItem key={1}>Placeholder</SelectItem>
              </Select>
            </div>
            <div className="w-1/4 px-4">
              <Select
                aria-label="Label"
                label="Danh mục"
                labelPlacement="outside"
                selectedKeys={["1"]}
              >
                <SelectItem key={1}>Placeholder</SelectItem>
              </Select>
            </div>
          </div>
        </motion.div>

        <Table
          aria-label="Product Table"
          selectionMode="none"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          isHeaderSticky
          classNames={{
            base: "max-h-[520px] overflow-auto",
            table: "min-h-[500px]",
          }}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn key={column.key} allowsSorting={column.sortable}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"Không có dữ liệu."}
            items={products}
            isLoading={isLoading}
            loadingContent={<Spinner />}
          >
            {(item) => (
              <TableRow key={item.id}>
                {Array.from(selectedColumns).map((key) => (
                  <TableCell key={item.id}>{item[key]}</TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-center">
          <Pagination
            page={page}
            onChange={setPage}
            initialPage={1}
            total={100}
            loop
            showControls
            isCompact
          />
        </div>
      </div>

      <CategoryModal
        isOpen={openModalCategory}
        onOpenChange={setOpenModalCategory}
      />
    </>
  );
};

export default ProductTable;
