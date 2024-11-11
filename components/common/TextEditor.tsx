"use client";
import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Skeleton } from "@nextui-org/react";
import { cn } from "@/libs/utils";
type Props = {
  label?: string;
  placeholder?: string;
  className?: string;
};

const toolbarOptions = [
  [{ header: "1" }, { header: "2" }, { header: "3" }, { font: [] }],
  [{ size: [] }],
  ["bold", "italic", "underline", "strike", "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  ["link", "image", "video"],
  ["clean"],
];

const TextEditor = ({
  label,
  placeholder = "Nhập nội dung...",
  className = "",
  ...props
}: Props) => {
  const ReactQuill = useMemo(
    () =>
      dynamic(() => import("react-quill"), {
        ssr: false,
        loading: () => <Skeleton className="w-full h-20 rounded-md" isLoaded />,
      }),
    []
  );
  return (
    <div className="flex flex-col gap-1">
      {label && <h4 className="label">{label}</h4>}
      <ReactQuill
        theme="snow"
        modules={{
          toolbar: toolbarOptions,
        }}
        placeholder={placeholder}
        className={cn("max-w-full", className)}
        {...props}
      />
    </div>
  );
};

export default TextEditor;
