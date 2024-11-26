"use client";
import {
  Button,
  ButtonGroup,
  cn,
  Image,
  Input,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import NextImage from "next/image";
import { ImagePlaceholderPath } from "@/constants/filepath";
import { CurrencyFormatter } from "@/libs/format-helper";
import { getSession } from "next-auth/react";
import { getProduct } from "@/app/api/products";
import { ProductResponse } from "@/app/api/products/products.type";
import Link from "next/link";
import { EditVariantRoute } from "@/constants/route";
import { useImmer } from "use-immer";
import { isInteger } from "@/libs/helper";
import { FaDongSign, FaPercent, FaTrash } from "react-icons/fa6";
import toast from "react-hot-toast";

type Props = {
  onSelectionChange?: (selectedProducts: ProductResponse) => void;
};

const ProductSelector = (props: Props) => {
  const { onSelectionChange } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenList, setIsOpenList] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchData, setSearchData] = useState<ProductResponse[]>([]);
  const [selectedProduct, setSelectedProduct] = useImmer<
    ProductResponse | undefined
  >(undefined);
  const [inputValue, setInputValue] = useState<string>();
  const limit = 10;

  const getProductData = useCallback(
    async (page: number, limit: number, query?: string) => {
      setIsLoading(true);
      try {
        const session = await getSession();
        const data = await getProduct(session?.accessToken, {
          page: page.toString(),
          limit: limit.toString(),
          query: query,
        });
        setIsLoading(false);
        setSearchData(data.products);
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
      getProductData(1, limit, value);
    }, 300);
    setPage(1);
    setInputValue(value);
  };

  const loadMore = useCallback(
    async (query: string | undefined) => {
      setIsLoading(true);
      try {
        const session = await getSession();
        const data = await getProduct(session?.accessToken, {
          page: (page + 1).toString(),
          limit: limit.toString(),
          query: query,
        });
        setIsLoading(false);
        setSearchData((prevData) => [...prevData, ...data.products]);
        setHasMore(!(data.paginition.page === data.paginition.total));
        setPage(page + 1);
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
    const findItem = searchData.find((item) => item.id === inputId);
    if (findItem) {
      setSelectedProduct(findItem);
    }
    setIsOpenList(false);
  };

  useEffect(() => {
    getProductData(page, limit);
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
  }, [searchData]);

  useEffect(() => {
    if (selectedProduct && onSelectionChange)
      onSelectionChange(selectedProduct);
  }, [selectedProduct]);

  return (
    <>
      <div className="flex gap-4 relative">
        <Input
          aria-label="Tìm kiếm sản phẩm"
          placeholder="Tìm kiếm theo tên, mã SKU, barcode..."
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
              items={searchData}
              emptyContent="Không có kết quả"
              onAction={(key) => handleListBoxAction(key as string)}
              selectionMode="single"
            >
              {(product) => (
                <ListboxItem key={product.id}>
                  <div className="flex gap-3 items-center text-xs">
                    <Image
                      as={NextImage}
                      height={40}
                      width={40}
                      src={product.image ?? ImagePlaceholderPath}
                      className={cn("rounded-md border-1 border-gray-500")}
                      alt=""
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </div>
                </ListboxItem>
              )}
            </Listbox>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSelector;
