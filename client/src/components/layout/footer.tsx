import { Link } from "wouter";
import { Smartphone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Smartphone className="text-black" size={16} />
              </div>
              <span className="text-xl font-bold gradient-text" data-testid="footer-logo">CurseROMforge</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md" data-testid="footer-description">
              The ultimate destination for Nothing Phone 2a/2a Plus custom ROMs. 
              Built by the community, for the community.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://t.me/nothing_phone_roms" 
                className="text-muted-foreground hover:text-accent transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="telegram-link"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-1.61 7.548c-.12.538-.44.667-.89.416l-2.463-1.812-1.19 1.144c-.131.131-.243.243-.5.243l.179-2.52L15.31 9.77c.213-.188-.046-.293-.33-.106L9.65 12.89l-2.442-.762c-.531-.166-.543-.53.111-.784L20.48 7.69c.442-.166.831.106.688.784-.001-.001-.001-.001 0 0z"/>
                </svg>
              </a>
              <a 
                href="https://discord.gg/nothing_phone_community" 
                className="text-muted-foreground hover:text-accent transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="discord-link"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.445.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="quick-links-title">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-accent transition-colors duration-200" data-testid="footer-home">Home</Link></li>
              <li><Link href="/roms" className="text-muted-foreground hover:text-accent transition-colors duration-200" data-testid="footer-roms">Browse ROMs</Link></li>
              <li><Link href="/community" className="text-muted-foreground hover:text-accent transition-colors duration-200" data-testid="footer-community">Community</Link></li>
              <li>
                <a 
                  href="https://forms.google.com/your-rom-submission-form" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors duration-200"
                  data-testid="footer-submit"
                >
                  Submit ROM
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="resources-title">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200" data-testid="footer-guide">Installation Guide</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200" data-testid="footer-docs">Developer Docs</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200" data-testid="footer-faq">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200" data-testid="footer-support">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 mt-8 text-center">
          <p className="text-muted-foreground text-sm" data-testid="copyright">
            © 2024 Nothing ROM Hub. Built with ❤️ by the Nothing Phone community.
          </p>
        </div>
      </div>
    </footer>
  );
}
