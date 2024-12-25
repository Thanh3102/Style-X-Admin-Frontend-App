"use client";
import { VN_Provinces } from "@/libs/data/vietnam-provinces";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  cn,
} from "@nextui-org/react";
import { Key, ReactNode, useMemo, useState } from "react";

// export type CountriesSelectorProps = {
//   onOptionChange: (value: string | undefined) => void;
//   defaultValue?: string;
//   className?: string;
//   children?: ReactNode;
//   isInvalid?: boolean;
//   errorMessage?: string;
// };
export type ProvinceSelectorProps = {
  onOptionChange: (value: string | undefined) => void;
  defaultValue?: string;
  className?: string;
  children?: ReactNode;
  isInvalid?: boolean;
  errorMessage?: string;
};
export type DistrictSelectorProps = {
  onOptionChange: (value: string | undefined) => void;
  defaultValue?: string;
  className?: string;
  provinceName?: string;
  children?: ReactNode;
  isInvalid?: boolean;
  errorMessage?: string;
};
export type WardSelectorProps = {
  onOptionChange: (value: string | undefined) => void;
  defaultValue?: string;
  className?: string;
  provinceName?: string;
  districtName?: string;
  children?: ReactNode;
  isInvalid?: boolean;
  errorMessage?: string;
};

const ProvinceSelector = ({
  defaultValue,
  onOptionChange,
  className,
  errorMessage,
  isInvalid,
}: ProvinceSelectorProps) => {
  const memoProvinces = useMemo(() => {
    return VN_Provinces.map((province) => province.name);
  }, []);
  return (
    <Autocomplete
      label="Tỉnh/Thành phố"
      placeholder="Chọn tỉnh/thành phố"
      aria-label="Chọn tỉnh/thành phố"
      defaultInputValue={defaultValue}
      defaultSelectedKey={defaultValue}
      isClearable={false}
      className={className}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      onSelectionChange={(key) => {
        onOptionChange(key as string);
      }}
      variant="bordered"
      radius="sm"
      labelPlacement="outside"
    >
      {memoProvinces.map((province) => (
        <AutocompleteItem key={province}>{province}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

const DistrictSelector = ({
  defaultValue,
  provinceName,
  className,
  errorMessage,
  isInvalid,
  onOptionChange,
}: DistrictSelectorProps) => {
  const memoDistricts = useMemo(() => {
    if (!provinceName) return [];
    const province = VN_Provinces.find(
      (province) => province.name === provinceName
    );
    return province ? province.districts.map((d) => d.name) : [];
  }, [provinceName]);

  return (
    <Autocomplete
      label="Quận/Huyện"
      placeholder="Chọn quận/huyện"
      aria-label="Chọn quận/huyện"
      defaultInputValue={defaultValue}
      defaultSelectedKey={defaultValue}
      isClearable={false}
      className={className}
      isDisabled={memoDistricts.length === 0}
      onSelectionChange={(key) => {
        onOptionChange(key as string);
      }}
      variant="bordered"
      radius="sm"
      labelPlacement="outside"
      isInvalid={isInvalid}
      errorMessage={errorMessage}
    >
      {memoDistricts.map((d) => (
        <AutocompleteItem key={d}>{d}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

const WardSelector = ({
  provinceName,
  districtName,
  defaultValue,
  className,
  onOptionChange,
  errorMessage,
  isInvalid,
}: WardSelectorProps) => {
  const memoWards = useMemo(() => {
    if (!provinceName || !districtName) return [];

    const province = VN_Provinces.find(
      (province) => province.name === provinceName
    );

    if (!province) return [];

    const district = province.districts.find((d) => d.name === districtName);

    return district ? district.wards.map((w) => w.name) : [];
  }, [provinceName, districtName]);
  return (
    <Autocomplete
      label="Phường/Xã"
      placeholder="Chọn phường/xã"
      aria-label="Chọn phường/xã"
      defaultInputValue={defaultValue}
      defaultSelectedKey={defaultValue}
      isClearable={false}
      isDisabled={memoWards.length === 0}
      onSelectionChange={(key) => {
        onOptionChange(key as string);
      }}
      variant="bordered"
      radius="sm"
      labelPlacement="outside"
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      className={cn(className)}
    >
      {memoWards.map((w) => (
        <AutocompleteItem key={w}>{w}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export { ProvinceSelector, DistrictSelector, WardSelector };
