import React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";

interface SearchSectionProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  cardHeaderClassName?: string;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  placeholder,
  value,
  onChange,
  className = "my-2 mb-6",
  cardHeaderClassName = "py-4",
}) => (
  <div className={className}>
    <Card>
      <CardHeader className={cardHeaderClassName}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-full">
            <SearchInput
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  </div>
);
