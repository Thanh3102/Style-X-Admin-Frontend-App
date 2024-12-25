"use client";
import { DetailSuppler, TagType } from "@/libs/types/backend";
import { EmployeeSelector } from "../common/EmployeeSelector";
import { GroupBox } from "../ui/GroupBox";
import { TagSeletor } from "../common/TagSelector";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";
import {
  Button,
  Divider,
  Link,
  Modal,
  Tooltip,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";
import { cn } from "@/libs/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { FormEditSupplier } from "./forms/FormEditSupplier";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import {
  DELETE_SUPPLIER_ROUTE,
  UPDATE_SUPPLIER_ROUTE,
} from "@/constants/api-routes";
import { SuppliersRoute } from "@/constants/route";

export type SupplierInfoProps = {
  supplier: DetailSuppler;
};

export const createEditSupplierSchema = (supplier: DetailSuppler) => {
  return z.object({
    id: z.number(),
    name: z
      .string({
        required_error: "Chưa nhập tên nhà cung cấp",
        invalid_type_error: "Giá trị không hợp lệ",
      })
      .min(1, { message: "Chưa nhập tên nhà cung cấp" }),
    code: z
      .string()
      .min(1, { message: "Mã nhà cung cấp không để trống" })
      .refine(
        (code) => {
          if (code === supplier.code) return true;
          return !code.startsWith("SUP");
        },
        { message: "Mã nhà cung cấp không bắt đầu bằng từ SUP" }
      ),
    phoneNumber: z.string().optional(),
    email: z.string().email("Email không đúng định dạng").optional(),
    taxCode: z.string().optional(),
    website: z.string().optional(),
    fax: z.string().optional(),
    country: z.string().optional(),
    province: z.string().optional(),
    district: z.string().optional(),
    ward: z.string().optional(),
    detailAddress: z.string().optional(),
    assignedId: z.number({
      required_error: "Chưa chọn nhân viên phụ trách",
      invalid_type_error: "Giá trị không hợp lệ",
    }),
    tags: z.array(z.string()).optional(),
    active: z.boolean(),
  });
};

// export type EditSupplierField = z.infer<typeof EditSupplierSchema>;

