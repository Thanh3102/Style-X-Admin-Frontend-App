import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import ImageFileDrop from "../common/ImageFileDrop";
import { useState } from "react";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";
import { POST_ADD_PRODUCT_IMAGE_ROUTE } from "@/constants/api-routes";

type Props = {
  productId: number;
  title?: string;
} & Omit<ModalProps, "children">;
const UploadImageModal = (props: Props) => {
  const { productId, title = "Thêm hình ảnh", ...modalProps } = props;

  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (images: File[]) => setImages(images);

  const handleUpload = async (onClose: () => void) => {
    if (images.length === 0) {
      toast.error("Hãy chọn ảnh trước khi thêm");
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId.toString())
    images.forEach((i) => formData.append("images", i));

    try {
      setIsLoading(true);
      const session = await getSession();
      const res = await fetch(`${POST_ADD_PRODUCT_IMAGE_ROUTE}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: formData,
      });
      setIsLoading(false);

      if(res.ok){
        const {message} = await res.json();
        toast.success(message ?? "Thêm ảnh thành công")
        location.reload();
        onClose()
      }
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi khi thêm ảnh");
    }
  };
  return (
    <Modal {...modalProps}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <ImageFileDrop maxSize={10} onImageChange={handleImageChange} />
            </ModalBody>
            <ModalFooter className="gap-4 flex items-center">
              <Button
                color="danger"
                variant="bordered"
                onClick={() => onClose()}
                isDisabled={isLoading}
              >
                Đóng
              </Button>
              <Button
                color="primary"
                onClick={() => handleUpload(onClose)}
                isDisabled={isLoading}
                isLoading={isLoading}
              >
                Thêm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default UploadImageModal;
