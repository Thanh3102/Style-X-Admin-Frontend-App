"use client";
import { TagSeletor } from "@/components/common/TagSelector";
import { GroupBox } from "@/components/ui/GroupBox";
import {
  PaymentMethod,
  ReceiveInventoryTransaction,
  TagType,
} from "@/libs/types/backend";
import ReceiveProductSelector, {
  SelectedVariant,
} from "../ReceiveProductSelector";
import { useImmer } from "use-immer";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { CurrencyFormatter } from "@/libs/format-helper";
import { FaDongSign, FaX } from "react-icons/fa6";
import { getSession } from "next-auth/react";
import { getWarehouse } from "@/app/api/warehouses";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/libs/utils";
import SupplierSelector from "../search_selector/SupplierSelector";
import { getLocalTimeZone, now, today } from "@internationalized/date";
import { SupplierResponse } from "@/app/api/suppliers/suppliers.type";
import SupplierCard from "@/components/ui/SupplierCard";
import RenderIf from "@/components/ui/RenderIf";
import ConfirmModal from "../ConfirmModal";
import {
  ReceiveInventoryDetailRoute,
  ReceiveInventoryRoute,
} from "@/constants/route";
import { useRouter } from "next/navigation";
import { POST_CREATE_RECEIVE_INVENTORY } from "@/constants/api-routes";
import { GetWarehousesResponse } from "@/app/api/warehouses/warehouses.type";

const CreateReceiveInventorySchema = z
  .object({
    warehouseId: z.number({
      required_error: "Chưa chọn kho nhập",
    }),
    supplierId: z.number({
      required_error: "Chưa chọn nhà cung cấp",
    }),
    code: z.string().optional(),
    expectedOn: z.date().optional(),
    note: z.string().optional(),
    tags: z.array(z.string()).optional(),
    importAfterCreate: z.boolean(),
    totalReceipt: z.number(),
    totalLandedCost: z.number(),
    totalItems: z.number(),
    totalItemsDiscount: z.number(),
    totalItemsPrice: z.number(),
    totalItemsPriceBeforeDiscount: z.number(),
    landedCosts: z.array(
      z.object({
        name: z.string(),
        price: z.number(),
      })
    ),
    transactionStatus: z.string(),
    transactionDate: z.date().optional(),
    transactionMethod: z.string().optional(),
    transactionAmount: z
      .number({
        required_error: "Chưa nhập giá trị",
        invalid_type_error: "Chưa nhập giá trị",
      })
      .optional(),
    items: z
      .array(
        z.object({
          variantId: z.number(),
          quantity: z.number(),
          price: z.number(),
          total: z.number(),
          totalDiscount: z.number(),
          discountType: z.string(),
          discountValue: z.number(),
          discountAmount: z.number(),
          finalPrice: z.number(),
          finalTotal: z.number(),
        }),
        { required_error: "Chưa có sản phẩm" }
      )
      .refine((items) => items.length > 0, {
        message: "Danh sách sản phẩm trống",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.transactionStatus === "Đã thanh toán") {
      if (data.transactionAmount && data.transactionAmount < 1000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["transactionAmount"],
          message: "Giá trị nhỏ nhất phải là 1000đ",
        });
      }

      if (
        data.transactionAmount &&
        data.transactionAmount > data.totalReceipt
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["transactionAmount"],
          message:
            "Giá trị thanh toán không thể lớn hơn tổng giá trị nhập hàng",
        });
      }
    }

    if (data.code && data.code.trim().toLowerCase().startsWith("re")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["code"],
        message: "Mã đơn nhập không thể bắt đầu bằng 'RE'",
      });
    }
  });

type CreateReceiveInventoryField = z.infer<typeof CreateReceiveInventorySchema>;

type LandedCost = {
  name: string;
  price: number;
};

