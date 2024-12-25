import { GET_ROLES_ROUTE } from "@/constants/api-routes";
import { updateSearchParams } from "@/libs/helper";
import { FilterParam } from "@/libs/types/backend";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFilterAltOff } from "react-icons/md";
import { Role } from "../RoleTab";

const EmployeeSearch = () => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isEmployed, setIsEmployed] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();

  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = useCallback(async () => {
    try {
      const session = await getSession();
      const res = await fetch(GET_ROLES_ROUTE, {
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      });
      const response = await res.json();

      if (res.ok) {
        setRoles(response as Role[]);
      }
    } catch (error: any) {
      setRoles([]);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const search = new URLSearchParams(Array.from(searchParams.entries()));
        const url = updateSearchParams(
          search,
          [
            {
              name: "query",
              value: value,
            },
          ],
          pathname
        );
        router.replace(url);
      }, 1000);
    },
    [searchParams, pathname]
  );

  const handleRoleChange = (role: string) => {
    const search = new URLSearchParams(searchParams.toString());
    if (role) {
      search.set(FilterParam.ROLE, role);
    } else {
      search.delete(FilterParam.ROLE);
    }
    router.replace(`${pathname}?${search.toString()}`);
  };

  const handleIsEmployedChange = (isEmployed: string) => {
    const search = new URLSearchParams(searchParams.toString());
    if (isEmployed) {
      search.set(FilterParam.IS_EMPLOYED, isEmployed);
    } else {
      search.delete(FilterParam.IS_EMPLOYED);
    }
    router.replace(`${pathname}?${search.toString()}`);
  };

  const handleDeleteFilter = () => {
    router.replace(`${pathname}`);
  };

  useEffect(() => {
    setRole(searchParams.get(FilterParam.ROLE) ?? "");
    setIsEmployed(searchParams.get(FilterParam.IS_EMPLOYED) ?? "");
  }, [searchParams]); 

  return (
    <div className="bg-white p-3 rounded-t-md flex flex-wrap gap-y-2 gap-2 items-center">
      <Input
        radius="sm"
        variant="bordered"
        defaultValue={searchParams.get("query") ?? undefined}
        startContent={<FaSearch className="text-zinc-400" />}
        placeholder="Tìm kiếm theo họ tên, email, SĐT, mã nhân viên"
        onValueChange={handleSearchChange}
        className="w-full min-w-[200px]"
      />

      <div className="w-1/4 min-w-[200px]">
        <Select
          placeholder="Chọn vai trò"
          label="Vai trò"
          variant="bordered"
          radius="sm"
          selectionMode="single"
          selectedKeys={role ? [role] : []}
          onSelectionChange={(key) =>
            handleRoleChange(Array.from(key)[0] as string)
          }
        >
          {roles.map((role) => (
            <SelectItem key={role.id}>{role.name}</SelectItem>
          ))}
        </Select>
      </div>
      <div className="w-1/4 min-w-[200px]">
        <Select
          placeholder="Chọn trạng thái"
          label="Trạng thái"
          variant="bordered"
          radius="sm"
          selectionMode="single"
          selectedKeys={isEmployed ? [isEmployed] : []}
          onSelectionChange={(key) =>
            handleIsEmployedChange(Array.from(key)[0] as string)
          }
        >
          <SelectItem key={"true"}>Đang làm việc</SelectItem>
          <SelectItem key={"false"}>Ngừng làm việc</SelectItem>
        </Select>
      </div>
      <div className="w-1/4 min-w-fit">
        <Button
          color="warning"
          variant="bordered"
          radius="sm"
          endContent={<MdOutlineFilterAltOff size={18} />}
          className="text-yellow-500"
          onClick={handleDeleteFilter}
        >
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  );
};
export default EmployeeSearch;
