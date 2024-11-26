"use client";
import {
  Button,
  Input,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  Select,
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
import { PUT_UPDATE_PRODUCT_ROUTE } from "@/constants/api-routes";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EditVariantRoute, ProductRoute } from "@/constants/route";
import ProductImages from "../../ui/ProductImages";
import UploadImageModal from "../UploadImageModal";
import { isInteger } from "@/libs/helper";
import { FaTrash } from "react-icons/fa6";
import { GetProductDetailResponse } from "@/app/api/products/products.type";

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
});

type EditProductField = z.infer<typeof EditProductSchema>;

type SelectedWarehouse = { id: number; name: string; onHand: number };

type Warehouse = Pick<SelectedWarehouse, "id" | "name">;

type ProductOption = {
  position: number;
  name: string;
  values: Array<string>;
};

type Variant = GetProductDetailResponse["variants"][number];

type Props = {
  product: GetProductDetailResponse;
};

const FormEditProduct = ({ product }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [openShortDesc, setOpenShortDesc] = useState(false);
  const [openAddImage, setOpenAddImage] = useState(false);
  const [options, setOptions] = useImmer<ProductOption[]>(product.options);
  const [variants, setVariants] = useImmer<Variant[]>(product.variants);
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
      // options: product.options,
    },
  });

  const onSubmit: SubmitHandler<EditProductField> = async (fieldData) => {
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
        id: product.id,
      }),
    });
    setIsLoading(false);

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message ?? "Đã cập nhật thông tin sản phẩm");
      router.refresh();
      return;
    }

    toast.error(data.error ?? "Đã xảy ra lỗi");
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

  // useEffect(() => {
  //   setValue("options", options, { shouldValidate: true });
  // }, [options]);

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
                          // isInvalid={
                          //   errors?.options?.[index]?.name ? true : false
                          // }
                          // errorMessage={errors?.options?.[index]?.name?.message}
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
                          // isInvalid={
                          //   errors?.options?.[index]?.values ? true : false
                          // }
                          // errorMessage={
                          //   errors?.options?.[index]?.values?.message
                          // }
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
                  onClick={() =>
                    router.push(EditVariantRoute(product.id, variant.id))
                  }
                  className="py-4 px-2 flex justify-between border-b-1 border-gray-200 hover:bg-gray-100 hover:cursor-pointer items-center text-sm"
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
                      <strong>{countVariantOnhand(variant.inventories)}</strong>{" "}
                      tại <strong>{`${variant.inventories.length} kho`}</strong>
                    </span>
                  </div>
                </div>
              ))}
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
          onClick={() => {}}
        >
          Xóa
        </Button>
        <Button
          isDisabled={isLoading || isDeleteLoading || !isDirty}
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
    </>
  );
};

export default FormEditProduct;
