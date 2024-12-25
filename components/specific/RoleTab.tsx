import { GET_PERMISSION_ROUTE, GET_ROLES_ROUTE } from "@/constants/api-routes";
import { convertDateToString } from "@/libs/helper";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa6";
import { useImmer } from "use-immer";
import RenderIf from "../ui/RenderIf";
import CreateRoleButton from "../ui/CreateRoleButton";
import UpdateRoleButton from "../ui/UpdateRoleButton";
import DeleteRoleButton from "../ui/DeleteRoleButton";

export type Role = {
  id: number;
  name: string;
  createdAt: string;
  isEditable: boolean;
  isDeletable: boolean;
  permissions: Array<{
    id: number;
    name: string;
  }>;
  employees: Array<{
    id: string;
    name: string;
  }>;
  // _count: { employees: number };
};

export type PermissionSection = {
  id: number;
  name: string;
  permissions: Permission[];
};

export type Permission = {
  id: number;
  name: string;
  displayName: string;
};

const RoleTab = () => {
  const [roles, setRoles] = useImmer<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionSections, setPermissionSections] = useState<
    PermissionSection[]
  >([]);

  const fetchPermission = async () => {
    try {
      const session = await getSession();
      const res = await fetch(GET_PERMISSION_ROUTE, {
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      });
      const response = await res.json();

      if (res.ok) {
        setPermissionSections(response as PermissionSection[]);
      }
    } catch (error: any) {
      setPermissionSections([]);
    }
  };

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const res = await fetch(GET_ROLES_ROUTE, {
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      });
      const response = await res.json();
      setIsLoading(false);

      if (res.ok) {
        setRoles(response as Role[]);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message ?? "Đã xảy ra lỗi");
      setRoles([]);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermission();
  }, []);

  console.log(roles);

  return (
    <>
      <div className="flex justify-end mb-2">
        <CreateRoleButton
          fetchRoles={fetchRoles}
          permissionSections={permissionSections}
        />
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableColumn key={"role"}>Vai trò</TableColumn>
            <TableColumn key={"countAccount"}>Số lượng tài khoản</TableColumn>
            <TableColumn key={"createdAt"}>Ngày tạo</TableColumn>
            <TableColumn key={"action"} align="center">
              Hành động
            </TableColumn>
          </TableHeader>
          <TableBody isLoading={isLoading}>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.employees.length}</TableCell>
                <TableCell>{convertDateToString(role.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-5 justify-center items-center">
                    <RenderIf condition={role.isEditable}>
                      <UpdateRoleButton
                        role={role}
                        fetchRoles={fetchRoles}
                        permissionSections={permissionSections}
                      />
                    </RenderIf>
                    <RenderIf condition={role.isDeletable}>
                      <DeleteRoleButton role={role} fetchRoles={fetchRoles} />
                    </RenderIf>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
export default RoleTab;