const FormCreateReceiveInventory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [exitConfirm, setExitConfirm] = useState(false);
  const [warehouses, setWarehouses] = useState<GetWarehousesResponse>([]);
  const [selectedVariants, setSelectedVariants] = useImmer<SelectedVariant[]>(
    []
  );
  const [landedCosts, setLandedCosts] = useImmer<LandedCost[]>([]);
  const [openLandedCostAdd, setOpenLandedCostAdd] = useState(false);
  const [cost, setCost] = useImmer({
    totalReceipt: 0,
    totalLandedCost: 0,
    totalItems: 0,
    totalItemsDiscount: 0,
    totalItemsPrice: 0,
    totalBeforeDiscount: 0,
  });
  const [supplier, setSupplier] = useState<SupplierResponse>();

  const router = useRouter();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, submitCount, isValid, isSubmitted },
  } = useForm<CreateReceiveInventoryField>({
    resolver: zodResolver(CreateReceiveInventorySchema),
    defaultValues: {
      transactionStatus: ReceiveInventoryTransaction.UN_PAID,
      transactionMethod: PaymentMethod.CASH,
      transactionAmount: 1000,
      transactionDate: new Date(),
      code: "",
      importAfterCreate: true,
    },
  });

  const onSubmit: SubmitHandler<CreateReceiveInventoryField> = async (data) => {
    if (
      data.transactionStatus === ReceiveInventoryTransaction.PAID &&
      data.transactionAmount &&
      data.transactionAmount > data.totalReceipt
    ) {
      toast.error("Số tiền thanh toán không thể lớn hơn giá trị đơn nhập");
      return;
    }
    try {
      setIsLoading(true);
      const session = await getSession();
      const res = await fetch(POST_CREATE_RECEIVE_INVENTORY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(data),
      });
      setIsLoading(false);

      const response = await res.json();

      if (res.ok) {
        toast.success("Tạo đơn nhập thành công");
        router.push(ReceiveInventoryDetailRoute(response.id));
        return;
      }

      toast.error(response.message ?? "Đã xảy ra lỗi");
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
    }
  };

  const getWarehousesData = useCallback(async () => {
    try {
      const session = await getSession();
      const data = await getWarehouse(session?.accessToken, { active: "true" });
      setWarehouses(data);
    } catch (error) {}
  }, []);

  const handleRemoveLandedCost = useCallback((index: number) => {
    setLandedCosts((landedCosts) => {
      landedCosts.splice(index, 1);
      return landedCosts;
    });
  }, []);

  useEffect(() => {
    getWarehousesData();
  }, []);

  useEffect(() => {
    const itemCost = {
      totalItems: 0,
      totalItemsDiscount: 0,
      totalItemsPrice: 0,
      totalBeforeDiscount: 0,
    };

    selectedVariants.forEach((item) => {
      itemCost.totalItems += item.quantity;
      itemCost.totalItemsDiscount += item.discountAmount * item.quantity;
      itemCost.totalItemsPrice += item.finalTotal;
      itemCost.totalBeforeDiscount += item.total;
    });

    const newTotalItems = itemCost.totalItems;
    const newTotalItemsDiscount = itemCost.totalItemsDiscount;
    const newTotalItemsPrice = itemCost.totalItemsPrice;
    const newTotalReceipt = cost.totalLandedCost + itemCost.totalItemsPrice;
    const items = selectedVariants.map((selectedVariant) => {
      const { variant, ...data } = selectedVariant;
      return {
        variantId: variant.id,
        ...data,
      };
    });

    setCost((cost) => {
      return {
        ...cost,
        totalItems: newTotalItems,
        totalItemsDiscount: newTotalItemsDiscount,
        totalItemsPrice: newTotalItemsPrice,
        totalReceipt: newTotalReceipt,
        totalBeforeDiscount: itemCost.totalBeforeDiscount,
      };
    });

    setValue("totalItems", newTotalItems);
    setValue("totalItemsDiscount", newTotalItemsDiscount);
    setValue("totalItemsPrice", newTotalItemsPrice);
    setValue("totalReceipt", newTotalReceipt);
    setValue("totalItemsPriceBeforeDiscount", cost.totalBeforeDiscount);
    setValue("items", items);
    setValue(
      "transactionAmount",
      newTotalReceipt < 1000 ? 1000 : newTotalReceipt
    );
  }, [selectedVariants]);

  useEffect(() => {
    const total = landedCosts.reduce((total, item) => {
      return total + item.price;
    }, 0);

    const newTotalLandedCost = total;
    const newTotalReceipt = total + cost.totalItemsPrice;

    setCost((cost) => {
      cost.totalLandedCost = newTotalLandedCost;
      cost.totalReceipt = newTotalReceipt;
      return cost;
    });

    setValue("landedCosts", landedCosts);
    setValue("totalLandedCost", newTotalLandedCost);
    setValue("totalReceipt", newTotalReceipt);
    setValue(
      "transactionAmount",
      newTotalReceipt < 1000 ? 1000 : newTotalReceipt
    );
  }, [landedCosts]);

  useEffect(() => {
    if (supplier) {
      setValue("supplierId", supplier.id);
    }
  }, [supplier]);

  useEffect(() => {
    if (isSubmitted && !isValid) {
      if (Object.keys(errors).length > 0) {
        const firstErrorField = Object.keys(errors)[0];
        const firstErrorMessage =
          errors[firstErrorField as keyof typeof errors]?.message;
        const messageToDisplay =
          typeof firstErrorMessage === "string"
            ? firstErrorMessage
            : "Có thông tin không hợp lệ";

        // toast.error(`${firstErrorField}: ${messageToDisplay}`);
        toast.error(`${messageToDisplay}`);
      }
    }
  }, [submitCount]);

  return (
    <>
      <form
        className="flex gap-4 flex-wrap"
        id="CreateReceiveInventoryForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col flex-[4] gap-4 basis-[600px]">
          <GroupBox title="Sản phẩm">
            <ReceiveProductSelector
              onSelectionChange={(variants) => setSelectedVariants(variants)}
            />

            <Checkbox {...register("importAfterCreate")}>
              Nhập kho sau khi tạo đơn
            </Checkbox>
          </GroupBox>
          <GroupBox title="Thanh toán">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <span className="flex-1">Tổng tiền</span>
                <div className="flex-[3] flex justify-between">
                  <span>{cost.totalItems} sản phẩm</span>
                  <div className="flex gap-1">
                    <RenderIf condition={cost.totalItemsDiscount > 0}>
                      <span className="line-through text-gray-500">
                        {CurrencyFormatter().format(cost.totalBeforeDiscount)}
                      </span>
                    </RenderIf>
                    <span>
                      {CurrencyFormatter().format(cost.totalItemsPrice)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="flex-1">Giảm giá</span>
                <div className="flex-[3] flex justify-between">
                  <span>-----</span>
                  <span>
                    {CurrencyFormatter().format(cost.totalItemsDiscount * -1)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <span
                  className="flex-1 label-link"
                  onClick={() => setOpenLandedCostAdd(true)}
                >
                  Chi phí nhập hàng
                </span>
                <div className="flex-[3] flex justify-between">
                  <ul className="flex flex-col text-sm list-disc">
                    {landedCosts.map((item, index) => (
                      <li className="flex gap-2 items-center" key={item.name}>
                        <div
                          className="p-2 rounded-full hover:bg-gray-300 hover:cursor-pointer"
                          onClick={() => handleRemoveLandedCost(index)}
                        >
                          <FaX size={10} />
                        </div>
                        <span>
                          {item.name}: {CurrencyFormatter().format(item.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <span>
                    {CurrencyFormatter().format(cost.totalLandedCost)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center font-semibold">
                <span>Tiền cần trả NCC</span>
                <span>{CurrencyFormatter().format(cost.totalReceipt)}</span>
              </div>
            </div>
            <div className="p-2rounded-md my-4 font-medium">
              <RadioGroup
                label="Trạng thái thanh toán"
                onValueChange={(value) => {
                  setValue("transactionStatus", value, { shouldDirty: true });
                  setValue("transactionAmount", 1000, { shouldValidate: true });
                }}
                defaultValue={ReceiveInventoryTransaction.UN_PAID}
              >
                <Radio
                  key={ReceiveInventoryTransaction.UN_PAID}
                  value={ReceiveInventoryTransaction.UN_PAID}
                >
                  Chưa thanh toán
                </Radio>

                <Radio
                  key={ReceiveInventoryTransaction.PAID}
                  value={ReceiveInventoryTransaction.PAID}
                >
                  Đã thanh toán
                </Radio>

                <div
                  className={cn("gap-y-4 -mx-2 [&>*]:px-2 flex-wrap hidden", {
                    flex:
                      watch("transactionStatus") ===
                      ReceiveInventoryTransaction.PAID,
                  })}
                >
                  <DatePicker
                    label="Ngày thanh toán"
                    variant="bordered"
                    radius="sm"
                    labelPlacement="outside"
                    hideTimeZone
                    showMonthAndYearPickers
                    maxValue={today(getLocalTimeZone()).add({ days: 1 })}
                    defaultValue={now(getLocalTimeZone())}
                    className="col-6"
                    onChange={(value) =>
                      setValue("transactionDate", value.toDate(), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                  <Input
                    label="Số tiền thanh toán"
                    type="number"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="sm"
                    className="col-6"
                    min={0}
                    max={1e12}
                    isInvalid={errors.transactionAmount ? true : false}
                    errorMessage={errors.transactionAmount?.message}
                    {...register("transactionAmount", { valueAsNumber: true })}
                  />
                  <Select
                    disallowEmptySelection
                    label="Phương thức thanh toán"
                    defaultSelectedKeys={[PaymentMethod.CASH]}
                    selectionMode="single"
                    variant="bordered"
                    radius="sm"
                    labelPlacement="outside"
                    className="col-12"
                    onSelectionChange={(key) =>
                      setValue("transactionMethod", key.anchorKey, {
                        shouldDirty: true,
                      })
                    }
                  >
                    {Object.values(PaymentMethod).map((key) => (
                      <SelectItem key={key}>{key}</SelectItem>
                    ))}
                  </Select>
                </div>
              </RadioGroup>
            </div>
          </GroupBox>
        </div>

        <div className="flex flex-col flex-[2] gap-4 basis-[300px]">
          <GroupBox title="Nhà cung cấp">
            <SupplierSelector
              onSelectionChange={(supplier) => {
                setSupplier(supplier);
              }}
            />
            {supplier && <SupplierCard supplier={supplier} className="mt-5" />}
          </GroupBox>

          <GroupBox title="Kho nhập">
            <Autocomplete
              radius="sm"
              variant="bordered"
              isInvalid={errors.warehouseId ? true : false}
              errorMessage={errors.warehouseId?.message}
              listboxProps={{
                emptyContent: "Không có kết quả.",
              }}
              onSelectionChange={(key) => {
                if (key) {
                  console.log("Key", parseInt(key as string));
                  setValue("warehouseId", parseInt(key as string), {
                    shouldValidate: true,
                  });
                }
              }}
            >
              {warehouses.map((item) => (
                <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
              ))}
            </Autocomplete>
          </GroupBox>

          <GroupBox title="Thông tin bổ sung">
            <div className="flex flex-col gap-4">
              <Input
                label="Mã đơn nhập"
                placeholder="Nhập mã đơn nhập"
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
                isInvalid={!!errors.code}
                errorMessage={errors.code?.message}
                {...register("code")}
              />

              <DatePicker
                label="Ngày nhập dự kiến"
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
                hideTimeZone
                showMonthAndYearPickers
                minValue={today(getLocalTimeZone())}
                onChange={(dateValue) =>
                  setValue("expectedOn", dateValue.toDate(getLocalTimeZone()))
                }
              />
            </div>
          </GroupBox>

          <GroupBox title="Ghi chú">
            <Textarea
              placeholder="Nhập ghi chú"
              variant="bordered"
              radius="sm"
              maxRows={5}
              minRows={3}
              {...register("note")}
            />
          </GroupBox>

          <TagSeletor
            type={TagType.RECEIVE_INVENTORY}
            onValueChange={(tags) => setValue("tags", tags)}
          />
        </div>
      </form>

      <Divider className="my-6" />

      <div className="flex justify-end gap-5">
        <Button
          radius="sm"
          variant="bordered"
          color="danger"
          onClick={() => setExitConfirm(true)}
          isDisabled={isLoading}
        >
          Hủy
        </Button>
        <Button
          radius="sm"
          color="primary"
          type="submit"
          form="CreateReceiveInventoryForm"
          isDisabled={isLoading}
          isLoading={isLoading}
        >
          Thêm
        </Button>
      </div>

      <AddLandedCostModal
        isOpen={openLandedCostAdd}
        onOpenChange={(open) => setOpenLandedCostAdd(open)}
        onSave={(landedCost) =>
          setLandedCosts((landedCosts) => [...landedCosts, landedCost])
        }
      />

      <ConfirmModal
        cancelText="Không phải bây giờ"
        confirmText="Xác nhận"
        title="Chỉnh sửa chưa được lưu"
        isOpen={exitConfirm}
        onOpenChange={(open) => setExitConfirm(open)}
        onConfirm={() => {
          router.push(`${ReceiveInventoryRoute}`);
        }}
      >
        <span>
          Các thay đổi bạn đã thực hiện không được lưu. Bạn có muốn tiếp tục?
        </span>
      </ConfirmModal>
    </>
  );
};

type AddLandedCostModalProps = {
  onSave?: (landedCost: LandedCost) => void;
} & Omit<ModalProps, "children">;

const AddLandedCostModal = ({ onSave, ...props }: AddLandedCostModalProps) => {
  const [landedCost, setLandedCost] = useImmer({
    name: "",
    price: 1000,
  });

  const handleSave = (onClose: () => void) => {
    if (!landedCost.name) {
      toast.error("Chưa nhập giá trị");
      return;
    }

    onSave && onSave(landedCost);
    setLandedCost({
      name: "",
      price: 1000,
    });
    onClose();
  };

  return (
    <Modal {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Thêm chi phí nhập hàng</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2">
                <Input
                  fullWidth
                  label="Tên chi phí"
                  labelPlacement="outside-left"
                  variant="bordered"
                  radius="sm"
                  classNames={{
                    label: "min-w-[100px]",
                    mainWrapper: "flex-1",
                  }}
                  onValueChange={(value) =>
                    setLandedCost((landedCost) => {
                      landedCost.name = value;
                      return landedCost;
                    })
                  }
                />
                <Input
                  type="number"
                  fullWidth
                  label="Giá tiền"
                  labelPlacement="outside-left"
                  variant="bordered"
                  radius="sm"
                  step={1000}
                  min={1000}
                  max={1e12}
                  value={landedCost.price.toString()}
                  endContent={<FaDongSign />}
                  classNames={{
                    label: "min-w-[100px]",
                    mainWrapper: "flex-1",
                  }}
                  onValueChange={(value) =>
                    setLandedCost((landedCost) => {
                      landedCost.price = parseInt(value);
                      return landedCost;
                    })
                  }
                />
                <ModalFooter className="px-0">
                  <div className="flex justify-end gap-4">
                    <Button
                      color="danger"
                      variant="bordered"
                      radius="sm"
                      onClick={onClose}
                    >
                      Đóng
                    </Button>
                    <Button
                      color="primary"
                      radius="sm"
                      onClick={() => handleSave(onClose)}
                    >
                      Thêm
                    </Button>
                  </div>
                </ModalFooter>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FormCreateReceiveInventory;
