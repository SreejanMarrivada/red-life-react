
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardCard from '@/components/common/DashboardCard';
import StatsCard from '@/components/common/StatsCard';
import PageHeader from '@/components/common/PageHeader';
import { getAllDonors, getAllReceivers, getBloodInventory, getAllRequests } from '@/services/adminService';
import { Users, User, Droplet, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [donors, setDonors] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [bloodInventory, setBloodInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch data for dashboard
        const [donorsData, receiversData, inventoryData, requestsData] = await Promise.all([
          getAllDonors(),
          getAllReceivers(),
          getBloodInventory(),
          getAllRequests()
        ]);
        
        setDonors(donorsData);
        setReceivers(receiversData);
        setBloodInventory(inventoryData);
        setRequests(requestsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Calculate blood inventory stats
  const totalUnits = bloodInventory.reduce((total, item) => total + item.quantity, 0);
  const criticalTypes = bloodInventory.filter(item => item.status === 'Critical').length;
  const pendingRequests = requests.filter(request => request.status === 'Pending').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title={`Welcome, ${currentUser.name}`}
        description="Blood Bank Management System Administration Dashboard"
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-medical">Loading...</div>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Donors" 
              value={donors.length} 
              icon={<Users className="h-5 w-5 text-medical" />} 
              color="bg-medical-light"
            />
            <StatsCard 
              title="Total Receivers" 
              value={receivers.length} 
              icon={<User className="h-5 w-5 text-medical" />} 
              color="bg-medical-light"
            />
            <StatsCard 
              title="Blood Units" 
              value={totalUnits} 
              icon={<Droplet className="h-5 w-5 text-blood" />} 
              color="bg-blood-light"
            />
            <StatsCard 
              title="Pending Requests" 
              value={pendingRequests} 
              icon={<Clock className="h-5 w-5 text-yellow-600" />} 
              color="bg-yellow-100"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Blood Inventory Status */}
            <DashboardCard title="Blood Inventory Status" className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                    <span className="text-xs text-gray-500">Available</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
                    <span className="text-xs text-gray-500">Low</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                    <span className="text-xs text-gray-500">Critical</span>
                  </div>
                </div>
                <Link to="/admin/inventory" className="text-blood hover:underline text-sm">
                  Manage Inventory
                </Link>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {bloodInventory.map(blood => (
                  <div 
                    key={blood.type}
                    className={`rounded-lg p-4 border-l-4 ${
                      blood.status === 'Available' ? 'border-green-500' :
                      blood.status === 'Low' ? 'border-yellow-500' : 'border-red-500'
                    } bg-white shadow-sm`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-bold text-medical-dark">{blood.type}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        blood.status === 'Available' ? 'bg-green-100 text-green-800' :
                        blood.status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {blood.status}
                      </span>
                    </div>
                    <div className="text-lg font-semibold">{blood.quantity} units</div>
                  </div>
                ))}
              </div>
            </DashboardCard>
            
            {/* Recent Requests */}
            <DashboardCard title="Recent Blood Requests">
              <div className="space-y-4">
                {requests
                  .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
                  .slice(0, 3)
                  .map(request => (
                    <div key={request.id} className="border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{request.receiverName}</span>
                          <div className="text-sm text-gray-500">
                            {request.bloodType} ({request.units} {request.units > 1 ? 'units' : 'unit'})
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{request.requestDate}</div>
                        </div>
                        <div>
                          {request.status === 'Approved' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : request.status === 'Rejected' ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                
                <div className="pt-2">
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link to="/admin/requests">View All Requests</Link>
                  </Button>
                </div>
              </div>
            </DashboardCard>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Button className="h-auto py-4 bg-blood hover:bg-blood-dark" asChild>
              <Link to="/admin/donors">
                <Users className="h-5 w-5 mb-2" />
                <span className="block">Manage Donors</span>
              </Link>
            </Button>
            <Button className="h-auto py-4 bg-blood hover:bg-blood-dark" asChild>
              <Link to="/admin/receivers">
                <User className="h-5 w-5 mb-2" />
                <span className="block">Manage Receivers</span>
              </Link>
            </Button>
            <Button className="h-auto py-4 bg-blood hover:bg-blood-dark" asChild>
              <Link to="/admin/inventory">
                <Droplet className="h-5 w-5 mb-2" />
                <span className="block">Manage Inventory</span>
              </Link>
            </Button>
            <Button className="h-auto py-4 bg-blood hover:bg-blood-dark" asChild>
              <Link to="/admin/requests">
                <CheckCircle className="h-5 w-5 mb-2" />
                <span className="block">Manage Requests</span>
              </Link>
            </Button>
          </div>
          
          {/* Critical Alerts */}
          {criticalTypes > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Critical Blood Supply Alert
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>
                      {criticalTypes} blood type(s) are at critical levels. Please check the inventory and arrange for donations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
