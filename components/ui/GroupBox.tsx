import { cn } from "@/libs/utils";
import { ReactNode } from "react";

export type GroupBoxProps = {
  title?: string;
  titleEndContent?: ReactNode;
  children?: ReactNode;
  className?: string;
};
const GroupBox = ({
  title,
  titleEndContent,
  children,
  className,
}: GroupBoxProps) => {
  return (
    <>
      <div className={cn("container shadow-md h-fit", className)}>
        <div
          className={cn("hidden pb-4 gap-4 items-center", {
            "flex justify-between": title && titleEndContent,
            "flex justify-start": title && !titleEndContent,
            "flex justify-end": !title && titleEndContent,
          })}
        >
          {title && <span className="font-medium text-lg">{title}</span>}
          {titleEndContent}
        </div>
        {children}
      </div>
    </>
  );
};

export { GroupBox };
