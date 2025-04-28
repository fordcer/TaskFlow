import type React from "react";
import { Check, File, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyPlaceholderProps = React.HTMLAttributes<HTMLDivElement>;

export function EmptyPlaceholder({
  className,
  children,
  ...props
}: Readonly<EmptyPlaceholderProps>) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-gray-800 dark:border-white border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

interface EmptyPlaceholderIconProps
  extends Partial<React.SVGProps<SVGSVGElement>> {
  name: "task" | "file" | "plus" | "check";
}

EmptyPlaceholder.Icon = function EmptyPlaceholderIcon({
  name,
  className,
  ...props
}: EmptyPlaceholderIconProps) {
  const Icon = {
    task: File,
    file: File,
    plus: Plus,
    check: Check,
  }[name];

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
      <Icon className={cn("h-10 w-10", className)} {...props} />
    </div>
  );
};

type EmptyPlaceholderTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children: React.ReactNode;
};

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  className,
  children,
  ...props
}: EmptyPlaceholderTitleProps) {
  return (
    <h2 className={cn("mt-6 text-xl font-semibold", className)} {...props}>
      {children}
    </h2>
  );
};

type EmptyPlaceholderDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>;

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  className,
  ...props
}: EmptyPlaceholderDescriptionProps) {
  return (
    <p
      className={cn(
        "mt-3 mb-8 text-center text-sm font-normal leading-6 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
