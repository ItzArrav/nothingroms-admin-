import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Smartphone, Menu } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmitROM = () => {
    window.open("https://forms.gle/YourActualFormID", "_blank");
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/roms", label: "ROMs" },
    { href: "/installation-guide", label: "Installation Guide" },
    { href: "/community", label: "Community" },
    { href: "/submit", label: "Submit ROM" },
  ];

  const NavLinks = ({ mobile = false, onClose = () => {} }) => (
    <div className={`${mobile ? "flex flex-col space-y-4" : "hidden md:flex items-center space-x-8"}`}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
        >
          <span 
            className={`hover:text-accent transition-colors duration-200 ${
              location === item.href ? "text-accent" : "text-foreground"
            }`}
            data-testid={`nav-${item.label.toLowerCase()}`}
          >
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );

  return (
    <motion.header 
      className="sticky top-0 z-50 glass-card border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" data-testid="logo-link">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Smartphone className="text-black" size={16} />
              </div>
              <span className="text-xl font-bold gradient-text" data-testid="site-title">
                Nothing ROM Hub
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <NavLinks />
          
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                data-testid="mobile-menu-trigger"
              >
                <Menu size={24} />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-card border-border">
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <Smartphone className="text-black" size={16} />
                  </div>
                  <span className="text-xl font-bold gradient-text">Nothing ROM Hub</span>
                </div>
                <NavLinks mobile onClose={() => setIsOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
