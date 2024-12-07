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
  useDisclosure,
} from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EditDiscountRoute } from "@/constants/route";
import { useCallback, useState } from "react";
import { EmptyTableContent } from "../EmptyTableContent";
import {
  GetCategoryResponse,
  GetCollectionResponse,
} from "@/app/api/categories/categories.type";
import Image from "next/image";
import { ImagePlaceholderPath } from "@/constants/filepath";
import CreateCategoryButton from "@/components/ui/CreateCategoryButton";
import { FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import EditCategoryModal from "../modals/EditCategoryModal";
import ConfirmModal from "../ConfirmModal";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";
import { DeleteCategory } from "@/app/api/categories";

type CategoryTableProps = {
  collection: GetCollectionResponse[number];
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
    key: "image",
    label: "Hình ảnh",
    isSortable: false,
  },
  {
    key: "title",
    label: "Tiêu đề",
    isSortable: false,
  },
  {
    key: "slug",
    label: "Đường dẫn",
    isSortable: false,
  },
  {
    key: "user-action",
    label: "Hành động",
    isSortable: false,
    align: "center",
  },
];

const CategoryTable = ({ collection }: CategoryTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [lastClickCategory, setLastClickCategory] =
    useState<GetCategoryResponse[number]>();

  const {
    isOpen: openEdit,
    onOpenChange: onEditOpenChange,
    onOpen: onOpenEdit,
  } = useDisclosure();
  const {
    isOpen: openDelete,
    onOpenChange: onDeleteOpenChange,
    onOpen: onOpenDelete,
  } = useDisclosure();

  const renderCell = useCallback(
    (category: GetCategoryResponse[number], key: any) => {
      switch (key) {
        case "image":
          return (
            <TableCell>
              <div className="w-10 h-10 flex items-center justify-center">
                <Image
                  alt=""
                  src={category?.image ?? ImagePlaceholderPath}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto object-cover"
                />
              </div>
            </TableCell>
          );
        case "title":
          return <TableCell>{category.title}</TableCell>;
        case "slug":
          return <TableCell>{category.slug}</TableCell>;
        case "user-action":
          return (
            <TableCell>
              <div className="flex gap-2 justify-center items-center">
                <FaEdit
                  className="hover:cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    setLastClickCategory(category);
                    onOpenEdit();
                  }}
                />
                <FaTrash
                  className="hover:cursor-pointer hover:text-red-500"
                  onClick={() => {
                    setLastClickCategory(category);
                    onOpenDelete();
                  }}
                />
              </div>
            </TableCell>
          );
        default:
          return <TableCell>No data</TableCell>;
      }
    },
    []
  );

  const handleDelete = async (id: number) => {
    try {
      const session = await getSession();
      const { message } = await DeleteCategory(id, session?.accessToken);
      toast.success(message ?? "Đã xóa danh mục");
      router.refresh();
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="max-w-full overflow-x-auto max-h-[300px]">
        <Table
          isHeaderSticky
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
                {column.label ?? null}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={collection.categories}>
            {(item) => (
              <TableRow key={item.id}>
                {(key) => renderCell(item, key.toString())}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {openEdit && lastClickCategory && (
        <EditCategoryModal
          isOpen={openEdit}
          onOpenChange={onEditOpenChange}
          category={lastClickCategory}
        />
      )}

      {openDelete && lastClickCategory && (
        <ConfirmModal
          title="Xác nhận xóa danh mục"
          isOpen={openDelete}
          onOpenChange={onDeleteOpenChange}
          confirmText="Xóa"
          onConfirm={() => handleDelete(lastClickCategory.id)}
        >
          Xác nhận xóa danh mục {lastClickCategory.title} ? Hành động này sẽ
          không thể hoàn tác
        </ConfirmModal>
      )}
    </>
  );
};

export { CategoryTable };
