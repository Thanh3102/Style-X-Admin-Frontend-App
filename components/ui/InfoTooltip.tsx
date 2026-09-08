"use client";

import { Tooltip } from "@heroui/react";
import { ReactNode } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";

const InfoTooltip = ({ content }: { content: ReactNode }) => {
  return (
    <Tooltip
      showArrow={true}
      content={content}
      radius="sm"
      classNames={{
        content: "max-w-[200px] p-2 text-white bg-(--sidebar-bg-color)",
        arrow:
          "text-(--sidebar-bg-color) bg-(--sidebar-bg-color) border-(--sidebar-bg-color)",
      }}
    >
      <div className="hover:cursor-help">
        <IoMdInformationCircleOutline />
      </div>
    </Tooltip>
  );
};

export { InfoTooltip };
