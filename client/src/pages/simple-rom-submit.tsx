import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Upload, MessageCircle, Github } from 'lucide-react';

export default function SimpleRomSubmit() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const openGitHubIssue = () => {
    const templateUrl = `https://github.com/your-org/nothing-roms/issues/new?assignees=&labels=rom-submission&template=rom-submission.md&title=[ROM] New ROM Submission`;
    window.open(templateUrl, '_blank');
  };

  const openGoogleForm = () => {
    window.open('https://forms.google.com/nothing-rom-submission', '_blank');
  };

  const openTelegram = () => {
    window.open('https://t.me/nothing_phone_roms', '_blank');
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
          <h1 className="text-4xl font-bold gradient-text mb-4">Submit Your ROM</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share your custom ROM with the Nothing Phone community. Choose your preferred submission method below.
          </p>
        </motion.div>

        {/* Upload Instructions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card border-cyan-500/30 bg-cyan-500/5">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Upload size={20} />
                📋 Before You Submit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">1. Upload Your ROM First</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">Upload your ROM (3GB+ supported) to:</p>
                      <ul className="space-y-1 ml-4">
                        <li>• <a href="https://sourceforge.net" target="_blank" className="text-cyan-400 hover:underline">SourceForge</a> (Unlimited size, fast)</li>
                        <li>• <a href="https://archive.org" target="_blank" className="text-cyan-400 hover:underline">Internet Archive</a> (Permanent, reliable)</li>
                        <li>• <a href="https://mega.nz" target="_blank" className="text-cyan-400 hover:underline">MEGA</a> (50GB free)</li>
                        <li>• <a href="https://drive.google.com" target="_blank" className="text-cyan-400 hover:underline">Google Drive</a> (15GB free)</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">2. Required Information</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>• ROM name and version</p>
                      <p>• Device compatibility (Pacman/Pacman Pro)</p>
                      <p>• Android version</p>
                      <p>• Download link (direct)</p>
                      <p>• Installation instructions</p>
                      <p>• Changelog/features</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submission Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* GitHub Issues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className={`glass-card hover:neon-border transition-all duration-300 cursor-pointer h-full ${selectedMethod === 'github' ? 'border-green-500/50' : ''}`}
                  onClick={() => setSelectedMethod('github')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Github className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg">GitHub Issue</CardTitle>
                <CardDescription>
                  Structured submission with template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">✅ Organized</Badge>
                    <Badge variant="secondary" className="text-xs">📝 Template</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use our GitHub issue template with pre-filled sections for easy submission.
                  </p>
                </div>
                <Button 
                  className="w-full bg-gray-700 hover:bg-gray-600"
                  onClick={openGitHubIssue}
                >
                  Open GitHub Issue
                  <ExternalLink className="ml-2" size={14} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Google Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className={`glass-card hover:neon-border transition-all duration-300 cursor-pointer h-full ${selectedMethod === 'form' ? 'border-blue-500/50' : ''}`}
                  onClick={() => setSelectedMethod('form')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Google Form</CardTitle>
                <CardDescription>
                  Simple form submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">🚀 Quick</Badge>
                    <Badge variant="secondary" className="text-xs">📧 Email</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fill out a simple Google Form. We'll get an email notification.
                  </p>
                </div>
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={openGoogleForm}
                >
                  Open Google Form
                  <ExternalLink className="ml-2" size={14} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Telegram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className={`glass-card hover:neon-border transition-all duration-300 cursor-pointer h-full ${selectedMethod === 'telegram' ? 'border-cyan-500/50' : ''}`}
                  onClick={() => setSelectedMethod('telegram')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg">Telegram Chat</CardTitle>
                <CardDescription>
                  Direct community submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">💬 Chat</Badge>
                    <Badge variant="secondary" className="text-xs">🤝 Community</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Submit directly in our Telegram group and get instant feedback.
                  </p>
                </div>
                <Button 
                  className="w-full bg-cyan-500 hover:bg-cyan-600"
                  onClick={openTelegram}
                >
                  Join Telegram
                  <ExternalLink className="ml-2" size={14} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Submission Template */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text">Submission Template</CardTitle>
              <CardDescription>
                Use this template when submitting your ROM (copy and paste)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm">
                <div className="space-y-2 text-gray-300">
                  <div><span className="text-cyan-400">**ROM Name:**</span> LineageOS 21</div>
                  <div><span className="text-cyan-400">**Version:**</span> 21.0-20241106-UNOFFICIAL</div>
                  <div><span className="text-cyan-400">**Device:**</span> Nothing Phone 2a (Pacman)</div>
                  <div><span className="text-cyan-400">**Android Version:**</span> Android 14</div>
                  <div><span className="text-cyan-400">**ROM Type:**</span> LineageOS/PixelOS/crDroid/etc.</div>
                  <div><span className="text-cyan-400">**Build Status:**</span> Stable/Beta</div>
                  <div><span className="text-cyan-400">**File Size:**</span> 3.2 GB</div>
                  <div><span className="text-cyan-400">**Download Link:**</span> https://sourceforge.net/.../rom.zip</div>
                  <div><span className="text-cyan-400">**SHA256:**</span> (optional but recommended)</div>
                  <div className="pt-2">
                    <span className="text-cyan-400">**Features:**</span>
                    <div className="ml-4 mt-1">
                      <div>- Working WiFi, Bluetooth, Calls</div>
                      <div>- Camera functionality</div>
                      <div>- Fingerprint sensor</div>
                      <div>- SELinux enforcing</div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="text-cyan-400">**Known Issues:**</span>
                    <div className="ml-4 mt-1">
                      <div>- None currently</div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="text-cyan-400">**Installation:**</span>
                    <div className="ml-4 mt-1">
                      <div>1. Boot to TWRP recovery</div>
                      <div>2. Wipe System, Data, Cache</div>
                      <div>3. Flash ROM ZIP</div>
                      <div>4. Reboot system</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  onClick={() => navigator.clipboard.writeText(`**ROM Name:** 
**Version:** 
**Device:** Nothing Phone 2a (Pacman)
**Android Version:** 
**ROM Type:** 
**Build Status:** 
**File Size:** 
**Download Link:** 
**SHA256:** 

**Features:**
- 
- 
- 

**Known Issues:**
- 

**Installation:**
1. Boot to TWRP recovery
2. Wipe System, Data, Cache  
3. Flash ROM ZIP
4. Reboot system`)}
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                  📋 Copy Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Review Process */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="glass-card border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">📋 What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">1</div>
                  <h4 className="font-semibold text-foreground mb-2">Review</h4>
                  <p className="text-muted-foreground">We review your submission for completeness and compatibility</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">2</div>
                  <h4 className="font-semibold text-foreground mb-2">Test</h4>
                  <p className="text-muted-foreground">Community members may test the ROM and provide feedback</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">3</div>
                  <h4 className="font-semibold text-foreground mb-2">Publish</h4>
                  <p className="text-muted-foreground">Approved ROMs are added to our website within 24-48 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
