"use client";
import { GroupBox } from "../../ui/GroupBox";
import {
  Button,
  Divider,
  Image,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { ImagePlaceholderPath } from "@/constants/filepath";
import { useRouter } from "next/navigation";
import { InventoriesHistoryRoute, ProductRoute } from "@/constants/route";
import NextImage from "next/image";
import Link from "next/link";
import { FaDongSign, FaPen } from "react-icons/fa6";
import { ChangeEvent, useCallback, useState } from "react";
import { isInteger } from "@/libs/helper";
import { FormInput } from "../../common/Form";
import { cn } from "@/libs/utils";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CurrencyFormatter } from "@/libs/format-helper";
import { COMPARE_PRICE_INFO, COST_PRICE_INFO } from "@/constants/text";
import { InfoTooltip } from "../../ui/InfoTooltip";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";
import {
  PUT_CHANGE_ON_HAND_INVENTORIES_ROUTE,
  PUT_UPDATE_PRODUCT_VARIANT_ROUTE,
} from "@/constants/api-routes";
import AddInventoryModal from "../AddInventoryModal";
import { GetProductDetailResponse } from "@/app/api/products/products.type";

export type Variant = GetProductDetailResponse["variants"][number];
export type Inventory = Variant["inventories"][number];
type Props = { product: GetProductDetailResponse; variant: Variant };

const EditVariantSchema = z.object({
  skuCode: z.string().optional(),
  barCode: z.string().optional(),
  unit: z.string().optional(),
  sellPrice: z
    .number()
    .min(0, "Giá bán nhỏ nhất là 0")
    .max(1e12, "Giá bán quá lớn"),
  costPrice: z
    .number()
    .min(0, "Giá vốn nhỏ nhất là 0")
    .max(1e12, "Giá vốn quá lớn"),
  comparePrice: z
    .number()
    .min(0, "Giá so sánh nhỏ nhất là 0")
    .max(1e12, "Giá so sánh quá lớn"),
});

type EditVariantField = z.infer<typeof EditVariantSchema>;

