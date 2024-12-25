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
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEmployee, UpdateEmployee } from "@/app/api/employee";
import { getSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Employee } from "@/app/api/employee/employee.type";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { GET_ROLES_ROUTE } from "@/constants/api-routes";

type Props = {
  onClose: () => void;
  employee: Employee;
};

const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);

const minDate = new Date("1900-01-01");

const UpdateEmployeeSchema = z.object({
  id: z.number(),
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
  isEmployed: z.boolean(),
});

export type UpdateEmployeeData = z.infer<typeof UpdateEmployeeSchema>;

const FormUpdateEmployee = ({ employee, onClose }: Props) => {
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = useCallback(async () => {
    try {
      const session = await getSession();
      const res = await fetch(GET_ROLES_ROUTE, {
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      });
      const response = await res.json();

      if (res.ok) {
        setRoles(response as Role[]);
      }
    } catch (error: any) {
      setRoles([]);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, []);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateEmployeeData>({
    resolver: zodResolver(UpdateEmployeeSchema),
    defaultValues: {
      id: employee.id,
      gender: employee.gender ? 1 : 0,
      dateOfBirth: new Date(employee.dateOfBirth),
      email: employee.email,
      isEmployed: employee.isEmployed,
      name: employee.name,
      phoneNumber: employee.phoneNumber,
      roleId: employee.roleId,
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<UpdateEmployeeData> = async (data) => {
    try {
      const session = await getSession();
      const { message } = await UpdateEmployee(data, session?.accessToken);
      toast.success(message);
      router.refresh();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form
      className="flex -mx-2 [&>*]:px-2 gap-y-4 flex-wrap"
      id="FormUpdateEmployee"
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
        defaultSelectedKeys={[employee.roleId.toString()]}
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
        defaultValue={
          new CalendarDate(
            getValues("dateOfBirth").getFullYear(),
            getValues("dateOfBirth").getMonth() + 1,
            getValues("dateOfBirth").getDate()
          )
        }
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
        value={getValues("gender").toString()}
        onValueChange={(value) => setValue("gender", parseInt(value))}
      >
        <Radio value="0">Nam</Radio>
        <Radio value="1">Nữ</Radio>
      </RadioGroup>

      <Select
        label="Trạng thái làm việc"
        labelPlacement="outside"
        variant="bordered"
        radius="sm"
        className="w-1/2"
        disallowEmptySelection
        selectionMode="single"
        defaultSelectedKeys={getValues("isEmployed") ? ["true"] : ["false"]}
        onSelectionChange={(key) =>
          setValue("isEmployed", Array.from(key as Set<string>)[0] === "true")
        }
      >
        <SelectItem key={"true"}>Đang làm việc</SelectItem>
        <SelectItem key={"false"}>Ngừng làm việc</SelectItem>
      </Select>
    </form>
  );
};
export default FormUpdateEmployee;
