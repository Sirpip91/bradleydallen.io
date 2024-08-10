import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface QuoteProps {
  children?: ReactNode;
  type?: "default" | "warning" | "danger";
}

export function Quote({
  children,
  type = "default",
  ...props
}: QuoteProps) {
  return (
    <div
      className={cn(
        "my-6 items-start rounded-md border boder-l-4 p-4 w-full dark:max-w-none",
        {
          "border-red-900 bg-red-50 dark:prose": type === "danger",
          "content-center border-black-900 text-xl text-center": type === "warning",
        }
      )}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
}