const FormEditVariant = ({ product, variant: propVariant }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    setValue,
    getValues,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditVariantField>({
    resolver: zodResolver(EditVariantSchema),
    defaultValues: {
      barCode: propVariant.barCode ?? undefined,
      skuCode: propVariant.skuCode,
      unit: propVariant.unit ?? undefined,
      sellPrice: propVariant.sellPrice,
      costPrice: propVariant.costPrice,
      comparePrice: propVariant.comparePrice,
    },
  });

  const handlePriceChange = useCallback(
    (value: string, field: "sellPrice" | "costPrice" | "comparePrice") => {
      if (value === "") setValue(field, 0);
      else
        setValue(field, parseInt(value), {
          shouldValidate: true,
        });
    },
    []
  );

  const onSubmit: SubmitHandler<EditVariantField> = async (data) => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const res = await fetch(`${PUT_UPDATE_PRODUCT_VARIANT_ROUTE}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          variantId: propVariant.id,
        }),
      });

      const responseData = await res.json();
      setIsLoading(false);

      if (res.ok) {
        toast.success(responseData.message ?? "Cập nhật thành công");
        router.refresh();
        return;
      }
      toast.error(responseData.error ?? "Đã xảy ra lỗi");
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại");
    }
  };

  return (
    <>
      <form
        className="flex gap-4 flex-wrap mb-4"
        onSubmit={handleSubmit(onSubmit)}
        id="FormEditVariant"
      >
        <div className="flex-1 basis-[300px] min-w-0 flex flex-wrap gap-4 h-fit">
          <GroupBox>
            <div className="flex gap-4 items-center">
              <Image
                as={NextImage}
                src={`${product.image ?? ImagePlaceholderPath}`}
                height={120}
                width={100}
                radius="sm"
                className="border-1 border-gray-500"
              />
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-base line-clamp-1">
                  {product.name}
                </span>
                <span className="text-gray-500">
                  {product.variants.length} phiên bản
                </span>
                <span
                  className="label-link"
                  onClick={() => router.push(`${ProductRoute}/${product.id}`)}
                >
                  Trở lại sản phẩm
                </span>
              </div>
            </div>
          </GroupBox>

          <GroupBox title="Phiên bản">
            <div className="h-[500px] overflow-y-auto">
              {product.variants.map((variant) => (
                <Link
                  href={`${ProductRoute}/${product.id}/variants/${variant.id}`}
                  key={variant.id}
                >
                  <div
                    className={cn(
                      "p-3 flex items-center gap-4 border-b-1 border-gray-200",
                      "hover:cursor-pointer hover:bg-blue-100",
                      {
                        "bg-blue-100": variant.id === propVariant.id,
                      }
                    )}
                  >
                    <Image
                      as={NextImage}
                      src={variant.image ?? ImagePlaceholderPath}
                      height={40}
                      width={40}
                      radius="sm"
                      className="border-1 border-gray-500"
                    />
                    <div className="flex flex-col gap-1 text-xs flex-1">
                      <span className="label-link">{variant.title}</span>
                      <div className="flex gap-2 justify-between flex-1">
                        <span className="line-clamp-1">
                          Tồn kho:{" "}
                          {variant.inventories.reduce(
                            (total, i) => total + i.onHand,
                            0
                          )}
                        </span>
                        <span className="line-clamp-1">
                          Có thể bán:{" "}
                          {variant.inventories.reduce(
                            (total, i) => total + i.avaiable,
                            0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </GroupBox>
        </div>
        <div className="flex-[2] basis-[600px] min-w-0 flex flex-wrap gap-4 h-fit">
          <GroupBox title="Thuộc tính">
            <div className="flex gap-4 flex-wrap">
              <div className="flex flex-col gap-2 flex-1">
                {product.options.map((option, index) => (
                  <FormInput
                    key={option.id}
                    label={option.name}
                    isDisabled
                    placeholder={`Nhập giá trị`}
                    value={
                      propVariant[
                        `option${option.position}` as keyof typeof propVariant
                      ]?.toString() || ""
                    }
                    isReadOnly
                  />
                ))}
              </div>
              <Tooltip
                showArrow
                content="Tạm thời chưa thể sử dụng"
                color="danger"
              >
                <div
                  className={cn(
                    "flex-1 flex items-center justify-center",
                    "border-1 border-dashed border-gray-500 rounded-md",
                    "min-h-40 label-link",
                    "hover:cursor-not-allowed"
                  )}
                >
                  Chọn hình ảnh
                </div>
              </Tooltip>
            </div>
          </GroupBox>
          <GroupBox title="Thông tin phiên bản">
            <div className="flex flex-wrap gap-y-2 -mx-2 [&>*]:px-2">
              <Controller
                control={control}
                name="skuCode"
                render={({ field }) => (
                  <FormInput
                    label="Mã SKU"
                    placeholder="Nhập mã SKU"
                    className="col-6"
                    isInvalid={errors.skuCode ? true : false}
                    errorMessage={errors.skuCode?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                control={control}
                name="barCode"
                render={({ field }) => (
                  <FormInput
                    label="Mã vạch/Barcode"
                    placeholder="Nhập mã vạch"
                    className="col-6"
                    isInvalid={errors.barCode ? true : false}
                    errorMessage={errors.barCode?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                control={control}
                name="unit"
                render={({ field }) => (
                  <FormInput
                    label="Đơn vị tính"
                    placeholder="Nhập đơn vị tính"
                    className="col-6"
                    isInvalid={errors.unit ? true : false}
                    errorMessage={errors.unit?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </GroupBox>
          <GroupBox title="Thông tin giá">
            <div className="flex flex-wrap gap-y-2 -mx-2 [&>*]:px-2">
              <Controller
                control={control}
                name="sellPrice"
                render={({ field }) => (
                  <FormInput
                    aria-label="Giá bán"
                    type="number"
                    label="Giá bán"
                    placeholder="Nhập giá bán"
                    className="col-6"
                    step={1000}
                    isInvalid={errors.sellPrice ? true : false}
                    errorMessage={errors.sellPrice?.message}
                    value={field.value.toString()}
                    endContent={<FaDongSign className="text-gray-500" />}
                    description={`Giá bán: ${CurrencyFormatter({
                      style: "currency",
                    }).format(getValues("sellPrice"))}`}
                    onValueChange={(value) =>
                      handlePriceChange(value, "sellPrice")
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="comparePrice"
                render={({ field }) => (
                  <FormInput
                    aria-label="Giá so sanh"
                    type="number"
                    label="Giá so sánh"
                    placeholder="Nhập giá so sánh"
                    className="col-6"
                    step={1000}
                    isInvalid={errors.comparePrice ? true : false}
                    errorMessage={errors.comparePrice?.message}
                    value={field.value.toString()}
                    startContent={<InfoTooltip content={COMPARE_PRICE_INFO} />}
                    endContent={<FaDongSign className="text-gray-500" />}
                    description={`Giá so sánh: ${CurrencyFormatter({
                      style: "currency",
                    }).format(getValues("comparePrice"))}`}
                    onValueChange={(value) =>
                      handlePriceChange(value, "comparePrice")
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="costPrice"
                render={({ field }) => (
                  <FormInput
                    aria-label="Giá vốn"
                    type="number"
                    label="Giá vốn"
                    placeholder="Nhập giá vốn"
                    className="col-6"
                    step={1000}
                    isInvalid={errors.costPrice ? true : false}
                    errorMessage={errors.costPrice?.message}
                    value={field.value.toString()}
                    startContent={<InfoTooltip content={COST_PRICE_INFO} />}
                    endContent={<FaDongSign className="text-gray-500" />}
                    description={`Giá vốn: ${CurrencyFormatter({
                      style: "currency",
                    }).format(getValues("costPrice"))}`}
                    onValueChange={(value) =>
                      handlePriceChange(value, "costPrice")
                    }
                  />
                )}
              />
            </div>
          </GroupBox>
          <GroupBox
            title="Thông tin kho"
            titleEndContent={
              <div className="flex gap-4">
                <Link
                  href={InventoriesHistoryRoute(propVariant.id)}
                  target="_blank"
                >
                  <span className="label-link">Lịch sử kho</span>
                </Link>
                <span className="label-link" onClick={onOpen}>
                  Thêm kho lưu trữ
                </span>
              </div>
            }
          >
            <Table removeWrapper className="mt-4" aria-label="Bảng tồn kho">
              <TableHeader>
                <TableColumn key={"kholuutru"} className="w-3/5">
                  Kho lưu trữ
                </TableColumn>
                <TableColumn align="center">Tồn kho</TableColumn>
                <TableColumn align="center">Hàng đang về</TableColumn>
                <TableColumn align="center">Đang giao dịch</TableColumn>
                <TableColumn align="center">Có thể bán</TableColumn>
              </TableHeader>
              <TableBody items={propVariant.inventories}>
                {(inventory) => (
                  <TableRow key={inventory.warehouse.id}>
                    <TableCell>{inventory.warehouse.name}</TableCell>
                    <TableCell>
                      <Popover showArrow classNames={{ content: "w-[300px]" }}>
                        <PopoverTrigger>
                          <div className="flex items-center justify-center p-1 gap-2 rounded-md hover:bg-blue-100 hover:cursor-pointer">
                            {inventory.onHand}{" "}
                            <FaPen className="text-gray-500" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent>
                          <UpdateOnHandPopover inventory={inventory} />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>{inventory.onReceive}</TableCell>
                    <TableCell>{inventory.onTransaction}</TableCell>
                    <TableCell>{inventory.avaiable}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </GroupBox>
        </div>
      </form>
      <Divider className="my-6" />
      <div className="flex justify-end gap-4">
        <Button
          radius="sm"
          variant="bordered"
          color="danger"
          isDisabled={isLoading}
        >
          Xóa
        </Button>
        <Button
          form="FormEditVariant"
          radius="sm"
          color="primary"
          type="submit"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Lưu
        </Button>
      </div>

      <AddInventoryModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        variant={propVariant}
      />
    </>
  );
};

const UpdateOnHandPopover = ({ inventory }: { inventory: Inventory }) => {
  enum Reason {
    BROKEN = "Hư hỏng",
    RETURN = "Trả hàng",
    DELIVER = "Chuyển hàng",
    PRODUCE = "Sản xuất thêm",
    LOST = "Thất lạc",
    REALITY = "Thực tế",
    OTHER = "Khác",
  }
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState<Reason>(Reason.REALITY);
  const [onHand, setOnHand] = useState(inventory.onHand);
  const [changeValue, setChangeValue] = useState(0);
  const router = useRouter();

  const handleOnHandChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = isInteger(e.target.value) ? parseInt(e.target.value) : 0;
    if (value < 0) value = 0;
    setOnHand(value);
    setChangeValue(value - inventory.onHand);
  };

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    let value = isInteger(e.target.value) ? parseInt(e.target.value) : 0;
    if (value < inventory.onHand * -1) value = inventory.onHand * -1;
    setChangeValue(value);
    setOnHand(inventory.onHand + value);
  };

  const handleSave = async () => {
    if (changeValue === 0) {
      toast.error("Giá trị điều chỉnh phải khác 0");
      return;
    }
    try {
      setIsLoading(true);
      const session = await getSession();
      const res = await fetch(`${PUT_CHANGE_ON_HAND_INVENTORIES_ROUTE}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventoryId: inventory.id,
          onHand: onHand,
          changeValue: changeValue,
          reason: reason,
        }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        toast.success(data.message || "Lưu thành công");
        router.refresh();
        return;
      }

      toast.error(data.error || data.message || "Đã xảy ra lỗi");
    } catch (error: any) {
      toast.error(error.message || "Đã xảy ra lỗi ");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex gap-2">
        <Input
          label="Điều chỉnh"
          labelPlacement="outside"
          type="number"
          defaultValue="0"
          size="sm"
          radius="sm"
          variant="bordered"
          min={inventory.onHand * -1}
          value={changeValue.toString()}
          onChange={handleChangeValue}
        />
        <Input
          label="Tồn kho mới"
          labelPlacement="outside"
          type="number"
          size="sm"
          radius="sm"
          variant="bordered"
          min={0}
          value={onHand.toString()}
          defaultValue={inventory.onHand.toString()}
          onChange={handleOnHandChange}
        />
      </div>
      <Select
        label="Lý do"
        labelPlacement="outside"
        size="sm"
        radius="sm"
        variant="bordered"
        selectionMode="single"
        defaultSelectedKeys={Reason.REALITY}
        selectedKeys={[reason]}
        onSelectionChange={(keys) => {
          if (keys.anchorKey !== undefined) {
            setReason(keys.anchorKey as Reason);
          }
        }}
      >
        {Object.entries(Reason).map(([key, value]) => (
          <SelectItem key={value}>{value}</SelectItem>
        ))}
      </Select>
      <div className="flex justify-end">
        <Button
          size="sm"
          color="primary"
          radius="sm"
          onClick={handleSave}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Lưu
        </Button>
      </div>
    </div>
  );
};

// const VariantImages = () => {};

export default FormEditVariant;
