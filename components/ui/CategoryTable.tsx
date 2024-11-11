"use client";
import { GET_ALL_CATEGORIES_ROUTE } from "@/constants/api-routes";
import { Compare } from "@/libs/helper";
import { Category } from "@/libs/types";
import {
  Button,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import EditCategoryModal from "../specific/EditCategoryModal";
import toast from "react-hot-toast";
import ConfirmModal from "../specific/ConfirmModal";

type Props = {
  x?: string;
};

const columns = [
  {
    key: "TITLE",
    title: "Tiêu đề",
    isSortable: true,
  },
  {
    key: "SLUG",
    title: "Đường dẫn",
    isSortable: false,
  },
  {
    key: "PARENT_CATEGORY",
    title: "Danh mục cha",
    isSortable: true,
  },
];

const CategoryTable = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [selectedCategoryKeys, setSelectedCategoryKeys] = useState(
    new Set<string>()
  );
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);

  const getCategories = async () => {
    setIsLoading(true);
    const session = await getSession();
    const response = await fetch(`${GET_ALL_CATEGORIES_ROUTE}`, {
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
      },
      next: {
        tags: ["categories"],
      },
    });

    if (response.ok) {
      const data = await response.json();
      setCategories(data);
    }

    setIsLoading(false);
  };

  const deleteCategory = useCallback(async () => {
    setIsDeleteLoading(true);
    const id = Array.from(selectedCategoryKeys)[0];
    await new Promise((resolve) => setTimeout(() => resolve(1), 3000));
    toast.success(`Đã xóa danh mục (ID: ${id}`);
    setIsDeleteLoading(false);
    setSelectedCategoryKeys(new Set());
    getCategories();
  }, [selectedCategoryKeys]);

  const sortItems = useMemo(() => {
    if (!sortDescriptor) return categories;

    const items = categories.sort((a, b) => {
      const column = sortDescriptor.column;
      if (!column) return 0;
      let cmp;

      switch (column) {
        case "ID":
          cmp = Compare(a.id, b.id);
          break;
        case "TITLE":
          cmp = Compare(a.title, b.title);
          break;
        case "PARENT_CATEGORY":
          cmp = Compare(a.parentCategory?.title, b.parentCategory?.title);
          break;
        default:
          cmp = 0;
      }

      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });

    return items;
  }, [sortDescriptor, categories]);

  const handleRowAction = (key: any) => {
    const selectedId = parseInt(key as string);
    const category = categories.find((cat) => {
      return cat.id === selectedId;
    });
    setSelectedCategory(category);
    setOpenEdit(true);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <div className="w-full flex gap-4 justify-end">
        <Button
          isDisabled={
            selectedCategoryKeys.size > 0 && !isDeleteLoading ? false : true
          }
          radius="sm"
          color={selectedCategoryKeys.size > 0 ? "danger" : "default"}
          size="sm"
          startContent={!isDeleteLoading ? <FaTrash /> : <></>}
          isLoading={isDeleteLoading}
          onClick={() => setOpenDeleteConfirm(true)}
        >
          Xóa
        </Button>
        <Button radius="sm" color="primary" size="sm" startContent={<FaPlus />}>
          Thêm danh mục
        </Button>
      </div>
      <Table
        aria-label="Label"
        isStriped
        color="danger"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        selectionMode="multiple"
        selectedKeys={selectedCategoryKeys}
        //@ts-ignore
        onSelectionChange={(keys) => setSelectedCategoryKeys(new Set(keys))}
        onRowAction={handleRowAction}
        removeWrapper
        selectionBehavior="replace"
        classNames={{
          base: "max-h-full overflow-y-auto",
          table: "min-h-full",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn allowsSorting={column.isSortable} key={column.key}>
              {column.title}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="Không có nội dung"
          items={sortItems}
          isLoading={isLoading}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell className="text-blue-500 hover:underline hover:cursor-pointer">
                {item.title}
              </TableCell>
              <TableCell>{item.slug}</TableCell>
              <TableCell>
                {item.parentCategory ? item.parentCategory.title : "Không"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <EditCategoryModal
        isOpen={openEdit}
        onOpenChange={setOpenEdit}
        category={selectedCategory}
      />

      <ConfirmModal
        isOpen={openDeleteConfirm}
        onConfirm={deleteCategory}
        onOpenChange={setOpenDeleteConfirm}
        title="Xác nhận xóa"
        cancelText="Hủy"
        confirmText="Xóa"
      >
        <span>
          Bạn có chắc muốn xóa danh mục {selectedCategory?.title} <br />{" "}
          {"(Các danh mục con cũng sẽ bị xóa)"}
        </span>
      </ConfirmModal>
    </>
  );
};

export default CategoryTable;
