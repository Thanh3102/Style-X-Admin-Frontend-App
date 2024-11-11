"use client";

import { Tooltip } from "@nextui-org/react";
import { IoMdInformationCircleOutline } from "react-icons/io";

const InfoTooltip = ({ content }: { content: string }) => {
  return (
    <Tooltip
      showArrow={true}
      content={content}
      radius="sm"
      classNames={{
        content: "max-w-[200px] p-2 text-white bg-[var(--sidebar-bg-color)]",
        arrow:
          "text-[var(--sidebar-bg-color)] bg-[var(--sidebar-bg-color)] border-[var(--sidebar-bg-color)]",
      }}
    >
      <div className="">
        <IoMdInformationCircleOutline />
      </div>
    </Tooltip>
  );
};

export { InfoTooltip };
