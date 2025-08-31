import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { type Rom } from "@shared/schema";
import RomCard from "@/components/rom-card";
import SearchFilters from "@/components/search-filters";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Info, HelpCircle, CheckCircle, Shield } from "lucide-react";

export default function Home() {
  const { data: featuredRoms, isLoading } = useQuery<Rom[]>({
    queryKey: ["/api/roms/featured"],
  });

  const handleSubmitROM = () => {
    // Open Google Form for ROM submission
    window.open("https://forms.google.com/your-rom-submission-form", "_blank");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4" data-testid="hero-section">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" data-testid="hero-title">
              Custom ROMs for<br />
              <span className="gradient-text">Nothing Phone 2a</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="hero-description">
              Discover, download, and contribute to the ultimate collection of custom Android ROMs 
              specifically crafted for Nothing Phone 2a and 2a Plus devices.
            </p>
            
            <SearchFilters />
          </motion.div>
        </div>
      </section>

      {/* Featured ROMs Section */}
      <section className="py-16 px-4" data-testid="featured-roms-section">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold gradient-text" data-testid="featured-roms-title">Featured ROMs</h2>
            <Button 
              variant="ghost" 
              className="text-accent hover:text-accent/80"
              onClick={() => window.location.href = "/roms"}
              data-testid="view-all-roms"
            >
              View All →
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card rounded-xl p-6 animate-pulse" data-testid={`rom-skeleton-${i}`}>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-6"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {featuredRoms?.map((rom, index) => (
                <motion.div
                  key={rom.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <RomCard rom={rom} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* About/FAQ Section */}
      <section className="py-16 px-4" data-testid="about-faq-section">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About Card */}
            <motion.div 
              className="glass-card rounded-xl p-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <Info className="text-black text-xl" />
                </div>
                <h3 className="text-2xl font-bold gradient-text mb-4" data-testid="about-title">About Nothing ROM Hub</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6" data-testid="about-description">
                Nothing ROM Hub is the ultimate destination for custom Android ROMs designed specifically for Nothing Phone 2a and 2a Plus devices. Our community-driven platform connects developers and users, providing a curated collection of stable, tested, and regularly updated custom ROMs.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-secondary mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-foreground">Verified ROMs</h4>
                    <p className="text-sm text-muted-foreground">All ROMs are tested and verified by our community moderators</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="text-secondary mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-foreground">Secure Downloads</h4>
                    <p className="text-sm text-muted-foreground">Every ROM includes SHA256 checksums for integrity verification</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FAQ Card */}
            <motion.div 
              className="glass-card rounded-xl p-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mb-4">
                  <HelpCircle className="text-black text-xl" />
                </div>
                <h3 className="text-2xl font-bold gradient-text mb-4" data-testid="faq-title">Frequently Asked Questions</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">What is a custom ROM?</h4>
                  <p className="text-sm text-muted-foreground">A custom ROM is a modified version of Android that provides enhanced features, better performance, and a different user experience compared to stock firmware.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Is it safe to flash custom ROMs?</h4>
                  <p className="text-sm text-muted-foreground">While flashing ROMs carries inherent risks, all ROMs on our platform are community-tested. Always follow installation guides carefully and create backups.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">How do I submit my ROM?</h4>
                  <p className="text-sm text-muted-foreground">Developers can submit ROMs through our Google Form integration. All submissions are reviewed before being published on the platform.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
