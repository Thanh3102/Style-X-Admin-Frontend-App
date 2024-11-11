"use client";
import { Button, ButtonProps } from "@nextui-org/react";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";


const GoBackButton = ({ href }: { href: string } & ButtonProps) => {
  return (
    <Link href={href}>
      <Button isIconOnly radius="sm" variant="faded">
        <FaArrowLeftLong size={16} className="text-gray-400"/>
      </Button>
    </Link>
  );
};
export default GoBackButton;
