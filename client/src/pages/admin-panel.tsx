import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
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
  FaTrash, 
  FaEdit,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPlus,
  FaTimes
} from 'react-icons/fa';

interface Rom {
  id: string;
  name: string;
  version: string;
  codename: string;
  androidVersion: string;
  romType: string;
  buildStatus: string;
  downloadUrl: string;
  fileSize: string;
  changelog?: string;
  maintainer: string;
  downloadCount: number;
  createdAt: string;
}

interface Submission {
  id: string;
  name: string;
  version: string;
  codename: string;
  androidVersion: string;
  romType: string;
  buildStatus: string;
  downloadUrl: string;
  fileSize: string;
  changelog?: string;
  maintainer: string;
  submitterName: string;
  submitterContact: string;
  additionalNotes?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
}

export function AdminPanel() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [roms, setRoms] = useState<Rom[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRom, setEditingRom] = useState<Rom | null>(null);
  const [activeTab, setActiveTab] = useState<'roms' | 'submissions'>('submissions');
  
  // Form state
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
    maintainer: ''
  });

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRoms();
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const checkAuthentication = () => {
    const token = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    
    if (!token || !storedUser) {
      setLocation('/admin/login');
      return;
    }
    
    try {
      // Verify token is valid and not expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired || !payload.isAdmin) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setLocation('/admin/login');
        return;
      }
      
      const user = JSON.parse(storedUser);
      setAdminUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication check failed:', error);
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setLocation('/admin/login');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const fetchRoms = async () => {
    try {
      const response = await fetch('/api/roms');
      if (!response.ok) throw new Error('Failed to fetch ROMs');
      
      const data = await response.json();
      setRoms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ROMs');
    }
  };

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/submissions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setLocation('/admin/login');
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch submissions');
      
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
      maintainer: ''
    });
    setEditingRom(null);
    setShowAddForm(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingRom ? `/api/admin/roms/${editingRom.id}` : '/api/admin/roms';
      const method = editingRom ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save ROM');

      setSuccess(editingRom ? 'ROM updated successfully!' : 'ROM added successfully!');
      resetForm();
      await fetchRoms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save ROM');
    }
  };

  const handleEdit = (rom: Rom) => {
    setFormData({
      name: rom.name,
      version: rom.version,
      codename: rom.codename,
      androidVersion: rom.androidVersion,
      romType: rom.romType,
      buildStatus: rom.buildStatus,
      downloadUrl: rom.downloadUrl,
      fileSize: rom.fileSize,
      changelog: rom.changelog || '',
      maintainer: rom.maintainer
    });
    setEditingRom(rom);
    setShowAddForm(true);
  };

  const handleDelete = async (romId: string) => {
    if (!confirm('Are you sure you want to delete this ROM?')) return;
    
    try {
      const response = await fetch(`/api/admin/roms/${romId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete ROM');

      setSuccess('ROM deleted successfully!');
      await fetchRoms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ROM');
    }
  };

  const testDownloadLink = (url: string) => {
    window.open(url, '_blank');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setLocation('/admin/login');
  };

  const handleApproveSubmission = async (submissionId: string) => {
    const reviewNote = prompt('Add a review note (optional):');
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/submissions/${submissionId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewNote }),
      });

      if (!response.ok) throw new Error('Failed to approve submission');

      setSuccess('ROM approved and published successfully!');
      await fetchSubmissions();
      await fetchRoms(); // Refresh ROM list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve submission');
    }
  };

  const handleRejectSubmission = async (submissionId: string) => {
    const reviewNote = prompt('Add a rejection reason:');
    
    if (!reviewNote) {
      setError('Rejection reason is required');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/submissions/${submissionId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewNote }),
      });

      if (!response.ok) throw new Error('Failed to reject submission');

      setSuccess('ROM submission rejected');
      await fetchSubmissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject submission');
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white">🔐 Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">🛠️ Admin Panel</h1>
                <p className="text-gray-300">Manage Nothing Phone ROMs & Review Submissions</p>
                {adminUser && (
                  <p className="text-purple-300 text-sm mt-1">
                    👋 Welcome, {adminUser.displayName} • {adminUser.email}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setActiveTab('submissions')}
                  variant={activeTab === 'submissions' ? 'default' : 'outline'}
                  className={activeTab === 'submissions' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
                >
                  📥 Submissions ({submissions.filter(s => s.status === 'pending').length})
                </Button>
                <Button
                  onClick={() => setActiveTab('roms')}
                  variant={activeTab === 'roms' ? 'default' : 'outline'}
                  className={activeTab === 'roms' ? 'bg-green-600 hover:bg-green-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
                >
                  📱 Live ROMs ({roms.length})
                </Button>
                {activeTab === 'roms' && (
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <FaPlus className="mr-2" />
                    Add New ROM
                  </Button>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-red-500/50 text-red-300 hover:bg-red-500/10"
                >
                  🚪 Logout
                </Button>
              </div>
            </div>
        </motion.div>

        {/* Status Messages */}
        {error && (
          <Alert className="border-red-500/50 bg-red-500/10 mb-6">
            <FaExclamationTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500/50 bg-green-500/10 mb-6">
            <FaCheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-300">{success}</AlertDescription>
          </Alert>
        )}

        {/* Add/Edit ROM Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FaUpload className="text-green-500" />
                  {editingRom ? 'Edit ROM' : 'Add New ROM'}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {editingRom ? 'Update ROM information' : 'Add a new ROM to the database'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">ROM Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g., LineageOS 21"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
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
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="codename" className="text-white">Device *</Label>
                      <Select value={formData.codename} onValueChange={(value) => handleInputChange('codename', value)}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
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
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="romType" className="text-white">ROM Type *</Label>
                      <Select value={formData.romType} onValueChange={(value) => handleInputChange('romType', value)}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
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
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
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
                      <Label htmlFor="downloadUrl" className="text-white">Download URL *</Label>
                      <Input
                        id="downloadUrl"
                        value={formData.downloadUrl}
                        onChange={(e) => handleInputChange('downloadUrl', e.target.value)}
                        placeholder="https://sourceforge.net/.../rom.zip"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fileSize" className="text-white">File Size *</Label>
                      <Input
                        id="fileSize"
                        value={formData.fileSize}
                        onChange={(e) => handleInputChange('fileSize', e.target.value)}
                        placeholder="e.g., 3.2 GB"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maintainer" className="text-white">Maintainer</Label>
                    <Input
                      id="maintainer"
                      value={formData.maintainer}
                      onChange={(e) => handleInputChange('maintainer', e.target.value)}
                      placeholder="e.g., @developer_name"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="changelog" className="text-white">Changelog</Label>
                    <Textarea
                      id="changelog"
                      value={formData.changelog}
                      onChange={(e) => handleInputChange('changelog', e.target.value)}
                      placeholder="- Fixed WiFi issues&#10;- Improved battery life&#10;- Updated security patches"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 min-h-[120px]"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <FaUpload className="mr-2" />
                      {editingRom ? 'Update ROM' : 'Add ROM'}
                    </Button>
                    <Button
                      type="button"
                      onClick={resetForm}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">
              📥 ROM Submissions ({submissions.filter(s => s.status === 'pending').length} pending)
            </h2>
            
            <div className="space-y-4">
              {submissions.filter(s => s.status === 'pending').map((submission) => (
                <Card key={submission.id} className="border-blue-700/50 bg-blue-800/10">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold text-lg">
                            {submission.name} {submission.version}
                          </h3>
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                            ⏳ Pending Review
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-400">Device</p>
                            <p className="text-white">{submission.codename}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Android</p>
                            <p className="text-white">{submission.androidVersion}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Size</p>
                            <p className="text-white">{submission.fileSize}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Submitted</p>
                            <p className="text-white">{new Date(submission.submittedAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-400 text-sm mb-1">Submitter:</p>
                          <p className="text-white">{submission.submitterName} ({submission.submitterContact})</p>
                        </div>

                        {submission.changelog && (
                          <div className="mb-4">
                            <p className="text-gray-400 text-sm mb-1">Features & Changelog:</p>
                            <div className="bg-gray-700/30 rounded p-2 text-sm text-gray-300 whitespace-pre-line">
                              {submission.changelog}
                            </div>
                          </div>
                        )}

                        {submission.additionalNotes && (
                          <div className="mb-4">
                            <p className="text-gray-400 text-sm mb-1">Additional Notes:</p>
                            <div className="bg-gray-700/30 rounded p-2 text-sm text-gray-300">
                              {submission.additionalNotes}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm mb-4">
                          <code className="bg-gray-700/50 px-2 py-1 rounded text-xs text-gray-300 flex-1 truncate">
                            {submission.downloadUrl}
                          </code>
                          <Button
                            onClick={() => testDownloadLink(submission.downloadUrl)}
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <FaExternalLinkAlt size={12} />
                            Test Link
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          onClick={() => handleApproveSubmission(submission.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white min-w-[100px]"
                        >
                          <FaCheckCircle size={12} className="mr-2" />
                          Approve & Publish
                        </Button>
                        <Button
                          onClick={() => handleRejectSubmission(submission.id)}
                          size="sm"
                          variant="destructive"
                          className="min-w-[100px]"
                        >
                          <FaTimes size={12} className="mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {submissions.filter(s => s.status === 'pending').length === 0 && (
              <Card className="border-gray-700 bg-gray-800/50">
                <CardContent className="p-8 text-center">
                  <FaCheckCircle className="text-green-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">No pending submissions</h3>
                  <p className="text-gray-400">All submissions have been reviewed. Great job!</p>
                </CardContent>
              </Card>
            )}

            {/* Recently Reviewed */}
            {submissions.filter(s => s.status !== 'pending').length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-white mb-4">Recently Reviewed</h3>
                <div className="space-y-2">
                  {submissions.filter(s => s.status !== 'pending').slice(0, 5).map((submission) => (
                    <Card key={submission.id} className="border-gray-700 bg-gray-800/30">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-white font-medium">
                              {submission.name} {submission.version}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              by {submission.submitterName} • {new Date(submission.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={
                              submission.status === 'approved'
                                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                : 'bg-red-500/20 text-red-300 border-red-500/30'
                            }>
                              {submission.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                            </Badge>
                          </div>
                        </div>
                        {submission.reviewNote && (
                          <div className="mt-3 p-3 bg-gray-700/20 rounded text-sm">
                            <p className="text-gray-400 mb-1">Review Note:</p>
                            <p className="text-gray-300">{submission.reviewNote}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ROMs List */}
        {activeTab === 'roms' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">
              📱 Live ROMs ({roms.length})
            </h2>
            
            <div className="space-y-4">
              {roms.map((rom) => (
                <Card key={rom.id} className="border-gray-700 bg-gray-800/50">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold text-lg">
                            {rom.name} {rom.version}
                          </h3>
                          <Badge className={
                            rom.buildStatus === 'stable' 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-yellow-500/20 text-yellow-300'
                          }>
                            {rom.buildStatus === 'stable' ? '�﹢ Stable' : '🟡 Beta'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-400">Device</p>
                            <p className="text-white">{rom.codename}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Android</p>
                            <p className="text-white">{rom.androidVersion}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Size</p>
                            <p className="text-white">{rom.fileSize}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Downloads</p>
                            <p className="text-white">{rom.downloadCount}</p>
                          </div>
                        </div>

                        {rom.changelog && (
                          <div className="mb-4">
                            <p className="text-gray-400 text-sm mb-1">Changelog:</p>
                            <div className="bg-gray-700/30 rounded p-2 text-sm text-gray-300 whitespace-pre-line">
                              {rom.changelog}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm">
                          <code className="bg-gray-700/50 px-2 py-1 rounded text-xs text-gray-300 flex-1 truncate">
                            {rom.downloadUrl}
                          </code>
                          <Button
                            onClick={() => testDownloadLink(rom.downloadUrl)}
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <FaExternalLinkAlt size={12} />
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => handleEdit(rom)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <FaEdit size={12} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(rom.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <FaTrash size={12} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {roms.length === 0 && (
              <Card className="border-gray-700 bg-gray-800/50">
                <CardContent className="p-8 text-center">
                  <FaUpload className="text-gray-400 text-4xl mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">No ROMs yet</h3>
                  <p className="text-gray-400">Approve some submissions or add ROMs manually to get started.</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
