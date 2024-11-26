"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast, { ToastOptions } from "react-hot-toast";

type Props = {
  href: string;
  type?: "success" | "error";
  content?: string;
  options?: ToastOptions;
};
const RedirectToast = ({ href, type, content, options }: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.push(href);

    if (content) {
      switch (type) {
        case "success":
          toast.success(content, {
            duration: 3000,
            ...options,
          });
          break;
        case "error":
          toast.error(content, {
            duration: 3000,
            ...options,
          });
          break;
        default:
          toast(content, {
            duration: 3000,
            ...options,
          });
      }
    }
  }, []);
  return null;
};
export default RedirectToast;
