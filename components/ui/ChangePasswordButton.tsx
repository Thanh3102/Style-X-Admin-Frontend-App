"use client";

import { CHANGE_PASSWORD_ROUTE } from "@/constants/api-routes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const ChangePasswordSchema = z
  .object({
    oldPassword: z
      .string({
        required_error: "Chưa nhập mật khẩu cũ",
      })
      .min(1, "Chưa nhập giá trị"),
    newPassword: z
      .string({
        required_error: "Chưa nhập mật khẩu mới",
      })
      .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Mật khẩu mới phải chứa ít nhất một chữ hoa, một chữ số và một ký tự đặc biệt"
      ),
    confirmPassword: z.string({
      required_error: "Chưa nhập lại mật khẩu mới",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        message: "Mật khẩu mới không khớp",
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
      });
    }
  });

type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;

const ChangePasswordButton = () => {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit: SubmitHandler<ChangePasswordData> = async (data) => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const res = await fetch(CHANGE_PASSWORD_ROUTE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      setIsLoading(false);
      if (res.ok) {
        toast.success(response.message);
        onClose();
        reset();
        return;
      }
      throw new Error(response.message);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <span className="label-link" onClick={onOpen}>
        Đổi mật khẩu
      </span>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Đổi mật khẩu</ModalHeader>
          <ModalBody>
            <form
              className="flex flex-col gap-3"
              id="FormChangePassword"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                label="Mật khẩu cũ"
                placeholder="Nhập mật khẩu cũ"
                type="password"
                radius="sm"
                variant="bordered"
                labelPlacement="outside"
                isInvalid={!!errors.oldPassword}
                errorMessage={errors.oldPassword?.message}
                {...register("oldPassword")}
              />
              <Input
                label="Mật khẩu mới"
                type="password"
                placeholder="Nhập mật khẩu mới"
                radius="sm"
                variant="bordered"
                labelPlacement="outside"
                isInvalid={!!errors.newPassword}
                errorMessage={errors.newPassword?.message}
                {...register("newPassword")}
              />
              <Input
                label="Nhập lại mật khẩu mới"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                radius="sm"
                variant="bordered"
                labelPlacement="outside"
                isInvalid={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </form>
          </ModalBody>
          <ModalFooter className="flex gap-5">
            <Button
              radius="sm"
              variant="bordered"
              color="primary"
              onClick={onClose}
            >
              Đóng
            </Button>
            <Button
              radius="sm"
              color="primary"
              type="submit"
              form="FormChangePassword"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Lưu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ChangePasswordButton;
