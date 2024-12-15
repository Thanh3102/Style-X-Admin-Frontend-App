"use client";
import { CancelOrder } from "@/app/api/order";
import {
  Button,
  Checkbox,
  Input,
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

const OrderCancelButton = ({ orderId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [isReStock, setIsReStock] = useState(true);
  const [reason, setReason] = useState<string>();
  const router = useRouter();

  const handleConfirm = async (onClose: () => void) => {
    try {
      if (!reason) {
        toast.error("Chưa nhập lý do hủy đơn");
        return;
      }
      setIsLoading(true);
      const session = await getSession();
      const { message } = await CancelOrder(
        {
          orderId: orderId,
          isReStock: isReStock,
          reason: reason,
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
      <Button
        color="danger"
        radius="sm"
        size="sm"
        variant="light"
        onClick={onOpen}
      >
        Hủy đơn
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
              <ModalHeader>Xác nhận hủy đơn hàng</ModalHeader>
              <ModalBody>
                {/* <span>Bạn có chắc chắn muốn hủy đơn hàng ?</span> */}
                <Input
                  label="Lý do"
                  placeholder="Nhập lý do hủy đơn"
                  labelPlacement="outside"
                  variant="bordered"
                  radius="sm"
                  maxLength={300}
                  value={reason}
                  onValueChange={setReason}
                  description="Hành động này sẽ không thể hoàn tác"
                />
                <Checkbox isSelected={isReStock} onValueChange={setIsReStock}>
                  Hoàn trả hàng về kho
                </Checkbox>
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
export default OrderCancelButton;
