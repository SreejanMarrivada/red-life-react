
import React, { useState, useEffect } from 'react';
import { getAllDonors } from '@/services/adminService';
import PageHeader from '@/components/common/PageHeader';
import { Search, User, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ManageDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDonors, setFilteredDonors] = useState([]);
  
  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      try {
        const data = await getAllDonors();
        setDonors(data);
        setFilteredDonors(data);
      } catch (error) {
        console.error('Error fetching donors:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonors();
  }, []);
  
  useEffect(() => {
    if (!searchTerm) {
      setFilteredDonors(donors);
    } else {
      const filtered = donors.filter(donor => 
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDonors(filtered);
    }
  }, [searchTerm, donors]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Manage Donors"
        description="View and manage all registered blood donors"
      />
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search donors by name, email, or blood type..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-medical">Loading donors...</div>
        </div>
      ) : (
        <>
          {filteredDonors.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blood Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Donation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Donations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDonors.map((donor) => (
                      <tr key={donor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{donor.name}</div>
                              <div className="text-sm text-gray-500">{donor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-blood-light rounded-full p-1 mr-2">
                              <Droplet className="h-4 w-4 text-blood" />
                            </div>
                            <span className="text-sm font-medium">{donor.bloodType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{donor.phone}</div>
                          <div className="text-sm text-gray-500">{donor.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {donor.lastDonation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {donor.donations}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm" className="text-medical hover:text-medical-dark">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 mb-2">No donors found matching your search criteria</p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-medical-dark mb-4">Donor Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Total Donors</div>
                <div className="text-2xl font-bold text-medical-dark">{donors.length}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Most Common Blood Type</div>
                <div className="text-2xl font-bold text-medical-dark">O+</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Total Donations</div>
                <div className="text-2xl font-bold text-medical-dark">
                  {donors.reduce((total, donor) => total + donor.donations, 0)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageDonors;
