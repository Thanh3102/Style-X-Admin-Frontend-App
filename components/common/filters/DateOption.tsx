"use client";
import { DateFilterOption, DateFilterOptionValue } from "@/libs/types/backend";
import { cn } from "@/libs/utils";
import { Button, DateValue, DatePicker } from "@nextui-org/react";
import { ReactNode, useState } from "react";

const dateOptions: DateFilterOption[] = [
  { label: "Hôm nay", value: DateFilterOptionValue.TODAY },
  { label: "Hôm qua", value: DateFilterOptionValue.YESTERDAY },
  { label: "7 ngày qua", value: DateFilterOptionValue.DAY_LAST_7 },
  { label: "30 ngày qua", value: DateFilterOptionValue.DAY_LAST_30 },
  { label: "Tuần trước", value: DateFilterOptionValue.LAST_WEEK },
  { label: "Tuần này", value: DateFilterOptionValue.THIS_WEEK },
  { label: "Tháng trước", value: DateFilterOptionValue.LAST_MONTH },
  { label: "Tháng này", value: DateFilterOptionValue.THIS_MONTH },
  { label: "Năm trước", value: DateFilterOptionValue.LAST_YEAR },
  { label: "Năm nay", value: DateFilterOptionValue.THIS_YEAR },
  { label: "Tùy chọn", value: DateFilterOptionValue.OPTION },
];

type DateOptionProps = {
  defaultValue?: DateFilterOption;
  buttonText?: string;
  onValueChange?: (option: DateFilterOption | undefined) => void;
  onFilter?: (option: DateFilterOption | undefined) => void;
  onMinDateChange?: (dateValue: DateValue) => void;
  onMaxDateChange?: (dateValue: DateValue) => void;
};

const DateOption = ({
  defaultValue,
  buttonText = "Lọc",
  onValueChange,
  onFilter,
  onMinDateChange,
  onMaxDateChange,
}: DateOptionProps) => {
  const [selectedOption, setSelectedOption] = useState<
    DateFilterOption | undefined
  >(defaultValue);

  const handleOptionClick = (option: DateFilterOption) => {
    if (option.value !== DateFilterOptionValue.OPTION) {
      setSelectedOption(option);
      if (onValueChange) onValueChange(option);
      return;
    }
    if (selectedOption?.value === DateFilterOptionValue.OPTION) {
      setSelectedOption(undefined);
      if (onValueChange) onValueChange(undefined);
    } else {
      setSelectedOption(option);
      if (onValueChange) onValueChange(option);
    }
  };

  const handleFilterClick = () => {
    if (onFilter) onFilter(selectedOption);
  };

  const handleMinDateChange = (v: DateValue) => {
    if (onMinDateChange) onMinDateChange(v);
  };

  const handleMaxDateChange = (v: DateValue) => {
    if (onMaxDateChange) onMaxDateChange(v);
  };

  return (
    <>
      <div className="flex flex-wrap -mx-1 gap-y-2 w-[300px]">
        {dateOptions.map((option: DateFilterOption) => (
          <div
            key={option.value}
            className={cn("w-1/2 px-1", {
              "w-full": option.value === DateFilterOptionValue.OPTION,
            })}
          >
            <Button
              size="sm"
              disableAnimation
              variant="bordered"
              fullWidth
              className={cn("hover:bg-gray-200", {
                "text-blue-500 border-1 border-blue-500":
                  selectedOption?.value === option.value,
              })}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </Button>
          </div>
        ))}
      </div>
      <div
        className={cn("mt-2 gap-x-1 hidden", {
          flex: selectedOption?.value === DateFilterOptionValue.OPTION,
        })}
      >
        <DatePicker
          variant="bordered"
          radius="sm"
          onChange={handleMinDateChange}
        />
        <DatePicker
          variant="bordered"
          radius="sm"
          onChange={handleMaxDateChange}
        />
      </div>
      <div className="pt-2 mt-2 border-t-1 w-full">
        <Button
          fullWidth
          size="sm"
          color="primary"
          variant="solid"
          radius="sm"
          className="text-base font-medium"
          onClick={handleFilterClick}
        >
          {buttonText}
        </Button>
      </div>
    </>
  );
};

export { DateOption };
