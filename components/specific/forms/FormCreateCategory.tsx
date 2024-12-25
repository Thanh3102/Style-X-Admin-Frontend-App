import { CreateCategory } from "@/app/api/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const CreateCategorySchema = z.object({
  title: z
    .string()
    .min(1, "Chưa nhập tiêu đề danh mục")
    .max(30, "Tiêu đề tối đa 30 kí tự"),
  slug: z
    .string()
    .min(1, "Chưa nhập đường dẫn")
    .max(50, "Đường dẫn tối đa 50 kí tự"),
  image: z.instanceof(FileList).nullable().optional(),
  collectionId: z.number(),
});

export type CreateCategoryData = z.infer<typeof CreateCategorySchema>;

type Props = {
  onClose: () => void;
  collectionId: number;
};

const FormCreateCategory = ({ collectionId, onClose }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryData>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      collectionId: collectionId,
    },
  });

  const onSubmit: SubmitHandler<CreateCategoryData> = async (data) => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const response = await CreateCategory(data, session?.accessToken);
      toast.success(response?.message ?? "Thêm danh mục thành công");
      onClose();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-wrap gap-y-4 -mx-2 [&>*]:px-2"
      id="FormCreateCategory"
      onSubmit={handleSubmit(onSubmit)}
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
          Thêm
        </Button>
      </div>
    </form>
  );
};
export default FormCreateCategory;
