"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const ErrorPage = () => {
  const router = useRouter();
  return (
    <div className="h-full flex-center flex-col gap-4">
      <span className="text-lg font-medium">Đã gặp lỗi khi tải trang</span>
      <Button color="primary" radius="sm" onClick={() => router.refresh()}>
        Tải lại
      </Button>
    </div>
  );
};
export default ErrorPage;
