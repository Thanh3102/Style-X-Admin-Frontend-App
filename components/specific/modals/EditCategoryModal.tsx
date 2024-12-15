import { GetCategoryResponse } from "@/app/api/categories/categories.type";
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
import { UpdateCategory } from "@/app/api/categories";

interface Props extends Omit<ModalProps, "children"> {
  category: GetCategoryResponse[number];
  collectionId: number;
}

const EditCategorySchema = z.object({
  id: z.number(),
  collectionId: z.number(),
  title: z
    .string()
    .min(1, "Chưa nhập tiêu đề danh mục")
    .max(30, "Tiêu đề tối đa 30 kí tự"),
  slug: z
    .string()
    .min(1, "Chưa nhập đường dẫn")
    .max(50, "Đường dẫn tối đa 50 kí tự"),
  image: z.instanceof(FileList).nullable().optional(),
});

export type EditCategoryData = z.infer<typeof EditCategorySchema>;

const EditCategoryModal = ({ category, collectionId, ...props }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditCategoryData>({
    resolver: zodResolver(EditCategorySchema),
    defaultValues: {
      collectionId: collectionId,
      id: category.id,
      image: null,
      slug: category.slug,
      title: category.title,
    },
  });

  const onSubmit = async (data: EditCategoryData, onClose: () => void) => {
    try {
      console.log(data);

      setIsLoading(true);
      const session = await getSession();
      const response = await UpdateCategory(data, session?.accessToken);
      setIsLoading(false);
      toast.success(response?.message ?? "Cập nhật thành công");
      router.refresh();
      onClose();
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
    }
  };
  return (
    <Modal classNames={{ closeButton: "top-[.75rem]" }} {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Chỉnh sửa danh mục</ModalHeader>
            <ModalBody>
              <form
                className="flex flex-wrap gap-y-4 -mx-2 [&>*]:px-2"
                id="FormCreateCategory"
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
                <Input
                  type="file"
                  label="Hình ảnh"
                  multiple={false}
                  radius="sm"
                  variant="underlined"
                  labelPlacement="outside"
                  className="w-full"
                  classNames={{
                    label: "label",
                  }}
                  {...register("image")}
                />
                <RenderIf condition={!!category.image}>
                  <Image
                    width={100}
                    height={100}
                    alt=""
                    src={category.image}
                    className="object-cover"
                  />
                </RenderIf>

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
                    form="FormCreateCategory"
                    isDisabled={isLoading}
                    isLoading={isLoading}
                  >
                    Lưu
                  </Button>
                </div>
              </form>
            </ModalBody>
            {/* <ModalFooter></ModalFooter>*/}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditCategoryModal;
