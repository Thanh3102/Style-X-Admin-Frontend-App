"use client";
import { Button, ButtonProps } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";

const GoBackButton = ({
  href,
  goPreviousPage = false,
}: { href: string; goPreviousPage?: boolean } & ButtonProps) => {
  const router = useRouter();
  if (goPreviousPage)
    return (
      <Button
        isIconOnly
        radius="sm"
        variant="faded"
        onClick={() => router.back()}
      >
        <FaArrowLeftLong size={16} className="text-gray-400" />
      </Button>
    );
  return (
    <Link href={href}>
      <Button isIconOnly radius="sm" variant="faded">
        <FaArrowLeftLong size={16} className="text-gray-400" />
      </Button>
    </Link>
  );
};
export default GoBackButton;
