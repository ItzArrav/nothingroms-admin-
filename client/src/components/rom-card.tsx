import { motion } from "framer-motion";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { type Rom } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Info, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface RomCardProps {
  rom: Rom;
}

export default function RomCard({ rom }: RomCardProps) {
  const { toast } = useToast();

  const downloadMutation = useMutation({
    mutationFn: async (romId: string) => {
      const response = await apiRequest("POST", `/api/roms/${romId}/download`);
      return response.json();
    },
    onSuccess: (data) => {
      window.open(data.downloadUrl, "_blank");
      toast({
        title: "Download Started",
        description: "Please verify the checksum after download.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/roms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/roms/featured"] });
    },
    onError: () => {
      toast({
        title: "Download Failed",
        description: "Unable to start download. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadMutation.mutate(rom.id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/roms/${rom.id}`;
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <motion.div
      className="glass-card rounded-xl p-6 hover:neon-border transition-all duration-300 group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => window.location.href = `/roms/${rom.id}`}
      data-testid={`rom-card-${rom.id}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-200" data-testid={`rom-name-${rom.id}`}>
            {rom.name}
          </h3>
          <p className="text-sm text-muted-foreground" data-testid={`rom-codename-${rom.id}`}>
            Nothing Phone 2a ({rom.codename})
          </p>
        </div>
        <Badge 
          variant="secondary" 
          className="bg-secondary/20 text-secondary" 
          data-testid={`android-version-${rom.id}`}
        >
          {rom.androidVersion}
        </Badge>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <User size={14} />
            Maintainer:
          </span>
          <span className="text-foreground font-medium" data-testid={`maintainer-${rom.id}`}>
            {rom.maintainer}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Version:</span>
          <span className="text-foreground font-medium" data-testid={`version-${rom.id}`}>
            {rom.version}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Calendar size={14} />
            Updated:
          </span>
          <span className="text-foreground font-medium" data-testid={`updated-${rom.id}`}>
            {formatDate(rom.updatedAt)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Downloads:</span>
          <span className="text-foreground font-medium" data-testid={`downloads-${rom.id}`}>
            {rom.downloadCount.toLocaleString()}
          </span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button 
          className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleDownload}
          disabled={downloadMutation.isPending}
          data-testid={`download-button-${rom.id}`}
        >
          <Download size={16} className="mr-2" />
          {downloadMutation.isPending ? "Starting..." : "Download"}
        </Button>
        <Button 
          variant="secondary"
          size="icon"
          className="bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          onClick={handleViewDetails}
          data-testid={`info-button-${rom.id}`}
        >
          <Info size={16} />
        </Button>
      </div>
    </motion.div>
  );
}
