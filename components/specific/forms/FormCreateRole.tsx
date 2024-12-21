"use client";

import {
  CREATE_ROLE_ROUTE,
  GET_PERMISSION_ROUTE,
} from "@/constants/api-routes";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionItem,
  Checkbox,
  CheckboxGroup,
  Input,
} from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useImmer } from "use-immer";
import { z } from "zod";
import { PermissionSection } from "../RoleTab";

type Props = {
  permissionSections: PermissionSection[];
  fetchRoles: () => void;
  onClose?: () => void;
};



const CreateRoleSchema = z.object({
  name: z.string().min(1, "Chưa nhập tên vai trò"),
  permissionIds: z.array(z.number()),
});

type CreateRoleData = z.infer<typeof CreateRoleSchema>;

const FormCreateRole = ({ permissionSections, fetchRoles, onClose }: Props) => {
  const [selectedPermission, setSelectedPermission] = useImmer<string[]>([]);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleData>({
    resolver: zodResolver(CreateRoleSchema),
  });

  const onSubmit: SubmitHandler<CreateRoleData> = async (data) => {
    if (data.permissionIds.length === 0) {
      toast.error("Chưa chọn quyền hạn");
      return;
    }
    try {
      const session = await getSession();
      const res = await fetch(CREATE_ROLE_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (res.ok) {
        toast.success(response.message ?? "Đã thêm vai trò mới");
        onClose && onClose();
        fetchRoles();
        return;
      }

      throw new Error(response.message);
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
    }
  };

  const renderSubTitle = useCallback(
    (inputSection: PermissionSection) => {
      const section = permissionSections.find(
        (item) => item.id === inputSection.id
      );

      if (!section) return undefined;

      const sectionPermissionIds = section.permissions.map((perm) =>
        perm.id.toString()
      );

      const permisssionCount = section.permissions.length;

      const selectPermissionCount = selectedPermission.filter((id) =>
        sectionPermissionIds.includes(id)
      ).length;

      return (
        <span
          className={cn({
            "text-blue-500": selectPermissionCount > 0,
          })}
        >
          Đã chọn {selectPermissionCount}/{permisssionCount}
        </span>
      );
    },
    [selectedPermission]
  );

  useEffect(() => {
    setValue(
      "permissionIds",
      selectedPermission.map((id) => parseInt(id))
    );
  }, [selectedPermission]);

  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(onSubmit)}
      id="FormCreateRole"
    >
      <Input
        label="Tên vai trò"
        placeholder="VD: Nhân viên nhập kho"
        labelPlacement="outside"
        variant="bordered"
        radius="sm"
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        classNames={{
          label: "label",
        }}
        {...register("name")}
      />

      <CheckboxGroup
        label="Quyền hạn"
        classNames={{ label: "label text-sm", base: "mt-2" }}
        value={selectedPermission}
        onValueChange={(value) => setSelectedPermission(value)}
      >
        <Accordion
          selectionMode="multiple"
          itemClasses={{
            title: "text-sm",
          }}
        >
          {permissionSections.map((section) => (
            <AccordionItem
              title={section.name}
              key={section.id}
              subtitle={renderSubTitle(section)}
            >
              <div className="flex flex-wrap -mx-1 [&>*]:py-1 gap-y-2">
                {section.permissions.map((perm) => (
                  <div className="w-1/2" key={perm.id}>
                    <Checkbox value={perm.id.toString()} className="text-sm">
                      {perm.displayName}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </CheckboxGroup>
    </form>
  );
};
export default FormCreateRole;
