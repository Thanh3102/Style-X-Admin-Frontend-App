"use client";
import {
  Button,
  Radio,
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
import { useCallback, useEffect, useRef, useState } from "react";
import { CurrencyFormatter } from "@/libs/format-helper";
import { TagSeletor } from "../../common/TagSelector";
import { TagType } from "@/libs/types/backend";
import { useImmer } from "use-immer";
import RenderIf from "../../ui/RenderIf";
import toast from "react-hot-toast";
import { FiPlusCircle } from "react-icons/fi";
import ProductOptionValueInput from "../filters/ProductOptionValueInput";

import dynamic from "next/dynamic";
import CategoriesSearch, { Category } from "../../common/CategoriesSearch";
import {
  DELETE_PRODUCT,
  PUT_UPDATE_PRODUCT_ROUTE,
} from "@/constants/api-routes";
import { getSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { EditVariantRoute, ProductRoute } from "@/constants/route";
import ProductImages from "../../ui/ProductImages";
import UploadImageModal from "../UploadImageModal";
import { isInteger } from "@/libs/helper";
import { FaDongSign, FaTrash } from "react-icons/fa6";
import { GetProductDetailResponse } from "@/app/api/products/products.type";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { COMPARE_PRICE_INFO, COST_PRICE_INFO } from "@/constants/text";
import { ProductVariant } from "./FormCreateProduct";
import ProductVariantEditModal from "../ProductVariantEditModal";
import ProductNewVariantEditModal from "../ProductNewVariantEditModal";
import ConfirmModal from "../ConfirmModal";

const TextEditor = dynamic(() => import("../../common/TextEditor"), {
  ssr: false,
});

const EditProductSchema = z.object({
  name: z
    .string({ required_error: "Chưa nhập tên sản phẩm" })
    .min(1, { message: "Chưa nhập tên sản phẩm" }),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  avaiable: z.boolean(),
  vendor: z.string().optional(),
  type: z.string().optional(),
  addTags: z.array(z.string()),
  deleteTags: z.array(z.string()),
  deleteCategoryIds: z.array(z.number()).optional(),
  addCategoryIds: z.array(z.number()).optional(),
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
  options: z
    .array(
      z.object({
        id: z.number(),
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
});

type EditProductField = z.infer<typeof EditProductSchema>;

// type SelectedWarehouse = { id: number; name: string; onHand: number };

// type Warehouse = Pick<SelectedWarehouse, "id" | "name">;

type ProductOption = {
  id: number;
  position: number;
  name: string;
  values: Array<string>;
};

type Variant = GetProductDetailResponse["variants"][number];

export type NewVariant = Omit<ProductVariant, "warehouses">;

type Props = {
  product: GetProductDetailResponse;
};

const FormEditProduct = ({ product }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [openShortDesc, setOpenShortDesc] = useState(
    !!product.shortDescription
  );
  const [openAddImage, setOpenAddImage] = useState(false);
  const [options, setOptions] = useImmer<ProductOption[]>(product.options);
  const [variants, setVariants] = useImmer<Variant[]>(product.variants);
  const [newVariants, setNewVariants] = useImmer<NewVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<NewVariant>();
  const [variantEditOpen, setVariantEditOpen] = useState(false);
  const [deleteVariants, setDeleteVariants] = useState<
    GetProductDetailResponse["variants"]
  >([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const inputTimeoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();

  const {
    handleSubmit,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitted, isValid, submitCount, isDirty },
  } = useForm<EditProductField>({
    resolver: zodResolver(EditProductSchema),
    defaultValues: {
      avaiable: product.avaiable,
      name: product.name,
      description: product.description ?? undefined,
      shortDescription: product.shortDescription ?? undefined,
      sellPrice: product.sellPrice,
      costPrice: product.costPrice,
      comparePrice: product.comparePrice,
      options: product.options,
    },
  });

  const onSubmit: SubmitHandler<EditProductField> = async (fieldData) => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const res = await fetch(`${PUT_UPDATE_PRODUCT_ROUTE}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...fieldData,
          deleteVariantIds: deleteVariants.map((item) => item.id),
          id: product.id,
          newVariants,
        }),
      });
      setIsLoading(false);

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message ?? "Đã cập nhật thông tin sản phẩm");
        setDeleteVariants([]);
        setNewVariants([]);
        location.reload();
        return;
      }

      throw new Error(data.error);
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
    }
  };

  useEffect(() => {
    updateVariants();
  }, [options]);

  const updateVariants = useCallback(() => {
    setNewVariants(() => {
      const result = options.reduce<NewVariant[]>((previosVariant, option) => {
        const newVariants: NewVariant[] = [];

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

            const findVariant = product.variants.find(
              (item) =>
                item.option1 === newVariant.option1 &&
                item.option2 === newVariant.option2 &&
                item.option3 === newVariant.option3
            );

            if (!findVariant) {
              newVariants.push(newVariant);
            }
          });
        }

        // Khi chưa có variant nào
        if (previosVariant.length === 0) {
          option.values.forEach((value, index) => {
            const skuCode = product.skuCode
              ? `${product.skuCode}-${index}`
              : `${index}`;

            const newVariant: NewVariant = {
              title: value,
              comparePrice: getValues("comparePrice"),
              sellPrice: getValues("sellPrice"),
              costPrice: getValues("costPrice"),
              // warehouses: getValues("warehouses"),
              barCode: undefined,
              skuCode: skuCode,
              unit: product.unit ?? undefined,
              option1: value,
              option2: "",
              option3: "",
            };
            const findVariant = product.variants.find(
              (item) =>
                item.option1 === newVariant.option1 &&
                item.option2 === newVariant.option2 &&
                item.option3 === newVariant.option3
            );

            if (!findVariant) {
              newVariants.push(newVariant);
            }
          });
        }

        return newVariants;
      }, []);
      console.log("result", result);

      return result;
    });
  }, [options]);

  const handleDeleteProduct = async () => {
    try {
      setIsDeleteLoading(true);
      const session = await getSession();
      const res = await fetch(`${DELETE_PRODUCT}/${product.id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
      });

      const response = await res.json();
      setIsDeleteLoading(false);

      if (res.ok) {
        toast.success(response.message);
        router.push(ProductRoute);
      }

      throw new Error(response.message);
    } catch (error: any) {
      setIsDeleteLoading(false);
      toast.error(error.message);
    }
  };

  const countVariantOnhand = useCallback(
    (
      inventories: {
        onHand: number;
        avaiable: number;
        warehouse: { id: number; name: string };
      }[]
    ) => {
      let total = 0;
      for (const inv of inventories) {
        total += inv.onHand;
      }
      return total;
    },
    []
  );

  const handleDeleteOptionValue = useCallback(
    (value: string, position: number) => {
      setOptions((options) => {
        const index = options.findIndex((op) => op.position === position);

        if (index === -1) return options;

        if (options[index].values.length === 1) {
          toast.error("Mỗi thuộc tính phải có ít nhất 1 giá trị");
          return;
        }

        setDeleteVariants((variants) => {
          const deleteVariants = product.variants.filter(
            (variant) =>
              variant[
                `option${position}` as keyof GetProductDetailResponse["variants"][0]
              ] === value
          );
          return [...variants, ...deleteVariants];
        });

        const valueIndex = options[index].values.findIndex((v) => v === value);
        options[index].values.splice(valueIndex, 1);
        return options;
      });
    },
    [options]
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

  const handleCategoryChange = useCallback((category: Category[]) => {
    const addedCat = category.filter(
      (cat) => !product.categories.find((c) => c.id === cat.id)
    );
    const deletedCat = product.categories.filter(
      (cat) => !category.find((c) => c.id === cat.id)
    );

    setValue(
      "addCategoryIds",
      addedCat.map((c) => c.id),
      { shouldDirty: true, shouldTouch: true }
    );

    setValue(
      "deleteCategoryIds",
      deletedCat.map((c) => c.id),
      { shouldDirty: true, shouldTouch: true }
    );
  }, []);

  const handleTagChange = useCallback((tags: string[]) => {
    const addedTags = tags.filter(
      (tag) => !product.tags.find((pTag) => pTag === tag)
    );
    const deletedTags = product.tags.filter(
      (tag) => !tags.find((pTag) => pTag === tag)
    );

    setValue("addTags", addedTags, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setValue("deleteTags", deletedTags, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, []);

  // const handlePriceChange = useCallback(
  //   (value: string, field: "sellPrice" | "costPrice" | "comparePrice") => {
  //     if (value === "") setValue(field, 0);
  //     else
  //       setValue(field, parseInt(value), {
  //         shouldValidate: true,
  //       });
  //   },
  //   []
  // );

  const handleVariantClick = useCallback((variant: NewVariant) => {
    setSelectedVariant(variant);
    setVariantEditOpen(true);
  }, []);

  const handleSaveVariant = useCallback((newVariant: NewVariant) => {
    setNewVariants((variants) => {
      const index = variants.findIndex((variant) => {
        return variant.title === newVariant.title;
      });

      if (index === -1) return variants;

      variants[index] = newVariant;
      return variants;
    });
  }, []);

  const handleCancelVariantChange = () => {
    setOptions(product.options);
    setDeleteVariants([]);
    setNewVariants([]);
  };

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
        // toast.error(firstErrorField);
        toast.error(messageToDisplay);
      }
    }
  }, [submitCount]);

  useEffect(() => {
    setValue("options", options, { shouldValidate: true });
  }, [options]);

  return (
    <>
      <form
        className="flex gap-4 flex-wrap"
        id="EditProductForm"
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

              <div className="col-12">
                <TextEditor
                  label="Mô tả"
                  placeholder="Nhập mô tả sản phẩm"
                  defaultValue={getValues("description")}
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
                  defaultValue={getValues("shortDescription")}
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

          {/* <GroupBox title="Thông tin giá">
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
          </GroupBox> */}

          <RenderIf condition={options.length > 0}>
            <GroupBox
              title="Thuộc tính"
              titleEndContent={
                <RenderIf
                  condition={
                    deleteVariants.length > 0 || newVariants.length > 0
                  }
                >
                  <span
                    className="label-link"
                    onClick={handleCancelVariantChange}
                  >
                    Hủy thay đổi
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
                            // isInvalid={
                            //   errors?.options?.[index]?.name ? true : false
                            // }
                            // errorMessage={errors?.options?.[index]?.name?.message}
                            // endContent={
                            //   <div className="text-gray-400 hover:text-gray-700 hover:cursor-pointer">
                            //     <FaTrash
                            //       size={16}
                            //       onClick={() =>
                            //         handleDeleteOption(option.position)
                            //       }
                            //     />
                            //   </div>
                            // }
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

              {/* <RenderIf condition={options.length > 0 && options.length < 3}>
                <div className="flex gap-2 items-center">
                  <FiPlusCircle className="text-blue-500" />
                  <span className="label-link" onClick={handleAddOption}>
                    Thêm thuộc tính
                  </span>
                </div>
              </RenderIf> */}
            </GroupBox>
          </RenderIf>

          <RenderIf condition={newVariants.length > 0}>
            <GroupBox title="Phiên bản thêm mới">
              <div className="text-base py-4 px-2 flex items-center border-y-1 border-gray-200">
                <span className="font-semibold">
                  {newVariants.length} phiên bản
                </span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {newVariants.map((variant) => (
                  <div
                    key={variant.title}
                    className="py-4 px-2 flex justify-between border-b-1 border-gray-200 hover:bg-gray-100 hover:cursor-pointer items-center text-sm"
                    onClick={() => handleVariantClick(variant)}
                  >
                    <div className="flex flex-col gap-2">
                      <span>
                        {variant.title !== "Default Title"
                          ? variant.title
                          : "Mặc định"}
                      </span>
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
                    </div>
                  </div>
                ))}
              </div>
            </GroupBox>
          </RenderIf>

          <RenderIf condition={variants.length > 0}>
            <GroupBox title="Phiên bản">
              <div className="text-base py-4 px-2 flex items-center border-y-1 border-gray-200">
                <span className="font-semibold">
                  {variants.length} phiên bản
                </span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {variants.map((variant) => (
                  <div
                    key={variant.title}
                    onClick={() =>
                      router.push(EditVariantRoute(product.id, variant.id))
                    }
                    className={cn(
                      "py-4 px-2 flex justify-between  items-center text-sm",
                      "hover:bg-gray-100 hover:cursor-pointer",
                      "border-b-1 border-gray-200",
                      {
                        "bg-red-200 hover:bg-red-200 line-through":
                          deleteVariants
                            .map((item) => item.id)
                            .includes(variant.id),
                      }
                    )}
                  >
                    <div className="flex flex-col gap-2">
                      <span>
                        {variant.title !== "Default Title"
                          ? variant.title
                          : "Mặc định"}
                      </span>
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
                        <strong>
                          {countVariantOnhand(variant.inventories)}
                        </strong>{" "}
                        tại{" "}
                        <strong>{`${variant.inventories.length} kho`}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* <div className="flex justify-between text-sm items-center py-4">
                <span>Tổng tồn kho</span>
                <span>Có thể bán: {totalVariantsOnHand}</span>
              </div> */}
            </GroupBox>
          </RenderIf>
        </div>

        <div className="basis-[300px] flex-1 w-[300px]">
          <div className="flex flex-col gap-4">
            <GroupBox
              title="Ảnh sản phẩm"
              titleEndContent={
                <span
                  className="label-link"
                  onClick={() => setOpenAddImage(true)}
                >
                  Thêm ảnh
                </span>
              }
            >
              <ProductImages product={product} />
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
                defaultSelected={product.categories}
                onSelectChange={handleCategoryChange}
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
              onValueChange={handleTagChange}
              defaultValue={product.tags}
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
          onClick={() => {
            setDeleteConfirm(true);
          }}
        >
          Xóa
        </Button>
        <Button
          isDisabled={isLoading || isDeleteLoading}
          isLoading={isLoading}
          radius="sm"
          type="submit"
          form="EditProductForm"
          color="primary"
        >
          Lưu
        </Button>
      </div>

      <UploadImageModal
        productId={product.id}
        isOpen={openAddImage}
        onOpenChange={(open) => setOpenAddImage(open)}
      />

      <RenderIf condition={variantEditOpen}>
        <ProductNewVariantEditModal
          variant={selectedVariant}
          isOpen={variantEditOpen}
          onOpenChange={(open) => setVariantEditOpen(open)}
          onSave={handleSaveVariant}
        />
      </RenderIf>

      {deleteConfirm && (
        <ConfirmModal
          isOpen={deleteConfirm}
          onOpenChange={(open) => setDeleteConfirm(open)}
          onConfirm={handleDeleteProduct}
          title="Xác nhận xóa"
        >
          Xác nhận xóa sản phẩm ?. Hành động này không thể hoàn tác
        </ConfirmModal>
      )}
    </>
  );
};

export default FormEditProduct;
