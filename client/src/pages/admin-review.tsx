import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  FaCheck, 
  FaTimes, 
  FaDownload, 
  FaExternalLinkAlt, 
  FaUser, 
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEye
} from 'react-icons/fa';

interface RomSubmission {
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
  submittedBy: {
    id: string;
    username: string;
    displayName: string;
    email: string;
  };
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
}

export function AdminReview() {
  const [submissions, setSubmissions] = useState<RomSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('dev_token');
      const response = await fetch('/api/admin/submissions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }

      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId: string, action: 'approve' | 'reject') => {
    setProcessingId(submissionId);
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('dev_token');
      const response = await fetch(`/api/admin/submissions/${submissionId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          reviewNote: reviewNotes[submissionId] || ''
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} submission`);
      }

      // Refresh submissions
      await fetchSubmissions();
      
      // Clear review note
      setReviewNotes(prev => {
        const updated = { ...prev };
        delete updated[submissionId];
        return updated;
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} submission`);
    } finally {
      setProcessingId(null);
    }
  };

  const testDownloadLink = (url: string) => {
    window.open(url, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">⏳ Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">✅ Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">❌ Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white">Loading submissions...</div>
      </div>
    );
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const reviewedSubmissions = submissions.filter(s => s.status !== 'pending');

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
          <h1 className="text-3xl font-bold text-white mb-2">ROM Submissions Review</h1>
          <p className="text-gray-300">
            Review and approve ROM submissions from the community
          </p>
        </motion.div>

        {error && (
          <Alert className="border-red-500/50 bg-red-500/10 mb-6">
            <FaExclamationTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-gray-700 bg-gray-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-400">{pendingSubmissions.length}</p>
                </div>
                <FaClock className="text-yellow-400 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Submissions</p>
                  <p className="text-2xl font-bold text-white">{submissions.length}</p>
                </div>
                <FaEye className="text-blue-400 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-gray-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-green-400">
                    {submissions.filter(s => s.status === 'approved').length}
                  </p>
                </div>
                <FaCheckCircle className="text-green-400 text-2xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">
            Pending Review ({pendingSubmissions.length})
          </h2>
          
          {pendingSubmissions.length === 0 ? (
            <Card className="border-gray-700 bg-gray-800/50">
              <CardContent className="p-8 text-center">
                <FaCheckCircle className="text-green-400 text-4xl mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-gray-400">No pending ROM submissions to review.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {pendingSubmissions.map((submission) => (
                <Card key={submission.id} className="border-gray-700 bg-gray-800/50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          {submission.name} v{submission.version}
                          {getStatusBadge(submission.status)}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Submitted by {submission.submittedBy.displayName} ({submission.submittedBy.username}) 
                          • {formatDate(submission.submittedAt)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* ROM Details */}
                      <div className="space-y-4">
                        <h4 className="text-white font-medium">ROM Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Device</p>
                            <p className="text-white">{submission.codename}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Android Version</p>
                            <p className="text-white">{submission.androidVersion}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">ROM Type</p>
                            <p className="text-white">{submission.romType}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Build Status</p>
                            <Badge className={
                              submission.buildStatus === 'stable' 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-yellow-500/20 text-yellow-300'
                            }>
                              {submission.buildStatus === 'stable' ? '🟢 Stable' : '🟡 Beta'}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-gray-400">File Size</p>
                            <p className="text-white">{submission.fileSize}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Maintainer</p>
                            <p className="text-white">{submission.maintainer}</p>
                          </div>
                        </div>

                        {submission.changelog && (
                          <div>
                            <p className="text-gray-400 mb-2">Changelog</p>
                            <div className="bg-gray-700/30 rounded p-3 text-sm text-gray-300 whitespace-pre-line">
                              {submission.changelog}
                            </div>
                          </div>
                        )}

                        <div>
                          <p className="text-gray-400 mb-2">Download URL</p>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-700/50 px-2 py-1 rounded text-xs text-gray-300 flex-1 truncate">
                              {submission.downloadUrl}
                            </code>
                            <Button
                              onClick={() => testDownloadLink(submission.downloadUrl)}
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <FaExternalLinkAlt className="mr-1" size={12} />
                              Test
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Review Actions */}
                      <div className="space-y-4">
                        <h4 className="text-white font-medium">Review Actions</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`note-${submission.id}`} className="text-white text-sm">
                              Review Note (Optional)
                            </Label>
                            <Textarea
                              id={`note-${submission.id}`}
                              value={reviewNotes[submission.id] || ''}
                              onChange={(e) => setReviewNotes(prev => ({
                                ...prev,
                                [submission.id]: e.target.value
                              }))}
                              placeholder="Add a note about this review (visible to the submitter)"
                              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 min-h-[80px]"
                            />
                          </div>
                          
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleReview(submission.id, 'approve')}
                              disabled={processingId === submission.id}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              {processingId === submission.id ? (
                                'Processing...'
                              ) : (
                                <>
                                  <FaCheck className="mr-2" size={14} />
                                  Approve & Publish
                                </>
                              )}
                            </Button>
                            
                            <Button
                              onClick={() => handleReview(submission.id, 'reject')}
                              disabled={processingId === submission.id}
                              variant="destructive"
                              className="flex-1"
                            >
                              {processingId === submission.id ? (
                                'Processing...'
                              ) : (
                                <>
                                  <FaTimes className="mr-2" size={14} />
                                  Reject
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recently Reviewed */}
        {reviewedSubmissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">
              Recently Reviewed ({reviewedSubmissions.length})
            </h2>
            
            <div className="space-y-4">
              {reviewedSubmissions.slice(0, 5).map((submission) => (
                <Card key={submission.id} className="border-gray-700 bg-gray-800/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">
                          {submission.name} v{submission.version}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          by {submission.submittedBy.displayName} • {formatDate(submission.submittedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(submission.status)}
                        <Button
                          onClick={() => testDownloadLink(submission.downloadUrl)}
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <FaDownload className="mr-1" size={12} />
                          View
                        </Button>
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
