import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FaUpload, 
  FaExternalLinkAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCloudUploadAlt
} from 'react-icons/fa';

export default function RomSubmissionDb() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    codename: 'Pacman',
    androidVersion: '',
    romType: 'LineageOS',
    buildStatus: 'stable',
    downloadUrl: '',
    fileSize: '',
    changelog: '',
    maintainer: '',
    submitterName: '',
    submitterContact: '',
    additionalNotes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.downloadUrl.includes('sourceforge.net')) {
      setError('Please use SourceForge for hosting. Other platforms may not be reliable.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          status: 'pending'
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const result = await response.json();
      setSuccess(`ROM submission received! Submission ID: ${result.id}`);
      setStep(3);
      
      // Reset form
      setFormData({
        name: '',
        version: '',
        codename: 'Pacman',
        androidVersion: '',
        romType: 'LineageOS',
        buildStatus: 'stable',
        downloadUrl: '',
        fileSize: '',
        changelog: '',
        maintainer: '',
        submitterName: '',
        submitterContact: '',
        additionalNotes: ''
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const openSourceForge = () => {
    window.open('https://sourceforge.net/projects/', '_blank');
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <Card className="glass-card border-green-500/30 bg-green-500/10 text-center">
            <CardContent className="p-8">
              <FaCheckCircle className="text-green-400 text-6xl mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">ROM Submitted Successfully!</h2>
              <p className="text-gray-300 mb-6">
                Your ROM submission has been saved to our database and will be reviewed by our team. 
                You'll be notified once it's approved and published.
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <h3 className="text-white font-semibold mb-2">What happens next?</h3>
                <div className="text-sm text-gray-300 text-left space-y-1">
                  <p>1. Admin will test your ROM download link</p>
                  <p>2. ROM compatibility and quality check</p>
                  <p>3. If approved, ROM appears on website within 24-48 hours</p>
                  <p>4. If issues found, we'll contact you for clarification</p>
                </div>
              </div>
              <Button
                onClick={() => {setStep(1); setSuccess(null);}}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Submit Another ROM
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 px-4">
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
            Upload your ROM to SourceForge first, then submit the details below for admin review.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
            }`}>
              1
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
            }`}>
              2
            </div>
            <div className={`h-1 w-16 ${step >= 3 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
            }`}>
              3
            </div>
          </div>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card border-cyan-500/30 bg-cyan-500/5">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <FaCloudUploadAlt size={20} />
                  Step 1: Upload to SourceForge
                </CardTitle>
                <CardDescription className="text-gray-400">
                  First, upload your ROM file to SourceForge for reliable hosting
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Upload Instructions:</h3>
                  <ol className="text-gray-300 space-y-3">
                    <li>1. Go to <a href="https://sourceforge.net" target="_blank" className="text-cyan-400 hover:underline">SourceForge.net</a></li>
                    <li>2. Create a free project for your ROM (or use existing)</li>
                    <li>3. Upload your ROM ZIP file (any size supported!)</li>
                    <li>4. Get the direct download link</li>
                    <li>5. Come back here and paste the link in the form</li>
                  </ol>
                </div>

                <div className="text-center">
                  <Button
                    onClick={openSourceForge}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    Go to SourceForge
                  </Button>
                  <p className="text-gray-400 text-sm mt-2">
                    Open SourceForge in a new tab, then come back here
                  </p>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => setStep(2)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    I've Uploaded My ROM - Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FaUpload className="text-green-500" />
                  Step 2: ROM Details & Submission
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Provide your ROM details and SourceForge download link
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {error && (
                  <Alert className="border-red-500/50 bg-red-500/10 mb-6">
                    <FaExclamationTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Download URL - Most Important */}
                  <div className="space-y-2">
                    <Label htmlFor="downloadUrl" className="text-white">SourceForge Download URL *</Label>
                    <Input
                      id="downloadUrl"
                      value={formData.downloadUrl}
                      onChange={(e) => handleInputChange('downloadUrl', e.target.value)}
                      placeholder="https://sourceforge.net/projects/your-project/files/rom-file.zip"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                      required
                    />
                    <p className="text-gray-400 text-xs">Paste the direct download link from SourceForge</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">ROM Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g., LineageOS 21"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="version" className="text-white">Version *</Label>
                      <Input
                        id="version"
                        value={formData.version}
                        onChange={(e) => handleInputChange('version', e.target.value)}
                        placeholder="e.g., v21.0-20240115"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="codename" className="text-white">Device *</Label>
                      <Select value={formData.codename} onValueChange={(value) => handleInputChange('codename', value)}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-cyan-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pacman">Pacman (Nothing Phone 2a)</SelectItem>
                          <SelectItem value="Pacman Pro">Pacman Pro (Nothing Phone 2a Plus)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="androidVersion" className="text-white">Android Version *</Label>
                      <Input
                        id="androidVersion"
                        value={formData.androidVersion}
                        onChange={(e) => handleInputChange('androidVersion', e.target.value)}
                        placeholder="e.g., Android 14"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="romType" className="text-white">ROM Type *</Label>
                      <Select value={formData.romType} onValueChange={(value) => handleInputChange('romType', value)}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-cyan-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LineageOS">LineageOS</SelectItem>
                          <SelectItem value="PixelOS">PixelOS</SelectItem>
                          <SelectItem value="crDroid">crDroid</SelectItem>
                          <SelectItem value="ArrowOS">ArrowOS</SelectItem>
                          <SelectItem value="EvolutionX">EvolutionX</SelectItem>
                          <SelectItem value="Custom">Custom ROM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buildStatus" className="text-white">Build Status *</Label>
                      <Select value={formData.buildStatus} onValueChange={(value) => handleInputChange('buildStatus', value)}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-cyan-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stable">🟢 Stable</SelectItem>
                          <SelectItem value="beta">🟡 Beta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fileSize" className="text-white">File Size *</Label>
                      <Input
                        id="fileSize"
                        value={formData.fileSize}
                        onChange={(e) => handleInputChange('fileSize', e.target.value)}
                        placeholder="e.g., 3.2 GB"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maintainer" className="text-white">Maintainer/Builder</Label>
                      <Input
                        id="maintainer"
                        value={formData.maintainer}
                        onChange={(e) => handleInputChange('maintainer', e.target.value)}
                        placeholder="e.g., @your_name"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="changelog" className="text-white">Features & Changelog</Label>
                    <Textarea
                      id="changelog"
                      value={formData.changelog}
                      onChange={(e) => handleInputChange('changelog', e.target.value)}
                      placeholder="- Working WiFi, Bluetooth, Calls&#10;- Camera functionality&#10;- Updated security patches&#10;- Known issues: ..."
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 min-h-[120px]"
                    />
                  </div>

                  {/* Submitter Details */}
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-white font-semibold mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="submitterName" className="text-white">Your Name *</Label>
                        <Input
                          id="submitterName"
                          value={formData.submitterName}
                          onChange={(e) => handleInputChange('submitterName', e.target.value)}
                          placeholder="Your name or username"
                          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="submitterContact" className="text-white">Contact *</Label>
                        <Input
                          id="submitterContact"
                          value={formData.submitterContact}
                          onChange={(e) => handleInputChange('submitterContact', e.target.value)}
                          placeholder="Email, Telegram, or Discord"
                          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes" className="text-white">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                      placeholder="Any additional information for the admin..."
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {submitting ? (
                        'Submitting...'
                      ) : (
                        <>
                          <FaUpload className="mr-2" />
                          Submit for Review
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
