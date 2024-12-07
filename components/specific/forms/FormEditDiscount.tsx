"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { GroupBox } from "@/components/ui/GroupBox";
import RenderIf from "@/components/ui/RenderIf";
import { CurrencyFormatter } from "@/libs/format-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  cn,
  DatePicker,
  Divider,
  Input,
  Radio,
  RadioGroup,
  Image,
  Accordion,
  AccordionItem,
  Textarea,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaDongSign, FaPercent, FaX } from "react-icons/fa6";
import { useImmer } from "use-immer";
import { isDirty, z } from "zod";
import { IoIosWarning } from "react-icons/io";
import { CalendarDate, now, today } from "@internationalized/date";
import { convertDateToString } from "@/libs/helper";
import { ProductResponse } from "@/app/api/products/products.type";
import CategoriesSearch, {
  Category,
} from "@/components/common/CategoriesSearch";
import ProductSelector from "../search_selector/ProductSelector";
import NextImage from "next/image";
import { ImagePlaceholderPath } from "@/constants/filepath";
import Link from "next/link";
import {
  EditDiscountRoute,
  ProductDetailRoute,
  ProductRoute,
} from "@/constants/route";
import { CreateDiscount, UpdateDiscount } from "@/app/api/discount";
import { getSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { DetailDiscount } from "@/app/api/discount/discount.type";

type Props = {
  discount: DetailDiscount;
};

const Schema = z
  .object({
    id: z.number(),
    title: z
      .string({ required_error: "Chưa nhập mã khuyến mại" })
      .min(6, { message: "Mã khuyến mại tối thiểu 6 kí tự" })
      .max(100, { message: "Mã giảm giá dài tối đa 100 kí tự" }),
    description: z.string().max(500, { message: "Mô tả dài tối đa 500 kí tự" }),
    value: z
      .number({
        required_error: "Chưa nhập giá trị",
        invalid_type_error: "Giá trị không hợp lệ",
      })
      .positive({ message: "Giá trị giảm phải lớn hơn 0" }),
    valueLimitAmount: z
      .number({
        required_error: "Chưa nhập giá trị",
        invalid_type_error: "Giá trị không hợp lệ",
      })
      .nonnegative({ message: "Giá trị không thể âm" })
      .nullable(),
    valueType: z.enum(["percent", "value", "flat"], {
      message: "Loại giảm giá không hợp lệ",
    }),
    prerequisite: z.string(),
    prerequisiteCustomerGroupIds: z.array(z.number()),
    prerequisiteMinTotal: z
      .number({
        required_error: "Chưa nhập giá trị",
        invalid_type_error: "Giá trị không hợp lệ",
      })
      .nonnegative("Giá trị phải lớn hơn 0")
      .min(1000, "Giá trị nhỏ nhất là 1000đ")
      .max(1e12, "Giá trị quá lớn")
      .nullable(),
    prerequisiteMinItem: z
      .number({
        required_error: "Chưa nhập giá trị",
        invalid_type_error: "Giá trị không hợp lệ",
      })
      .nonnegative("Giá trị phải lớn hơn 0")
      .min(2, "Tối thiếu từ 2 sản phẩm")
      .max(99, "Giá trị lớn nhất là 99")
      .nullable(),
    prerequisiteMinItemTotal: z
      .number({
        required_error: "Chưa nhập giá trị",
        invalid_type_error: "Giá trị không hợp lệ",
      })
      .nonnegative("Giá trị phải lớn hơn 0")
      .min(1000, "Giá trị nhỏ nhất là 1000đ")
      .max(1e12, "Giá trị quá lớn")
      .nullable(),
    usageLimit: z
      .number({
        required_error: "Chưa nhập giá trị",
        invalid_type_error: "Giá trị không hợp lệ",
      })
      .min(1, "Giá trị nhỏ nhất là 1")
      .max(1e6, "Giá trị quá lớn")
      .nullable(),
    onePerCustomer: z.boolean(),
    combinesWithProductDiscount: z.boolean(),
    combinesWithOrderDiscount: z.boolean(),
    startOn: z.date(),
    endOn: z.date().nullable(),
    summary: z.string(),
    entitle: z.string(),
    entitledProductIds: z.array(z.number()),
    entitledVariantIds: z.array(z.number()),
    entitledCategoriesIds: z.array(z.number()),
    applyFor: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.valueType === "percent") {
      if (data.value > 100)
        ctx.addIssue({
          message: "Giá trị giảm không quá 100 %",
          path: ["value"],
          code: z.ZodIssueCode.custom,
        });
      if (data.valueLimitAmount && data.valueLimitAmount > 1e12)
        ctx.addIssue({
          message: "Giá trị giảm quá lớn",
          path: ["valueLimitAmount"],
          code: z.ZodIssueCode.custom,
        });
    }

    if (data.valueType === "value") {
      if (data.value > 1e12)
        ctx.addIssue({
          message: "Giá trị quá lớn",
          path: ["value"],
          code: z.ZodIssueCode.custom,
        });
    }

    if (data.endOn && data.startOn > data.endOn) {
      ctx.addIssue({
        message: "Ngày bắt đầu phải trước ngày kết thúc",
        path: ["startOn"],
        code: z.ZodIssueCode.custom,
      });
    }

    if (
      data.applyFor === "entitledProduct" &&
      (data.entitledProductIds.length === 0 ||
        data.entitledVariantIds.length === 0)
    ) {
      ctx.addIssue({
        message: "Chưa chọn sản phẩm/phiên bản áp dụng",
        path: ["entitledProductIds"],
        code: z.ZodIssueCode.custom,
      });
    }

    if (
      data.applyFor === "entitledCategory" &&
      data.entitledCategoriesIds.length === 0
    ) {
      ctx.addIssue({
        message: "Chưa chọn danh mục áp dụng",
        path: ["entitledCategoryIds"],
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type UpdateDiscountData = z.infer<typeof Schema>;

type SummaryData = {
  type: "order" | "product";
  value: number;
  valueType: "percent" | "value" | "flat";
  valueLimit: number | null;
  prerequisiteMinItem: number | null;
  prerequisiteMinTotal: number | null;
  prerequisiteMinItemTotal: number | null;
  usageLimit: number | null;
  onePerCustomer: boolean;
  combinesWithOrderDiscount: boolean;
  combinesWithProductDiscount: boolean;
  startOn: Date;
  endOn: Date | null;
  entitledCategories: number;
  entitledVariants: number;
  entitle: string;
};

type Summary = {
  type?: string | null;
  value?: string | null;
  prerequisite?: string | null;
  customer?: string | null;
  usageLimit?: string | null;
  onePerCustomer?: string | null;
  combine?: string | null;
  time?: string | null;
};

const FormEditDiscount = ({ discount }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [valueClass, setValueClass] = useState<string>(() => {
    return discount.valueType === "flat" ? discount.valueType : "discount";
  });
  const [summary, setSummary] = useImmer<Summary>({});
  const [isLoading, setIsLoading] = useState(false);
  const [entitledProducts, setEntitledProducts] = useImmer<
    DetailDiscount["products"]
  >(discount.products);
  const [entitledVariants, setEntitledVariants] = useImmer<
    DetailDiscount["variants"]
  >(discount.variants);

  const [entitledCategories, setEntitledCategories] = useImmer<
    DetailDiscount["categories"]
  >(discount.categories);

  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors, submitCount, isValid, isSubmitted, isDirty },
  } = useForm<UpdateDiscountData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      id: discount.id,
      title: discount.title,
      description: discount.description,
      value: discount.value,
      valueType: discount.valueType as "value" | "flat" | "percent",
      valueLimitAmount: discount.valueLimitAmount,
      prerequisite: discount.prerequisite,
      prerequisiteCustomerGroupIds: [],
      prerequisiteMinItem: discount.prerequisiteMinItem,
      prerequisiteMinTotal: discount.prerequisiteMinTotal,
      prerequisiteMinItemTotal: discount.prerequisiteMinItemTotal,
      usageLimit: discount.usageLimit,
      onePerCustomer: discount.onePerCustomer,
      combinesWithOrderDiscount: discount.combinesWithOrderDiscount,
      combinesWithProductDiscount: discount.combinesWithProductDiscount,
      startOn: new Date(discount.startOn),
      endOn: discount.endOn ? new Date(discount.endOn) : null,
      entitle: discount.entitle,
      entitledProductIds: discount.products.map((item) => item.id),
      entitledVariantIds: discount.variants.map((item) => item.id),
      entitledCategoriesIds: discount.categories.map((item) => item.id),
      applyFor: discount.applyFor,
    },
    mode: "onChange",
  });

  useEffect(() => {
    updateSummary({
      type: discount.type as "order" | "product",
      value: getValues("value"),
      valueType: getValues("valueType"),
      valueLimit: getValues("valueLimitAmount"),
      combinesWithProductDiscount: getValues("combinesWithProductDiscount"),
      combinesWithOrderDiscount: getValues("combinesWithOrderDiscount"),
      startOn: getValues("startOn"),
      endOn: getValues("endOn"),
      onePerCustomer: getValues("onePerCustomer"),
      prerequisiteMinItem: getValues("prerequisiteMinItem"),
      prerequisiteMinTotal: getValues("prerequisiteMinTotal"),
      prerequisiteMinItemTotal: getValues("prerequisiteMinItemTotal"),
      usageLimit: getValues("usageLimit"),
      entitledCategories: getValues("entitledCategoriesIds").length,
      entitledVariants: getValues("entitledVariantIds").length,
      entitle: getValues("entitle"),
    });
  }, [
    watch("value"),
    watch("valueType"),
    watch("valueLimitAmount"),
    watch("combinesWithProductDiscount"),
    watch("combinesWithOrderDiscount"),
    watch("startOn"),
    watch("endOn"),
    watch("onePerCustomer"),
    watch("prerequisiteMinItem"),
    watch("prerequisiteMinTotal"),
    watch("prerequisiteMinItemTotal"),
    watch("usageLimit"),
    watch("entitledCategoriesIds"),
    watch("entitledVariantIds"),
    watch("entitle"),
  ]);

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

  useEffect(() => {
    handlePrerequisiteChange();
  }, [watch("prerequisite")]);

  useEffect(() => {
    setValue("summary", Object.values(summary).join(" * "));
  }, [summary]);

  useEffect(() => {
    setValue(
      "entitledCategoriesIds",
      entitledCategories.map((item) => item.id)
    );
    setValue(
      "entitledProductIds",
      entitledProducts.map((item) => item.id)
    );
    setValue(
      "entitledVariantIds",
      entitledVariants.map((item) => item.id)
    );
  }, [entitledProducts, entitledCategories, entitledVariants]);

  const handleValueTypeChange = useCallback(
    (valueType: "percent" | "value") => {
      setValue("valueType", valueType);
      setValue("value", 0);

      if (valueType === "percent") {
        setValue("valueLimitAmount", 0);
      }
      if (valueType === "value") {
        setValue("valueLimitAmount", null);
      }
    },
    []
  );

  const handleUsageLimitChange = useCallback((isSelected: boolean) => {
    if (isSelected)
      setValue("usageLimit", discount.usageLimit ? discount.usageLimit : 1);
    else setValue("usageLimit", null);
  }, []);

  const handlePrerequisiteChange = useCallback(() => {
    switch (getValues("prerequisite")) {
      case "none":
        setValue("prerequisiteMinItem", null);
        setValue("prerequisiteMinTotal", null);
        setValue("prerequisiteMinItemTotal", null);
        break;
      case "prerequisiteMinTotal":
        setValue("prerequisiteMinItem", null);
        setValue("prerequisiteMinItemTotal", null);

        setValue("prerequisiteMinTotal", discount.prerequisiteMinTotal ?? 1000);
        break;
      case "prerequisiteMinItem":
        setValue("prerequisiteMinItem", discount.prerequisiteMinItem ?? 2);
        setValue("prerequisiteMinItemTotal", null);

        setValue("prerequisiteMinTotal", null);
        break;
      case "prerequisiteMinItemTotal":
        setValue(
          "prerequisiteMinItemTotal",
          discount.prerequisiteMinItemTotal ?? 1000
        );
        setValue("prerequisiteMinItem", null);
        setValue("prerequisiteMinTotal", null);
    }
  }, [watch("prerequisite")]);

  const handleEndCheckboxChange = useCallback((isSelected: boolean) => {
    if (isSelected) {
      setValue("endOn", null);
    } else {
      setValue("endOn", now("Asia/Ho_Chi_Minh").toDate());
    }
  }, []);

  const handleEntitledChange = useCallback(
    (value: "all" | "entitledProduct" | "entitledCategory") => {
      switch (value) {
        case "all":
          setEntitledProducts([]);
          setEntitledVariants([]);
          setEntitledCategories([]);
          break;
        case "entitledProduct":
          setEntitledProducts(
            discount.entitle === "entitledProduct" ? discount.products : []
          );
          setEntitledVariants(
            discount.entitle === "entitledProduct" ? discount.variants : []
          );
          setEntitledCategories([]);
          break;
        case "entitledCategory":
          setEntitledCategories(
            discount.entitle === "entitledCategory" ? discount.categories : []
          );
          setEntitledProducts([]);
          setEntitledVariants([]);
          break;
      }
      setValue("entitle", value);
      setValue("applyFor", value);
    },
    []
  );

  const handleRemoveEntitleProduct = useCallback(
    (id: number) => {
      setEntitledProducts((entitledProducts) =>
        entitledProducts.filter((item) => item.id !== id)
      );
      setEntitledVariants((entitledVariants) =>
        entitledVariants.filter((item) => item.productId !== id)
      );
    },
    [entitledProducts, entitledVariants]
  );

  const handleRemoveEntitleVariant = useCallback(
    (id: number) => {
      setEntitledVariants((entitledVariants) =>
        entitledVariants.filter((item) => item.id !== id)
      );
    },
    [entitledProducts, entitledVariants]
  );

  const updateSummary = useCallback((data: SummaryData) => {
    const {
      type,
      combinesWithOrderDiscount,
      combinesWithProductDiscount,
      endOn,
      onePerCustomer,
      prerequisiteMinItem,
      prerequisiteMinTotal,
      prerequisiteMinItemTotal,
      startOn,
      usageLimit,
      value,
      valueLimit,
      valueType,
      entitledCategories,
      entitledVariants,
      entitle,
    } = data;
    const newSummary: Summary = {};

    switch (type) {
      case "order":
        newSummary.type = "Giảm giá đơn hàng";
        break;
      case "product":
        newSummary.type = "Giảm giá sản phẩm";
        break;
    }

    switch (valueType) {
      case "percent":
        newSummary.value = `Giảm ${value}%`;
        break;
      case "value":
        newSummary.value = `Giảm ${CurrencyFormatter().format(value)}`;
        break;
      case "flat":
        newSummary.value = `Đồng giá ${CurrencyFormatter().format(value)}`;
        break;
    }

    if (valueLimit && valueLimit > 0) {
      newSummary.value += `, tối đa ${CurrencyFormatter().format(valueLimit)}`;
    }

    if (entitle === "all") {
      newSummary.value += ` cho toàn bộ đơn hàng`;
    }

    if (entitledCategories > 0 && entitle === "entitledCategory") {
      newSummary.value += ` áp dụng cho ${entitledCategories} danh mục`;
    }

    if (entitledVariants > 0 && entitle === "entitledProduct") {
      newSummary.value += ` áp dụng cho ${entitledVariants} phiên bản sản phẩm`;
    }

    if (prerequisiteMinItem) {
      newSummary.prerequisite = `Tổng số sản phẩm để khuyến mại phải tối thiểu là ${prerequisiteMinItem}`;
    }

    if (prerequisiteMinItemTotal) {
      newSummary.prerequisite = `Tổng giá trị sản phẩm được khuyến mại phải tối thiểu là ${CurrencyFormatter().format(
        prerequisiteMinItemTotal
      )}`;
    }

    if (prerequisiteMinTotal) {
      newSummary.prerequisite = `Giá trị đơn hàng tối thiểu để khuyến mại là ${CurrencyFormatter().format(
        prerequisiteMinTotal
      )}`;
    }

    if (true) {
      newSummary.customer = "Áp dụng cho tất cả khách hàng";
    }

    if (usageLimit) {
      newSummary.usageLimit = `Mã giảm giá có thể sử dụng ${usageLimit} lần`;
    }
    if (onePerCustomer) {
      newSummary.onePerCustomer = "Mỗi khách hàng chỉ sử dụng 1 lần";
    }

    const combines = [];
    if (combinesWithOrderDiscount) combines.push("giảm giá đơn hàng");
    if (combinesWithProductDiscount) combines.push("giảm giá sản phẩm");
    if (combines.length > 0) {
      newSummary.combine = `Có thể kết hợp với ${combines.join(", ")}`;
    } else {
      newSummary.combine = `Không kết hợp với giảm giá khác`;
    }

    newSummary.time = `Bắt đầu từ ${convertDateToString(startOn, {
      getTime: false,
    })}`;

    if (endOn) {
      newSummary.time += ` tới ${convertDateToString(endOn, {
        getTime: false,
      })}`;
    }

    setSummary(newSummary);
  }, []);

  const handleSelectProduct = useCallback(
    (product: ProductResponse) => {
      const findIndex = entitledProducts.findIndex(
        (item) => item.id === product.id
      );
      if (findIndex === -1) {
        setEntitledProducts((entitledProducts) => {
          entitledProducts.push(product);
          return entitledProducts;
        });
        setEntitledVariants((entitledVariants) => {
          entitledVariants.push(...product.variants);
        });
      }
    },
    [entitledProducts, entitledVariants]
  );

  const onSubmit: SubmitHandler<UpdateDiscountData> = async (data) => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const { message } = await UpdateDiscount(data, session?.accessToken);
      setIsLoading(false);
      toast.success(message ?? "Tạo khuyến mại thành công");
      // router.refresh();
      // router.replace(pathname);
      location.reload();
    } catch (error: any) {
      console.log("Error", error);
      toast.error(error.message ?? "Đã xảy ra lỗi");
    }
  };

  return (
    <>
      <form
        className="flex flex-wrap gap-4"
        id="CreateDiscount"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex-[3] basis-[600px] max-w-full flex flex-col gap-4">
          <RenderIf condition={discount.mode === "coupon"}>
            <GroupBox title="Mã khuyến mại">
              <Input
                isRequired
                radius="sm"
                variant="bordered"
                label={"Mã khuyến mại"}
                labelPlacement="outside"
                maxLength={100}
                placeholder="VD: COUPON10"
                isInvalid={!!errors.title}
                errorMessage={errors.title?.message}
                value={getValues("title")}
                {...register("title")}
              />
              <Textarea
                variant="bordered"
                label={"Mô tả"}
                labelPlacement="outside"
                placeholder="Nhập mô tả khuyến mại"
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
                minRows={5}
                maxRows={5}
                className="mt-2"
                {...register("description")}
              />
            </GroupBox>
          </RenderIf>

          <RenderIf condition={discount.mode === "promotion"}>
            <GroupBox title="Chương trình khuyến mại">
              <Input
                isRequired
                radius="sm"
                variant="bordered"
                label={"Tên chương trình khuyến mại"}
                labelPlacement="outside"
                maxLength={100}
                placeholder="VD: Chương trình khuyến mại T6"
                isInvalid={!!errors.title}
                errorMessage={errors.title?.message}
                value={getValues("title")}
                {...register("title")}
              />

              <Textarea
                variant="bordered"
                label={"Mô tả"}
                labelPlacement="outside"
                placeholder="Nhập mô tả khuyến mại"
                radius="sm"
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
                minRows={5}
                maxRows={5}
                className="mt-2"
                {...register("description")}
              />
            </GroupBox>
          </RenderIf>

          <GroupBox title="Giá trị">
            <RadioGroup
              value={valueClass}
              onValueChange={(value) => {
                setValueClass(value);
                if (value === "discount") setValue("valueType", "value");
                if (value === "flat") setValue("valueType", "flat");
                setValue("value", 0, { shouldValidate: true });
              }}
            >
              <RenderIf condition={discount.mode === "promotion"}>
                <Radio value={"discount"}>Giảm giá</Radio>
              </RenderIf>

              <RenderIf condition={valueClass === "discount"}>
                <div className="flex flex-wrap gap-y-4 -mx-2 [&>*]:px-2">
                  <div className="col-12">
                    <ButtonGroup radius="sm" variant="bordered">
                      <Button
                        color={
                          watch("valueType") === "value" ? "primary" : "default"
                        }
                        onClick={() => handleValueTypeChange("value")}
                      >
                        Số tiền
                      </Button>
                      <Button
                        color={
                          watch("valueType") === "percent"
                            ? "primary"
                            : "default"
                        }
                        onClick={() => handleValueTypeChange("percent")}
                      >
                        %
                      </Button>
                    </ButtonGroup>
                  </div>
                  <div className="col-4">
                    <Input
                      label="Giá trị giảm"
                      labelPlacement="outside"
                      type="number"
                      variant="bordered"
                      radius="sm"
                      isInvalid={!!errors.value}
                      errorMessage={errors.value?.message}
                      value={watch("value").toString()}
                      endContent={
                        watch("valueType") === "value" ? (
                          <FaDongSign />
                        ) : (
                          <FaPercent />
                        )
                      }
                      {...register("value", { valueAsNumber: true })}
                    />
                  </div>
                  <RenderIf condition={getValues("valueType") === "percent"}>
                    <div className="col-4">
                      <Input
                        label="Giá trị giảm tối đa"
                        labelPlacement="outside"
                        type="number"
                        variant="bordered"
                        radius="sm"
                        isInvalid={!!errors.valueLimitAmount}
                        errorMessage={errors.valueLimitAmount?.message}
                        endContent={<FaDongSign />}
                        {...register("valueLimitAmount", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </RenderIf>
                </div>
              </RenderIf>

              <RenderIf
                condition={
                  discount.mode === "promotion" && discount.type === "product"
                }
              >
                <Radio value={"flat"}>Đồng giá</Radio>
              </RenderIf>

              <RenderIf condition={valueClass === "flat"}>
                <div className="flex flex-wrap gap-y-4 -mx-2 [&>*]:px-2">
                  <div className="col-4">
                    <Input
                      label="Giá trị đồng giá"
                      labelPlacement="outside"
                      type="number"
                      variant="bordered"
                      radius="sm"
                      isInvalid={!!errors.value}
                      errorMessage={errors.value?.message}
                      value={watch("value").toString()}
                      endContent={<FaDongSign />}
                      {...register("value", { valueAsNumber: true })}
                    />
                  </div>
                  <RenderIf condition={getValues("valueType") === "percent"}>
                    <div className="col-4">
                      <Input
                        label="Giá trị giảm tối đa"
                        labelPlacement="outside"
                        type="number"
                        variant="bordered"
                        radius="sm"
                        isInvalid={!!errors.valueLimitAmount}
                        errorMessage={errors.valueLimitAmount?.message}
                        endContent={<FaDongSign />}
                        {...register("valueLimitAmount", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </RenderIf>
                </div>
              </RenderIf>
            </RadioGroup>
            <RenderIf condition={discount.type === "product"}>
              <RadioGroup
                label="Áp dụng cho"
                className="mt-2"
                classNames={{ label: "font-medium text-black" }}
                value={watch("entitle")}
                onValueChange={(value) =>
                  handleEntitledChange(
                    value as "all" | "entitledProduct" | "entitledCategory"
                  )
                }
              >
                <Radio value={"all"}>Tất cả sản phẩm</Radio>
                <Radio value={"entitledProduct"}>Sản phẩm</Radio>
                <RenderIf condition={watch("entitle") === "entitledProduct"}>
                  <ProductSelector onSelectionChange={handleSelectProduct} />
                </RenderIf>
                <RenderIf
                  condition={
                    entitledProducts.length > 0 &&
                    watch("entitle") === "entitledProduct"
                  }
                >
                  <div className="max-h-[500px] overflow-y-auto">
                    <Accordion>
                      {entitledProducts.map((product) => (
                        <AccordionItem
                          key={product.id}
                          startContent={
                            <div className="flex gap-3 items-center text-xs">
                              <Image
                                as={NextImage}
                                height={40}
                                width={40}
                                src={product.image ?? ImagePlaceholderPath}
                                className={cn(
                                  "rounded-md border-1 border-gray-500"
                                )}
                                alt=""
                              />
                              <div className="flex flex-col gap-1">
                                <Link
                                  href={ProductDetailRoute(product.id)}
                                  target="_blank"
                                >
                                  <span className="font-medium label-link">
                                    {product.name}
                                  </span>
                                </Link>
                              </div>
                              <div
                                className="p-1 rounded-full hover:bg-gray-100 hover:cursor-pointer"
                                onClick={() =>
                                  handleRemoveEntitleProduct(product.id)
                                }
                              >
                                <FaX />
                              </div>
                            </div>
                          }
                        >
                          <div className="pl-10 flex flex-col">
                            {entitledVariants
                              .filter((item) => item.productId === product.id)
                              .map((variant) => (
                                <div
                                  className="py-1 border-b-1 border-gray-100 flex justify-between"
                                  key={variant.id}
                                >
                                  <span>{variant.title}</span>
                                  <div
                                    className="p-2 flex justify-center items-center rounded-full hover:bg-gray-100 hover:cursor-pointer"
                                    onClick={() =>
                                      handleRemoveEntitleVariant(variant.id)
                                    }
                                  >
                                    <FaX size={10} />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </RenderIf>
                <Radio value={"entitledCategory"}>Danh mục sản phẩm</Radio>
                <RenderIf condition={watch("entitle") === "entitledCategory"}>
                  <CategoriesSearch
                    onSelectChange={(categories) =>
                      setEntitledCategories(categories)
                    }
                    defaultSelected={entitledCategories}
                  />
                </RenderIf>
              </RadioGroup>
            </RenderIf>
          </GroupBox>

          <GroupBox title="Điều kiện áp dụng">
            <RadioGroup
              value={getValues("prerequisite")}
              onValueChange={(value) => setValue("prerequisite", value)}
            >
              <Radio value={"none"}>Không có</Radio>
              <Radio value={"prerequisiteMinTotal"}>
                Tổng giá trị đơn hàng tối thiểu
              </Radio>
              <RenderIf
                condition={watch("prerequisite") === "prerequisiteMinTotal"}
              >
                <Input
                  radius="sm"
                  className="w-1/2 min-w-10"
                  variant="bordered"
                  endContent={<FaDongSign />}
                  isInvalid={!!errors.prerequisiteMinTotal}
                  errorMessage={errors.prerequisiteMinTotal?.message}
                  value={watch("prerequisiteMinTotal")?.toString()}
                  {...register("prerequisiteMinTotal", {
                    valueAsNumber: true,
                  })}
                />
              </RenderIf>
              <RenderIf condition={discount.type === "product"}>
                <Radio value={"prerequisiteMinItemTotal"}>
                  Tổng giá trị sản phẩm được khuyến mại tối thiểu
                </Radio>
                <RenderIf
                  condition={
                    watch("prerequisite") === "prerequisiteMinItemTotal"
                  }
                >
                  <Input
                    radius="sm"
                    className="w-1/2 min-w-10"
                    variant="bordered"
                    endContent={<FaDongSign />}
                    isInvalid={!!errors.prerequisiteMinTotal}
                    errorMessage={errors.prerequisiteMinTotal?.message}
                    value={watch("prerequisiteMinItemTotal")?.toString()}
                    {...register("prerequisiteMinItemTotal", {
                      valueAsNumber: true,
                    })}
                  />
                </RenderIf>
              </RenderIf>
              <Radio value={"prerequisiteMinItem"}>
                Tổng số lượng sản phẩm được khuyến mại tối thiểu
              </Radio>
              <RenderIf
                condition={watch("prerequisite") === "prerequisiteMinItem"}
              >
                <Input
                  radius="sm"
                  className="w-1/2 min-w-10"
                  variant="bordered"
                  isInvalid={!!errors.prerequisiteMinItem}
                  errorMessage={errors.prerequisiteMinItem?.message}
                  value={watch("prerequisiteMinItem")?.toString()}
                  {...register("prerequisiteMinItem", {
                    valueAsNumber: true,
                  })}
                />
              </RenderIf>
            </RadioGroup>
          </GroupBox>

          <GroupBox title="Nhóm khách hàng">
            <RadioGroup value={"all"}>
              <Radio value={"all"}>Tất cả</Radio>
              <Radio value={"customer"} isDisabled>
                Nhóm khách hàng đã lưu
              </Radio>
            </RadioGroup>
          </GroupBox>

          <RenderIf condition={discount.mode === "coupon"}>
            <GroupBox title="Giới hạn sử dụng">
              <div className="flex flex-col gap-1">
                <Checkbox
                  key={"usageLimit"}
                  value={"usageLimit"}
                  isSelected={watch("usageLimit") !== null}
                  onValueChange={handleUsageLimitChange}
                >
                  Giới hạn sử dụng
                </Checkbox>
                <RenderIf condition={watch("usageLimit") !== null}>
                  <Input
                    className="min-w-[150px] w-1/3"
                    radius="sm"
                    variant="bordered"
                    type="number"
                    isInvalid={!!errors.usageLimit}
                    errorMessage={errors.usageLimit?.message}
                    {...register("usageLimit", { valueAsNumber: true })}
                  />
                </RenderIf>
                <Checkbox
                  key={"onePerCustomer"}
                  value={"onePerCustomer"}
                  onValueChange={(isSelected) =>
                    setValue("onePerCustomer", isSelected)
                  }
                  isSelected={watch("onePerCustomer")}
                >
                  Giới hạn mỗi khách hàng chỉ sử dụng mã giảm giá này 1 lần
                </Checkbox>
              </div>
            </GroupBox>
          </RenderIf>

          <GroupBox title="Kết hợp khuyến mại">
            <Alert variant={"warning"}>
              <IoIosWarning />
              <AlertTitle>
                Lưu ý việc kết hợp có thể tạo ra giảm giá lớn trong đơn
              </AlertTitle>
              <AlertDescription>
                Hãy thử trước một số kết hợp khuyến mại của bạn. Nếu giá trị
                giảm giá quá lớn, bạn có thể điều chỉnh các loại giảm giá được
                áp dụng với nhau
              </AlertDescription>
            </Alert>
            <div className="my-2 font-medium">
              Mã khuyến mại có thể kết hợp khuyến mại với:
            </div>
            <div className="flex flex-col gap-2">
              <Checkbox
                isSelected={watch("combinesWithOrderDiscount")}
                onValueChange={(isSelected) =>
                  setValue("combinesWithOrderDiscount", isSelected)
                }
              >
                <div className="flex flex-col">
                  <span>Giảm giá đơn hàng</span>
                  {/* <span className="text-sm text-gray-500">
                    Không có giảm giá đơn hàng được thiết lập để kết hợp
                  </span> */}
                </div>
              </Checkbox>
              <Checkbox
                isSelected={watch("combinesWithProductDiscount")}
                onValueChange={(isSelected) =>
                  setValue("combinesWithProductDiscount", isSelected)
                }
              >
                <div className="flex flex-col">
                  <span>Giảm giá sản phẩm</span>
                  {/* <span className="text-sm text-gray-500">
                    Không có giảm giá đơn hàng được thiết lập để kết hợp
                  </span> */}
                </div>
              </Checkbox>
            </div>
          </GroupBox>

          <GroupBox title="Thời gian">
            <div className="flex gap-y-4 -mx-2 [&>*]:px-2 flex-wrap">
              <DatePicker
                className="col-6"
                variant="bordered"
                radius="sm"
                minValue={today("Asia/Ho_Chi_Minh")}
                value={
                  new CalendarDate(
                    watch("startOn").getFullYear(),
                    watch("startOn").getMonth() + 1,
                    watch("startOn").getDate()
                  )
                }
                showMonthAndYearPickers
                hideTimeZone
                onChange={(value) =>
                  setValue("startOn", value.toDate("Asia/Ho_Chi_Minh"), {
                    shouldValidate: true,
                  })
                }
                isInvalid={!!errors.startOn}
                errorMessage={errors.startOn?.message}
              />

              <DatePicker
                className="col-6"
                variant="bordered"
                radius="sm"
                minValue={today("Asia/Ho_Chi_Minh")}
                value={(() => {
                  const date = watch("endOn");
                  return date
                    ? new CalendarDate(
                        date.getFullYear(),
                        date.getMonth() + 1,
                        date.getDate()
                      )
                    : undefined;
                })()}
                showMonthAndYearPickers
                hideTimeZone
                isDisabled={!watch("endOn")}
                onChange={(value) =>
                  setValue("endOn", value.toDate("Asia/Ho_Chi_Minh"), {
                    shouldValidate: true,
                  })
                }
              />
              <div className="col-12">
                <Checkbox
                  onValueChange={handleEndCheckboxChange}
                  isSelected={!watch("endOn")}
                >
                  Không có ngày kết thúc
                </Checkbox>
              </div>
            </div>
          </GroupBox>
        </div>
        <div className="flex-[1] basis-[400px] max-w-full flex flex-col gap-4 relative">
          <div className="sticky top-5">
            <GroupBox title="Tổng quan khuyến mại">
              <div className="mx-4">
                <div
                  className={cn(
                    "flex items-center justify-center relative",
                    "px-2 py-6 rounded-t-2xl bg-blue-50 text-xl font-medium",
                    "border-b-2 border-dashed border-gray-500",
                    "before:content-[''] before:w-10 before:h-10 before:bg-black before:absolute before:block",
                    "before:rounded-full before:-left-4 before:-bottom-5 before:bg-white",
                    "after:content-[''] after:w-10 after:h-10 after:bg-black after:absolute after:block",
                    "after:rounded-full after:-right-4 after:-bottom-5 after:bg-white"
                  )}
                >
                  <span className="text-center">
                    {watch("title")
                      ? watch("title")
                      : discount.mode === "coupon"
                      ? "Mã khuyến mại"
                      : "Chương trình khuyến mại"}
                  </span>
                </div>
                <div className="bg-gray-100 rounded-b-lg pt-6 px-8 pb-4">
                  <ul className="list-disc [&>li]:py-1">
                    {Object.values(summary).map((value) => (
                      <li key={value}>{value}</li>
                    ))}
                  </ul>
                </div>
                <RenderIf condition={discount.mode === "coupon"}>
                  <div className="py-2 px-3 mt-3 bg-green-100 text-green-500 rounded-lg border-1 border-green-500">
                    <span>{`Mã đã được sử dụng ${discount.usage} lần`}</span>
                  </div>
                </RenderIf>
              </div>
            </GroupBox>
          </div>
        </div>
      </form>

      <Divider className="my-5" />

      <div className="flex justify-end items-center ">
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          color="primary"
          type="submit"
          radius="sm"
          form="CreateDiscount"
        >
          Lưu
        </Button>
      </div>
    </>
  );
};
export default FormEditDiscount;
