"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { GoPlusCircle } from "react-icons/go";
import FormEditWarehouse from "../specific/forms/FormEditWarehouse";
import { WarehousesResponse } from "@/app/api/warehouses/warehouses.type";
import { FaEdit } from "react-icons/fa";

type Props = {
  warehouse: WarehousesResponse;
};

const UpdateWarehouseButton = ({ warehouse }: Props) => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div
        className="hover:cursor-pointer hover:text-blue-500"
        onClick={onOpen}
      >
        <FaEdit size={18} />
      </div>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          backdrop="blur"
          radius="sm"
          isDismissable={false}
        >
          <ModalContent className="min-w-[800px] w-[70vw]">
            <ModalHeader>Chỉnh sửa kho hàng</ModalHeader>
            <ModalBody>
              <FormEditWarehouse onClose={onClose} warehouse={warehouse} />
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
                form="FormEditWarehouse"
              >
                Lưu
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
export default UpdateWarehouseButton;
