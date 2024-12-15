"use client";
import { confirmDelivery, ConfirmPayment, DeleteOrder } from "@/app/api/order";
import { OrdersRoute } from "@/constants/route";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  orderId: string;
};

const OrderDeleteButton = ({ orderId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const router = useRouter();

  const handleConfirm = async (onClose: () => void) => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const { message } = await DeleteOrder(orderId, session?.accessToken);
      setIsLoading(false);
      toast.success(message);
      router.push(OrdersRoute);
      onClose();
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Button color="danger" radius="sm" size="sm" onClick={onOpen}>
        Xóa đơn hàng
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="sm"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Xác nhận xóa đơn hàng</ModalHeader>
              <ModalBody>
                <span>
                  Bạn có chắc chắn muốn xóa đơn hàng ? (Không thể hoàn tác)
                </span>
              </ModalBody>
              <ModalFooter>
                <div className="flex gap-2">
                  <Button
                    radius="sm"
                    variant="bordered"
                    onClick={onClose}
                    isDisabled={isLoading}
                  >
                    Hủy
                  </Button>
                  <Button
                    radius="sm"
                    color="danger"
                    onClick={() => handleConfirm(onClose)}
                    isLoading={isLoading}
                    isDisabled={isLoading}
                  >
                    Xác nhận
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
export default OrderDeleteButton;
