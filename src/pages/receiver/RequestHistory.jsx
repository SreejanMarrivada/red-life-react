
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getReceiverRequests } from '@/services/receiverService';
import PageHeader from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Calendar, Droplet, AlertCircle } from 'lucide-react';

const statusColors = {
  Approved: 'bg-green-100 text-green-800 border-green-200',
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
};

const RequestHistory = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestHistory = async () => {
      setLoading(true);
      try {
        const data = await getReceiverRequests(currentUser.id);
        setRequests(data);
      } catch (error) {
        console.error('Error fetching request history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequestHistory();
  }, [currentUser.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Request History"
        description="Track your blood requests and their status"
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-medical">Loading...</div>
        </div>
      ) : (
        <>
          {requests.length > 0 ? (
            <div className="space-y-6">
              {requests
                .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
                .map(request => (
                  <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-wrap gap-4 justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="bg-blood-light rounded-full p-1 mr-2">
                            <Droplet className="h-4 w-4 text-blood" />
                          </div>
                          <h3 className="text-lg font-semibold text-medical-dark">
                            {request.bloodType} - {request.units} unit(s)
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>
                              <span className="font-medium">Request Date:</span> {request.requestDate}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
                            <span>
                              <span className="font-medium">Urgency:</span> {request.urgency}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-gray-600">
                          <span className="font-medium">Hospital:</span> {request.hospital}
                        </div>
                        <div className="mt-1 text-gray-600">
                          <span className="font-medium">Reason:</span> {request.reason}
                        </div>
                      </div>
                      
                      <Badge 
                        variant="outline" 
                        className={`${statusColors[request.status]} px-3 py-1 text-xs`}
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 mb-2">You haven't made any blood requests yet</p>
              <p className="text-sm text-gray-400">When you need blood, you can request it through the Blood Search page</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RequestHistory;
