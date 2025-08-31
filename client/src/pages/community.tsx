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
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-1.61 7.548c-.12.538-.44.667-.89.416l-2.463-1.812-1.19 1.144c-.131.131-.243.243-.5.243l.179-2.52L15.31 9.77c.213-.188-.046-.293-.33-.106L9.65 12.89l-2.442-.762c-.531-.166-.543-.53.111-.784L20.48 7.69c.442-.166.831.106.688.784-.001-.001-.001-.001 0 0z"/>
                  </svg>
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
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.445.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
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
                  <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3" data-testid="developer-title">Developer Resources</h3>
                <p className="text-muted-foreground mb-6 text-sm" data-testid="developer-description">
                  Access developer tools, documentation, and resources for ROM development.
                </p>
                <Button 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
                  onClick={openGitHub}
                  data-testid="view-resources"
                >
                  View Resources
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
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
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
