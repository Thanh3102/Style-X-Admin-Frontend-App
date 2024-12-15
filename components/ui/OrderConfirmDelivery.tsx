"use client";
import { confirmDelivery } from "@/app/api/order";
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

const OrderConfirmDelivery = ({ orderId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [isSendEmail, setIsSendEmail] = useState(true);
  const router = useRouter();

  const handleConfirm = async (onClose: () => void) => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const { message } = await confirmDelivery(
        {
          orderId: orderId,
          isSendEmail: isSendEmail,
        },
        session?.accessToken
      );
      setIsLoading(false);
      toast.success(message);
      router.refresh();
      onClose();
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Button color="primary" radius="sm" size="sm" onClick={onOpen}>
        Xác nhận giao hàng
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
              <ModalHeader>Xác nhận đơn hàng đã giao hàng</ModalHeader>
              <ModalBody>
                <span>
                  Bạn có chắc chắn muốn đánh dấu đơn hàng này đã được giao không
                  ?
                </span>
                <Checkbox
                  isSelected={isSendEmail}
                  onValueChange={setIsSendEmail}
                >
                  Gửi thông báo email tới khách hàng
                </Checkbox>
              </ModalBody>
              <ModalFooter>
                <div className="flex gap-2">
                  <Button
                    radius="sm"
                    variant="bordered"
                    color="primary"
                    onClick={onClose}
                    isDisabled={isLoading}
                  >
                    Hủy
                  </Button>
                  <Button
                    radius="sm"
                    color="primary"
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
export default OrderConfirmDelivery;
