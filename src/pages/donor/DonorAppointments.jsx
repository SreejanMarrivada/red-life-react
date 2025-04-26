
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getDonorAppointments } from '@/services/donorService';
import PageHeader from '@/components/common/PageHeader';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';

const statusColors = {
  Scheduled: 'bg-green-100 text-green-800',
  Completed: 'bg-blue-100 text-blue-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const DonorAppointments = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getDonorAppointments(currentUser.id);
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [currentUser.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="My Appointments"
        description="Manage your scheduled blood donation appointments"
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-medical">Loading...</div>
        </div>
      ) : (
        <>
          {appointments.length > 0 ? (
            <div className="space-y-6">
              {appointments
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map(appointment => (
                  <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-wrap gap-4 items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-medical-dark">{appointment.campName}</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {appointment.time}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[appointment.status]}`}>
                          {appointment.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 mb-2">You don't have any appointments</p>
              <p className="text-sm text-gray-400">Visit the Donation Camps page to book an appointment</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DonorAppointments;
