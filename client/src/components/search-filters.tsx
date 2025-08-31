import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

interface SearchFiltersProps {
  onSearch?: (query: string) => void;
  onFilter?: (filters: { androidVersion?: string; romType?: string; maintainer?: string }) => void;
}

export default function SearchFilters({ onSearch, onFilter }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    androidVersion: "all",
    romType: "all",
    maintainer: "",
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  useEffect(() => {
    if (onFilter) {
      onFilter(filters);
    }
  }, [filters, onFilter]);

  const clearFilters = () => {
    setFilters({
      androidVersion: "all",
      romType: "all",
      maintainer: "",
    });
    setSearchQuery("");
  };

  const hasActiveFilters = searchQuery || (filters.androidVersion !== "all") || (filters.romType !== "all") || filters.maintainer;

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <motion.div 
        className="glass-card rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Search ROMs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 bg-input border-border focus:border-accent focus:ring-accent/20"
            data-testid="search-input"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="text-accent hover:text-accent/80"
            data-testid="toggle-filters"
          >
            <Filter size={16} className="mr-2" />
            {isFiltersOpen ? "Hide Filters" : "Show Filters"}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
              data-testid="clear-filters"
            >
              <X size={16} className="mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Filters */}
        <motion.div
          initial={false}
          animate={{ height: isFiltersOpen ? "auto" : 0, opacity: isFiltersOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <Select 
              value={filters.androidVersion} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, androidVersion: value }))}
            >
              <SelectTrigger 
                className="bg-input border-border focus:border-accent focus:ring-accent/20"
                data-testid="android-version-filter"
              >
                <SelectValue placeholder="Android Version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Versions</SelectItem>
                <SelectItem value="Android 14">Android 14</SelectItem>
                <SelectItem value="Android 13">Android 13</SelectItem>
                <SelectItem value="Android 12">Android 12</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.romType} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, romType: value }))}
            >
              <SelectTrigger 
                className="bg-input border-border focus:border-accent focus:ring-accent/20"
                data-testid="rom-type-filter"
              >
                <SelectValue placeholder="ROM Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="AOSP">AOSP</SelectItem>
                <SelectItem value="LineageOS">LineageOS</SelectItem>
                <SelectItem value="PixelOS">PixelOS</SelectItem>
                <SelectItem value="crDroid">crDroid</SelectItem>
                <SelectItem value="ArrowOS">ArrowOS</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Maintainer"
              value={filters.maintainer}
              onChange={(e) => setFilters(prev => ({ ...prev, maintainer: e.target.value }))}
              className="bg-input border-border focus:border-accent focus:ring-accent/20"
              data-testid="maintainer-filter"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
