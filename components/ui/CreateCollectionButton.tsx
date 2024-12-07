"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import FormCreateCollection from "../specific/forms/FormCreateCollection";

const CreateCollectionButton = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  return (
    <>
      <Button
        color="primary"
        radius="sm"
        startContent={<AiOutlinePlusCircle />}
        onClick={onOpen}
      >
        Thêm bộ sưu tập mới
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Thêm bộ sưu tập mới</ModalHeader>
              <ModalBody>
                <FormCreateCollection onClose={onClose}/>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCollectionButton;
