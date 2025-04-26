
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getDonorHistory } from '@/services/donorService';
import PageHeader from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Calendar, Droplet, MapPin } from 'lucide-react';

const DonationHistory = () => {
  const { currentUser } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonationHistory = async () => {
      setLoading(true);
      try {
        const data = await getDonorHistory(currentUser.id);
        setDonations(data);
      } catch (error) {
        console.error('Error fetching donation history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonationHistory();
  }, [currentUser.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Donation History"
        description="View your blood donation records"
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-medical">Loading...</div>
        </div>
      ) : (
        <>
          {donations.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                      <th className="px-6 py-3 font-medium text-gray-500">Blood Type</th>
                      <th className="px-6 py-3 font-medium text-gray-500">Amount</th>
                      <th className="px-6 py-3 font-medium text-gray-500">Center</th>
                      <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {donations
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((donation) => (
                        <tr key={donation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              {donation.date}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Droplet className="h-4 w-4 text-blood mr-2" />
                              {donation.bloodType}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{donation.amount}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              {donation.center}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {donation.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 mb-2">You haven't made any donations yet</p>
              <p className="text-sm text-gray-400">Your donation history will appear here once you donate blood</p>
            </div>
          )}
          
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-medical-dark mb-4">Donation Facts</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Droplet className="h-5 w-5 text-blood mr-3 mt-0.5" />
                  <p className="text-gray-600">
                    A person can donate blood every 56 days, up to 6 times a year.
                  </p>
                </div>
                <div className="flex items-start">
                  <Droplet className="h-5 w-5 text-blood mr-3 mt-0.5" />
                  <p className="text-gray-600">
                    Each blood donation can help save up to 3 lives.
                  </p>
                </div>
                <div className="flex items-start">
                  <Droplet className="h-5 w-5 text-blood mr-3 mt-0.5" />
                  <p className="text-gray-600">
                    The average adult has about 10 pints of blood in their body. Roughly 1 pint is given during a donation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DonationHistory;
