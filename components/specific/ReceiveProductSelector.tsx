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

type ProductVariant = {
  product: { id: number; image: string; name: string };
} & ProductResponse["variants"][number];

export type SelectedVariant = {
  variant: ProductVariant;
  quantity: number;
  price: number;
  total: number;
  totalDiscount: number;
  discountType: "percent" | "value";
  discountValue: number;
  discountAmount: number;
  finalPrice: number;
  finalTotal: number;
  // rejectQuantity: number;
  // rejectReason: string;
};

type Props = {
  onSelectionChange?: (SelectedVariants: SelectedVariant[]) => void;
};

const ReceiveProductSelector = (props: Props) => {
  const { onSelectionChange } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenList, setIsOpenList] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchVariants, setSearchVariants] = useState<ProductVariant[]>([]);
  const [inputValue, setInputValue] = useState<string>();
  const [selectedVariants, setSelectedVariants] = useImmer<SelectedVariant[]>(
    []
  );
  const [lastSelectVariantClick, setLastSelectVariantClick] =
    useState<SelectedVariant>();
  const [isOpenPriceChange, setIsOpenPriceChange] = useState(false);

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
    }, 1000);
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
        setIsLoading(false);
        setSearchVariants((currentVariants) => [
          ...currentVariants,
          ...variants,
        ]);
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
    const findVariant = selectedVariants.find(
      (item) => item.variant.id === inputId
    );
    const variant = searchVariants.find((item) => item.id === inputId);

    if (findVariant || !variant) {
      setIsOpenList(false);
      return;
    }

    setSelectedVariants((selectedVariants) => {
      const newSelect = {
        variant: variant,
        discountType: "value",
        discountAmount: 0,
        discountValue: 0,
        totalDiscount: 0,
        price: variant.costPrice,
        total: variant.costPrice,
        finalPrice: variant.costPrice,
        finalTotal: variant.costPrice,
        quantity: 1,
      };

      return [...selectedVariants, newSelect];
    });
    setIsOpenList(false);
  };

  const handleSelectedVariantQuantityChange = (
    value: string,
    variantId: number
  ) => {
    let newValue;
    newValue = parseInt(value);
    if (!isInteger(value)) newValue = 1;
    if (newValue < 1) return;
    if (newValue > 9999) newValue = 9999;

    setSelectedVariants((selectedVariants) => {
      const index = selectedVariants.findIndex(
        (item) => item.variant.id === variantId
      );

      if (index !== -1) {
        const newQuantity = newValue;
        const newTotal = selectedVariants[index].price * newQuantity;
        const newFinalTotal = selectedVariants[index].finalPrice * newQuantity;
        selectedVariants[index].quantity = newQuantity;
        selectedVariants[index].total = newTotal;
        selectedVariants[index].finalTotal = newFinalTotal;
      }

      return selectedVariants;
    });
  };

  const handlePriceClick = (selectedVariant: SelectedVariant) => {
    setLastSelectVariantClick(selectedVariant);
    setIsOpenPriceChange(true);
  };

  const handleRemoveItem = (id: number) => {
    setSelectedVariants((selectedVariants) => {
      const findIndex = selectedVariants.findIndex(
        (item) => item.variant.id === id
      );

      if (findIndex !== -1) selectedVariants.splice(findIndex, 1);

      return selectedVariants;
    });
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
  }, [searchVariants]);

  useEffect(() => {
    if (selectedVariants && onSelectionChange)
      onSelectionChange(selectedVariants);
  }, [selectedVariants]);

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
              items={searchVariants}
              emptyContent="Không có kết quả"
              onAction={(key) => handleListBoxAction(key as string)}
              selectionMode="single"
            >
              {(variant) => (
                <ListboxItem
                  key={variant.id}
                  // isDisabled={variant.avaiable === 0}
                >
                  <div className="flex justify-between text-xs px-2">
                    <div className="flex gap-3 items-center">
                      <Image
                        as={NextImage}
                        height={40}
                        width={40}
                        src={variant.product.image ?? ImagePlaceholderPath}
                        className={cn("rounded-md border-1 border-gray-500")}
                        alt=""
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
                        Có thể bán:{" "}
                        <Link
                          href={EditVariantRoute(
                            variant.product.id,
                            variant.id
                          )}
                        >
                          <span className="label-link text-sm">
                            {variant.avaiable}
                          </span>
                        </Link>
                      </span>
                    </div>
                  </div>
                </ListboxItem>
              )}
            </Listbox>
          </div>
        </div>
      </div>
      <div className="max-w-full overflow-y-auto max-h-[300px] mt-6">
        <Table removeWrapper isHeaderSticky>
          <TableHeader>
            <TableColumn className="w-2/5">Sản phẩm</TableColumn>
            <TableColumn className="w-28" align="center">
              Số lượng
            </TableColumn>
            <TableColumn align="center">Đơn giá</TableColumn>
            <TableColumn align="center">Thành tiền</TableColumn>
            <TableColumn>{null}</TableColumn>
          </TableHeader>
          <TableBody
            items={selectedVariants}
            emptyContent={"Chưa chọn sản phẩm."}
          >
            {(selectedVariant) => (
              <TableRow key={selectedVariant.variant.id}>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <Image
                      as={NextImage}
                      alt=""
                      src={ImagePlaceholderPath}
                      width={40}
                      height={40}
                    />
                    <div className="flex flex-col gap-1">
                      <Link
                        href={EditVariantRoute(
                          selectedVariant.variant.product.id,
                          selectedVariant.variant.id
                        )}
                      >
                        <span className="label-link line-clamp-1">
                          {selectedVariant.variant.product.name}
                        </span>
                      </Link>
                      <span className="line-clamp-1">
                        {selectedVariant.variant.title}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    variant="bordered"
                    radius="sm"
                    type="number"
                    value={selectedVariant.quantity.toString()}
                    onValueChange={(value) =>
                      handleSelectedVariantQuantityChange(
                        value,
                        selectedVariant.variant.id
                      )
                    }
                    min={1}
                    max={9999}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-col items-center">
                    <span
                      className={cn("line-through text-gray-500", {
                        hidden: selectedVariant.discountValue === 0,
                      })}
                    >
                      {CurrencyFormatter().format(selectedVariant.price)}
                    </span>
                    <span
                      className="label-link"
                      onClick={() => handlePriceClick(selectedVariant)}
                    >
                      {CurrencyFormatter().format(selectedVariant.finalPrice)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {CurrencyFormatter().format(selectedVariant.finalTotal)}
                </TableCell>
                <TableCell>
                  <div
                    className="hover:text-red-500 hover:cursor-pointer"
                    onClick={() => handleRemoveItem(selectedVariant.variant.id)}
                  >
                    <FaTrash />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isOpenPriceChange && (
        <ChangePriceModal
          isOpen={isOpenPriceChange}
          onOpenChange={(open) => setIsOpenPriceChange(open)}
          selectedVariant={lastSelectVariantClick}
          onSave={(newVariant) => {
            setSelectedVariants((selectedVariants) => {
              const findIndex = selectedVariants.findIndex(
                (item) => item.variant.id === newVariant.variant.id
              );
              if (findIndex === -1) return selectedVariants;
              selectedVariants[findIndex] = newVariant;
              return selectedVariants;
            });
          }}
        />
      )}
    </>
  );
};

