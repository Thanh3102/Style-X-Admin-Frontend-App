"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { GoPlusCircle } from "react-icons/go";
import FormCreateWarehouse from "../specific/forms/FormCreateWarehouse";

const CreateWarehouseButton = () => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        radius="sm"
        color="primary"
        startContent={<GoPlusCircle />}
        onClick={onOpen}
      >
        Thêm kho hàng
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        radius="sm"
        isDismissable={false}
      >
        <ModalContent className="min-w-[800px] w-[70vw]">
          <ModalHeader>Thêm kho hàng</ModalHeader>
          <ModalBody>
            <FormCreateWarehouse onClose={onClose} />
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
              form="FormCreateWarehouse"
            >
              Thêm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateWarehouseButton;
