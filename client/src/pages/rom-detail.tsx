import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { type Rom } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Calendar, User, Smartphone, Hash, ArrowLeft, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function RomDetail() {
  const [match, params] = useRoute("/roms/:id");
  const { toast } = useToast();
  
  const { data: rom, isLoading } = useQuery<Rom>({
    queryKey: ["/api/roms", params?.id],
    enabled: !!params?.id,
  });

  const downloadMutation = useMutation({
    mutationFn: async (romId: string) => {
      const response = await apiRequest("POST", `/api/roms/${romId}/download`);
      return response.json();
    },
    onSuccess: (data) => {
      // Open download link
      window.open(data.downloadUrl, "_blank");
      toast({
        title: "Download Started",
        description: "Please verify the checksum after download.",
      });
      // Refresh ROM data to update download count
      queryClient.invalidateQueries({ queryKey: ["/api/roms", params?.id] });
    },
    onError: () => {
      toast({
        title: "Download Failed",
        description: "Unable to start download. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDownload = () => {
    if (rom) {
      downloadMutation.mutate(rom.id);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-32"></div>
            <div className="h-12 bg-muted rounded mb-6 w-3/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-muted rounded"></div>
              </div>
              <div>
                <div className="h-48 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!rom) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4" data-testid="rom-not-found">ROM Not Found</h1>
          <p className="text-muted-foreground mb-8">The ROM you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()} data-testid="back-button">
            <ArrowLeft className="mr-2" size={16} />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 text-accent hover:text-accent/80"
          onClick={() => window.history.back()}
          data-testid="back-to-roms"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to ROMs
        </Button>

        {/* ROM Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2" data-testid="rom-name">{rom.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Smartphone size={16} />
                  <span data-testid="rom-codename">{rom.codename}</span>
                </span>
                <span className="flex items-center gap-1">
                  <User size={16} />
                  <span data-testid="rom-maintainer">{rom.maintainer}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span data-testid="rom-updated">{formatDate(rom.updatedAt)}</span>
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-secondary/20 text-secondary" data-testid="android-version">
              {rom.androidVersion}
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Changelog */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle data-testid="changelog-title">Changelog</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground whitespace-pre-line" data-testid="changelog-content">
                  {rom.changelog || "No changelog available."}
                </div>
              </CardContent>
            </Card>

            {/* ROM Details */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle data-testid="details-title">ROM Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ROM Type</p>
                    <p className="font-medium" data-testid="rom-type">{rom.romType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Version</p>
                    <p className="font-medium" data-testid="rom-version">{rom.version}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Downloads</p>
                    <p className="font-medium" data-testid="download-count">{rom.downloadCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Device Codename</p>
                    <p className="font-medium" data-testid="device-codename">{rom.codename}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">SHA256 Checksum</p>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Hash size={16} className="text-muted-foreground flex-shrink-0" />
                    <code className="text-xs font-mono break-all" data-testid="rom-checksum">{rom.checksum}</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Download Card */}
            <Card className="glass-card">
              <CardContent className="pt-6">
                <Button 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mb-4"
                  onClick={handleDownload}
                  disabled={downloadMutation.isPending}
                  data-testid="download-rom-button"
                >
                  <Download className="mr-2" size={16} />
                  {downloadMutation.isPending ? "Starting Download..." : "Download ROM"}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  <p>Always verify the checksum</p>
                  <p>after downloading!</p>
                </div>
              </CardContent>
            </Card>

            {/* ROM Info */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg" data-testid="rom-info-title">ROM Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Maintainer</p>
                  <p className="font-medium" data-testid="sidebar-maintainer">{rom.maintainer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Android Version</p>
                  <p className="font-medium" data-testid="sidebar-android">{rom.androidVersion}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium" data-testid="sidebar-updated">{formatDate(rom.updatedAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                  <p className="font-medium" data-testid="sidebar-downloads">{rom.downloadCount.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="glass-card border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-amber-400" data-testid="warning-title">⚠️ Important</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Flashing custom ROMs voids warranty</p>
                <p>• Always create a backup before flashing</p>
                <p>• Verify checksums for security</p>
                <p>• Follow installation guides carefully</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
