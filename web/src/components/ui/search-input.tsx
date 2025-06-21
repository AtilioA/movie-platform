import { Search } from "lucide-react";
import * as React from "react";
import { InputWithIcon } from "./input-with-icon";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export function SearchInput({
  containerClassName = "",
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div className={`relative flex-1 max-w-md ${containerClassName}`}>
      <InputWithIcon
        icon={<Search className="text-muted-foreground" />}
        type="text"
        placeholder="Search..."
        className={`w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
        {...props}>
      </InputWithIcon>
    </div>
  );
}
