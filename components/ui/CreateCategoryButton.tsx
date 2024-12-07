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
import FormCreateCategory from "../specific/forms/FormCreateCategory";

type Props = {
  collectionId: number;
};

const CreateCategoryButton = ({ collectionId }: Props) => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  return (
    <>
      <Button color="primary" radius="sm" size="sm" isIconOnly onClick={onOpen}>
        <AiOutlinePlusCircle size={16}/>
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
              <ModalHeader>Thêm danh mục mới</ModalHeader>
              <ModalBody>
                <FormCreateCategory
                  onClose={onClose}
                  collectionId={collectionId}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCategoryButton;
