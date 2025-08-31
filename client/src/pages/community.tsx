import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function Community() {
  const openTelegram = () => {
    window.open("https://t.me/nothing_phone_roms", "_blank");
  };

  const openDiscord = () => {
    window.open("https://discord.gg/nothing_phone_community", "_blank");
  };

  const openDevForm = () => {
    window.open("https://forms.google.com/developer-application-form", "_blank");
  };

  const openGitHub = () => {
    window.open("https://github.com/nothing-rom-hub", "_blank");
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-4" data-testid="community-title">Join Our Community</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="community-description">
            Connect with fellow Nothing Phone users, developers, and ROM enthusiasts. Get support, share feedback, and stay updated with the latest developments.
          </p>
        </motion.div>
        
        {/* Community Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Telegram Community */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-card hover:neon-border transition-all duration-300 text-center h-full">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fab fa-telegram-plane text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3" data-testid="telegram-title">Telegram Group</h3>
                <p className="text-muted-foreground mb-6 text-sm" data-testid="telegram-description">
                  Join our active Telegram community for real-time discussions, support, and ROM announcements.
                </p>
                <Button 
                  className="bg-blue-500 text-white hover:bg-blue-600 w-full"
                  onClick={openTelegram}
                  data-testid="join-telegram"
                >
                  Join Telegram
                  <ExternalLink className="ml-2" size={16} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Discord Server */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card hover:neon-border transition-all duration-300 text-center h-full">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fab fa-discord text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3" data-testid="discord-title">Discord Server</h3>
                <p className="text-muted-foreground mb-6 text-sm" data-testid="discord-description">
                  Connect on Discord for organized discussions, voice chats, and community events.
                </p>
                <Button 
                  className="bg-indigo-500 text-white hover:bg-indigo-600 w-full"
                  onClick={openDiscord}
                  data-testid="join-discord"
                >
                  Join Discord
                  <ExternalLink className="ml-2" size={16} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Developer Program */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-card hover:neon-border transition-all duration-300 text-center h-full">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-code text-black text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3" data-testid="developer-title">Become a Developer</h3>
                <p className="text-muted-foreground mb-6 text-sm" data-testid="developer-description">
                  Interested in contributing? Learn how to become a ROM developer and join our contributor program.
                </p>
                <Button 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
                  onClick={openDevForm}
                  data-testid="apply-developer"
                >
                  Apply Now
                  <ExternalLink className="ml-2" size={16} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Community Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="gradient-text" data-testid="guidelines-title">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Be Respectful</h4>
                  <p className="text-sm text-muted-foreground">Treat all community members with respect and kindness. No harassment, discrimination, or toxic behavior.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Stay On Topic</h4>
                  <p className="text-sm text-muted-foreground">Keep discussions related to Nothing Phone ROMs, development, and technical support.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">No Piracy</h4>
                  <p className="text-sm text-muted-foreground">Do not share or request copyrighted content, proprietary software, or paid apps.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Help Others</h4>
                  <p className="text-sm text-muted-foreground">Share your knowledge and help fellow community members with their questions and issues.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text" data-testid="resources-title">Developer Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Getting Started</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Android ROM development basics</li>
                    <li>• Nothing Phone 2a device trees</li>
                    <li>• Build environment setup</li>
                    <li>• Testing and debugging guide</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Submission Process</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• ROM quality requirements</li>
                    <li>• Testing checklist</li>
                    <li>• Documentation standards</li>
                    <li>• Review and approval process</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <Button 
                  variant="outline" 
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  onClick={openGitHub}
                  data-testid="github-resources"
                >
                  <i className="fab fa-github mr-2"></i>
                  View on GitHub
                  <ExternalLink className="ml-2" size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
