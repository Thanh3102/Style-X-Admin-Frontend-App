"use client";
import { Countries } from "@/libs/data/countries";
import { VN_Provinces } from "@/libs/data/vietnam-provinces";
import { AutocompleteItem, AutocompleteProps } from "@nextui-org/react";
import { Key, ReactNode, useMemo, useState } from "react";
import { FormAutoComplete } from "../common/Form";

export type CountriesSelectorProps = {
  onOptionChange: (value: string | undefined) => void;
  defaultValue?: string;
  className?: string;
  children?: ReactNode;
};
export type ProvinceSelectorProps = {
  onOptionChange: (value: string | undefined) => void;
  defaultValue?: string;
  className?: string;
  children?: ReactNode;
};
export type DistrictSelectorProps = {
  onOptionChange: (value: string | undefined) => void;
  defaultValue?: string;
  className?: string;
  provinceName?: string;
  children?: ReactNode;
};
export type WardSelectorProps = {
  onOptionChange: (value: string | undefined) => void;
  defaultValue?: string;
  className?: string;
  provinceName?: string;
  districtName?: string;
  children?: ReactNode;
};

const CountriesSelector = ({
  defaultValue = "Viet Nam",
  onOptionChange,
  className,
}: CountriesSelectorProps) => {
  const memoCountries = useMemo(() => {
    return Countries;
  }, []);

  return (
    <FormAutoComplete
      label="Quốc gia"
      placeholder="Chọn quốc gia"
      aria-label="Chọn quốc gia"
      defaultInputValue={defaultValue}
      defaultSelectedKey={defaultValue}
      isClearable={false}
      onSelectionChange={(key) => {
        onOptionChange(key as string as string);
      }}
      className={className}
    >
      {memoCountries.map((country) => (
        <AutocompleteItem key={country.name}>{country.name}</AutocompleteItem>
      ))}
    </FormAutoComplete>
  );
};

const ProvinceSelector = ({
  defaultValue,
  onOptionChange,
  className,
}: ProvinceSelectorProps) => {
  const memoProvinces = useMemo(() => {
    return VN_Provinces.map((province) => province.name);
  }, []);
  return (
    <FormAutoComplete
      label="Tỉnh/Thành phố"
      placeholder="Chọn tỉnh/thành phố"
      aria-label="Chọn tỉnh/thành phố"
      defaultInputValue={defaultValue}
      defaultSelectedKey={defaultValue}
      isClearable={false}
      className={className}
      onSelectionChange={(key) => {
        onOptionChange(key as string);
      }}
    >
      {memoProvinces.map((province) => (
        <AutocompleteItem key={province}>{province}</AutocompleteItem>
      ))}
    </FormAutoComplete>
  );
};

const DistrictSelector = ({
  defaultValue,
  provinceName,
  className,
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
    <FormAutoComplete
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
    >
      {memoDistricts.map((d) => (
        <AutocompleteItem key={d}>{d}</AutocompleteItem>
      ))}
    </FormAutoComplete>
  );
};

const WardSelector = ({
  provinceName,
  districtName,
  defaultValue,
  className,
  onOptionChange,
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
    <FormAutoComplete
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
    >
      {memoWards.map((w) => (
        <AutocompleteItem key={w}>{w}</AutocompleteItem>
      ))}
    </FormAutoComplete>
  );
};

export { CountriesSelector, ProvinceSelector, DistrictSelector, WardSelector };
