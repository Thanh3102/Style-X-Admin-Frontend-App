import { CreateWarehouse } from "@/app/api/warehouses";
import {
  DistrictSelector,
  ProvinceSelector,
  WardSelector,
} from "@/components/ui/LocationSelector";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type Props = {
  onClose: () => void;
};

const CreateWarehouseSchema = z.object({
  name: z.string().min(1, "Chưa nhập tên kho hàng"),
  email: z.string().email("Email không đúng định dạng"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Số điện thoại không đúng định dạng"),
  province: z.string({ required_error: "Chưa chọn giá trị" }),
  district: z.string({ required_error: "Chưa chọn giá trị" }),
  ward: z.string({ required_error: "Chưa chọn giá trị" }),
  address: z.string().min(1, "Chưa nhập địa chỉ"),
});

type CreateWarehouseField = z.infer<typeof CreateWarehouseSchema>;

const FormCreateWarehouse = ({ onClose }: Props) => {
  const router = useRouter();
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWarehouseField>({
    resolver: zodResolver(CreateWarehouseSchema),
  });

  const onSubmit: SubmitHandler<CreateWarehouseField> = async (data) => {
    try {
      const session = await getSession();
      const { message } = await CreateWarehouse(data, session?.accessToken);
      toast.success(message);
      router.refresh();
      onClose();
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi. Vui lòng thử lại");
    }
  };

  return (
    <form
      className="flex flex-wrap mx-2 [&>*]:px-2 gap-y-4"
      id="FormCreateWarehouse"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Tên kho hàng"
        placeholder="Nhập tên kho hàng"
        labelPlacement="outside"
        radius="sm"
        variant="bordered"
        className="w-full min-w-[200px]"
        maxLength={200}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Email"
        placeholder="Nhập email"
        labelPlacement="outside"
        radius="sm"
        variant="bordered"
        className="w-1/2 min-w-[200px]"
        maxLength={200}
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        labelPlacement="outside"
        radius="sm"
        variant="bordered"
        className="w-1/2 min-w-[200px]"
        maxLength={200}
        isInvalid={!!errors.phoneNumber}
        errorMessage={errors.phoneNumber?.message}
        {...register("phoneNumber")}
      />
      <ProvinceSelector
        onOptionChange={(option) =>
          option && setValue("province", option, { shouldValidate: true })
        }
        isInvalid={!!errors.province}
        errorMessage={errors.province?.message}
        className="w-1/3 min-w-[200px]"
      />

      <DistrictSelector
        provinceName={watch("province")}
        onOptionChange={(option) =>
          option && setValue("district", option, { shouldValidate: true })
        }
        isInvalid={!!errors.district}
        errorMessage={errors.district?.message}
        className="w-1/3 min-w-[200px]"
      />

      <WardSelector
        provinceName={watch("province")}
        districtName={watch("district")}
        onOptionChange={(option) =>
          option && setValue("ward", option, { shouldValidate: true })
        }
        isInvalid={!!errors.ward}
        errorMessage={errors.ward?.message}
        className="w-1/3 min-w-[200px]"
      />
      <Input
        label="Địa chỉ cụ thể"
        placeholder="Nhập địa chỉ"
        labelPlacement="outside"
        radius="sm"
        variant="bordered"
        className="w-full min-w-[200px]"
        maxLength={200}
        isInvalid={!!errors.address}
        errorMessage={errors.address?.message}
        {...register("address")}
      />
    </form>
  );
};
export default FormCreateWarehouse;
