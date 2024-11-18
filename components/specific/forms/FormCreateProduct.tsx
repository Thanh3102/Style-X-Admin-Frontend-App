"use client";
import {
  Button,
  Radio,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import RadioGroup from "../../common/RadioGroup";
import { FormInput, FormSelect } from "../../common/Form";
import { GroupBox } from "../../ui/GroupBox";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/libs/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CurrencyFormatter } from "@/libs/format-helper";
import { FaDongSign, FaTrash } from "react-icons/fa6";
import { InfoTooltip } from "../../ui/InfoTooltip";
import { COMPARE_PRICE_INFO, COST_PRICE_INFO } from "@/constants/text";
import { TagSeletor } from "../../common/TagSelector";
import { TagType } from "@/libs/types/backend";
import { useImmer } from "use-immer";
import RenderIf from "../../ui/RenderIf";
import toast from "react-hot-toast";
import { FiPlusCircle } from "react-icons/fi";
import ProductOptionValueInput from "../filters/ProductOptionValueInput";
import ProductVariantEditModal from "../ProductVariantEditModal";
import ImageDrop from "../../common/CreateProductImageDrop";
import dynamic from "next/dynamic";
import CategoriesSearch from "../../common/CategoriesSearch";
import {
  GET_WAREHOUSE_ROUTE,
  POST_CREATE_PRODUCT_ROUTE,
} from "@/constants/api-routes";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProductRoute } from "@/constants/route";
import { getWarehouse } from "@/app/api/warehouses";

const TextEditor = dynamic(() => import("../../common/TextEditor"), {
  ssr: false,
});

const CreateProductSchema = z.object({
  name: z
    .string({ required_error: "Chưa nhập tên sản phẩm" })
    .min(1, { message: "Chưa nhập tên sản phẩm" }),
  skuCode: z.string().optional(),
  barCode: z.string().optional(),
  unit: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
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
  avaiable: z.boolean(),
  warehouses: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        onHand: z.number(),
      }),
      { required_error: "Chưa chọn kho lưu trữ" }
    )
    .refine(
      (warehouses) => {
        return warehouses.length > 0;
      },
      { message: "Chưa chọn kho lưu trữ" }
    ),
  vendor: z.string().optional(),
  type: z.string().optional(),
  options: z
    .array(
      z.object({
        position: z.number(),
        name: z.string().min(1, "Chưa nhập tên thuộc tính"),
        values: z.array(z.string()).refine(
          (values) => {
            return !(values.length === 0);
          },
          { message: "Giá trị thuộc tính trống" }
        ),
      })
    )
    .refine(
      (options) => {
        const nameSet = new Set();
        for (const option of options) {
          if (nameSet.has(option.name)) return false;
          nameSet.add(option.name);
        }
        return true;
      },
      { message: "Tên thuộc tính trùng nhau" }
    ),
  variants: z.any(),
  images: z.array(z.instanceof(File)),
  tags: z.array(z.string()),
  categoryIds: z.array(z.number()),
});

type CreateProductField = z.infer<typeof CreateProductSchema>;

type SelectedWarehouse = { id: number; name: string; onHand: number };

type Warehouse = Pick<SelectedWarehouse, "id" | "name">;

type ProductOption = {
  position: number;
  name: string;
  values: Array<string>;
};

export type ProductVariant = {
  title: string;
  option1: string;
  option2: string;
  option3: string;
} & Pick<
  CreateProductField,
  | "skuCode"
  | "barCode"
  | "costPrice"
  | "sellPrice"
  | "comparePrice"
  | "warehouses"
  | "unit"
>;

const FormCreateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [openShortDesc, setOpenShortDesc] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouses, setSelectedWarehouses] = useImmer<
    SelectedWarehouse[]
  >([]);

  const [options, setOptions] = useImmer<ProductOption[]>([]);
  const [variants, setVariants] = useImmer<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();
  const [variantEditOpen, setVariantEditOpen] = useState(false);

  const inputTimeoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitted, isValid, submitCount },
  } = useForm<CreateProductField>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      sellPrice: 0,
      costPrice: 0,
      comparePrice: 0,
      avaiable: true,
    },
  });

  const onSubmit: SubmitHandler<CreateProductField> = async ({
    images,
    ...productData
  }) => {
    const formData = new FormData();

    if (images.length > 0) {
      images.forEach((img) => {
        formData.append("images", img);
      });
    }

    formData.append("productData", JSON.stringify(productData));

    setIsLoading(true);
    const session = await getSession();
    const res = await fetch(`${POST_CREATE_PRODUCT_ROUTE}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: formData,
    });
    setIsLoading(false);
    const data = await res.json();

    if (res.ok) {
      toast.success("Thêm sản phẩm thành công");
      router.push(`${ProductRoute}/${data.id}`);
      return;
    }

    toast.error(data.error ?? "Đã xảy ra lỗi");
  };

  const getWarehouseData = useCallback(async () => {
    try {
      const data = await getWarehouse();
      setWarehouses(data);
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi khi tải dữ liệu");
    }
  }, []);

  const totalVariantsOnHand = useMemo(() => {
    return variants.reduce((total: number, variant) => {
      for (const warehouse of variant.warehouses) {
        total = total + warehouse.onHand;
      }
      return total;
    }, 0);
  }, [variants]);

  const updateVariants = useCallback(() => {
    setVariants((variants) => {
      const result = options.reduce<ProductVariant[]>(
        (previosVariant, option) => {
          const newVariants: ProductVariant[] = [];

          for (const variant of previosVariant) {
            option.values.forEach((value, index) => {
              const skuCode = variant.skuCode
                ? `${variant.skuCode}-${index}`
                : undefined;
              const newVariant = {
                ...variant,
                title: [...variant.title.split("/"), value].join("/"),
                skuCode: skuCode,
                [`option${option.position}`]: value,
              };
              newVariants.push(newVariant);
            });
          }

          // Khi chưa có variant nào
          if (previosVariant.length === 0) {
            option.values.forEach((value, index) => {
              const skuCode = getValues("skuCode")
                ? `${getValues("skuCode")}-${index}`
                : `${index}`;

              const newVariant: ProductVariant = {
                title: value,
                comparePrice: getValues("comparePrice"),
                sellPrice: getValues("sellPrice"),
                costPrice: getValues("costPrice"),
                warehouses: getValues("warehouses"),
                barCode: undefined,
                skuCode: skuCode,
                unit: getValues("unit"),
                option1: value,
                option2: "",
                option3: "",
              };

              /* Nếu muốn lưu thay đổi của variant không bị ảnh hưởng bới thay đổi sản phẩm gốc*/
              // const findIndex = variants.findIndex((v) => {
              //   if (
              //     v.option1 === newVariant.option1 &&
              //     v.option2 === newVariant.option2 &&
              //     v.option3 === newVariant.option3
              //   )
              //     return true;
              //   return false;
              // });

              // if (findIndex !== -1) {
              //   newVariant = {
              //     ...newVariant,
              //     comparePrice: variants[findIndex].comparePrice,
              //     sellPrice: variants[findIndex].sellPrice,
              //     costPrice: variants[findIndex].costPrice,
              //     warehouses: variants[findIndex].warehouses,
              //     unit: variants[findIndex].unit ?? getValues("unit"),
              //     barCode: variants[findIndex].barCode,
              //     skuCode: variants[findIndex].skuCode ?? skuCode,
              //   };
              // }

              newVariants.push(newVariant);
            });
          }

          return newVariants;
        },
        []
      );
      return result;
    });
  }, [
    options,
    watch("skuCode"),
    watch("warehouses"),
    watch("unit"),
    watch("sellPrice"),
    watch("costPrice"),
    watch("comparePrice"),
  ]);

  const countVariantOnhand = useCallback(
    (warehouses: Array<{ id: number; name: string; onHand: number }>) => {
      let total = 0;
      for (const warehouse of warehouses) {
        total += warehouse.onHand;
      }
      return total;
    },
    []
  );

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

  const handleWarehouseSelect = useCallback(
    (key: string[]) => {
      setSelectedWarehouses((selecteds) => {
        if (key.length === 0) return [];

        const keySet = new Set(key);

        const keepedSelectedWarehouses = selecteds.filter((selected) => {
          if (key.includes(selected.id.toString())) {
            keySet.delete(selected.id.toString());
            return true;
          }
          return false;
        });

        const newSelectedWarehouse: SelectedWarehouse[] = [];

        keySet.forEach((key) => {
          const index = warehouses.findIndex(
            (warehouse) => warehouse.id.toString() === key
          );
          newSelectedWarehouse.push({
            id: warehouses[index].id,
            name: warehouses[index].name,
            onHand: 0,
          });
        });

        return [...keepedSelectedWarehouses, ...newSelectedWarehouse];
      });
    },
    [selectedWarehouses, warehouses]
  );

  const handleOnHandChange = useCallback(
    (value: string, warehouseId: number) => {
      setSelectedWarehouses((whs) => {
        const index = whs.findIndex((wh) => wh.id === warehouseId);
        if (index !== -1) {
          whs[index].onHand = !isNaN(parseInt(value)) ? parseInt(value) : 0;
          return whs;
        }
        return whs;
      });
    },
    []
  );

  const handleAddOption = useCallback(() => {
    if (options.length === 3) return;

    setOptions((options) => {
      options.push({
        position: options.length + 1,
        name: "",
        values: [],
      });
    });
  }, []);

  const handleDeleteOption = useCallback((position: number) => {
    setOptions((options) => {
      const index = options.findIndex((option) => option.position === position);

      if (index === -1) return options;

      options.splice(index, 1);

      for (const option of options) {
        if (option.position < position) continue;
        option.position = option.position - 1;
      }

      return options;
    });
  }, []);

  const handleDeleteOptionValue = useCallback(
    (value: string, position: number) => {
      setOptions((options) => {
        const index = options.findIndex((op) => op.position === position);

        if (index === -1) return options;

        const valueIndex = options[index].values.findIndex((v) => v === value);
        options[index].values.splice(valueIndex, 1);
        return options;
      });
    },
    []
  );

  const handleAddOptionValue = useCallback(
    (value: string, position: number) => {
      setOptions((options) => {
        const index = options.findIndex((op) => op.position === position);

        if (index === -1) return options;

        if (options[index].values.find((v) => v === value)) return;

        options[index].values.push(value);

        return options;
      });
    },
    []
  );

  const handleOptionNameInputChange = useCallback(
    (value: string, position: number) => {
      clearInterval(inputTimeoutRef.current);
      inputTimeoutRef.current = setTimeout(
        () =>
          setOptions((options) => {
            const index = options.findIndex((op) => op.position === position);

            if (index === -1) return options;
            options[index].name = value;
            return options;
          }),
        300
      );
    },
    []
  );

  const handleVariantClick = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant);
    setVariantEditOpen(true);
  }, []);

  const handleSaveVariant = useCallback((newVariant: ProductVariant) => {
    setVariants((variants) => {
      const index = variants.findIndex((variant) => {
        return variant.title === newVariant.title;
      });

      if (index === -1) return variants;

      variants[index] = newVariant;
      return variants;
    });
  }, []);

  useEffect(() => {
    getWarehouseData();
  }, []);

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

        toast.error(messageToDisplay);
      }
    }
  }, [submitCount]);

  useEffect(() => {
    setValue("variants", variants);
  }, [variants]);

  useEffect(() => {
    setValue("warehouses", selectedWarehouses, { shouldValidate: true });
  }, [selectedWarehouses]);

  useEffect(() => {
    setValue("options", options, { shouldValidate: true });
    updateVariants();
  }, [options]);

  useEffect(() => {
    updateVariants();
  }, [
    watch("skuCode"),
    watch("warehouses"),
    watch("unit"),
    watch("sellPrice"),
    watch("costPrice"),
    watch("comparePrice"),
  ]);

  return (
    <>
      <form
        className="flex gap-4 flex-wrap"
        id="CreateProductForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex-[2] basis-[600px] flex flex-col gap-5 w-[600px]">
          <GroupBox title="Thông tin sản phẩm">
            <div className="flex flex-wrap gap-y-2 -mx-2 [&>*]:px-2">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <FormInput
                    aria-label="Tên sản phẩm"
                    label="Tên sản phẩm"
                    placeholder="Nhập tên của sản phẩm (tối đa 320 kí tự)"
                    maxLength={320}
                    className="col-12"
                    isInvalid={errors.name ? true : false}
                    errorMessage={errors.name?.message}
                    isRequired={true}
                    {...field}
                    ref={null}
                  />
                )}
              />

              <Controller
                control={control}
                name="skuCode"
                render={({ field }) => (
                  <FormInput
                    aria-label="Mã SKU"
                    label="Mã SKU"
                    placeholder="Nhập mã SKU sản phẩm"
                    className="col-6"
                    isInvalid={errors.skuCode ? true : false}
                    errorMessage={errors.skuCode?.message}
                    {...field}
                    ref={null}
                  />
                )}
              />

              <Controller
                control={control}
                name="barCode"
                render={({ field }) => (
                  <FormInput
                    aria-label="Mã vạch/ Barcode"
                    label="Mã vạch/ Barcode"
                    placeholder="Nhập mã vạch sản phẩm (Tối đa 50 kí tự)"
                    className="col-6"
                    isInvalid={errors.barCode ? true : false}
                    errorMessage={errors.barCode?.message}
                    maxLength={50}
                    {...field}
                    ref={null}
                  />
                )}
              />

              <Controller
                control={control}
                name="unit"
                render={({ field }) => (
                  <FormInput
                    aria-label="Đơn vị tính"
                    label="Đơn vị tính"
                    placeholder="Nhập đơn vị tính"
                    className="col-6"
                    isInvalid={errors.unit ? true : false}
                    errorMessage={errors.unit?.message}
                    {...field}
                    ref={null}
                  />
                )}
              />

              <div className="col-12">
                <TextEditor
                  label="Mô tả"
                  placeholder="Nhập mô tả sản phẩm"
                  onValueChange={(data) =>
                    setValue("description", data, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                />
              </div>

              <div className="col-12">
                <span
                  className="label-link"
                  onClick={() => setOpenShortDesc(!openShortDesc)}
                >
                  {openShortDesc ? "Ẩn" : "Thêm"} mô tả ngắn
                </span>
              </div>

              <div
                className={cn("col-12 hidden", {
                  block: openShortDesc,
                })}
              >
                <TextEditor
                  label="Mô tả ngắn"
                  placeholder="Nhập mô tả sản phẩm"
                  onValueChange={(data) =>
                    setValue("shortDescription", data, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                />
              </div>
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

          <GroupBox title="Thông tin kho">
            <FormSelect
              aria-label="Lưu trữ tại kho"
              label="Lưu trữ tại kho"
              placeholder="Chọn kho lưu trữ"
              selectionMode="multiple"
              disallowEmptySelection
              isInvalid={errors.warehouses ? true : false}
              errorMessage={errors.warehouses?.message}
              onSelectionChange={(key) =>
                handleWarehouseSelect(Array.from(key) as string[])
              }
            >
              {warehouses.map((warehouse) => (
                <SelectItem key={warehouse.id}>{warehouse.name}</SelectItem>
              ))}
            </FormSelect>

            <RenderIf condition={selectedWarehouses.length > 0}>
              <Table removeWrapper className="mt-4" aria-label="Bảng tồn kho">
                <TableHeader>
                  <TableColumn key={"kholuutru"} className="w-3/5">
                    Kho lưu trữ
                  </TableColumn>
                  <TableColumn>Tồn kho</TableColumn>
                </TableHeader>
                <TableBody items={selectedWarehouses}>
                  {(warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell>{warehouse.name}</TableCell>
                      <TableCell>
                        <FormInput
                          aria-label="Só lượng tồn kho"
                          type="number"
                          placeholder="Nhập số lượng tồn kho"
                          min={0}
                          value={warehouse.onHand.toString()}
                          onValueChange={(value) =>
                            handleOnHandChange(value, warehouse.id)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </RenderIf>
          </GroupBox>

          <GroupBox
            title="Thuộc tính"
            titleEndContent={
              <RenderIf condition={options.length === 0}>
                <span className="label-link" onClick={handleAddOption}>
                  Thêm thuộc tính
                </span>
              </RenderIf>
            }
          >
            <RenderIf condition={options.length === 0}>
              Sản phẩm có nhiều thuộc tính khác nhau. Ví dụ: kích thước, màu
              sắc.
            </RenderIf>

            <RenderIf condition={options.length > 0}>
              <Table removeWrapper>
                <TableHeader>
                  <TableColumn key={"option_name"} className="w-1/2">
                    Tên thuộc tính
                  </TableColumn>
                  <TableColumn key={"option_values"} className="w-1/2">
                    Giá trị
                  </TableColumn>
                </TableHeader>
                <TableBody items={options}>
                  {options.map((option, index) => (
                    <TableRow key={option.position}>
                      <TableCell className="align-top">
                        <FormInput
                          aria-label="Tên thuộc tính"
                          defaultValue={option.name}
                          placeholder="Nhập tên thuộc tính"
                          isInvalid={
                            errors?.options?.[index]?.name ? true : false
                          }
                          errorMessage={errors?.options?.[index]?.name?.message}
                          endContent={
                            <div className="text-gray-400 hover:text-gray-700 hover:cursor-pointer">
                              <FaTrash
                                size={16}
                                onClick={() =>
                                  handleDeleteOption(option.position)
                                }
                              />
                            </div>
                          }
                          onChange={(e) =>
                            handleOptionNameInputChange(
                              e.target.value,
                              option.position
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <ProductOptionValueInput
                          values={option.values}
                          position={option.position}
                          onInputEnter={handleAddOptionValue}
                          onValueDelete={handleDeleteOptionValue}
                          isInvalid={
                            errors?.options?.[index]?.values ? true : false
                          }
                          errorMessage={
                            errors?.options?.[index]?.values?.message
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </RenderIf>

            <RenderIf condition={options.length > 0 && options.length < 3}>
              <div className="flex gap-2 items-center">
                <FiPlusCircle className="text-blue-500" />
                <span className="label-link" onClick={handleAddOption}>
                  Thêm thuộc tính
                </span>
              </div>
            </RenderIf>
          </GroupBox>

          <RenderIf condition={variants.length > 0}>
            <GroupBox title="Phiên bản">
              <div className="text-base py-4 px-2 flex items-center border-y-1 border-gray-200">
                <span className="font-semibold">
                  {variants.length} phiên bản
                </span>
              </div>
              {variants.map((variant) => (
                <div
                  key={variant.title}
                  className="py-4 px-2 flex justify-between border-b-1 border-gray-200 hover:bg-gray-100 hover:cursor-pointer items-center text-sm"
                  onClick={() => handleVariantClick(variant)}
                >
                  <div className="flex flex-col gap-2">
                    <span>{variant.title}</span>
                    <RenderIf condition={!!variant.skuCode}>
                      <span className="text-sm">Sku: {variant.skuCode}</span>
                    </RenderIf>
                  </div>
                  <div className="flex flex-col items-end">
                    <span>
                      Giá bán:{" "}
                      <strong>
                        {CurrencyFormatter().format(variant.sellPrice)}
                      </strong>
                    </span>
                    <span>
                      Có thể bán{" "}
                      <strong>{countVariantOnhand(variant.warehouses)}</strong>{" "}
                      tại <strong>{`${variant.warehouses.length} kho`}</strong>
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between text-sm items-center py-4">
                <span>Tổng tồn kho</span>
                <span>Có thể bán: {totalVariantsOnHand}</span>
              </div>
            </GroupBox>
          </RenderIf>
        </div>

        <div className="basis-[300px] flex-1 w-[300px]">
          <div className="flex flex-col gap-4">
            <GroupBox title="Ảnh sản phẩm">
              <ImageDrop
                maxSize={10}
                onImageChange={(images) =>
                  setValue("images", images, {
                    shouldDirty: true,
                    shouldValidate: true,
                    shouldTouch: true,
                  })
                }
              />
            </GroupBox>

            <GroupBox className="flex flex-col gap-4">
              <RadioGroup
                label="Hiển thị"
                size="sm"
                defaultValue={watch("avaiable").toString()}
                onValueChange={(value) =>
                  setValue("avaiable", value === "true" ? true : false)
                }
              >
                <Radio value={"true"}>Hiển thị</Radio>
                <Radio value={"false"}>Ẩn</Radio>
              </RadioGroup>

              <CategoriesSearch
                label="Danh mục"
                onSelectChange={(category) =>
                  setValue(
                    "categoryIds",
                    category.map((cat) => cat.id),
                    {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    }
                  )
                }
              />

              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <FormInput
                    aria-label="Loại sản phẩm"
                    label="Loại sản phẩm"
                    placeholder="Nhập loại sản phẩm"
                    {...field}
                    ref={null}
                  />
                )}
              />

              <Controller
                control={control}
                name="vendor"
                render={({ field }) => (
                  <FormInput
                    aria-label="Nhãn hiệu"
                    label="Nhãn hiệu"
                    placeholder="Nhập nhãn hiệu"
                    {...field}
                    ref={null}
                  />
                )}
              />
            </GroupBox>

            <TagSeletor
              type={TagType.PRODUCT}
              onValueChange={(tags) =>
                setValue("tags", tags, {
                  shouldDirty: true,
                  shouldValidate: true,
                  shouldTouch: true,
                })
              }
            />
          </div>
        </div>
      </form>

      <div className="flex justify-end gap-4 mt-4 py-4 border-t-1 border-gray-400">
        <Button
          radius="sm"
          variant="bordered"
          color="danger"
          isLoading={isDeleteLoading}
          isDisabled={isLoading || isDeleteLoading}
        >
          Hủy
        </Button>
        <Button
          isDisabled={isLoading || isDeleteLoading}
          isLoading={isLoading}
          radius="sm"
          type="submit"
          form="CreateProductForm"
          color="primary"
        >
          Thêm sản phẩm
        </Button>
      </div>

      <RenderIf condition={variantEditOpen}>
        <ProductVariantEditModal
          variant={selectedVariant}
          isOpen={variantEditOpen}
          onOpenChange={(open) => setVariantEditOpen(open)}
          onSave={handleSaveVariant}
        />
      </RenderIf>
    </>
  );
};

export default FormCreateProduct;
