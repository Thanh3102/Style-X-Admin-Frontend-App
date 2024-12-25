"use client";
import {
  DateFilterOption,
  DateFilterOptionValue,
  FilterParam,
} from "../../../libs/types/backend";
import {
  Button,
  ButtonProps,
  DateValue,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { RxTriangleDown } from "react-icons/rx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DateOption } from "./DateOption";

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

type Props = {
  buttonProps?: ButtonProps;
};

const DateFilterButton = ({ buttonProps }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<
    DateFilterOption | undefined
  >(() => {
    const createdOn = searchParams.get(FilterParam.CREATED_ON);
    const createdOnMin = searchParams.get(FilterParam.CREATED_ON_MIN);
    const createdOnMax = searchParams.get(FilterParam.CREATED_ON_MAX);
    if (createdOnMin || createdOnMax) {
      return {
        label: "Tùy chọn",
        value: DateFilterOptionValue.OPTION,
      };
    }

    if (createdOn) {
      const option = dateOptions.find((item) => item.value === createdOn);
      if (option) return option;
    }
    return undefined;
  });
  const [minDateString, setMinDateString] = useState<string>(
    searchParams.get(FilterParam.CREATED_ON_MIN) ?? ""
  );
  const [maxDateString, setMaxDateString] = useState<string>(
    searchParams.get(FilterParam.CREATED_ON_MAX) ?? ""
  );

  const handleFilter = () => {
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    // Không chọn giá trị -> Xóa các param
    if (!selectedOption) {
      setOpen(false);
      currentParams.delete(FilterParam.CREATED_ON);
      currentParams.delete(FilterParam.CREATED_ON_MIN);
      currentParams.delete(FilterParam.CREATED_ON_MIN);
      const search = currentParams.toString();
      const query = search ? `?${search}` : "";
      router.replace(`${pathname}${query}`);
      return;
    }

    if (selectedOption.value === DateFilterOptionValue.OPTION) {
      // Nếu đang có param sẽ thay đổi, không có sẽ thêm mới (Khi giá trị ngày không trống)

      if (minDateString) {
        if (currentParams.get(FilterParam.CREATED_ON_MIN)) {
          currentParams.set(FilterParam.CREATED_ON_MIN, minDateString);
        } else {
          currentParams.append(FilterParam.CREATED_ON_MIN, minDateString);
        }
        setMinDateString("");
      } else if (currentParams.get(FilterParam.CREATED_ON_MIN)) {
        currentParams.delete(FilterParam.CREATED_ON_MIN);
      }

      if (maxDateString) {
        if (currentParams.get(FilterParam.CREATED_ON_MAX)) {
          currentParams.set(FilterParam.CREATED_ON_MAX, maxDateString);
        } else {
          currentParams.append(FilterParam.CREATED_ON_MAX, maxDateString);
        }
        setMaxDateString("");
      } else if (currentParams.get(FilterParam.CREATED_ON_MAX)) {
        currentParams.delete(FilterParam.CREATED_ON_MAX);
      }

      currentParams.delete(FilterParam.CREATED_ON);
    } else {
      currentParams.get(FilterParam.CREATED_ON)
        ? currentParams.set(FilterParam.CREATED_ON, selectedOption.value)
        : currentParams.append(FilterParam.CREATED_ON, selectedOption.value);

      currentParams.delete(FilterParam.CREATED_ON_MIN);
      currentParams.delete(FilterParam.CREATED_ON_MAX);
    }

    setOpen(false);

    const search = currentParams.toString();

    // Tạo params string
    const query = search ? `?${search}` : "";

    // Đẩy param mới lên url
    router.replace(`${pathname}${query}`);

    // setSelectedOption(undefined);
  };

  const handleMinDateChange = (v: DateValue) => {
    setMinDateString(`${v.day}/${v.month}/${v.year}`);
  };

  const handleMaxDateChange = (v: DateValue) => {
    setMaxDateString(`${v.day}/${v.month}/${v.year}`);
  };

  useEffect(() => {
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    const created_on = currentParams.get(FilterParam.CREATED_ON);

    if (created_on) {
      const option = dateOptions.find((option) => option.value === created_on);
      if (option) {
        setSelectedOption(option);
      }
    }
  }, []);

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setOpen}
      placement="bottom"
      radius="sm"
      showArrow
      classNames={{ backdrop: "p-0", content: "py-3" }}
    >
      <PopoverTrigger>
        <Button
          disableRipple
          {...buttonProps}
          endContent={<RxTriangleDown size={16} className="text-gray-500" />}
        >
          Ngày tạo
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <DateOption
          defaultValue={selectedOption}
          onFilter={() => handleFilter()}
          onValueChange={(option) => setSelectedOption(option)}
          onMinDateChange={handleMinDateChange}
          onMaxDateChange={handleMaxDateChange}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateFilterButton;
