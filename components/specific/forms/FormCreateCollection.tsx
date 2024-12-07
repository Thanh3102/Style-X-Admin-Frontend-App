import { CreateCategory, CreateCollection } from "@/app/api/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const CreateCollectionSchema = z.object({
  title: z
    .string()
    .min(1, "Chưa nhập tiêu đề bộ sưu tập")
    .max(30, "Tiêu đề tối đa 30 kí tự"),
  slug: z
    .string()
    .min(1, "Chưa nhập đường dẫn")
    .max(50, "Đường dẫn tối đa 50 kí tự"),
});

export type CreateCollectionData = z.infer<typeof CreateCollectionSchema>;

type Props = {
  onClose: () => void;
};

const FormCreateCollection = ({ onClose }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCollectionData>({
    resolver: zodResolver(CreateCollectionSchema),
  });

  const onSubmit: SubmitHandler<CreateCollectionData> = async (data) => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const response = await CreateCollection(data, session?.accessToken);
      setIsLoading(false);
      toast.success(response?.message ?? "Thêm bộ sưu tập thành công");
      onClose();
      router.refresh();
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message ?? "Đã xảy ra lỗi");
    }
  };

  return (
    <form
      className="flex flex-wrap gap-y-4 -mx-2 [&>*]:px-2"
      id="FormCreateCollection"
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
          form="FormCreateCollection"
          isDisabled={isLoading}
          isLoading={isLoading}
        >
          Thêm
        </Button>
      </div>
    </form>
  );
};
export default FormCreateCollection;
