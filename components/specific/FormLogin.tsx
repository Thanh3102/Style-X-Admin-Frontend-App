"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Input } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaKey, FaUser } from "react-icons/fa6";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Không thể để trống" }),
  password: z.string().min(1, { message: "Không thể để trống" }),
  isRemember: z.boolean(),
});

type LoginField = z.infer<typeof loginSchema>;

const FormLogin = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginField>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      isRemember: false,
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<LoginField> = async (data) => {
    setLoading(true);
    const result = await signIn("credentials", {
      username: data.username,
      password: data.password,
      isRemember: data.isRemember,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      toast.error(result ? result.error : "Đã xảy ra lỗi", {
        position: "top-center",
        duration: 1000,
      });
      setLoading(false);
      reset();
    }
  };

  return (
    <form
      className="bg-white p-5 rounded-lg min-w-[400px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="font-bold text-3xl">Đăng nhập</h1>
      <div className="flex flex-col gap-4 mt-6">
        <Input
          type="text"
          label="Tên đăng nhập"
          variant="faded"
          labelPlacement="outside"
          radius="sm"
          placeholder="Nhập tên đăng nhập"
          endContent={<FaUser />}
          isReadOnly={isLoading}
          isInvalid={errors.username ? true : false}
          errorMessage={errors.username?.message}
          classNames={{
            label: "font-semibold text-base",
          }}
          {...register("username")}
        />
        <Input
          type="password"
          label="Mật khẩu"
          variant="faded"
          description="Không chia sẻ mật khẩu với bất kì ai"
          labelPlacement="outside"
          radius="sm"
          placeholder="Nhập mật khẩu"
          endContent={<FaKey />}
          isReadOnly={isLoading}
          isInvalid={errors.password ? true : false}
          errorMessage={errors.password?.message}
          classNames={{
            label: "font-semibold text-base",
          }}
          {...register("password")}
        />
        <Checkbox {...register("isRemember")}>Ghi nhớ đăng nhập</Checkbox>
        <Button type="submit" color="primary" radius="sm" isLoading={isLoading}>
          Đăng nhập
        </Button>
      </div>
    </form>
  );
};

export default FormLogin;
