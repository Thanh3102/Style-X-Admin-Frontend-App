"use client";
import { FormInput } from "@/components/common/Form";
import { SelectedTag } from "@/components/ui/SelectedTag";
import { Button, InputProps } from "@nextui-org/react";
import { ChangeEvent, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";

type Props = {
  position: number;
  values: Array<string>;
  isInvalid?: boolean;
  isReadonly?: boolean
  errorMessage?: string;
  onInputEnter?: (value: string, position: number) => void;
  onValueDelete?: (value: string, position: number) => void;
};
const ProductOptionValueInput = (props: Props) => {
  const {
    values,
    position,
    isReadonly,
    onInputEnter,
    onValueDelete,
    isInvalid,
    errorMessage,
  } = props;

  const [inputValue, setInputValue] = useState<string>();

  const handleAdd = () => {
    if (inputValue) {
      if (onInputEnter) onInputEnter(inputValue, position);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <FormInput
        aria-label="OptionValue"
        placeholder="Nhập giá trị"
        isReadOnly={isReadonly}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        endContent={
          <FaPlus
            size={10}
            onClick={handleAdd}
            className="text-gray-400 hover:text-gray-700 hover:cursor-pointer"
          />
        }
      />
      <div className="flex flex-wrap gap-2">
        {Array.from(values).map((value) => (
          <SelectedTag
            key={value}
            value={value}
            onDelete={() => {
              if (onValueDelete) onValueDelete(value, position);
            }}
          />
        ))}
      </div>
    </div>
  );
};
export default ProductOptionValueInput;
