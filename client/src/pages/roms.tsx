import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { type Rom } from "@shared/schema";
import RomCard from "@/components/rom-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";

interface RomWithStatus extends Rom {
  approvalStatus?: 'approved' | 'pending';
  isPublic?: boolean;
}

export default function Roms() {
  const [sortBy, setSortBy] = useState("latest");
  const [showAll, setShowAll] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('dev_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(Boolean(payload.isAdmin));
      } catch (e) {
        setIsAdmin(false);
      }
    }
  }, []);

  // Fetch ROMs based on admin status and show all toggle
  const { data: publicRoms, isLoading: publicLoading } = useQuery<Rom[]>({
    queryKey: ["/api/roms"],
    enabled: !showAll || !isAdmin,
  });

  const { data: adminRomsData, isLoading: adminLoading } = useQuery<{
    roms: RomWithStatus[];
    totalCount: number;
    approvedCount: number;
    pendingCount: number;
  }>({
    queryKey: ["/api/admin/roms/all"],
    enabled: isAdmin && showAll,
  });

  const displayRoms = showAll && isAdmin ? adminRomsData?.roms : publicRoms;
  const isLoading = showAll && isAdmin ? adminLoading : publicLoading;

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
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold gradient-text" data-testid="roms-page-title">
              {showAll && isAdmin ? 'All ROMs (Admin View)' : 'All ROMs'}
            </h1>
            {isAdmin && (
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <FaShieldAlt className="mr-1" size={12} />
                Admin
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mb-4" data-testid="roms-page-description">
            {showAll && isAdmin 
              ? 'Admin view: Browse all ROMs including pending approvals'
              : 'Browse our complete collection of custom ROMs for Nothing Phone 2a and 2a Plus'
            }
          </p>
          
          {/* Admin Toggle */}
          {isAdmin && (
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowAll(!showAll)}
                variant={showAll ? "default" : "outline"}
                className={showAll ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                {showAll ? (
                  <><FaEye className="mr-2" size={14} />Show All ROMs</>
                ) : (
                  <><FaEyeSlash className="mr-2" size={14} />Show Public Only</>
                )}
              </Button>
              
              {showAll && adminRomsData && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Total: {adminRomsData.totalCount}</span>
                  <span className="text-green-400">Approved: {adminRomsData.approvedCount}</span>
                  <span className="text-yellow-400">Pending: {adminRomsData.pendingCount}</span>
                </div>
              )}
            </div>
          )}
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
