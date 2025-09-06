import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FaArrowLeft, FaDownload, FaEye, FaEdit, FaTrash, FaCheck, FaClock, FaTimes } from 'react-icons/fa';

interface Rom {
  id: string;
  name: string;
  version: string;
  androidVersion: string;
  romType: string;
  buildStatus: string;
  isApproved: boolean;
  downloadCount: number;
  fileName: string;
  fileSize: string;
  createdAt: string;
  updatedAt: string;
}

export function MyRoms() {
  const [, setLocation] = useLocation();
  const [roms, setRoms] = useState<Rom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('dev_token');
    if (!token) {
      setLocation('/developer/login');
      return;
    }

    fetchRoms();
  }, [setLocation]);

  const fetchRoms = async () => {
    try {
      const token = localStorage.getItem('dev_token');
      const response = await fetch('/api/developer/roms', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ROMs');
      }

      const data = await response.json();
      setRoms(data.roms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ROMs');
    } finally {
      setLoading(false);
    }
  };

  const deleteRom = async (romId: string) => {
    if (!confirm('Are you sure you want to delete this ROM?')) {
      return;
    }

    try {
      const token = localStorage.getItem('dev_token');
      const response = await fetch(`/api/developer/roms/${romId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete ROM');
      }

      // Remove ROM from the list
      setRoms(roms.filter(rom => rom.id !== romId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ROM');
    }
  };

  const getStatusBadge = (isApproved: boolean) => {
    if (isApproved) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
          <FaCheck className="mr-1" size={10} />
          Approved
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
          <FaClock className="mr-1" size={10} />
          Pending Review
        </Badge>
      );
    }
  };

  const getBuildStatusBadge = (status: string) => {
    const statusConfig = {
      stable: { bgColor: 'bg-green-500/20', textColor: 'text-green-400', borderColor: 'border-green-500/50', emoji: '🟢', text: 'Stable' },
      beta: { bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/50', emoji: '🟡', text: 'Beta' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.stable;
    return (
      <Badge className={`${config.bgColor} ${config.textColor} ${config.borderColor}`}>
        <span className="mr-1">{config.emoji}</span>
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white">Loading your ROMs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4">
      <div className="container mx-auto max-w-6xl">
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
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My ROMs</h1>
              <p className="text-gray-300">
                Manage your uploaded ROMs and track their status
              </p>
            </div>
            <Link href="/developer/upload">
              <Button className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600">
                Upload New ROM
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Alert className="border-red-500/50 bg-red-500/10 mb-6">
              <FaTimes className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* ROMs List */}
        {roms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm text-center py-12">
              <CardContent>
                <div className="text-gray-400 text-6xl mb-4">📱</div>
                <h3 className="text-white text-xl font-semibold mb-2">No ROMs Yet</h3>
                <p className="text-gray-400 mb-6">You haven't uploaded any ROMs yet. Ready to share your first custom ROM?</p>
                <Link href="/developer/upload">
                  <Button className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600">
                    Upload Your First ROM
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {roms.map((rom, index) => (
              <motion.div
                key={rom.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white flex items-center gap-3">
                          {rom.name}
                          {getStatusBadge(rom.isApproved)}
                          {getBuildStatusBadge(rom.buildStatus || 'stable')}
                        </CardTitle>
                        <CardDescription className="text-gray-400 mt-2">
                          {rom.romType} • {rom.androidVersion} • Version {rom.version}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          onClick={() => deleteRom(rom.id)}
                        >
                          <FaTrash size={12} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <h4 className="text-gray-400 text-sm mb-1">File Size</h4>
                        <p className="text-white font-medium">{rom.fileSize || 'N/A'}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-400 text-sm mb-1">Downloads</h4>
                        <p className="text-white font-medium flex items-center gap-1">
                          <FaDownload size={12} className="text-green-400" />
                          {rom.downloadCount}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-gray-400 text-sm mb-1">Uploaded</h4>
                        <p className="text-white font-medium">
                          {new Date(rom.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-gray-400 text-sm mb-1">Status</h4>
                        <p className="text-white font-medium">
                          {rom.isApproved ? '✅ Live on site' : '⏳ Under review'}
                        </p>
                      </div>
                    </div>
                    
                    {rom.fileName && (
                      <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">File Name</p>
                        <p className="text-white font-mono text-sm">{rom.fileName}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {roms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">{roms.length}</div>
                    <div className="text-gray-400 text-sm">Total ROMs</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {roms.filter(rom => rom.isApproved).length}
                    </div>
                    <div className="text-gray-400 text-sm">Approved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {roms.filter(rom => !rom.isApproved).length}
                    </div>
                    <div className="text-gray-400 text-sm">Pending</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">
                      {roms.reduce((total, rom) => total + rom.downloadCount, 0)}
                    </div>
                    <div className="text-gray-400 text-sm">Total Downloads</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