type ChangePriceModalProps = {
  selectedVariant: SelectedVariant | undefined;
  onSave?: (variant: SelectedVariant) => void;
} & Omit<ModalProps, "children">;

const ChangePriceModal = (props: ChangePriceModalProps) => {
  const { selectedVariant: inputSelectedValue, onSave, ...rest } = props;

  const [selectedVariant, setSelectedVariant] = useImmer<
    SelectedVariant | undefined
  >(inputSelectedValue);

  if (!selectedVariant) {
    return null;
  }

  const handlePriceChange = (value: string) => {
    let newPrice = 0;
    if (isInteger(value)) newPrice = parseInt(value);
    if (newPrice > 1e12) newPrice = 1e12;
    setSelectedVariant((selectedVariant) => {
      if (selectedVariant) {
        const newDiscountAmount =
          selectedVariant.discountType === "value"
            ? selectedVariant.discountValue
            : Math.floor(selectedVariant.discountValue * newPrice * 0.01);

        selectedVariant.discountAmount = newDiscountAmount;
        selectedVariant.price = newPrice;
        selectedVariant.total = newPrice * selectedVariant.quantity;
        selectedVariant.finalPrice = newPrice - newDiscountAmount;
        selectedVariant.finalTotal =
          (newPrice - newDiscountAmount) * selectedVariant.quantity;
      }
    });
  };

  const handleDiscountValueChange = (value: string) => {
    setSelectedVariant((selectedVariant) => {
      if (!selectedVariant) return undefined;
      let newDiscountValue = 0;
      if (isInteger(value)) newDiscountValue = parseInt(value);
      switch (selectedVariant.discountType) {
        case "percent":
          if (newDiscountValue > 100) newDiscountValue = 100;
          const newDiscountAmount = Math.floor(
            selectedVariant.price * newDiscountValue * 0.01
          );
          const newFinalPrice = selectedVariant.price - newDiscountAmount;
          selectedVariant.discountValue = newDiscountValue;
          selectedVariant.discountAmount = newDiscountAmount;
          selectedVariant.finalPrice = newFinalPrice;
          selectedVariant.finalTotal = newFinalPrice * selectedVariant.quantity;
          break;
        case "value":
          const newFinalPriceValue = selectedVariant.price - newDiscountValue;
          selectedVariant.discountValue = newDiscountValue;
          selectedVariant.discountAmount = newDiscountValue;
          selectedVariant.finalPrice = newFinalPriceValue;
          selectedVariant.finalTotal =
            newFinalPriceValue * selectedVariant.quantity;
      }
    });
  };

  const handleOnSave = (onClose: () => void) => {
    if (selectedVariant.finalPrice < 0) {
      toast.error("Giá trị giảm quá lớn");
      return;
    }
    onSave && onSave(selectedVariant);
    onClose();
  };

  const handleChangeDiscountType = (type: "percent" | "value") => {
    setSelectedVariant((selectedVariant) => {
      if (selectedVariant) {
        selectedVariant.discountType = type;
        selectedVariant.discountValue = 0;
        selectedVariant.discountAmount = 0;
        selectedVariant.finalPrice = selectedVariant.price;
        selectedVariant.finalTotal =
          selectedVariant.price * selectedVariant.quantity;
      }
    });
  };

  return (
    <Modal {...rest}>
      <ModalContent className="min-w-[40vw]">
        {(onClose) => (
          <>
            <ModalHeader>Điều chỉnh giá nhập sản phẩm</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex-1">Đơn giá</span>
                  <Input
                    type="number"
                    min={0}
                    max={1e12}
                    className="flex-[2]"
                    radius="sm"
                    variant="bordered"
                    value={selectedVariant.price.toString()}
                    onValueChange={handlePriceChange}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex-1">Loại giảm giá</span>
                  <div className="flex-[2] flex gap-4">
                    <ButtonGroup variant="bordered" radius="sm">
                      <Button
                        color={
                          selectedVariant.discountType === "value"
                            ? "primary"
                            : "default"
                        }
                        onClick={() => handleChangeDiscountType("value")}
                      >
                        Giá trị
                      </Button>
                      <Button
                        color={
                          selectedVariant.discountType === "percent"
                            ? "primary"
                            : "default"
                        }
                        onClick={() => handleChangeDiscountType("percent")}
                      >
                        %
                      </Button>
                    </ButtonGroup>
                    <Input
                      type="number"
                      variant="bordered"
                      radius="sm"
                      min={0}
                      max={1e12}
                      value={selectedVariant.discountValue.toString()}
                      onValueChange={handleDiscountValueChange}
                      endContent={
                        selectedVariant.discountType === "percent" ? (
                          <FaPercent />
                        ) : (
                          <FaDongSign />
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Giá sau giảm: </span>
                  <span>
                    {CurrencyFormatter().format(selectedVariant.finalPrice)}
                  </span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={onClose}
                variant="ghost"
                color="primary"
                radius="sm"
              >
                Đóng
              </Button>
              <Button
                onClick={() => handleOnSave(onClose)}
                color="primary"
                radius="sm"
              >
                Lưu
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ReceiveProductSelector;
