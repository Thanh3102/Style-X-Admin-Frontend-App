"use client";
import { GetProductDetailResponse } from "@/libs/types/backend/response";
import { cn } from "@/libs/utils";
import { FaStar, FaTrash } from "react-icons/fa6";
import Image from "next/image";
import { useImmer } from "use-immer";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import {
  DELETE_PRODUCT_IMAGE_ROUTE,
  PUT_UPDATE_MAIN_IMAGE_ROUTE,
} from "@/constants/api-routes";
import toast from "react-hot-toast";
import { Tooltip } from "@nextui-org/react";
import ConfirmModal from "../specific/ConfirmModal";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  product: GetProductDetailResponse;
};

type Image = { url: string; publicId: string };

const ProductImages = ({ product }: Props) => {
  const [images, setImages] = useImmer(product.images);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image>();

  const changeMainImage = async (url: string, index: number) => {
    const session = await getSession();
    const res = await fetch(`${PUT_UPDATE_MAIN_IMAGE_ROUTE}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: product.id, image: url }),
    });
    const data = await res.json();

    if (res.ok) {
      toast.success(data.message ?? "Đã đổi ảnh đại diện");
      setImages((images) => {
        [images[0], images[index]] = [images[index], images[0]];
        return images;
      });
      location.reload();
      return;
    }

    toast.error(data.error ?? "Đã xảy ra lỗi");
  };

  const handleRemoveImage = async (image: Image) => {
    const session = await getSession();
    const res = await fetch(`${DELETE_PRODUCT_IMAGE_ROUTE}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(image),
    });
    const data = await res.json();

    if (res.ok) {
      toast.success(data.message ?? "Đã xóa ảnh");
      setImages((images) => {
        const newImages = images.filter(
          (img) => img.publicId !== selectedImage?.publicId
        );
        return newImages;
      });
      setSelectedImage(undefined);
      return;
    }

    toast.error(data.error ?? "Đã xảy ra lỗi khi xóa ảnh");
  };

  useEffect(() => {
    const mainImageIndex: number = images.findIndex(
      (img) => img.url === product.image
    );

    if (mainImageIndex !== -1 && mainImageIndex !== 0) {
      setImages((images) => {
        [images[0], images[mainImageIndex]] = [
          images[mainImageIndex],
          images[0],
        ];
        return images;
      });
    }
  }, []);

  if (product.images.length === 0) return null;

  return (
    <>
      <div className={cn("flex flex-wrap gap-4 relative")}>
        {images.map((img, index) => {
          return (
            <div
              className="rounded-lg h-24 w-24 relative hover:cursor-pointer group"
              key={img.publicId}
            >
              <div className="h-full w-full absolute p-2 z-20 rounded-lg bg-[rgba(0,0,0,0.5)] hidden group-hover:block">
                <div className="flex items-center justify-center gap-2 text-white h-full">
                  <Tooltip content="Chọn làm ảnh đại diện" showArrow>
                    <div
                      className={cn("hover:text-blue-500", {
                        hidden: img.url === product.image,
                      })}
                      onClick={() => changeMainImage(img.url, index)}
                    >
                      <FaStar />
                    </div>
                  </Tooltip>
                  <Tooltip content={"Xóa ảnh"} showArrow>
                    <div
                      className={cn("hover:text-blue-500")}
                      onClick={() => {
                        setSelectedImage(img);
                        setOpenDelete(true);
                      }}
                    >
                      <FaTrash />
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div
                className={cn(
                  "absolute bottom-0 p-1 bg-black text-xs text-center z-10 text-white w-full rounded-b-lg",
                  { hidden: img.url !== product.image }
                )}
              >
                <span>Ảnh đại diện</span>
              </div>
              <Image
                alt=""
                src={img.url}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          );
        })}
      </div>
      <ConfirmModal
        isOpen={openDelete}
        onOpenChange={(open) => setOpenDelete(open)}
        title="Xác nhân xóa ảnh ?"
        cancelText="Hủy"
        confirmText="Xóa"
        onConfirm={() => {
          if (selectedImage) handleRemoveImage(selectedImage);
        }}
      >
        <span>Hành động này sẽ không thể hoàn tác</span>
      </ConfirmModal>
    </>
  );
};
export default ProductImages;
