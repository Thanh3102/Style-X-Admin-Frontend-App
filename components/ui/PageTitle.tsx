import { cn } from "@/libs/utils";
import { ReactNode } from "react";

type Props = { children: ReactNode; className?: string };
const PageTitle = ({ children, className }: Props) => {
  return (
    <h3 className={cn("text-2xl font-semibold py-2 my-2", className)}>{children}</h3>
  );
};

export default PageTitle;
