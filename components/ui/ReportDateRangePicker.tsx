"use client";
import {
  DateFilterOption,
  DateFilterOptionValue,
  FilterParam,
} from "../../libs/types/backend";
import {
  Button,
  DateValue,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { RxTriangleDown } from "react-icons/rx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DateOption } from "../common/filters/DateOption";
import {
  getLastMonthStartEnd,
  getLastWeekStartEnd,
  getLastYearStartEnd,
  getPreviousDay,
  getThisMonthStartEnd,
  getThisWeekStartEnd,
  getThisYearStartEnd,
  getToday,
} from "@/libs/DateHelper";
import {
  convertDateToString,
  UpdateParams,
  updateSearchParams,
} from "@/libs/helper";
import { FaCalendarAlt } from "react-icons/fa";

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

const ReportDateRangePicker = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<
    DateFilterOption | undefined
  >(() => {
    const reportDate = searchParams.get(FilterParam.REPORT_DATE);
    const reportMinDate = searchParams.get(FilterParam.REPORT_DATE_MIN);
    const reportMaxDate = searchParams.get(FilterParam.REPORT_DATE_MAX);
    if (reportMaxDate || reportMinDate) {
      return {
        label: "Tùy chọn",
        value: DateFilterOptionValue.OPTION,
      };
    }

    if (reportDate) {
      const option = dateOptions.find((item) => item.value === reportDate);
      if (option) return option;
    }
    return {
      label: "30 ngày qua",
      value: DateFilterOptionValue.DAY_LAST_30,
    };
  });
  const [clickedOption, setClickedOption] = useState<
    DateFilterOption | undefined
  >();

  const [minDateString, setMinDateString] = useState<string>(
    searchParams.get(FilterParam.REPORT_DATE_MIN) ?? ""
  );
  const [maxDateString, setMaxDateString] = useState<string>(
    searchParams.get(FilterParam.REPORT_DATE_MAX) ?? ""
  );

  const handleFilter = (option: DateFilterOption | undefined) => {
    setSelectedOption(option);

    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    let url = pathname;

    // Không chọn giá trị -> Xóa các param
    if (!option) {
      const params: UpdateParams = [
        {
          name: FilterParam.REPORT_DATE,
          value: "",
        },
        {
          name: FilterParam.REPORT_DATE_MIN,
          value: "",
        },
        {
          name: FilterParam.REPORT_DATE_MAX,
          value: "",
        },
      ];

      url = updateSearchParams(currentParams, params, pathname);
      setOpen(false);

      router.replace(url);
      return;
    }

    if (option.value === DateFilterOptionValue.OPTION) {
      // Nếu đang có param sẽ thay đổi, không có sẽ thêm mới (Khi giá trị ngày không trống)
      const params: UpdateParams = [
        {
          name: FilterParam.REPORT_DATE,
          value: "",
        },
        {
          name: FilterParam.REPORT_DATE_MIN,
          value: minDateString ? minDateString : "",
        },
        {
          name: FilterParam.REPORT_DATE_MAX,
          value: maxDateString ? maxDateString : "",
        },
      ];

      url = updateSearchParams(currentParams, params, pathname);

      // if (minDateString) {
      //   setMinDateString("");
      // }

      // if (maxDateString) {
      //   setMaxDateString("");
      // }
    } else {
      url = updateSearchParams(
        currentParams,
        [
          {
            name: FilterParam.REPORT_DATE,
            value: option.value,
          },
          {
            name: FilterParam.REPORT_DATE_MIN,
            value: "",
          },
          {
            name: FilterParam.REPORT_DATE_MAX,
            value: "",
          },
        ],
        pathname
      );
    }
    setOpen(false);
    router.replace(url);
  };

  const handleMinDateChange = (v: DateValue) => {
    setMinDateString(`${v.day}/${v.month}/${v.year}`);
  };

  const handleMaxDateChange = (v: DateValue) => {
    setMaxDateString(`${v.day}/${v.month}/${v.year}`);
  };

  const renderSelectValue = (option: DateFilterOption | undefined) => {
    let startDate: Date;
    let endDate: Date;

    switch (option?.value) {
      case DateFilterOptionValue.TODAY:
        startDate = getToday();
        return (
          <span>{`${option.label} (${convertDateToString(startDate, {
            getTime: false,
          })})`}</span>
        );
      case DateFilterOptionValue.YESTERDAY:
        startDate = getPreviousDay(1);
        return (
          <span>{`${option.label} (${convertDateToString(startDate, {
            getTime: false,
          })})`}</span>
        );
      case DateFilterOptionValue.DAY_LAST_7:
        startDate = getPreviousDay(6);
        endDate = getToday();
        return (
          <span>{`${option.label} (${convertDateToString(startDate, {
            getTime: false,
          })}-${convertDateToString(endDate, { getTime: false })})`}</span>
        );
      case DateFilterOptionValue.DAY_LAST_30:
        startDate = getPreviousDay(29);
        endDate = getToday();
        return (
          <span>{`${option.label} (${convertDateToString(startDate, {
            getTime: false,
          })}-${convertDateToString(endDate, { getTime: false })})`}</span>
        );
      case DateFilterOptionValue.LAST_WEEK:
        const { start: lastWeekStart, end: lastWeekEnd } =
          getLastWeekStartEnd();
        startDate = lastWeekStart;
        endDate = lastWeekEnd;
        return (
          <span>{`${option.label} (${convertDateToString(startDate, {
            getTime: false,
          })}-${convertDateToString(endDate, { getTime: false })})`}</span>
        );
      case DateFilterOptionValue.LAST_MONTH:
        const { start: lastMonthStart, end: lastMonthEnd } =
          getLastMonthStartEnd();
        startDate = lastMonthStart;
        endDate = lastMonthEnd;
        return (
          <span>{`${option.label} (${convertDateToString(startDate, {
            getTime: false,
          })}-${convertDateToString(endDate, { getTime: false })})`}</span>
        );
      case DateFilterOptionValue.LAST_YEAR:
        const { start: lastYearStart, end: lastYearEnd } =
          getLastYearStartEnd();
        startDate = lastYearStart;
        endDate = lastYearEnd;
        return (
          <span>{`${option.label} (${convertDateToString(startDate, {
            getTime: false,
          })}-${convertDateToString(endDate, { getTime: false })})`}</span>
        );
      case DateFilterOptionValue.THIS_WEEK:
        const { start: thisWeekStart, end: thisWeekEnd } =
          getThisWeekStartEnd();
        startDate = thisWeekStart;
        endDate = thisWeekEnd;
        return (
          <span>{`${option.label} (${convertDateToString(startDate, {
            getTime: false,
          })}-${convertDateToString(endDate, { getTime: false })})`}</span>
        );
      case DateFilterOptionValue.THIS_MONTH:
        const { start: thisMonthStart, end: thisMonthEnd } =
          getThisMonthStartEnd();
        startDate = thisMonthStart;
        endDate = thisMonthEnd;
        return (
          <span>{`${option.label} (${convertDateToString(startDate, {
            getTime: false,
          })}-${convertDateToString(endDate, { getTime: false })})`}</span>
        );
      case DateFilterOptionValue.THIS_YEAR:
        const { start: thisYearStart, end: thisYearEnd } =
          getThisYearStartEnd();
        startDate = thisYearStart;
        endDate = thisYearEnd;
        return (
          <span>{`${option.label} (${convertDateToString(startDate, {
            getTime: false,
          })}-${convertDateToString(endDate, { getTime: false })})`}</span>
        );
      case DateFilterOptionValue.OPTION:
        return (
          <span>{`${option.label} (${minDateString}-${maxDateString})`}</span>
        );
      default:
        return <span>Chưa chọn thời gian</span>;
    }
  };

  useEffect(() => {
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    const reportDate = currentParams.get(FilterParam.REPORT_DATE);

    if (reportDate) {
      const option = dateOptions.find((option) => option.value === reportDate);
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
          radius="sm"
          variant="bordered"
          className="bg-white"
          fullWidth={false}
          startContent={<FaCalendarAlt />}
          endContent={<RxTriangleDown size={16} className="text-gray-500" />}
        >
          {renderSelectValue(selectedOption)}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <DateOption
          buttonText="Xác nhận"
          defaultValue={selectedOption}
          onFilter={(option) => handleFilter(option)}
          onValueChange={(option) => setClickedOption(option)}
          onMinDateChange={handleMinDateChange}
          onMaxDateChange={handleMaxDateChange}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ReportDateRangePicker;
