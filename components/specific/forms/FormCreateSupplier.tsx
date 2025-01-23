"use client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormInput } from "../../common/Form";
import { GroupBox } from "../../ui/GroupBox";
import { z } from "zod";
import {
  CountriesSelector,
  DistrictSelector,
  ProvinceSelector,
  WardSelector,
} from "../../ui/CountriesSelector";
import { Button, Divider } from "@nextui-org/react";
import ConfirmModal from "../ConfirmModal";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeSelector } from "../../common/EmployeeSelector";
import { cn } from "@/libs/utils";
import { useRouter } from "next/navigation";
import { SuppliersRoute } from "@/constants/route";
import { TagSeletor } from "../../common/TagSelector";
import { TagType } from "@/libs/types/backend";
import { getSession } from "next-auth/react";
import { CREATE_SUPPLIER_ROUTE } from "@/constants/api-routes";
import toast from "react-hot-toast";

const CreateSupplierSchema = z
  .object({
    name: z
      .string({
        required_error: "Chưa nhập tên nhà cung cấp",
        invalid_type_error: "Giá trị không hợp lệ",
      })
      .min(1, { message: "Chưa nhập tên nhà cung cấp" }),
    code: z.string().optional(),
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
    assignedId: z.string({
      required_error: "Chưa chọn nhân viên phụ trách",
      invalid_type_error: "Giá trị không hợp lệ",
    }),
    tags: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.code && data.code.trim().toLowerCase().startsWith("sup")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mã nhà cung cấp không bắt đầu bằng 'SUP'",
        path: ["code"],
      });
    }
  });

type CreateSupplierField = z.infer<typeof CreateSupplierSchema>;

