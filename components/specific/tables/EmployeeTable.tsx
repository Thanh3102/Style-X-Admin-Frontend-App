"use client";

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
import { Employee } from "@/app/api/employee/employee.type";
import { updateSearchParams } from "@/libs/helper";
import { Status } from "@/components/ui/Status";
import UpdateEmployeeButton from "@/components/ui/UpdateEmployeeButton";
import DeleteEmployeeButton from "@/components/ui/DeleteEmployeeButton";
import { useSession } from "next-auth/react";
import RenderIf from "@/components/ui/RenderIf";

type EmployeeTableProps = {
  employees: Employee[];
  page: number;
  limit: number;
  total: number;
  count: number;
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
    label: "Mã nhân viên",
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
    key: "phoneNumber",
    label: "Số điện thoại",
    isSortable: false,
  },
  {
    key: "status",
    label: "Trạng thái",
    isSortable: false,
  },
  {
    key: "action",
    label: "Hành động",
    isSortable: false,
  },
];

const EmployeeTable = ({
  count,
  employees,
  limit,
  page,
  total,
}: EmployeeTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data } = useSession();

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

  const renderCell = useCallback((employee: Employee, key: any) => {
    switch (key) {
      case "code":
        return (
          <TableCell>
            <span className="font-medium">{employee.code}</span>
          </TableCell>
        );
      case "name":
        return (
          <TableCell>
            <span>{employee.name}</span>
          </TableCell>
        );
      case "email":
        return (
          <TableCell>
            <span>{employee.email}</span>
          </TableCell>
        );
      case "phoneNumber":
        return (
          <TableCell>
            <span>{employee.phoneNumber}</span>
          </TableCell>
        );
      case "status":
        return (
          <TableCell>
            <div className="">
              {employee.isEmployed ? (
                <Status content="Đang làm việc" color="success" />
              ) : (
                <Status content="Ngừng làm việc" color="default" />
              )}
            </div>
          </TableCell>
        );
      case "action":
        return (
          <TableCell>
            <div className="flex gap-4">
              <UpdateEmployeeButton employee={employee} />
              <RenderIf condition={employee.id !== data?.user.id}>
                <DeleteEmployeeButton employee={employee} />
              </RenderIf>
            </div>
          </TableCell>
        );
      default:
        return <TableCell>No data</TableCell>;
    }
  }, []);

  return (
    <>
      <div className="max-w-full overflow-x-auto max-h-[50vh] bg-white">
        <Table
          isHeaderSticky
          removeWrapper
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

          <TableBody items={employees}>
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
          {`Từ ${count === 0 ? 0 : page === 1 ? 1 : (page - 1) * limit + 1} tới
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

export { EmployeeTable };
