"use client";

import { signOut } from "next-auth/react";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { FaChevronDown } from "react-icons/fa6";

type Props = {
  name: string;
};

const UserAction = ({ name }: Props) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <div className="flex gap-4 items-center px-3 py-1 hover:cursor-pointer hover:bg-gray-200 rounded-lg">
          <span>{name}</span>
          <FaChevronDown size={12} />
        </div>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem href="/profile">Thông tin cá nhân</DropdownItem>
        <DropdownItem onClick={() => signOut()} className="text-red-500">
          Đăng xuất
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
export default UserAction;
