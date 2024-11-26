"use client";
import { DeleteDiscount, UpdateDiscountActice } from "@/app/api/discount";
import { DiscountsRoute } from "@/constants/route";
import { Button, useDisclosure } from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa6";
import { HiOutlineLightBulb } from "react-icons/hi";
import { MdDoNotDisturbAlt } from "react-icons/md";
import ConfirmModal from "../specific/ConfirmModal";

type Props = {
  discountId: number;
};

const DeleteDiscountButton = ({ discountId }: Props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const handleOnClick = async () => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const { message } = await DeleteDiscount(
        discountId,
        session?.accessToken
      );
      setIsLoading(false);

      toast.success(message ?? "Đã xóa khuyến mại");
      router.push(DiscountsRoute);
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="light"
        radius="sm"
        isDisabled={isLoading}
        isLoading={isLoading}
        startContent={<FaTrash />}
        onClick={onOpen}
        color="danger"
      >
        <span className="font-medium">Xóa khuyến mại</span>
      </Button>
      <ConfirmModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Xác nhận xóa"
        onConfirm={() => handleOnClick()}
      >
        Hành động này không thể hoàn tác. Bạn có chắc muốn xóa khuyến mại
      </ConfirmModal>
    </>
  );
};
export default DeleteDiscountButton;
