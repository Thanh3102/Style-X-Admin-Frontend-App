"use client";
import {
  memo,
  useCallback,
  useEffect,
} from "react";
import { cn } from "@/libs/utils";
import { FileRejection, useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { FaPlus, FaStar, FaTrash } from "react-icons/fa6";
import Image from "next/image";
import { useImmer } from "use-immer";

type Props = {
  maxSize?: number;
  onImageChange?: (imageFiles: File[]) => void;
};

const CreateProductImageDrop = (props: Props) => {
  const { maxSize = 10, onImageChange } = props;
  const [images, setImages] = useImmer<File[]>([]);

  const onDrop = useCallback(
    async (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
    ) => {
      console.log("AcceptedFiles", acceptedFiles);
      console.log("fileRejections", fileRejections);

      setImages((images) => {
        const newImages = images;
        for (const acceptedFile of acceptedFiles) {
          const index = images.findIndex(
            (image) => image.name === acceptedFile.name
          );
          if (index === -1) {
            newImages.push(acceptedFile);
          }
        }
        return newImages;
      });

      if (fileRejections.length > 0) {
        for (const fileRejection of fileRejections) {
          toast.error(
            `${fileRejection.file.name}: ${fileRejection.errors[0].message}`,
            {
              duration: 3000,
              position: "bottom-right",
            }
          );
        }
      }
    },
    []
  );

  const onError = useCallback((err: any) => {
    toast.error(err.message);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    maxSize: maxSize * 1e6,
    accept: {
      "image/*": [],
    },
    multiple: true,
    onDrop,
    onError,
  });

  const handleRemoveImage = (index: number) => {
    setImages((images) => {
      images.splice(index, 1);
      return images;
    });
  };

  const changeMainImage = (index: number) => {
    setImages((images) => {
      [images[0], images[index]] = [images[index], images[0]];
      return images;
    });
  };

  useEffect(() => {
    console.log("New images", images);
    onImageChange && onImageChange(images);
  }, [images]);

  return (
    <>
      <div
        className={cn(
          "rounded-lg p-4 flex flex-col gap-y-1 items-center justify-center text-sm",
          "border-1 border-gray-400 border-dashed hover:border-blue-500",
          "hover:cursor-pointer",
          {
            hidden: images.length !== 0,
          }
        )}
        {...getRootProps()}
        onClick={() => open()}
      >
        <input {...getInputProps({ className: "hidden" })} />
        <span>Kéo thả hoặc</span>
        <span className="label-link font-semibold">
          Tải ảnh lên từ thiết bị
        </span>
        <span className="text-gray-500 font-medium">{`(Dung lượng ảnh tối đa ${maxSize}MB)`}</span>
      </div>

      <div
        className={cn("flex flex-wrap gap-4", {
          hidden: images.length === 0,
        })}
      >
        <div
          className={cn(
            "h-24 w-24 flex items-center justify-center",
            "border-1 border-dashed border-gray-400 hover:border-blue-500",
            "rounded-lg hover:cursor-pointer"
          )}
          {...getRootProps()}
          onClick={() => open()}
        >
          <FaPlus />
        </div>
        {images.map((img, index) => {
          const imageURL = URL.createObjectURL(img);
          return (
            <div
              className="rounded-lg h-24 w-24 relative hover:cursor-pointer group"
              key={img.name}
            >
              <div className="h-full w-full absolute p-2 z-20 rounded-lg bg-[rgba(0,0,0,0.5)] hidden group-hover:block">
                <div className="flex items-center justify-center gap-2 text-white h-full">
                  <FaStar
                    className={cn("hover:text-blue-500", {
                      hidden: index === 0,
                    })}
                    onClick={() => changeMainImage(index)}
                  />
                  <FaTrash
                    className={cn("hover:text-blue-500")}
                    onClick={() => handleRemoveImage(index)}
                  />
                </div>
              </div>
              <div
                className={cn(
                  "absolute bottom-0 p-1 bg-black text-xs text-center z-10 text-white w-full rounded-b-lg",
                  { hidden: index !== 0 }
                )}
              >
                <span>Ảnh đại diện</span>
              </div>
              <Image
                alt=""
                src={imageURL}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default memo(CreateProductImageDrop);
