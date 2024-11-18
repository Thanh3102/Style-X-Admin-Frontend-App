"use client";
import {
  Button,
  cn,
  Image,
  Input,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import NextImage from "next/image";
import { ImagePlaceholderPath } from "@/constants/filepath";
import { CurrencyFormatter } from "@/libs/format-helper";
import { getSession } from "next-auth/react";
import { getProduct } from "@/app/api/products";
import { ProductResponse } from "@/app/api/products/products.type";

type Props = {};

type ProductVariant = {
  product: { id: number; image: string; name: string };
} & ProductResponse["variants"][number];

const ProductSelector = (props: Props) => {
  const [isOpenList, setIsOpenList] = useState(false);
  const [page, setPage] = useState(1);
  const [serachVariants, setSearchVariants] = useState<ProductVariant[]>([]);

  const limit = 10;

  const getProductData = useCallback(
    async (page: number, limit: number, query?: string) => {
      try {
        const session = await getSession();
        const data = await getProduct(session?.accessToken, {
          page: page.toString(),
          limit: limit.toString(),
          query: query,
        });
        const variants: ProductVariant[] = [];
        data.products.forEach((product) => {
          product.variants.forEach((variant) => {
            variants.push({
              ...variant,
              product: {
                id: product.id,
                name: product.name,
                image: product.image,
              },
            });
          });
        });
        setSearchVariants(variants);
      } catch (error) {
        return [];
      }
    },
    []
  );

  const listBoxRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any) => {
    if (listBoxRef.current && !listBoxRef.current.contains(event.target)) {
      setIsOpenList(false);
    }
  };

  useEffect(() => {
    getProductData(page, limit);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="flex gap-4">
        <Input
          placeholder="Tìm kiếm theo tên, mã SKU, barcode..."
          variant="bordered"
          radius="sm"
          startContent={<FaSearch size={16} className="text-gray-400" />}
          onFocus={() => setIsOpenList(true)}
        />
        <Button radius="sm" variant="bordered" className="font-medium">
          Chọn nhiều
        </Button>
      </div>
      <div
        className={cn("absolute top-12 w-full", "bg-white rounded-md", {
          hidden: !isOpenList,
        })}
        ref={listBoxRef}
      >
        <div className="border-1 border-gray-500 rounded-md h-fit max-h-[400px] overflow-y-auto">
          <Listbox items={serachVariants}>
            {(variant) => (
              <ListboxItem key={variant.id}>
                <div className="flex justify-between text-xs px-2">
                  <div className="flex gap-3 items-center">
                    <Image
                      as={NextImage}
                      height={40}
                      width={40}
                      src={ImagePlaceholderPath}
                      className={cn("rounded-md border-1 border-gray-500")}
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">
                        {variant.product.name}
                      </span>
                      <span>{variant.title}</span>
                      <span>{variant.skuCode ?? "---"}</span>
                    </div>
                  </div>
                  <div className="flex-col flex justify-between">
                    <span className="text-right font-medium">
                      {CurrencyFormatter().format(variant.sellPrice)}
                    </span>
                    <span>
                      Có thể bán: <span className="label-link text-sm">0</span>{" "}
                      {/* Điều hướng về trang variant */}
                    </span>
                  </div>
                </div>
              </ListboxItem>
            )}
          </Listbox>
        </div>
      </div>
    </div>
  );
};
export default ProductSelector;
