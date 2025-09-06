import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaUpload, FaSignOutAlt, FaUser, FaDownload, FaEye, FaClock } from 'react-icons/fa';

interface Developer {
  id: string;
  username: string;
  email: string;
  displayName: string;
  isVerified: boolean;
}

export function DeveloperDashboard() {
  const [, setLocation] = useLocation();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('dev_token');
    const userData = localStorage.getItem('dev_user');
    
    if (!token || !userData) {
      setLocation('/developer/login');
      return;
    }

    try {
      setDeveloper(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      setLocation('/developer/login');
      return;
    }
    
    setLoading(false);
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('dev_token');
    localStorage.removeItem('dev_user');
    setLocation('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!developer) {
    return null;
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome, {developer.displayName}!
              </h1>
              <p className="text-gray-300">
                Manage your ROM uploads and track your community impact
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={developer.isVerified ? "default" : "secondary"} className="flex items-center gap-2">
                <FaUser size={12} />
                {developer.isVerified ? 'Verified Developer' : 'Developer'}
              </Badge>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                <FaSignOutAlt className="mr-2" size={14} />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <FaUpload className="text-cyan-500" />
                Upload New ROM
              </CardTitle>
              <CardDescription className="text-gray-400">
                Share your latest custom ROM with the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/developer/upload">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600">
                  Upload ROM File
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <FaEye className="text-blue-500" />
                My ROMs
              </CardTitle>
              <CardDescription className="text-gray-400">
                View and manage your uploaded ROMs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/developer/my-roms">
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                  View My ROMs
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <FaDownload className="text-green-500" />
                Statistics
              </CardTitle>
              <CardDescription className="text-gray-400">
                Track downloads and community engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                View Stats
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FaClock className="text-yellow-500" />
                Developer Dashboard
              </CardTitle>
              <CardDescription className="text-gray-400">
                Full dashboard features coming soon!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-yellow-500/20 rounded-lg bg-yellow-500/10">
                  <h3 className="text-yellow-400 font-semibold mb-2">🚧 Under Construction</h3>
                  <p className="text-gray-300 text-sm">
                    We're currently building the full developer dashboard with ROM upload, management, 
                    and analytics features. For now, you can use our API endpoints directly or check back soon!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="text-white font-medium mb-2">Available Features:</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>✅ Developer registration & login</li>
                      <li>✅ JWT authentication system</li>
                      <li>✅ ROM upload API endpoints</li>
                      <li>✅ File storage system (up to 2GB)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Coming Soon:</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>🔄 Interactive ROM upload form</li>
                      <li>🔄 ROM management interface</li>
                      <li>🔄 Download statistics dashboard</li>
                      <li>🔄 Community feedback system</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Link href="/">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Back to Home
                    </Button>
                  </Link>
                  <Link href="/community">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Join Community
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button variant="outline" className="border-cyan-600 text-cyan-300 hover:bg-cyan-700">
                      🛠️ Admin Panel
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
