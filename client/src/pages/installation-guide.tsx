import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Download, Smartphone, Shield, CheckCircle } from "lucide-react";

export default function InstallationGuide() {
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
          <h1 className="text-4xl font-bold gradient-text mb-4" data-testid="installation-guide-title">Installation Guide</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="installation-guide-description">
            Complete step-by-step guide to flash custom ROMs on Nothing Phone 2a & 2a Plus devices.
          </p>
        </motion.div>

        {/* Warning */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card border-amber-500/30 bg-amber-500/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-400 mt-1" size={24} />
                <div>
                  <h3 className="text-amber-400 font-semibold mb-2">⚠️ Important Warning</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Flashing custom ROMs will void your warranty</li>
                    <li>• Always create a full backup before proceeding</li>
                    <li>• Ensure your device is fully charged (80%+)</li>
                    <li>• Use original USB cable and stable connection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Prerequisites */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text">Prerequisites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Download size={16} />
                    Required Downloads
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <a href="#" className="text-accent hover:underline">Platform Tools (ADB/Fastboot)</a></li>
                    <li>• <a href="#" className="text-accent hover:underline">Nothing Phone 2a USB Drivers</a></li>
                    <li>• <a href="#" className="text-accent hover:underline">Custom Recovery (TWRP)</a></li>
                    <li>• Your chosen ROM file</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Smartphone size={16} />
                    Device Setup
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Enable Developer Options</li>
                    <li>• Enable USB Debugging</li>
                    <li>• Enable OEM Unlocking</li>
                    <li>• Unlock Bootloader</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Terminal Commands */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text">Terminal Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <Card className="bg-black/80 border-green-500/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <CardTitle className="text-green-400 font-mono text-sm">Terminal</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                  <div className="space-y-3">
                    <div>
                      <div className="text-green-400 mb-1">
                        <span className="text-blue-400">user@pacman</span>
                        <span className="text-white">:</span>
                        <span className="text-yellow-400">~$</span>
                        <span className="text-white ml-2">adb devices</span>
                      </div>
                      <div className="text-gray-300 text-xs mb-1">List of devices attached</div>
                      <div className="text-gray-300 text-xs">aabbccddeecc    device</div>
                    </div>
                    
                    <div>
                      <div className="text-green-400 mb-1">
                        <span className="text-blue-400">user@pacman</span>
                        <span className="text-white">:</span>
                        <span className="text-yellow-400">~$</span>
                        <span className="text-white ml-2">adb reboot bootloader</span>
                      </div>
                      <div className="text-gray-300 text-xs">Rebooting to bootloader...</div>
                    </div>
                    
                    <div>
                      <div className="text-green-400 mb-1">
                        <span className="text-blue-400">user@pacman</span>
                        <span className="text-white">:</span>
                        <span className="text-yellow-400">~$</span>
                        <span className="text-white ml-2">fastboot devices</span>
                      </div>
                      <div className="text-gray-300 text-xs">aabbccddeecc    fastboot</div>
                    </div>
                    
                    <div>
                      <div className="text-green-400 mb-1">
                        <span className="text-blue-400">user@pacman</span>
                        <span className="text-white">:</span>
                        <span className="text-yellow-400">~$</span>
                        <span className="text-white ml-2">fastboot flash recovery twrp.img</span>
                      </div>
                      <div className="text-gray-300 text-xs">Sending 'recovery' (32768 KB)...</div>
                      <div className="text-gray-300 text-xs">OKAY [  1.234s]</div>
                      <div className="text-gray-300 text-xs">Writing 'recovery'...</div>
                      <div className="text-gray-300 text-xs">OKAY [  0.456s]</div>
                    </div>
                    
                    <div>
                      <div className="text-green-400 mb-1">
                        <span className="text-blue-400">user@pacman</span>
                        <span className="text-white">:</span>
                        <span className="text-yellow-400">~$</span>
                        <span className="text-white ml-2">fastboot reboot recovery</span>
                      </div>
                      <div className="text-gray-300 text-xs">Rebooting to recovery...</div>
                      <div className="text-green-500 text-xs mt-2">
                        <span>✓</span>
                        <span className="ml-2">Ready to flash ROM in TWRP</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step by Step */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text">Installation Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Backup Your Device</h4>
                    <p className="text-sm text-muted-foreground">Create a complete backup using TWRP or your preferred method</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Boot to Recovery</h4>
                    <p className="text-sm text-muted-foreground">Use the fastboot commands above to boot into TWRP recovery</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Wipe System</h4>
                    <p className="text-sm text-muted-foreground">Perform a factory reset: Wipe &gt; Advanced Wipe &gt; System, Data, Cache</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Flash ROM</h4>
                    <p className="text-sm text-muted-foreground">Install &gt; Select ROM file &gt; Swipe to confirm flash</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Reboot & Enjoy</h4>
                    <p className="text-sm text-muted-foreground">Reboot system and wait for first boot (may take 5-10 minutes)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Safety Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass-card border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Shield size={20} />
                Safety Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Before Flashing</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-400 mt-0.5" size={14} />
                      <span>Verify ROM compatibility with your exact device model</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-400 mt-0.5" size={14} />
                      <span>Check SHA256 checksums match</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-400 mt-0.5" size={14} />
                      <span>Read installation instructions carefully</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Troubleshooting</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-400 mt-0.5" size={14} />
                      <span>If bootloop occurs, restore from backup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-400 mt-0.5" size={14} />
                      <span>Join our community for support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-400 mt-0.5" size={14} />
                      <span>Never force flash incompatible files</span>
                    </li>
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