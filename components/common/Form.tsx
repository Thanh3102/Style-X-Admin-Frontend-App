import { cn } from "@/libs/utils";
import { InputProps, Input, SelectProps, Select } from "@nextui-org/react";
import { Autocomplete, AutocompleteProps } from "@nextui-org/react";

export type FormInputProps = {} & InputProps;
export type FormAutoCompleteProps = {} & AutocompleteProps;
export type FormSelectProps = {} & SelectProps;

const FormInput = ({
  className,
  ...props
}: FormInputProps) => {
  return (
    <Input
      radius="sm"
      labelPlacement="outside"
      placeholder="Nhập thông tin"
      variant="bordered"
      classNames={{
        label: "label",
      }}
      className={cn("", className)}
      {...props}
    />
  );
};

const FormAutoComplete = ({
  children,
  label,
  className,
  ...props
}: FormAutoCompleteProps) => {
  return (
    <>
      {label && <span className="pb-1 text-sm label block">{label}</span>}
      <Autocomplete
        variant="bordered"
        labelPlacement="outside"
        radius="sm"
        classNames={{
          popoverContent: "rounded-md",
        }}
        listboxProps={{
          emptyContent: "Không tìm thấy kết quả",
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </Autocomplete>
    </>
  );
};

const FormSelect = ({ children, ...props }: FormSelectProps) => {
  return (
    <Select
      variant="bordered"
      radius="sm"
      labelPlacement="outside"
      classNames={{
        label: "label",
      }}
      {...props}
    >
      {children}
    </Select>
  );
};

export { FormInput, FormAutoComplete, FormSelect };
