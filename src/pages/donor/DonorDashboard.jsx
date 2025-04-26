
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardCard from '@/components/common/DashboardCard';
import StatsCard from '@/components/common/StatsCard';
import PageHeader from '@/components/common/PageHeader';
import { getDonorAppointments, getDonorHistory, getUpcomingDonationCamps } from '@/services/donorService';
import { Calendar, Droplet, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DonorDashboard = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [upcomingCamps, setUpcomingCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch data for dashboard
        const [appointmentsData, historyData, campsData] = await Promise.all([
          getDonorAppointments(currentUser.id),
          getDonorHistory(currentUser.id),
          getUpcomingDonationCamps()
        ]);
        
        setAppointments(appointmentsData);
        setDonationHistory(historyData);
        setUpcomingCamps(campsData.slice(0, 3)); // Show only 3 upcoming camps
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
        description="Manage your blood donations and appointments"
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
              title="Total Donations" 
              value={donationHistory.length} 
              icon={<Droplet className="h-5 w-5 text-blood" />} 
              color="bg-blood-light"
            />
            <StatsCard 
              title="Upcoming Appointments" 
              value={appointments.filter(a => a.status === 'Scheduled').length} 
              icon={<Calendar className="h-5 w-5 text-medical" />} 
              color="bg-medical-light"
            />
            <StatsCard 
              title="Blood Type" 
              value={currentUser.bloodType} 
              icon={<Droplet className="h-5 w-5 text-blood" />} 
              color="bg-blood-light"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Appointment */}
            <DashboardCard title="Your Next Appointment" className="lg:col-span-2">
              {appointments.filter(a => a.status === 'Scheduled').length > 0 ? (
                <div>
                  {appointments
                    .filter(a => a.status === 'Scheduled')
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 1)
                    .map(appointment => (
                      <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="font-medium text-lg text-medical-dark">{appointment.campName}</div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {appointment.time}
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" variant="outline" asChild>
                            <Link to="/donor/appointments">View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don't have any scheduled appointments</p>
                  <Button asChild>
                    <Link to="/donor/camps">Book an Appointment</Link>
                  </Button>
                </div>
              )}
            </DashboardCard>
            
            {/* Recent Donations */}
            <DashboardCard title="Recent Donations">
              {donationHistory.length > 0 ? (
                <div className="space-y-3">
                  {donationHistory
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 3)
                    .map(donation => (
                      <div key={donation.id} className="flex items-center border-b border-gray-100 pb-3">
                        <div className="w-10 h-10 bg-blood-light rounded-full flex items-center justify-center mr-3">
                          <Droplet className="h-5 w-5 text-blood" />
                        </div>
                        <div>
                          <div className="font-medium">{donation.amount}</div>
                          <div className="text-sm text-gray-500">{donation.date}</div>
                        </div>
                      </div>
                    ))}
                  <div className="pt-2">
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link to="/donor/history">View All Donations</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No donation history yet</p>
                </div>
              )}
            </DashboardCard>
          </div>
          
          {/* Upcoming Donation Camps */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-medical-dark">Upcoming Donation Camps</h3>
              <Link to="/donor/camps" className="text-blood hover:underline text-sm">View All</Link>
            </div>
            
            {upcomingCamps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingCamps.map(camp => (
                  <div key={camp.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-medical p-4 text-white">
                      <h4 className="font-semibold">{camp.name}</h4>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start mb-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{camp.location}</span>
                      </div>
                      <div className="flex items-start mb-2">
                        <Calendar className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{camp.date}</span>
                      </div>
                      <div className="flex items-start mb-4">
                        <Clock className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{camp.time}</span>
                      </div>
                      <Button size="sm" className="w-full" asChild>
                        <Link to={`/donor/camps`}>Book Appointment</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-500 mb-2">No upcoming donation camps at the moment</p>
                <p className="text-sm text-gray-400">Check back later for new opportunities to donate</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DonorDashboard;
