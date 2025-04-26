
import React, { useState, useEffect } from 'react';
import { getAllRequests, updateRequestStatus } from '@/services/adminService';
import PageHeader from '@/components/common/PageHeader';
import { Search, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const statusColors = {
  Approved: 'bg-green-100 text-green-800 border-green-200',
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons = {
  Approved: <CheckCircle className="h-5 w-5 text-green-500" />,
  Pending: <Clock className="h-5 w-5 text-yellow-500" />,
  Rejected: <XCircle className="h-5 w-5 text-red-500" />,
};

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', title: '', description: '' });
  
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await getAllRequests();
        setRequests(data);
        setFilteredRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blood requests',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, []);
  
  useEffect(() => {
    // Apply filters
    let filtered = [...requests];
    
    // Status filter
    if (currentFilter !== 'all') {
      filtered = filtered.filter(request => request.status.toLowerCase() === currentFilter);
    }
    
    // Search term
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredRequests(filtered);
  }, [searchTerm, currentFilter, requests]);
  
  const handleApproveClick = (request) => {
    setSelectedRequest(request);
    setConfirmDialog({
      open: true,
      action: 'approve',
      title: 'Approve Blood Request',
      description: `Are you sure you want to approve the request for ${request.units} unit(s) of ${request.bloodType} blood by ${request.receiverName}?`
    });
  };
  
  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setConfirmDialog({
      open: true,
      action: 'reject',
      title: 'Reject Blood Request',
      description: `Are you sure you want to reject the request for ${request.units} unit(s) of ${request.bloodType} blood by ${request.receiverName}?`
    });
  };
  
  const handleConfirmAction = async () => {
    if (!selectedRequest) return;
    
    const status = confirmDialog.action === 'approve' ? 'Approved' : 'Rejected';
    
    try {
      const result = await updateRequestStatus(selectedRequest.id, status);
      
      if (result.success) {
        // Update local state
        setRequests(prev => prev.map(req => 
          req.id === selectedRequest.id ? { ...req, status } : req
        ));
        
        toast({
          title: 'Success',
          description: `Request ${status.toLowerCase()} successfully`,
        });
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update request status',
        variant: 'destructive',
      });
    } finally {
      setSelectedRequest(null);
      setConfirmDialog({ open: false, action: '', title: '', description: '' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Manage Blood Requests"
        description="Review, approve, or reject blood requests from receivers"
      />
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by receiver name, blood type, or hospital..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant={currentFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={currentFilter === 'pending' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentFilter('pending')}
            >
              Pending
            </Button>
            <Button 
              variant={currentFilter === 'approved' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentFilter('approved')}
            >
              Approved
            </Button>
            <Button 
              variant={currentFilter === 'rejected' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCurrentFilter('rejected')}
            >
              Rejected
            </Button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-medical">Loading requests...</div>
        </div>
      ) : (
        <>
          {filteredRequests.length > 0 ? (
            <div className="space-y-6">
              {filteredRequests
                .sort((a, b) => {
                  // Sort by status (Pending first, then by date)
                  if (a.status === 'Pending' && b.status !== 'Pending') return -1;
                  if (a.status !== 'Pending' && b.status === 'Pending') return 1;
                  
                  // Then by urgency for pending requests
                  if (a.status === 'Pending' && b.status === 'Pending') {
                    const urgencyOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
                    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
                  }
                  
                  // Then by date (newest first)
                  return new Date(b.requestDate) - new Date(a.requestDate);
                })
                .map(request => (
                  <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          {statusIcons[request.status]}
                          <h3 className="text-lg font-semibold text-medical-dark ml-2">
                            Request #{request.id}: {request.bloodType} ({request.units} {request.units > 1 ? 'units' : 'unit'})
                          </h3>
                          <Badge variant="outline" className={`ml-2 ${statusColors[request.status]}`}>
                            {request.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Receiver:</span>{' '}
                            <span className="text-gray-600">{request.receiverName}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Request Date:</span>{' '}
                            <span className="text-gray-600">{request.requestDate}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Hospital:</span>{' '}
                            <span className="text-gray-600">{request.hospital}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Urgency:</span>{' '}
                            <span className={`${
                              request.urgency === 'Critical' ? 'text-red-600' :
                              request.urgency === 'High' ? 'text-orange-600' :
                              request.urgency === 'Medium' ? 'text-yellow-600' :
                              'text-green-600'
                            } font-medium`}>
                              {request.urgency}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm">
                          <span className="font-medium text-gray-700">Reason:</span>{' '}
                          <span className="text-gray-600">{request.reason}</span>
                        </div>
                      </div>
                      
                      {request.status === 'Pending' && (
                        <div className="flex flex-col sm:flex-row gap-2 md:self-end">
                          <Button
                            onClick={() => handleApproveClick(request)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => handleRejectClick(request)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 mb-2">No blood requests found matching your criteria</p>
              {(searchTerm || currentFilter !== 'all') && (
                <Button variant="outline" onClick={() => { setSearchTerm(''); setCurrentFilter('all'); }}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-medical-dark">Pending</h3>
              </div>
              <div className="text-3xl font-bold text-medical-dark">
                {requests.filter(r => r.status === 'Pending').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-medical-dark">Approved</h3>
              </div>
              <div className="text-3xl font-bold text-medical-dark">
                {requests.filter(r => r.status === 'Approved').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-medical-dark">Rejected</h3>
              </div>
              <div className="text-3xl font-bold text-medical-dark">
                {requests.filter(r => r.status === 'Rejected').length}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open, action: '', title: '', description: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>
              {confirmDialog.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, action: '', title: '', description: '' })}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === 'approve' ? 'default' : 'destructive'}
              onClick={handleConfirmAction}
            >
              {confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageRequests;
