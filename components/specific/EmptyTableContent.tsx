"use client";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const EmptyTableContent = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="rounded-b-md bg-white shadow-md h-[450px] flex flex-col items-center justify-center gap-3">
      <Image alt="" src={"/images/not_found.webp"} height={100} width={100} />
      <div className="flex-center flex-col">
        <span className="font-semibold text-lg">
          Không tìm thấy dữ liệu phù hợp với kết quả tìm kiếm
        </span>
        <span className="text-gray-500 text-base">
          Thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm
        </span>
      </div>
      <Button
        variant="ghost"
        color="primary"
        radius="sm"
        onClick={() => router.push(pathname)}
      >
        Xem tất cả danh sách
      </Button>
    </div>
  );
};

export { EmptyTableContent };
