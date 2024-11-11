import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { ReactNode } from "react";

type Props = {
  title?: string;
  cancelText?: string;
  confirmText?: string;
  children?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
} & ModalProps;

const ConfirmModal = ({
  title,
  cancelText = "Hủy",
  confirmText = "Xác nhận",
  children,
  onCancel = () => {},
  onConfirm = () => {},
  ...props
}: Props) => {
  return (
    <Modal
      hideCloseButton
      radius="sm"
      classNames={{
        header: "text-xl",
      }}
      {...props}
    >
      <ModalContent className="overflow-hidden w-fit">
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter className="gap-4 justify-end">
              <Button
                variant="bordered"
                radius="sm"
                onClick={() => {
                  onCancel();
                  onClose();
                }}
                className="font-medium"
              >
                {cancelText}
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  onConfirm();
                }}
                color="danger"
                radius="sm"
                className="font-medium"
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
