"use client";
import { Checkbox, CheckboxGroup, Spinner } from "@nextui-org/react";
import { FormInput } from "./Form";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSession } from "next-auth/react";
import { GET_TAG_ROUTE } from "@/constants/api-routes";
import { FilterParam, GetTagResponse, TagType } from "@/libs/types/backend";
import { cn } from "@/libs/utils";
import { FiPlusCircle } from "react-icons/fi";
import RenderIf from "../ui/RenderIf";
import SearchEmpty from "../ui/SearchEmpty";

export type TagSearchProps = {
  type: TagType;
  selectedTags?: string[];
  hideCheckbox?: boolean;
  onCheckBoxChange?: (isSelected: boolean, tag: string) => void;
  onAddTag?: (tagName: string) => void;
};

const TagSearch = ({
  type,
  selectedTags = [],
  hideCheckbox,
  onAddTag,
  onCheckBoxChange,
}: TagSearchProps) => {
  // const [page, setPage] = useState<number>(1);
  // const [hasMore, setHasMore] = useState<boolean>(false);
  const limit = 10;

  const [tags, setTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  const queryTimeoutRef = useRef<NodeJS.Timeout>();
  const checkboxGroupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const getTags = useCallback(
    async (page?: number, lim?: number, value?: string) => {
      try {
        setIsLoading(true);
        const session = await getSession();
        const query = value ?? "";
        const url = `${GET_TAG_ROUTE}?${FilterParam.TAG_TYPE}=${type}&${FilterParam.QUERY}=${query}&${FilterParam.PAGE}=${page}&${FilterParam.LIMIT}=${lim}`;

        const res = await fetch(url, {
          headers: {
            authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (res.ok) {
          const data: GetTagResponse = await res.json();
          if (setTags) setTags(data.tags);
        }

        setIsLoading(false);
      } catch (error) {
        // console.log(error);
        setIsLoading(false);
      }
    },
    []
  );

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsOpen(true);
    if (queryTimeoutRef.current) clearTimeout(queryTimeoutRef.current);
    const queryTimeout = setTimeout(() => {
      getTags(1, 10, value);
    }, 300);
    queryTimeoutRef.current = queryTimeout;
  };

  const handleClickOutside = (event: any) => {
    if (
      checkboxGroupRef.current &&
      !checkboxGroupRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    getTags(1, 10);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current && checkboxGroupRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const dropdownRect = checkboxGroupRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Kiểm tra khoảng trống dưới input còn đủ không
      const spaceBelow = windowHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;

      if (
        spaceBelow < dropdownRect.height &&
        spaceAbove > dropdownRect.height
      ) {
        // Không đủ sẽ hiển thị lên trên
        setDropdownPosition("top");
      } else {
        // Ngược lại
        setDropdownPosition("bottom");
      }
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={inputRef}>
      <FormInput
        placeholder="Tìm kiếm hoặc thêm mới tag"
        onChange={(e) => {
          handleInputChange(e.target.value);
        }}
        value={inputValue}
        onFocus={() => setIsOpen(true)}
      />
      <CheckboxGroup
        ref={checkboxGroupRef}
        value={selectedTags.map((tag) => tag)}
        className={cn(
          "hidden absolute w-full p-2 shadow-small [&>*]:py-1 z-50 max-h-[200px] overflow-y-auto",
          {
            block: isOpen,
            "top-[calc(100% + 10px)]": dropdownPosition === "bottom",
            "top-auto": dropdownPosition !== "bottom",
            "bottom-[calc(100% + 10px)]": dropdownPosition === "top",
            "bottom-auto": dropdownPosition !== "top",
          }
        )}
        classNames={{
          base: "bg-white rounded-md",
        }}
      >
        <RenderIf condition={isLoading}>
          <Spinner />
        </RenderIf>

        <RenderIf condition={tags.length > 0 && !hideCheckbox && !isLoading}>
          {tags.map((tag) => (
            <Checkbox
              key={tag}
              value={tag}
              onValueChange={(isSelected) =>
                onCheckBoxChange && onCheckBoxChange(isSelected, tag)
              }
              classNames={{ wrapper: "hover:bg-gray-100" }}
            >
              {tag}
            </Checkbox>
          ))}
        </RenderIf>

        <RenderIf condition={!!(inputValue && tags.length === 0 && !isLoading)}>
          <AddTagButton
            inputValue={inputValue}
            onClick={() => {
              onAddTag && onAddTag(inputValue);
              setIsOpen(false);
              setInputValue("");
            }}
          />
        </RenderIf>

        <RenderIf condition={tags.length === 0 && !isLoading}>
          <SearchEmpty />
        </RenderIf>
      </CheckboxGroup>
    </div>
  );
};

const AddTagButton = ({
  inputValue,
  onClick,
}: {
  inputValue: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex items-center gap-1 p-2 rounded-md text-sm font-medium hover:bg-gray-200 hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="text-blue-500 flex items-center gap-1">
        <FiPlusCircle />
        Thêm
      </div>{" "}
      {inputValue}
    </div>
  );
};
export { TagSearch };
