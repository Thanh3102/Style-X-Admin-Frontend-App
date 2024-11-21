"use client";
import { cn, Input, Listbox, ListboxItem, Spinner } from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { getSession } from "next-auth/react";
import { useImmer } from "use-immer";
import { getSupplier } from "@/app/api/suppliers";
import { SupplierResponse } from "@/app/api/suppliers/suppliers.type";

type Props = {
  onSelectionChange?: (supplier: SupplierResponse) => void;
};

const SupplierSelector = (props: Props) => {
  const { onSelectionChange } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenList, setIsOpenList] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [inputValue, setInputValue] = useState<string>();
  const [searchSuppliers, setSearchSuppliers] = useImmer<SupplierResponse[]>(
    []
  );
  const [selectedSupplier, setSelectedSupplier] = useImmer<
    SupplierResponse | undefined
  >(undefined);

  const limit = 10;

  const getSupplierData = useCallback(
    async (page: number, limit: number, query?: string) => {
      setIsLoading(true);
      try {
        const session = await getSession();
        const data = await getSupplier(session?.accessToken, {
          page: page.toString(),
          limit: limit.toString(),
          query: query,
          active: "true",
        });
        setIsLoading(false);
        setSearchSuppliers(data.suppliers);
        setHasMore(!(data.paginition.page === data.paginition.total));
      } catch (error) {
        return [];
      }
    },
    []
  );

  const listBoxRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleClickOutside = (event: any) => {
    if (listBoxRef.current && !listBoxRef.current.contains(event.target)) {
      setIsOpenList(false);
    }
  };

  const handleInputChange = (value: string) => {
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      getSupplierData(1, limit, value);
    }, 300);
    setPage(1);
    setInputValue(value);
  };

  const loadMore = useCallback(
    async (query: string | undefined) => {
      setIsLoading(true);
      try {
        const session = await getSession();
        const data = await getSupplier(session?.accessToken, {
          page: (page + 1).toString(),
          limit: limit.toString(),
          query: query,
          active: "true",
        });
        setIsLoading(false);
        setSearchSuppliers((suppliers) => [...suppliers, ...data.suppliers]);
        setPage(page + 1);
        setHasMore(!(data.paginition.page === data.paginition.total));
      } catch (error) {
        setIsLoading(false);
      }
    },
    [page, hasMore, inputValue]
  );

  const handleScroll = async () => {
    if (listBoxRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listBoxRef.current;
      if (scrollTop + clientHeight > scrollHeight - 100) {
        if (!isLoading && hasMore) {
          loadMore(inputValue);
        }
      }
    }
  };

  const handleListBoxAction = (key: string) => {
    const inputId = parseInt(key);
    const findSupplier = searchSuppliers.find((item) => item.id === inputId);

    if (findSupplier) {
      setSelectedSupplier(findSupplier);
    }

    setIsOpenList(false);
  };

  useEffect(() => {
    getSupplierData(page, limit);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (listBoxRef.current)
      listBoxRef.current.addEventListener("scroll", handleScroll);

    return () => {
      if (listBoxRef.current)
        listBoxRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [searchSuppliers]);

  useEffect(() => {
    if (selectedSupplier)
      onSelectionChange && onSelectionChange(selectedSupplier);
  }, [selectedSupplier]);

  return (
    <>
      <div className="flex gap-4 relative">
        <Input
          aria-label="Tìm kiếm nhà cung cấp"
          placeholder="Tìm kiếm theo tên, SĐT, tên NCC."
          variant="bordered"
          radius="sm"
          startContent={<FaSearch size={16} className="text-gray-400" />}
          onFocus={() => setIsOpenList(true)}
          onValueChange={(value) => handleInputChange(value)}
          endContent={isLoading ? <Spinner size="sm" /> : <></>}
        />
        {/* <Button radius="sm" variant="bordered" className="font-medium">
          Chọn nhiều
        </Button> */}
        <div
          className={cn("absolute top-12 w-full z-50", "bg-white rounded-md", {
            hidden: !isOpenList,
          })}
        >
          <div
            className="border-1 border-gray-500 rounded-md h-fit max-h-[400px] overflow-y-auto"
            ref={listBoxRef}
          >
            <Listbox
              items={searchSuppliers}
              emptyContent="Không có kết quả"
              onAction={(key) => handleListBoxAction(key as string)}
              selectionMode="single"
            >
              {(supplier) => (
                <ListboxItem key={supplier.id}>{supplier.name}</ListboxItem>
              )}
            </Listbox>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupplierSelector;
