"use client";
import { Checkbox, CheckboxGroup, Spinner } from "@nextui-org/react";
import { FormInput } from "./Form";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FilterParam, QueryParams } from "@/libs/types/backend";
import { GET_CATEGORIES_ROUTE } from "@/constants/api-routes";
import { getSession } from "next-auth/react";
import RenderIf from "../ui/RenderIf";
import SearchEmpty from "../ui/SearchEmpty";
import { cn } from "@/libs/utils";
import { SelectedTag } from "../ui/SelectedTag";

export type Category = {
  id: number;
  title: string;
  collection: {
    title: string;
    id: number;
    slug: string | null;
    position: number;
  };
};

type Props = {
  label?: string;
  defaultInputValue?: string;
  defaultSelected?: Category[];
  onSelectChange?: (selectCategory: Category[]) => void;
};

const CategoriesSearch = (props: Props) => {
  const {
    label,
    defaultInputValue = "",
    defaultSelected = [],
    onSelectChange,
  } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] =
    useState<Category[]>(defaultSelected);
  const [inputValue, setInputValue] = useState("");

  const inputTimeoutRef = useRef<NodeJS.Timeout>();
  const checkboxGroupRef = useRef<HTMLDivElement>(null);

  const categoriesSortBySelect = useMemo<Category[]>(() => {
    const array = [...selectedCategories];
    const idSet = new Set();
    selectedCategories.forEach((cat) => {
      idSet.add(cat.id);
    });

    categories.forEach((cat) => {
      if (!idSet.has(cat.id)) {
        array.push(cat);
        idSet.add(cat.id);
      }
    });
    return array;
  }, [categories, selectedCategories]);

  const getCategory = useCallback(
    async (queryParams: Pick<QueryParams, FilterParam.QUERY>) => {
      const { query } = queryParams;

      const url =
        `${GET_CATEGORIES_ROUTE}?` +
        `${query ? `${FilterParam.QUERY}=${query}` : ""}`;

      setIsLoading(true);
      const session = await getSession();
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      });
      setIsLoading(false);

      if (res.ok) {
        const data = (await res.json()) as Category[];
        setCategories(data);
        return;
      }

      return [];
    },
    []
  );

  const handleCheckboxGroupChange = useCallback(
    (values: string[]) => {
      if (values.length === 0) {
        setSelectedCategories([]);
        return;
      }

      setSelectedCategories((selectedCategories) => {
        // Giữ các lựa chọn đã chọn
        const keepSelectedCategories = selectedCategories.filter((cat) => {
          return values.includes(cat.id.toString());
        });

        // Các lựa chọn mới
        const newSelectedCategories = categories.filter((cat) => {
          return values.includes(cat.id.toString());
        });

        // Lọc trùng giá trị
        const array = [...keepSelectedCategories];
        const idSet = new Set();
        keepSelectedCategories.forEach((cat) => {
          idSet.add(cat.id);
        });

        newSelectedCategories.forEach((cat) => {
          if (!idSet.has(cat.id)) {
            array.push(cat);
            idSet.add(cat.id);
          }
        });
        return array;
      });
    },
    [categories]
  );

  const handleInputChange = useCallback((value: string) => {
    clearTimeout(inputTimeoutRef.current);

    inputTimeoutRef.current = setTimeout(() => {
      getCategory({ query: value });
    }, 300);

    setInputValue(value);
  }, []);

  const handleClickOutside = (event: any) => {
    if (
      checkboxGroupRef.current &&
      !checkboxGroupRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    getCategory({ query: defaultInputValue });
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  

  useEffect(() => {
    onSelectChange && onSelectChange(selectedCategories);
  }, [selectedCategories]);

  return (
    <div className="relative">
      <FormInput
        label={label}
        placeholder="Chọn danh mục"
        onChange={(e) => {
          handleInputChange(e.target.value);
        }}
        defaultValue={defaultInputValue}
        onFocus={() => setIsOpen(true)}
        endContent={
          selectedCategories.length > 0 && (
            <SelectedTag
              value={`Đã chọn ${selectedCategories.length}`}
              onDelete={() => setSelectedCategories([])}
            />
          )
        }
      />
      <CheckboxGroup
        value={selectedCategories.map((cat) => cat.id.toString())}
        onValueChange={handleCheckboxGroupChange}
        ref={checkboxGroupRef}
        className={cn(
          "hidden absolute w-full p-2 shadow-small [&>*]:py-1 z-50 max-h-[200px] overflow-y-auto",
          {
            block: isOpen,
          }
        )}
        classNames={{
          base: "bg-white rounded-md",
        }}
      >
        <RenderIf condition={isLoading}>
          <Spinner />
        </RenderIf>

        <RenderIf
          condition={categories.length > 0 && !isLoading && !!inputValue}
        >
          {categories.map((cat) => (
            <Checkbox
              key={cat.id}
              value={cat.id.toString()}
              classNames={{ wrapper: "hover:bg-gray-100" }}
            >
              {`${cat.title}-${cat.collection.title}`}
            </Checkbox>
          ))}
        </RenderIf>

        <RenderIf
          condition={categories.length > 0 && !isLoading && !inputValue}
        >
          {categoriesSortBySelect.map((cat) => (
            <Checkbox
              key={cat.id}
              value={cat.id.toString()}
              classNames={{ wrapper: "hover:bg-gray-100" }}
            >
              {`${cat.title}-${cat.collection.title}`}
            </Checkbox>
          ))}
        </RenderIf>

        <RenderIf condition={categories.length === 0 && !isLoading}>
          <SearchEmpty />
        </RenderIf>
      </CheckboxGroup>
    </div>
  );
};
export default memo(CategoriesSearch);
