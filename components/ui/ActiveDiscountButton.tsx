"use client";
import { UpdateDiscountActice } from "@/app/api/discount";
import { Button } from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineLightBulb } from "react-icons/hi";
import { MdDoNotDisturbAlt } from "react-icons/md";

type Props = {
  discountId: number;
  active: boolean;
};

const ActiveDiscountButton = ({ discountId, active }: Props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = async () => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const { message } = await UpdateDiscountActice(
        discountId,
        !active,
        session?.accessToken
      );
      setIsLoading(false);

      toast.success(message ?? "Đã cập nhật trạng thái");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="light"
      radius="sm"
      isDisabled={isLoading}
      isLoading={isLoading}
      startContent={active ? <MdDoNotDisturbAlt /> : <HiOutlineLightBulb />}
      onClick={handleOnClick}
    >
      <span className="font-medium">
        {active ? "Ngừng kích hoạt" : "Kích hoạt"}
      </span>
    </Button>
  );
};
export default ActiveDiscountButton;
