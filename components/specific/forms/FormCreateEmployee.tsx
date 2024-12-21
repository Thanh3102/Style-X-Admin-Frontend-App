import {
  DateInput,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Role } from "../RoleTab";
import { z } from "zod";
import { nameRegex } from "@/constants/regex";
import { getLocalTimeZone, today } from "@internationalized/date";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEmployee } from "@/app/api/employee";
import { getSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  roles: Role[];
  onClose: () => void;
};

const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);

const minDate = new Date("1900-01-01");

const CreateEmployeeSchema = z.object({
  name: z
    .string({ required_error: "Chưa nhập họ tên" })
    .min(1, "Chưa nhập giá trị")
    .regex(nameRegex, "Họ tên chỉ chứa chữ cái và khoảng trắng"),
  roleId: z.number({ required_error: "Chưa chọn vai trò" }),
  email: z
    .string({ required_error: "Chưa nhập email" })
    .email("Email không đúng định dạng"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Số điện thoại không hợp lệ"),
  gender: z.number(),
  dateOfBirth: z
    .date({
      required_error: "Chưa chọn ngày sinh",
      invalid_type_error: "Ngày sinh không hợp lệ",
    })
    .min(minDate, "Ngày sinh không thể sớm hơn 1/1/1900")
    .max(todayDate, "Ngày sinh không thể quá hiện tại"),
});

export type CreateEmployeeData = z.infer<typeof CreateEmployeeSchema>;

const FormCreateEmployee = ({ roles,onClose }: Props) => {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEmployeeData>({
    resolver: zodResolver(CreateEmployeeSchema),
    defaultValues: {
      gender: 0,
    },
  });

  const router = useRouter()

  const onSubmit: SubmitHandler<CreateEmployeeData> = async (data) => {
    try {
      const session = await getSession();
      const { message } = await createEmployee(data, session?.accessToken);
      toast.success(message);
      router.refresh()
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form
      className="flex -mx-2 [&>*]:px-2 gap-y-4 flex-wrap"
      id="FormCreateEmployee"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Họ tên"
        placeholder="Nhập họ tên"
        labelPlacement="outside"
        variant="bordered"
        radius="sm"
        className="w-1/2"
        maxLength={50}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        {...register("name")}
      />

      <Select
        label="Vai trò"
        labelPlacement="outside"
        variant="bordered"
        radius="sm"
        className="w-1/2"
        placeholder="Chọn vai trò"
        disallowEmptySelection
        selectionMode="single"
        onSelectionChange={(key) =>
          setValue("roleId", Number(Array.from(key as Set<string>)[0]), {
            shouldValidate: true,
          })
        }
        isInvalid={!!errors.roleId}
        errorMessage={errors.roleId?.message}
      >
        {roles.map((role) => (
          <SelectItem key={role.id}>{role.name}</SelectItem>
        ))}
      </Select>

      <Input
        label="Email"
        placeholder="Nhập email"
        labelPlacement="outside"
        variant="bordered"
        radius="sm"
        className="w-1/2"
        max={100}
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        labelPlacement="outside"
        variant="bordered"
        radius="sm"
        className="w-1/2"
        max={10}
        isInvalid={!!errors.phoneNumber}
        errorMessage={errors.phoneNumber?.message}
        {...register("phoneNumber")}
      />

      <DateInput
        label={"Ngày sinh"}
        variant="bordered"
        radius="sm"
        labelPlacement="outside"
        maxValue={today(getLocalTimeZone())}
        isInvalid={!!errors.dateOfBirth}
        errorMessage={errors.dateOfBirth?.message}
        className="w-1/2"
        onChange={(dateValue) =>
          setValue("dateOfBirth", dateValue.toDate(getLocalTimeZone()), {
            shouldValidate: true,
          })
        }
      />

      <RadioGroup
        size="sm"
        orientation="horizontal"
        label="Giới tính"
        className="w-1/2"
        classNames={{
          label: "text-black text-sm",
          wrapper: "gap-5 h-full",
        }}
        defaultValue={getValues("gender").toString()}
        onValueChange={(value) => setValue("gender", parseInt(value))}
      >
        <Radio value="0">Nam</Radio>
        <Radio value="1">Nữ</Radio>
      </RadioGroup>
    </form>
  );
};
export default FormCreateEmployee;
