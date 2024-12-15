import { cn } from "@/libs/utils";

export type StatusProps = {
  color?: "default" | "success" | "warning" | "danger" | "primary";
  content?: string;
};

const colors: Record<
  "default" | "success" | "warning" | "danger" | "primary",
  string
> = {
  default: "bg-stone-200 text-stone-600 border-stone-600 border-1",
  success: "bg-green-100 text-green-600 border-green-600 border-1",
  warning: "bg-yellow-100 text-yellow-600 border-yellow-600 border-1",
  danger: "bg-red-100 text-red-600 border-red-600 border-1",
  primary: "bg-blue-100 text-blue-600 border-blue-600 border-1",
};

const Status = ({ content, color = "default" }: StatusProps) => {
  return (
    <div
      className={cn(
        "px-4 py-1 rounded-full text-xs w-fit flex items-center justify-center",
        colors[color]
      )}
    >
      <span>{content}</span>
    </div>
  );
};

export { Status };
