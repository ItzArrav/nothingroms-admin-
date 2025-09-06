import { motion } from "framer-motion";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { type Rom } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Info, Calendar, User, Smartphone, Shield, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";

interface RomWithStatus extends Rom {
  approvalStatus?: 'approved' | 'pending';
  isPublic?: boolean;
}

interface RomCardProps {
  rom: RomWithStatus;
}

export default function RomCard({ rom }: RomCardProps) {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roms/all"] });
    },
    onError: () => {
      toast({
        title: "Download Failed",
        description: "Unable to start download. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Admin approval mutation
  const approvalMutation = useMutation({
    mutationFn: async ({ romId, isApproved }: { romId: string; isApproved: boolean }) => {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('dev_token');
      const response = await fetch(`/api/admin/roms/${romId}/approval`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isApproved }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update approval status');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: variables.isApproved ? "ROM Approved" : "ROM Disapproved",
        description: variables.isApproved 
          ? "ROM is now visible to all users."
          : "ROM is now hidden from public view.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roms/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/roms"] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update ROM approval status.",
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

  const handleApproval = (e: React.MouseEvent, approved: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    approvalMutation.mutate({ romId: rom.id, isApproved: approved });
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

  const getBuildStatusBadge = (status: string) => {
    const statusConfig = {
      stable: { color: 'border-green-500 text-green-400', emoji: '🟢', text: 'Stable' },
      beta: { color: 'border-yellow-500 text-yellow-400', emoji: '🟡', text: 'Beta' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.stable;
    return { ...config };
  };

  const getApprovalBadge = () => {
    if (rom.isApproved) {
      return {
        color: 'border-green-500/50 bg-green-500/10 text-green-400',
        emoji: '✅',
        text: 'Approved'
      };
    } else {
      return {
        color: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
        emoji: '⏳',
        text: 'Pending'
      };
    }
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
            className={`text-xs ${getBuildStatusBadge(rom.buildStatus || 'stable').color}`}
          >
            {getBuildStatusBadge(rom.buildStatus || 'stable').emoji} {getBuildStatusBadge(rom.buildStatus || 'stable').text}
          </Badge>
          {/* Admin approval status */}
          {isAdmin && (
            <Badge 
              variant="outline"
              className={`text-xs ${getApprovalBadge().color}`}
            >
              {getApprovalBadge().emoji} {getApprovalBadge().text}
            </Badge>
          )}
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
      
      <div className="space-y-2">
        {/* Regular download button */}
        {rom.isApproved && (
          <Button 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
            onClick={handleDownload}
            disabled={downloadMutation.isPending}
            data-testid={`download-button-${rom.id}`}
          >
            <Download size={16} className="mr-2" />
            {downloadMutation.isPending ? "Starting..." : "Download"}
          </Button>
        )}

        {/* Admin controls */}
        {isAdmin && (
          <div className="flex gap-2">
            {!rom.isApproved ? (
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={(e) => handleApproval(e, true)}
                disabled={approvalMutation.isPending}
                size="sm"
              >
                <Check size={14} className="mr-1" />
                Approve
              </Button>
            ) : (
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={(e) => handleApproval(e, false)}
                disabled={approvalMutation.isPending}
                size="sm"
              >
                <X size={14} className="mr-1" />
                Disapprove
              </Button>
            )}
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleViewDetails}
              size="sm"
            >
              <Info size={14} className="mr-1" />
              Details
            </Button>
          </div>
        )}

        {/* Pending ROM notice for non-admins */}
        {!rom.isApproved && !isAdmin && (
          <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-sm text-yellow-400">⏳ Pending Approval</p>
            <p className="text-xs text-yellow-300/70 mt-1">
              This ROM is awaiting admin approval
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
