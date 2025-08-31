import { motion } from "framer-motion";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { type Rom } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Info, Calendar, User, Smartphone } from "lucide-react";
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
      className="glass-card rounded-2xl p-6 hover:neon-border transition-all duration-300 group cursor-pointer bg-card/60 backdrop-blur-md"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => window.location.href = `/roms/${rom.id}`}
      data-testid={`rom-card-${rom.id}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Smartphone className="text-black" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-200" data-testid={`rom-name-${rom.id}`}>
              {rom.name}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid={`rom-codename-${rom.id}`}>
              {rom.romType} • Based on AOSP
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge 
            variant="secondary" 
            className="bg-secondary/20 text-secondary border-secondary/30" 
            data-testid={`android-version-${rom.id}`}
          >
            {rom.androidVersion}
          </Badge>
          <Badge 
            variant="outline"
            className={`text-xs ${
              rom.romType === 'Stable' ? 'border-green-500 text-green-400' :
              rom.romType === 'Beta' ? 'border-yellow-500 text-yellow-400' :
              'border-orange-500 text-orange-400'
            }`}
          >
            Stable
          </Badge>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold text-foreground mb-2">Why it's different:</h4>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {rom.changelog?.split('\n')[0] || "Enhanced Android experience with essential privacy features and long-term support."}
        </p>
      </div>
      
      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-muted-foreground">{rom.version}</span>
        <span className="text-foreground font-medium">{(Math.random() * 5 + 1).toFixed(1)} GB</span>
      </div>
      
      <Button 
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
        onClick={handleDownload}
        disabled={downloadMutation.isPending}
        data-testid={`download-button-${rom.id}`}
      >
        <Download size={16} className="mr-2" />
        {downloadMutation.isPending ? "Starting..." : "Download"}
      </Button>
    </motion.div>
  );
}
