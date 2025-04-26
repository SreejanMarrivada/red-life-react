
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardCard from '@/components/common/DashboardCard';
import StatsCard from '@/components/common/StatsCard';
import BloodTypeCard from '@/components/common/BloodTypeCard';
import PageHeader from '@/components/common/PageHeader';
import { getAvailableBlood, getReceiverRequests } from '@/services/receiverService';
import { Droplet, ClipboardList, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReceiverDashboard = () => {
  const { currentUser } = useAuth();
  const [bloodInventory, setBloodInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch data for dashboard
        const [inventoryData, requestsData] = await Promise.all([
          getAvailableBlood(),
          getReceiverRequests(currentUser.id)
        ]);
        
        setBloodInventory(inventoryData);
        setRequests(requestsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [currentUser.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title={`Welcome, ${currentUser.name}`}
        description="Manage your blood requests and check availability"
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-medical">Loading...</div>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard 
              title="Total Requests" 
              value={requests.length} 
              icon={<ClipboardList className="h-5 w-5 text-medical" />} 
              color="bg-medical-light"
            />
            <StatsCard 
              title="Approved Requests" 
              value={requests.filter(r => r.status === 'Approved').length} 
              icon={<ClipboardList className="h-5 w-5 text-green-600" />} 
              color="bg-green-100"
            />
            <StatsCard 
              title="Pending Requests" 
              value={requests.filter(r => r.status === 'Pending').length} 
              icon={<Clock className="h-5 w-5 text-yellow-600" />} 
              color="bg-yellow-100"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Blood Request Status */}
            <DashboardCard title="Recent Request Status" className="lg:col-span-2">
              {requests.length > 0 ? (
                <div className="space-y-4">
                  {requests
                    .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
                    .slice(0, 3)
                    .map(request => (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between">
                          <span className="font-medium">{request.bloodType} - {request.units} unit(s)</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <p><span className="font-medium">Request Date:</span> {request.requestDate}</p>
                          <p><span className="font-medium">Hospital:</span> {request.hospital}</p>
                          <p><span className="font-medium">Reason:</span> {request.reason}</p>
                        </div>
                      </div>
                    ))}
                  
                  <div className="pt-2">
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link to="/receiver/history">View All Requests</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't made any blood requests yet</p>
                  <Button asChild>
                    <Link to="/receiver/search">Request Blood</Link>
                  </Button>
                </div>
              )}
            </DashboardCard>
            
            {/* Quick Actions */}
            <DashboardCard title="Quick Actions">
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link to="/receiver/search">
                    <Droplet className="h-4 w-4 mr-2" />
                    New Blood Request
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/receiver/history">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    View Request History
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/receiver/profile">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Update Profile
                  </Link>
                </Button>
              </div>
            </DashboardCard>
          </div>
          
          {/* Blood Inventory Status */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-medical-dark">Blood Inventory Status</h3>
              <Link to="/receiver/search" className="text-blood hover:underline text-sm">Search Blood</Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {bloodInventory.map(blood => (
                <BloodTypeCard 
                  key={blood.type}
                  type={blood.type}
                  quantity={blood.quantity}
                  status={blood.status}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReceiverDashboard;
