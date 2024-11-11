import { Category } from "@/libs/types";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";

type Props = {
  isOpen: boolean;
  onOpenChange: ((isOpen: boolean) => void) | undefined;
  category: Category | undefined;
};

const EditCategoryModal = ({ isOpen, onOpenChange, category }: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{ closeButton: "top-[.75rem]" }}
    >
      <ModalContent className="h-[30vh] min-h-[200px] max-h-[400px] w-[30vw] min-w-[300px] max-w-[600px] overflow-hidden">
        {(onClose) => (
          <>
            <ModalHeader>Chỉnh sửa danh mục</ModalHeader>
            <ModalBody>Id danh mục: {category?.id}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditCategoryModal;
