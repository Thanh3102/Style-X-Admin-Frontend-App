"use client";
import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

import { FiPlusCircle } from "react-icons/fi";

import { cn } from "@/lib/utils";

import { ReactNode, useState } from "react";
import { FaBox } from "react-icons/fa6";
import { MdOutlineReceiptLong } from "react-icons/md";
import { useRouter } from "next/navigation";
import {
  CreateCoupouDiscountRoute,
  CreatePromotionDiscountRoute,
} from "@/constants/route";

const CreateDiscountButton = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [discountMode, setDiscountMode] = useState<"coupon" | "promotion">(
    "coupon"
  );

  const router = useRouter();

  const handleClick = (type: "order" | "product") => {
    switch (discountMode) {
      case "coupon":
        router.push(`${CreateCoupouDiscountRoute}?type=${type}`);
        break;
      case "promotion":
        router.push(`${CreatePromotionDiscountRoute}?type=${type}`);
        break;
    }
  };

  const discountTypes: Array<{
    title: string;
    description: string;
    icon: ReactNode;
    onClick: () => void;
  }> = [
    {
      title: "Giảm giá đơn hàng",
      description: "VD: Giảm giá 20% cho các đơn hàng từ 100,000đ",
      icon: <MdOutlineReceiptLong size={20} />,
      onClick: () => handleClick("order"),
    },
    {
      title: "Giảm giá sản phẩm",
      description: "VD: Giảm giá 15% sản phẩm Áo phông trong đơn",
      icon: <FaBox size={20} />,
      onClick: () => handleClick("product"),
    },
  ];

  return (
    <>
      <Button
        color="primary"
        radius="sm"
        onClick={onOpen}
        className="font-medium"
        startContent={<FiPlusCircle />}
      >
        Tạo khuyến mại
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{ closeButton: "top-[0.75rem]" }}
      >
        <ModalContent className="min-w-[50vw]">
          {(onClose) => (
            <>
              <ModalHeader>Tạo khuyến mại</ModalHeader>
              <ModalBody>
                <div className="py-5 border-y-1 border-gray-300">
                  <ButtonGroup variant="bordered" radius="sm">
                    <Button
                      onClick={() => setDiscountMode("coupon")}
                      color={discountMode === "coupon" ? "primary" : "default"}
                    >
                      Mã giảm giá
                    </Button>
                    <Button
                      onClick={() => setDiscountMode("promotion")}
                      color={
                        discountMode === "promotion" ? "primary" : "default"
                      }
                    >
                      Chương trình khuyến mại
                    </Button>
                  </ButtonGroup>
                  <div className="flex gap-y-4 flex-wrap -mx-2 [&>*]:px-2 mt-4">
                    {discountTypes.map((item) => (
                      <div className="col-6" key={item.title}>
                        <div
                          className={cn(
                            "flex gap-2 items-center justify-center",
                            "p-2 border-1 border-gray-500 rounded-lg shadow-sm",
                            "hover:bg-blue-100 hover:cursor-pointer hover:border-blue-500",
                            "h-[100px]"
                          )}
                          onClick={item.onClick}
                        >
                          <div className="p-5 bg-blue-100 flex items-center justify-center rounded-md">
                            {item.icon}
                          </div>
                          <div className="flex flex-col gap-1 text-sm">
                            <span className="font-medium">{item.title}</span>
                            <span className="text-gray-500">
                              {item.description}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="justify-end flex">
                  <Button
                    variant="bordered"
                    color="primary"
                    radius="sm"
                    onClick={onClose}
                  >
                    Hủy
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateDiscountButton;
