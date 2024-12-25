"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { EmptyTableContent } from "../EmptyTableContent";
import { GetCollectionResponse } from "@/app/api/categories/categories.type";
import CreateCollectionButton from "@/components/ui/CreateCollectionButton";
import { FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

import ConfirmModal from "../ConfirmModal";
import EditCollectionModal from "../modals/EditCollectionModal";
import { getSession } from "next-auth/react";
import { DeleteCollection } from "@/app/api/categories";
import toast from "react-hot-toast";

type CollectionTableProps = {
  collections: GetCollectionResponse;
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
    key: "number-of-categories",
    label: "Số danh mục",
    isSortable: false,
  },
  {
    key: "user-action",
    label: "Hành động",
    isSortable: false,
    align: "center",
  },
];

const CollectionTable = ({ collections }: CollectionTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [lastClickCollection, setLastClickCollection] =
    useState<GetCollectionResponse[number]>();

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
    (collection: GetCollectionResponse[number], key: any) => {
      switch (key) {
        case "title":
          return <TableCell>{collection.title}</TableCell>;
        case "slug":
          return <TableCell>{collection.slug}</TableCell>;
        case "number-of-categories":
          return <TableCell>{collection.categories.length}</TableCell>;
        case "user-action":
          return (
            <TableCell>
              <div className="flex gap-2 justify-center items-center">
                <FaEdit
                  className="hover:cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    setLastClickCollection(collection);
                    onOpenEdit();
                  }}
                />
                <FaTrash
                  className="hover:cursor-pointer hover:text-red-500"
                  onClick={() => {
                    setLastClickCollection(collection);
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
      const { message } = await DeleteCollection(id, session?.accessToken);
      toast.success(message ?? "Đã xóa bộ sưu tập");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (collections.length === 0) {
    return (
      <>
        <EmptyTableContent
          title="Cửa hàng danh mục nào"
          subTitle="Tạo danh mục để phân loại sản phẩm"
          addButton={<CreateCollectionButton />}
        />
      </>
    );
  }

  return (
    <>
      <div className="max-w-full overflow-x-auto max-h-[70vh]">
        <Table
          removeWrapper
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
          <TableBody items={collections}>
            {(item) => (
              <TableRow key={item.id}>
                {(key) => renderCell(item, key.toString())}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {openEdit && lastClickCollection && (
        <EditCollectionModal
          isOpen={openEdit}
          onOpenChange={onEditOpenChange}
          collection={lastClickCollection}
        />
      )}

      {openDelete && lastClickCollection && (
        <ConfirmModal
          title="Xác nhận xóa bộ sưu tập"
          isOpen={openDelete}
          onOpenChange={onDeleteOpenChange}
          confirmText="Xóa"
          onConfirm={() => handleDelete(lastClickCollection.id)}
        >
          <div className="flex flex-col gap-1">
            <span>Xác nhận xóa bộ sưu tập {lastClickCollection.title} ?</span>
            <span>Các danh mục thuộc bộ sưu tập này sẽ bị xóa.</span>
          </div>
        </ConfirmModal>
      )}
    </>
  );
};

export { CollectionTable };
