import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
// import CategoryList from "../ui/CategoryTable";

type Props = {
  isOpen: boolean;
  onOpenChange: ((isOpen: boolean) => void) | undefined;
};

const CategoryModal = ({ isOpen, onOpenChange }: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{ closeButton: "top-[.75rem]" }}
    >
      <ModalContent className="h-[50vh] min-h-[500px] max-h-[700px] w-[50vw] min-w-[600px] max-w-[900px] overflow-hidden">
        {(onClose) => (
          <>
            <ModalHeader>Danh mục sản phẩm</ModalHeader>
            <ModalBody>
              {/* <CategoryList /> */}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CategoryModal;
