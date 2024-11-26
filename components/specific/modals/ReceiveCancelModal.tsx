"use client";
import { ReceiveInventoryDetail } from "@/app/api/receive-inventory/receive-inventory.type";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";

import { useState } from "react";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";
import { PUT_CANCEL_RECEIVE_INVENTORY, PUT_IMPORT_ITEMS } from "@/constants/api-routes";
import { useRouter } from "next/navigation";

type Props = {
  receiveInventory: ReceiveInventoryDetail;
} & Omit<ModalProps, "children">;

const ReceiveCancalModal = ({ receiveInventory, ...props }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReturnItem, setIsReturnItem] = useState(false);
  const router = useRouter();

  const handleSave = async (onClose: () => void) => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const res = await fetch(PUT_CANCEL_RECEIVE_INVENTORY, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          receiveId: receiveInventory.id,
          returnItem: isReturnItem
        }),
      });

      const response = await res.json();
      setIsLoading(false);

      if (res.ok) {
        toast.success(response.message ?? "Đã hủy đơn nhập");
        router.refresh();
        onClose();
        return;
      } else {
        toast.error(response.error ?? "Đã xảy ra lỗi");
      }
    } catch (error) {}
  };

  return (
    <Modal {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <span>
                Xác nhận hủy đơn{" "}
                <span className="font-medium">{receiveInventory.code}</span>
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2">
                <span>
                  Hành động này không thể hoàn tác. Bạn có chắc muốn hủy đơn ?
                </span>
                <Checkbox
                  isSelected={isReturnItem}
                  onValueChange={setIsReturnItem}
                >
                  Hoàn trả hàng đã nhập
                </Checkbox>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex gap-4">
                <Button
                  color="primary"
                  radius="sm"
                  variant="bordered"
                  onClick={onClose}
                >
                  Đóng
                </Button>
                <Button
                  color="danger"
                  radius="sm"
                  onClick={() => handleSave(onClose)}
                  isLoading={isLoading}
                  isDisabled={isLoading}
                >
                  Hủy đơn
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default ReceiveCancalModal;
