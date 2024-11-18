"use client";

import { Controller, useFormContext } from "react-hook-form";
// import { EditSupplierField } from "./SupplierInfo";
import { FormInput, FormSelect } from "../../common/Form";
import { cn } from "@/libs/utils";
import {
  CountriesSelector,
  DistrictSelector,
  ProvinceSelector,
  WardSelector,
} from "../../ui/CountriesSelector";
import { SelectItem } from "@nextui-org/react";
import { z } from "zod";
import { DetailSuppler } from "@/libs/types/backend";
import { createEditSupplierSchema } from "../SupplierInfo";

type FormEditSupplierProps = {
  supplier: DetailSuppler;
};

const FormEditSupplier = ({ supplier }: FormEditSupplierProps) => {
  const schema = createEditSupplierSchema(supplier);
  type EditSupplierField = z.infer<typeof schema>;

  const {
    formState: { errors },
    getValues,
    setValue,
    register,
    watch,
    control,
  } = useFormContext<EditSupplierField>();

  return (
    <div className="py-2 -mx-2 [&>*]:px-2 gap-y-2 flex flex-wrap">
      <div className="col-6">
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
              isInvalid={errors.code ? true : false}
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

      <div className={cn("col-6")}>
        <CountriesSelector
          onOptionChange={(key) => setValue("country", key)}
          defaultValue={getValues("country")}
        />
      </div>

      <div
        className={cn("col-6", {
          hidden: watch("country") !== "Viet Nam",
        })}
      >
        <ProvinceSelector
          onOptionChange={(key) => setValue("province", key)}
          defaultValue={getValues("province")}
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
          defaultValue={getValues("district")}
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
          defaultValue={getValues("ward")}
          className={cn({
            hidden: watch("country") !== "Viet Nam",
          })}
        />
      </div>

      <div className="col-6">
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

      <div className="col-6">
        <FormSelect
          label={"Trạng thái"}
          placeholder="Chọn trạng thái"
          defaultSelectedKeys={[getValues("active").toString()]}
          onSelectionChange={(key) => {
            key.currentKey === "true"
              ? setValue("active", true, { shouldDirty: true })
              : setValue("active", false, { shouldDirty: true });
          }}
          selectionMode="single"
        >
          <SelectItem key={"true"} value={"true"}>
            Đang hoạt động
          </SelectItem>
          <SelectItem key={"false"} value={"false"}>
            Ngừng hoạt động
          </SelectItem>
        </FormSelect>
      </div>
    </div>
  );
};

export { FormEditSupplier };
