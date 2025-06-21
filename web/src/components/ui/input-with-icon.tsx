import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

const inputBaseClass =
  "flex h-9 w-full rounded-md bg-transparent border px-3 py-1 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

function InputRoot({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
    </div>
  );
}

function InputIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Slot
      role="presentation"
      className={cn(
        "absolute left-3 top-2 bottom-2 pointer-events-none size-5 [&~input]:pl-11",
        className
      )}
    >
      {children}
    </Slot>
  );
}

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(inputBaseClass, className)} {...props} />;
}

interface InputWithIconProps extends React.ComponentProps<"input"> {
  icon: React.ReactNode;
  rootClassName?: string;
  iconClassName?: string;
}

export function InputWithIcon({ icon, rootClassName, iconClassName, className, ...inputProps }: InputWithIconProps) {
  return (
    <InputRoot className={rootClassName}>
      <InputIcon className={iconClassName}>{icon}</InputIcon>
      <Input className={className} {...inputProps} />
    </InputRoot>
  );
}