const SupplierInfo = ({ supplier }: SupplierInfoProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [exitConfirm, setExitConfirm] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const router = useRouter();

  const schema = createEditSupplierSchema(supplier);
  type EditSupplierField = z.infer<typeof schema>;

  const formMethods = useForm<EditSupplierField>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: supplier.id,
      active: supplier.active,
      assignedId: supplier.assigned.id,
      code: supplier.code,
      country: supplier.country,
      province: supplier.province ?? undefined,
      district: supplier.district ?? undefined,
      ward: supplier.ward ?? undefined,
      detailAddress: supplier.detailAddress ?? undefined,
      email: supplier.email ?? undefined,
      fax: supplier.fax ?? undefined,
      name: supplier.name,
      phoneNumber: supplier.phoneNumber ?? undefined,
      taxCode: supplier.taxCode ?? undefined,
      website: supplier.website ?? undefined,
      tags: supplier.tags,
    },
  });

  const {
    setValue,
    handleSubmit,
    formState: { isDirty, errors },
  } = formMethods;

  const onSubmit: SubmitHandler<EditSupplierField> = async (data) => {
    if (openEditModal) setOpenEditModal(false);
    setIsLoading(true);
    try {
      const session = await getSession();
      const res = await fetch(`${UPDATE_SUPPLIER_ROUTE}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success(responseData.message ?? "Lưu nhà cung cấp thành công");
        // reset();
        router.refresh();
      } else {
        throw new Error(responseData.message);
      }
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleteLoading(true);
      const session = await getSession();
      const request = await fetch(`${DELETE_SUPPLIER_ROUTE}/${supplier.id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
      });

      setIsDeleteLoading(false);

      const response = await request.json();

      if (request.ok) {
        toast.success("Đã xóa nhà cung cấp");
        router.push(`${SuppliersRoute}`);
        return;
      }

      throw new Error(response.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form
        className="flex gap-5 flex-col"
        id="updateSupplierForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <GroupBox
          title="Liên hệ"
          titleEndContent={
            <FaRegEdit
              className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              size={20}
              onClick={() => setOpenEditModal(true)}
            />
          }
        >
          <div className="text-sm">
            <div className="flex flex-col">
              <span className="text-gray-400">
                {supplier.phoneNumber
                  ? "Số điện thoại"
                  : "Không có số điện thoại"}
              </span>
              <Tooltip
                placement="top-start"
                content={
                  <div className={"w-fit max-w-[200px]"}>
                    <span className="break-words">{supplier.phoneNumber}</span>
                  </div>
                }
                classNames={{
                  base: "",
                  content: "bg-black text-white p-3 rounded-md text-sm",
                }}
              >
                <span
                  className={cn(
                    "whitespace-nowrap text-ellipsis overflow-hidden w-2/3",
                    {
                      hidden: !supplier.phoneNumber,
                    }
                  )}
                >
                  {supplier.phoneNumber}
                </span>
              </Tooltip>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">
                {supplier.email ? "Email" : "Không có email"}
              </span>
              <Tooltip
                placement="top-start"
                content={
                  <div className={"w-fit max-w-[200px]"}>
                    <span className="break-words">{supplier.email}</span>
                  </div>
                }
                classNames={{
                  base: "",
                  content: "bg-black text-white p-3 rounded-md text-sm",
                }}
              >
                <span
                  className={cn(
                    "whitespace-nowrap text-ellipsis overflow-hidden w-2/3",
                    {
                      hidden: !supplier.email,
                    }
                  )}
                >
                  {supplier.email}
                </span>
              </Tooltip>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">
                {supplier.detailAddress ? "Địa chỉ" : "Không có địa chỉ"}
              </span>
              <Tooltip
                placement="top-start"
                content={
                  <div className={"w-fit max-w-[200px]"}>
                    <span className="break-words">
                      {supplier.detailAddress}
                    </span>
                  </div>
                }
                classNames={{
                  base: "",
                  content: "bg-black text-white p-3 rounded-md text-sm",
                }}
              >
                <span
                  className={cn(
                    "whitespace-nowrap text-ellipsis overflow-hidden w-2/3",
                    {
                      hidden: !supplier.detailAddress,
                    }
                  )}
                >
                  {supplier.detailAddress}
                </span>
              </Tooltip>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">
                {supplier.fax ? "Fax" : "Không có fax"}
              </span>
              <Tooltip
                placement="top-start"
                content={
                  <div className={"w-fit max-w-[200px]"}>
                    <span className="break-words">{supplier.fax}</span>
                  </div>
                }
                classNames={{
                  base: "",
                  content: "bg-black text-white p-3 rounded-md text-sm",
                }}
              >
                <span
                  className={cn(
                    "whitespace-nowrap text-ellipsis overflow-hidden w-2/3",
                    {
                      hidden: !supplier.fax,
                    }
                  )}
                >
                  {supplier.fax}
                </span>
              </Tooltip>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">
                {supplier.website ? "Website" : "Không có website"}
              </span>
              <Tooltip
                placement="top-start"
                content={
                  <div className={"w-fit max-w-[200px]"}>
                    <span className="break-words">{supplier.website}</span>
                  </div>
                }
                classNames={{
                  base: "",
                  content: "bg-black text-white p-3 rounded-md text-sm",
                }}
              >
                <Link href={supplier.website} target="_blank">
                  <span
                    className={cn(
                      "whitespace-nowrap text-ellipsis overflow-hidden w-2/3 label-link",
                      {
                        hidden: !supplier.website,
                      }
                    )}
                  >
                    {supplier.website}
                  </span>
                </Link>
              </Tooltip>
            </div>
          </div>
        </GroupBox>

        <EmployeeSelector
          defaultInputValue={supplier.assigned.name}
          defaultSelectedKey={supplier.assigned.id.toString()}
          onKeyChange={(id) => {
            setValue("assignedId", Number(id), { shouldDirty: true });
          }}
          isValid={errors.assignedId ? true : false}
          error={errors.assignedId?.message}
        />

        <TagSeletor
          type={TagType.SUPPLIER}
          defaultValue={supplier.tags}
          onValueChange={(tags) =>
            setValue("tags", tags, { shouldDirty: true })
          }
        />

        <div className="w-full z-0">
          <Divider className="my-4" />
          <div className="flex justify-end gap-5 my-2">
            <Button
              variant="bordered"
              radius="sm"
              color="danger"
              onClick={() => setExitConfirm(true)}
              isLoading={isDeleteLoading}
              isDisabled={isLoading || isDeleteLoading}
            >
              Xóa
            </Button>
            <Button
              color="primary"
              type="submit"
              form="updateSupplierForm"
              radius="sm"
              isLoading={isLoading}
              isDisabled={!isDirty || isLoading || isDeleteLoading}
            >
              Lưu
            </Button>
          </div>
        </div>
      </form>

      <ConfirmModal
        title="Xóa nhà cung cấp"
        cancelText="Không phải bây giờ"
        confirmText="Xóa nhà cung cấp"
        isOpen={exitConfirm}
        onOpenChange={(open) => setExitConfirm(open)}
        onConfirm={() => handleDelete()}
      >
        <span>
          Bạn có chắc muốn xóa nhà cung cấp <strong>{supplier.name}</strong>?
          Thao tác này không thể khôi phục
        </span>
      </ConfirmModal>

      <Modal
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={openEditModal}
        onOpenChange={(open) => setOpenEditModal(open)}
        radius="sm"
        classNames={{
          header: "text-xl",
          base: "w-[80vw] max-h-[80vh] h-fit max-w-[800px]",
          body: "border-y-1 border-gray-400 gap-0 h-fit max-h-[500px] overflow-y-auto",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Sửa nhà cung cấp</ModalHeader>
              <ModalBody>
                <FormEditSupplier supplier={supplier} />
              </ModalBody>
              <ModalFooter className="justify-end">
                <Button
                  variant="bordered"
                  radius="sm"
                  color="primary"
                  onClick={() => setOpenEditModal(false)}
                  className="font-medium"
                  isLoading={isDeleteLoading}
                  isDisabled={isLoading || isDeleteLoading}
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {}}
                  color="primary"
                  radius="sm"
                  className="font-medium"
                  type="submit"
                  form="updateSupplierForm"
                  isLoading={isLoading}
                  isDisabled={isLoading || isDeleteLoading}
                >
                  Lưu
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </FormProvider>
  );
};

export { SupplierInfo };
