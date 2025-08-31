import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Upload, FileCheck, Users, Clock } from "lucide-react";

export default function SubmitRom() {
  const openSubmissionForm = () => {
    window.open("https://forms.gle/YourActualFormID", "_blank");
  };


  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-4" data-testid="submit-rom-title">Submit Your ROM</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="submit-rom-description">
            Share your custom ROM with the Nothing Phone community. All submissions are reviewed by our team before being published.
          </p>
        </motion.div>

        {/* Submission Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* For Developers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <Upload className="text-black" size={20} />
                  </div>
                  <CardTitle className="gradient-text">Submit ROM</CardTitle>
                </div>
                <Badge variant="secondary" className="w-fit">For Developers</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Already a verified developer? Submit your ROM directly through our Google Form.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>ROM name and version</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Device codename (Pacman/Pro)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Download link and SHA256 checksum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Detailed changelog</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={openSubmissionForm}
                  data-testid="submit-rom-form"
                >
                  Submit ROM
                  <ExternalLink className="ml-2" size={16} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card h-full bg-black/80 border-green-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <CardTitle className="text-green-400 font-mono text-sm">Terminal</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                <div className="space-y-2">
                  <div className="text-green-400">
                    <span className="text-blue-400">user@pacman</span>
                    <span className="text-white">:</span>
                    <span className="text-yellow-400">~$</span>
                    <span className="text-white ml-2">adb devices</span>
                  </div>
                  <div className="text-gray-300">List of devices attached</div>
                  <div className="text-gray-300">aabbccddeecc    device</div>
                  
                  <div className="text-green-400 mt-4">
                    <span className="text-blue-400">user@pacman</span>
                    <span className="text-white">:</span>
                    <span className="text-yellow-400">~$</span>
                    <span className="text-white ml-2">adb reboot fastboot</span>
                  </div>
                  
                  <div className="text-green-400 mt-4">
                    <span className="text-blue-400">user@pacman</span>
                    <span className="text-white">:</span>
                    <span className="text-yellow-400">~$</span>
                    <span className="text-white ml-2">fastboot devices</span>
                  </div>
                  <div className="text-gray-300">aabbccddeecc    fastboot</div>
                  
                  <div className="text-green-400 mt-4">
                    <span className="text-blue-400">user@pacman</span>
                    <span className="text-white">:</span>
                    <span className="text-yellow-400">~$</span>
                    <span className="text-white ml-2">fastboot getvar all</span>
                  </div>
                  <div className="text-gray-300">(bootloader) version-bootloader: unknown</div>
                  <div className="text-gray-300">(bootloader) version-baseband: unknown</div>
                  <div className="text-gray-300">(bootloader) serialno: aabbccddeecc</div>
                  <div className="text-gray-300 mt-2">
                    <span className="text-green-500">✓</span>
                    <span className="ml-2">Device ready for flashing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text text-center">How ROM Submission Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="text-white" size={20} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">1. Submit Form</h4>
                  <p className="text-sm text-muted-foreground">
                    Fill out the Google Form with ROM details and download links
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileCheck className="text-white" size={20} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">2. Auto-Save</h4>
                  <p className="text-sm text-muted-foreground">
                    Form data automatically saves to our Google Sheets database
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="text-white" size={20} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">3. Review</h4>
                  <p className="text-sm text-muted-foreground">
                    Our moderators test and verify the ROM for quality and safety
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="text-white" size={20} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">4. Published</h4>
                  <p className="text-sm text-muted-foreground">
                    Approved ROMs appear on the website within 24-48 hours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Requirements */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-card border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">⚠️ Submission Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Technical Requirements</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• ROM must be for Nothing Phone 2a/2a Plus only</li>
                    <li>• Include working boot.img and system.img</li>
                    <li>• Provide SHA256 checksums for verification</li>
                    <li>• Test basic functionality (calls, SMS, WiFi, etc.)</li>
                    <li>• Include installation instructions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Community Guidelines</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• No proprietary vendor blobs without permission</li>
                    <li>• Open source components preferred</li>
                    <li>• No malware or tracking software</li>
                    <li>• Respect original authors' credits</li>
                    <li>• Provide support in community channels</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}