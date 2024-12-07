import {
  GetCategoryResponse,
  GetCollectionResponse,
} from "@/app/api/categories/categories.type";
import RenderIf from "@/components/ui/RenderIf";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Image from "next/image";
import { UpdateCategory, UpdateCollection } from "@/app/api/categories";
import { CategoryTable } from "../tables/CategoryTable";
import CreateCategoryButton from "@/components/ui/CreateCategoryButton";

interface Props extends Omit<ModalProps, "children"> {
  collection: GetCollectionResponse[number];
}

const EditCollectionSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(1, "Chưa nhập tiêu đề danh mục")
    .max(30, "Tiêu đề tối đa 30 kí tự"),
  slug: z
    .string()
    .min(1, "Chưa nhập đường dẫn")
    .max(50, "Đường dẫn tối đa 50 kí tự"),
});

export type EditCollectionData = z.infer<typeof EditCollectionSchema>;

const EditCollectionModal = ({ collection, ...props }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditCollectionData>({
    resolver: zodResolver(EditCollectionSchema),
    defaultValues: {
      id: collection.id,
      slug: collection.slug,
      title: collection.title,
    },
  });

  const onSubmit = async (data: EditCollectionData, onClose: () => void) => {
    try {
      console.log(data);

      setIsLoading(true);
      const session = await getSession();
      const response = await UpdateCollection(data, session?.accessToken);
      setIsLoading(false);
      toast.success(response?.message ?? "Cập nhật thành công");
      router.refresh();
      onClose();
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message ?? "Đã xảy ra lỗi");
    }
  };

  return (
    <Modal classNames={{ closeButton: "top-[.75rem]" }} {...props}>
      <ModalContent className="min-w-[50vw]">
        {(onClose) => (
          <>
            <ModalHeader>Chỉnh sửa bộ sưu tập</ModalHeader>
            <ModalBody>
              <>
                <form
                  className="flex flex-wrap gap-y-4 -mx-2 [&>*]:px-2"
                  id="FormUpdateCollection"
                  onSubmit={handleSubmit((data) => onSubmit(data, onClose))}
                >
                  <Input
                    label="Tiêu đề"
                    placeholder="Nhập tiêu đề"
                    isRequired
                    radius="sm"
                    variant="underlined"
                    labelPlacement="outside"
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                    className="w-full"
                    classNames={{
                      label: "label",
                    }}
                    {...register("title")}
                  />
                  <Input
                    label="Đường dẫn"
                    placeholder="Nhập đường dẫn"
                    labelPlacement="outside"
                    radius="sm"
                    variant="underlined"
                    className="w-full"
                    isInvalid={!!errors.slug}
                    errorMessage={errors.slug?.message}
                    classNames={{
                      label: "label",
                    }}
                    {...register("slug")}
                  />
                </form>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <h4>Danh mục</h4>
                    <CreateCategoryButton collectionId={collection.id} />
                  </div>
                  <CategoryTable collection={collection} />
                </div>
                <div className="flex gap-4 w-full justify-end">
                  <Button
                    color="danger"
                    variant="bordered"
                    radius="sm"
                    onClick={onClose}
                    isDisabled={isLoading}
                  >
                    Đóng
                  </Button>
                  <Button
                    color="primary"
                    radius="sm"
                    type="submit"
                    form="FormUpdateCollection"
                    isDisabled={isLoading}
                    isLoading={isLoading}
                  >
                    Lưu
                  </Button>
                </div>
              </>
            </ModalBody>
            {/* <ModalFooter></ModalFooter>*/}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditCollectionModal;
