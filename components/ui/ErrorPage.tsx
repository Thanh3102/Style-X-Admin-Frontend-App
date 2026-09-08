"use client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
  error?: string;
};

const ErrorPage = ({ error }: Props) => {
  const router = useRouter();
  useEffect(() => {
    if (error) toast.error(error);
  }, []);
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
