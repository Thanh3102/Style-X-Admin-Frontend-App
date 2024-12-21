"use client";
import { Button, DateInput, Input, Radio, RadioGroup } from "@nextui-org/react";
import { z } from "zod";
import { nameRegex } from "@/constants/regex";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Employee } from "@/app/api/employee/employee.type";
import { useRouter } from "next/navigation";
import { UpdateEmployee } from "@/app/api/employee";
import { useState } from "react";
import ChangePasswordButton from "@/components/ui/ChangePasswordButton";

type Props = {
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

export type UpdateEmployeeData = z.infer<typeof UpdateEmployeeSchema>;

const FormUpdateUserInfo = ({ employee }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateEmployeeData>({
    resolver: zodResolver(UpdateEmployeeSchema),
    defaultValues: {
      id: employee.id,
      gender: employee.gender ? 1 : 0,
      dateOfBirth: new Date(employee.dateOfBirth),
      email: employee.email,
      name: employee.name,
      phoneNumber: employee.phoneNumber,
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<UpdateEmployeeData> = async (data) => {
    try {
      setIsLoaded(true);
      const session = await getSession();
      const { message } = await UpdateEmployee(data, session?.accessToken);
      toast.success(message);
      router.refresh();
      setIsLoaded(false);
    } catch (error: any) {
      setIsLoaded(false);

      toast.error(error.message);
    }
  };

  return (
    <div className="p-5 border-1 border-black rounded-md shadow-md">
      <form
        className="flex -mx-2 [&>*]:px-2 gap-y-4 flex-wrap"
        id="FormUpdateUserInfo"
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
      </form>
      <div className="w-full flex justify-between items-center">
        <ChangePasswordButton />
        <Button
          radius="sm"
          color="primary"
          isLoading={isLoaded}
          isDisabled={isLoaded || !isDirty}
          type="submit"
          form="FormUpdateUserInfo"
        >
          Lưu
        </Button>
      </div>
    </div>
  );
};
export default FormUpdateUserInfo;
