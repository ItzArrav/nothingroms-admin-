import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { type Rom } from "@shared/schema";
import RomCard from "@/components/rom-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Roms() {
  const [sortBy, setSortBy] = useState("latest");

  const { data: allRoms, isLoading } = useQuery<Rom[]>({
    queryKey: ["/api/roms"],
  });

  const displayRoms = allRoms;

  const sortedRoms = displayRoms?.sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.downloadCount - a.downloadCount;
      case "name":
        return a.name.localeCompare(b.name);
      case "latest":
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4" data-testid="roms-page-title">All ROMs</h1>
          <p className="text-muted-foreground" data-testid="roms-page-description">
            Browse our complete collection of custom ROMs for Nothing Phone 2a and 2a Plus
          </p>
        </div>


        {/* Sort Options */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground" data-testid="rom-count">
            {sortedRoms?.length || 0} ROMs found
          </p>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48" data-testid="sort-select">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest Updated</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ROMs Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-6 animate-pulse" data-testid={`rom-skeleton-${i}`}>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-3 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-6"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : sortedRoms?.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg" data-testid="no-roms-message">
              No ROMs found matching your criteria.
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {sortedRoms?.map((rom, index) => (
              <motion.div
                key={rom.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <RomCard rom={rom} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
