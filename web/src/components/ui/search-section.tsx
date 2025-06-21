import React, { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchSectionProps {
  placeholder: string;
  initialQuery?: string;
  onSearch: (_query: string) => void;
  className?: string;
  cardHeaderClassName?: string;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  placeholder,
  initialQuery = "",
  onSearch,
  className = "my-2 mb-6",
  cardHeaderClassName = "py-4",
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Handle input change and debounce in parent
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  // Keep the form submission for accessibility and keyboard navigation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  // Handle Enter key for better UX
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      onSearch(query);
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader className={cardHeaderClassName}>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
              <div className="relative flex-1">
                <SearchInput
                  placeholder={placeholder}
                  value={query}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </CardHeader>
      </Card>
    </div>
  );
};