const FormCreateSupplier = () => {
  const router = useRouter();
  const [exitConfirm, setExitConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateSupplierField>({
    defaultValues: {
      country: "Viet Nam",
    },
    resolver: zodResolver(CreateSupplierSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<CreateSupplierField> = async (data) => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const response = await fetch(`${CREATE_SUPPLIER_ROUTE}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (response.ok) {
        toast.success("Thêm nhà cung cấp mới thành công");
        router.push(`${SuppliersRoute}/${res.id}`);
        return;
      }
      throw new Error(res?.message ?? "Đã xảy ra lỗi");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("error", errors);
  

  return (
    <>
      <form
        className="flex gap-5"
        id="createSupplierForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex-[2] basis-[400px] flex flex-col gap-5">
          <GroupBox title="Thông tin chung">
            <div className="flex flex-wrap gap-y-4 -mx-2 [&>*]:px-2">
              <div className="col-12">
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { ...props } }) => (
                    <FormInput
                      label={"Tên nhà cung cấp"}
                      placeholder="Nhập tên nhà cung cấp"
                      isRequired
                      isInvalid={errors.name ? true : false}
                      errorMessage={errors.name?.message}
                      {...props}
                    />
                  )}
                />
              </div>

              <div className="col-6">
                <Controller
                  control={control}
                  name="code"
                  render={({ field: { ...props } }) => (
                    <FormInput
                      label={"Mã nhà cung cấp"}
                      placeholder="Nhập mã nhà cung cấp"
                      isInvalid={!!errors.code}
                      errorMessage={errors.code?.message}
                      {...props}
                    />
                  )}
                />
              </div>

              <div className="col-6">
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field: { ...props } }) => (
                    <FormInput
                      label={"Số điện thoại"}
                      placeholder="Nhập số điện thoại"
                      isInvalid={errors.phoneNumber ? true : false}
                      errorMessage={errors.phoneNumber?.message}
                      {...props}
                    />
                  )}
                />
              </div>

              <div className="col-6">
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { ...props } }) => (
                    <FormInput
                      label={"Email"}
                      placeholder="Nhập email"
                      isInvalid={errors.email ? true : false}
                      errorMessage={errors.email?.message}
                      {...props}
                    />
                  )}
                />
              </div>

              <div className="col-6">
                <Controller
                  control={control}
                  name="taxCode"
                  render={({ field: { ...props } }) => (
                    <FormInput
                      label={"Mã số thuế"}
                      placeholder="Nhập mã số thuế"
                      isInvalid={errors.taxCode ? true : false}
                      errorMessage={errors.taxCode?.message}
                      {...props}
                    />
                  )}
                />
              </div>

              <div className="col-6">
                <Controller
                  control={control}
                  name="website"
                  render={({ field: { ...props } }) => (
                    <FormInput
                      label={"Website"}
                      placeholder="https://"
                      isInvalid={errors.website ? true : false}
                      errorMessage={errors.website?.message}
                      {...props}
                    />
                  )}
                />
              </div>

              <div className="col-6">
                <Controller
                  control={control}
                  name="fax"
                  render={({ field: { ...props } }) => (
                    <FormInput
                      label={"Số fax"}
                      placeholder="Nhập số fax"
                      isInvalid={errors.fax ? true : false}
                      errorMessage={errors.fax?.message}
                      {...props}
                    />
                  )}
                />
              </div>
            </div>
          </GroupBox>

          <GroupBox title="Địa chỉ">
            <div className="flex flex-wrap gap-y-4 -mx-2 [&>*]:px-2">
              <div
                className={cn("col-6", {
                  "col-12": watch("country") !== "Viet Nam",
                })}
              >
                <CountriesSelector
                  onOptionChange={(key) => setValue("country", key)}
                />
              </div>

              <div
                className={cn("col-6", {
                  hidden: watch("country") !== "Viet Nam",
                })}
              >
                <ProvinceSelector
                  onOptionChange={(key) => setValue("province", key)}
                />
              </div>

              <div
                className={cn("col-6", {
                  hidden: watch("country") !== "Viet Nam",
                })}
              >
                <DistrictSelector
                  onOptionChange={(key) => setValue("district", key)}
                  provinceName={watch("province")}
                  className={cn({
                    hidden: watch("country") !== "Viet Nam",
                  })}
                />
              </div>

              <div
                className={cn("col-6", {
                  hidden: watch("country") !== "Viet Nam",
                })}
              >
                <WardSelector
                  onOptionChange={(key) => setValue("ward", key)}
                  provinceName={watch("province")}
                  districtName={watch("district")}
                  className={cn({
                    hidden: watch("country") !== "Viet Nam",
                  })}
                />
              </div>

              <div className="col-12">
                <Controller
                  control={control}
                  name="detailAddress"
                  render={({ field: { ...props } }) => (
                    <FormInput
                      label="Địa chỉ cụ thể"
                      placeholder="Nhập địa chỉ cụ thể"
                      isInvalid={errors.detailAddress ? true : false}
                      errorMessage={errors.detailAddress?.message}
                      {...props}
                    />
                  )}
                />
              </div>
            </div>
          </GroupBox>
        </div>

        <div className="flex-1 basis-[200px] flex flex-col gap-5">
          <EmployeeSelector
            onKeyChange={(id) => {
              setValue("assignedId", id, {
                shouldValidate: true,
              });
            }}
            isValid={errors.assignedId ? true : false}
            error={errors.assignedId?.message}
          />

          <TagSeletor
            type={TagType.SUPPLIER}
            onValueChange={(tags) => {
              setValue("tags", tags);
            }}
          />
        </div>
      </form>

      <div className="w-full">
        <Divider className="my-4" />
        <div className="flex justify-end gap-5 my-2">
          <Button
            variant="bordered"
            radius="sm"
            color="primary"
            onClick={() => setExitConfirm(true)}
            isDisabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            color="primary"
            type="submit"
            form="createSupplierForm"
            radius="sm"
            isDisabled={isLoading}
            isLoading={isLoading}
          >
            Thêm mới
          </Button>
        </div>
      </div>

      <ConfirmModal
        cancelText="Không phải bây giờ"
        confirmText="Xác nhận"
        title="Chỉnh sửa chưa được lưu"
        isOpen={exitConfirm}
        onOpenChange={(open) => setExitConfirm(open)}
        onConfirm={() => {
          router.push(`${SuppliersRoute}`);
        }}
      >
        <span>
          Các thay đổi bạn đã thực hiện không được lưu. Bạn có muốn tiếp tục?
        </span>
      </ConfirmModal>
    </>
  );
};

export default FormCreateSupplier;
