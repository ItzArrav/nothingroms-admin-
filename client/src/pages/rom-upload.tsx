import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FaUpload, FaFile, FaCheckCircle, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const uploadSchema = z.object({
  name: z.string().min(3, 'ROM name must be at least 3 characters'),
  codename: z.string().min(1, 'Device codename is required'),
  version: z.string().min(1, 'Version is required'),
  androidVersion: z.string().min(1, 'Android version is required'),
  romType: z.string().min(1, 'ROM type is required'),
  buildStatus: z.string().min(1, 'Build status is required'),
  downloadUrl: z.string().url('Please provide a valid download URL'),
  fileSize: z.string().min(1, 'File size is required'),
  changelog: z.string().optional(),
  maintainer: z.string().optional(),
});

type UploadForm = z.infer<typeof uploadSchema>;

interface Developer {
  id: string;
  username: string;
  displayName: string;
}

export function RomUpload() {
  const [, setLocation] = useLocation();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('dev_token');
    const userData = localStorage.getItem('dev_user');
    
    if (!token || !userData) {
      setLocation('/developer/login');
      return;
    }

    try {
      const dev = JSON.parse(userData);
      setDeveloper(dev);
      setValue('maintainer', dev.displayName);
    } catch (error) {
      console.error('Error parsing user data:', error);
      setLocation('/developer/login');
    }
  }, [setLocation, setValue]);


  const onSubmit = async (data: UploadForm) => {
    if (!developer) {
      setError('Authentication required');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('dev_token');
      
      const response = await fetch('/api/developer/roms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Submission failed');
      }

      const result = await response.json();
      setSuccess('ROM submission received! Your ROM will be reviewed and published within 24-48 hours. You will be notified once it\'s live.');
      
      // Reset form
      window.location.reload();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!developer) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => setLocation('/developer/dashboard')}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <FaArrowLeft className="mr-2" size={14} />
              Back to Dashboard
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Upload ROM</h1>
          <p className="text-gray-300">
            Share your custom ROM with the Nothing Phone community
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FaUpload className="text-cyan-500" />
                ROM Submission Form
              </CardTitle>
              <CardDescription className="text-gray-400">
                Submit your ROM details and download link. Perfect for ROMs over 2GB! All submissions will be reviewed before being published.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Status Messages */}
                {error && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <FaExclamationTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <FaCheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-300">{success}</AlertDescription>
                  </Alert>
                )}

                {/* Upload Instructions */}
                <div className="space-y-4 p-6 border border-cyan-500/30 rounded-lg bg-cyan-500/5">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    📋 ROM Upload Steps (For 3GB+ Files)
                  </h3>
                  <div className="text-gray-300 space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 min-w-fit">1</Badge>
                      <div>
                        <p className="font-medium">Upload your ROM to one of these platforms:</p>
                        <div className="mt-2 space-y-1 text-sm text-gray-400">
                          <p>• <a href="https://sourceforge.net" target="_blank" className="text-cyan-400 hover:underline">SourceForge</a> (Unlimited size, fast)</p>
                          <p>• <a href="https://archive.org" target="_blank" className="text-cyan-400 hover:underline">Internet Archive</a> (Unlimited size, permanent)</p>
                          <p>• <a href="https://mega.nz" target="_blank" className="text-cyan-400 hover:underline">MEGA</a> (50GB free)</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 min-w-fit">2</Badge>
                      <p>Copy the <strong>direct download link</strong> to your uploaded ROM file</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 min-w-fit">3</Badge>
                      <p>Fill out the form below with ROM details and paste the download link</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 min-w-fit">4</Badge>
                      <p>Submit for review - we'll add it to the site within 24-48 hours!</p>
                    </div>
                  </div>
                </div>

                {/* Download URL */}
                <div className="space-y-2">
                  <Label htmlFor="downloadUrl" className="text-white">ROM Download URL *</Label>
                  <Input
                    id="downloadUrl"
                    {...register('downloadUrl')}
                    placeholder="https://sourceforge.net/projects/.../files/rom-file.zip or https://archive.org/download/.../rom.zip"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                  />
                  {errors.downloadUrl && (
                    <p className="text-red-400 text-sm">{errors.downloadUrl.message}</p>
                  )}
                  <p className="text-gray-400 text-xs">Make sure this is a direct download link to your ROM ZIP file</p>
                </div>

                {/* File Size */}
                <div className="space-y-2">
                  <Label htmlFor="fileSize" className="text-white">File Size *</Label>
                  <Input
                    id="fileSize"
                    {...register('fileSize')}
                    placeholder="e.g., 3.2 GB, 1.8 GB, 4.5 GB"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                  />
                  {errors.fileSize && (
                    <p className="text-red-400 text-sm">{errors.fileSize.message}</p>
                  )}
                  <p className="text-gray-400 text-xs">Approximate size of your ROM file</p>
                </div>

                {/* ROM Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">ROM Name *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="e.g., LineageOS 21"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="version" className="text-white">Version *</Label>
                    <Input
                      id="version"
                      {...register('version')}
                      placeholder="e.g., v21.0-20240115"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                    />
                    {errors.version && (
                      <p className="text-red-400 text-sm">{errors.version.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codename" className="text-white">Device Codename *</Label>
                    <Select onValueChange={(value) => setValue('codename', value)}>
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-cyan-500">
                        <SelectValue placeholder="Select device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pacman">Pacman (Nothing Phone 2a)</SelectItem>
                        <SelectItem value="Pacman Pro">Pacman Pro (Nothing Phone 2a Plus)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.codename && (
                      <p className="text-red-400 text-sm">{errors.codename.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="androidVersion" className="text-white">Android Version *</Label>
                    <Input
                      id="androidVersion"
                      {...register('androidVersion')}
                      placeholder="e.g., Android 14, Android 13, Android 12L"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                    />
                    {errors.androidVersion && (
                      <p className="text-red-400 text-sm">{errors.androidVersion.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="romType" className="text-white">ROM Type *</Label>
                    <Select onValueChange={(value) => setValue('romType', value)}>
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-cyan-500">
                        <SelectValue placeholder="Select ROM type" />
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
                    {errors.romType && (
                      <p className="text-red-400 text-sm">{errors.romType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buildStatus" className="text-white">Build Status *</Label>
                    <Select onValueChange={(value) => setValue('buildStatus', value)}>
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white focus:border-cyan-500">
                        <SelectValue placeholder="Select build status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stable">🟢 Stable</SelectItem>
                        <SelectItem value="beta">🟡 Beta</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.buildStatus && (
                      <p className="text-red-400 text-sm">{errors.buildStatus.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintainer" className="text-white">Maintainer</Label>
                  <Input
                    id="maintainer"
                    {...register('maintainer')}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="changelog" className="text-white">Changelog (Optional)</Label>
                  <Textarea
                    id="changelog"
                    {...register('changelog')}
                    placeholder="- Fixed WiFi issues&#10;- Improved battery life&#10;- Updated security patches"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 min-h-[120px]"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-semibold py-3"
                  >
                    {submitting ? (
                      <>Submitting...</>
                    ) : (
                      <>
                        <FaUpload className="mr-2" />
                        Submit ROM for Review
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Info */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">📋 Requirements</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Compatible with Nothing Phone 2a/2a Plus</li>
                      <li>• ZIP file format (<span className="text-green-400 font-semibold">Any size supported!</span>)</li>
                      <li>• Upload to external platform first</li>
                      <li>• Working basic functionality</li>
                      <li>• Tested and stable build</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-3">⏱️ Review Process</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Submissions are manually reviewed</li>
                      <li>• We verify the download link works</li>
                      <li>• Approval typically takes 24-48 hours</li>
                      <li>• You'll be notified of the status</li>
                      <li>• Approved ROMs appear on the site</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
