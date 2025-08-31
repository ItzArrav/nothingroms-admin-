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
              <span className="text-xl font-bold gradient-text" data-testid="footer-logo">Nothing ROM Hub</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md" data-testid="footer-description">
              The ultimate destination for Nothing Phone 2a/2a Plus custom ROMs. 
              Built by the community, for the community.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/nothing-rom-hub" 
                className="text-muted-foreground hover:text-accent transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="github-link"
              >
                <i className="fab fa-github text-xl"></i>
              </a>
              <a 
                href="https://t.me/nothing_phone_roms" 
                className="text-muted-foreground hover:text-accent transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="telegram-link"
              >
                <i className="fab fa-telegram text-xl"></i>
              </a>
              <a 
                href="https://discord.gg/nothing_phone_community" 
                className="text-muted-foreground hover:text-accent transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="discord-link"
              >
                <i className="fab fa-discord text-xl"></i>
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
