"use client";
import { GetEmployees } from "@/app/api/employee";
import { Employee } from "@/app/api/employee/employee.type";
import RenderIf from "@/components/ui/RenderIf";
import { EMPLOYEE_GET_ROUTE } from "@/constants/api-routes";
import { updateSearchParams } from "@/libs/helper";
import { FilterParam } from "@/libs/types/backend";
import { GetUsersResponse, ResponseUser } from "@/libs/types/backend/response";
import { cn } from "@/libs/utils";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { RxTriangleDown } from "react-icons/rx";

const AssignedFilterButton = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (selectedValues: string[]) => {
    const url = new URLSearchParams(Array.from(searchParams.entries()));
    const assignedIdString = selectedValues.join(",");
    setOpen(false);
    const newURL = updateSearchParams(
      url,
      [{ name: FilterParam.ASSIGN_IDS, value: assignedIdString }],
      pathname
    );
    router.replace(newURL);
  };

  return (
    <>
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
            endContent={<RxTriangleDown size={16} className="text-gray-500" />}
            disableRipple
          >
            Nhân viên phụ trách
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <AssignedFilterDropdown onFilterClick={handleClick} />
        </PopoverContent>
      </Popover>
    </>
  );
};

type AssignedFilterDropdownProps = {
  onInputChange?: (value: string) => void;
  onSelectChange?: (values: string[]) => void;
  onFilterClick?: (selectedValues: string[]) => void;
};

const AssignedFilterDropdown = ({
  onInputChange,
  onSelectChange,
  onFilterClick,
}: AssignedFilterDropdownProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<Employee[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const limit = 5;

  const searchParams = useSearchParams();
  const defaultSelect = searchParams.get(FilterParam.ASSIGN_IDS)?.split(",");
  const checkboxScrollRef = useRef<HTMLDivElement>(null);
  const inputTimeoutRef = useRef<NodeJS.Timeout>();

  const getUsers = useCallback(
    async (input: string) => {
      try {
        setIsLoading(true);
        const session = await getSession();
        const responseData = await GetEmployees(
          {
            page: page.toString(),
            limit: limit.toString(),
            query: input,
          },
          session?.accessToken
        );
        setUsers(responseData.employees);
        setHasMore(
          responseData.paginition.page < responseData.paginition.total
        );
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    },
    [page, hasMore, inputValue]
  );

  const loadMore = useCallback(
    async (input: string | undefined) => {
      setIsLoading(true);
      try {
        const session = await getSession();
        const responseData = await GetEmployees(
          {
            page: (page + 1).toString(),
            limit: limit.toString(),
            query: input,
          },
          session?.accessToken
        );
        setUsers(responseData.employees);
        setHasMore(
          responseData.paginition.page < responseData.paginition.total
        );

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    },
    [page, hasMore, inputValue]
  );

  const handleScroll = async () => {
    if (checkboxScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        checkboxScrollRef.current;

      // Kiểm tra khi nào scrollbar chạm đáy
      if (scrollTop + clientHeight >= scrollHeight) {
        if (!isLoading && hasMore) {
          loadMore(inputValue);
        }
      }
    }
  };

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (inputTimeoutRef.current) clearInterval(inputTimeoutRef.current);
    inputTimeoutRef.current = setTimeout(() => {
      getUsers(e.target.value);
    }, 1000);
    if (onInputChange) onInputChange(e.target.value);
    setInputValue(e.target.value);
    setPage(1);
    setHasMore(true);
  };

  const handleGroupChange = (values: string[]) => {
    setSelected(values);
    if (onSelectChange) onSelectChange(values);
  };

  const handleFilterClick = () => {
    if (onFilterClick) onFilterClick(selected);
  };

  useEffect(() => {
    getUsers("");
  }, []);

  useEffect(() => {
    if (checkboxScrollRef.current)
      checkboxScrollRef.current.addEventListener("scroll", handleScroll);

    return () => {
      if (checkboxScrollRef.current)
        checkboxScrollRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [page, hasMore, inputValue]);

  const handleCheckboxGroupChange = (values: string[]) => {
    setSelected(values);
  };

  return (
    <div className="w-[250px]">
      <Input
        size="sm"
        radius="sm"
        variant="underlined"
        placeholder="Tìm kiếm"
        startContent={<IoMdSearch size={18} />}
        onChange={handleInputChange}
      />
      <div
        className="max-h-[140px] overflow-y-auto py-2"
        ref={checkboxScrollRef}
      >
        <CheckboxGroup
          onChange={handleGroupChange}
          classNames={{ base: "p-2" }}
        >
          {users.map((user) => (
            <Checkbox
              key={user.id}
              value={user.id.toString()}
              size="sm"
              classNames={{
                base: cn(
                  "max-w-md w-full",
                  "hover:bg-gray-200",
                  "cursor-pointer rounded-md",
                  "data-[selected=true]:bg-blue-200"
                ),
                label: "w-full",
              }}
            >
              {user.name}
            </Checkbox>
          ))}
        </CheckboxGroup>
        <RenderIf condition={isLoading}>
          <div className="flex-center py-2">
            <Spinner size="sm" />
          </div>
        </RenderIf>

        <RenderIf condition={users.length === 0 && !isLoading}>
          <div className="flex-center py-2">
            <span>Không có kết quả tìm kiếm</span>
          </div>
        </RenderIf>
      </div>

      <div className="">
        <Button
          size="sm"
          radius="sm"
          color="primary"
          variant="solid"
          fullWidth
          className="text-sm font-medium"
          onClick={handleFilterClick}
        >
          Lọc
        </Button>
      </div>
    </div>
  );
};

export { AssignedFilterButton, AssignedFilterDropdown };
