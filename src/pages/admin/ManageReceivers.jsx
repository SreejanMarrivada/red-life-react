
import React, { useState, useEffect } from 'react';
import { getAllReceivers } from '@/services/adminService';
import PageHeader from '@/components/common/PageHeader';
import { Search, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ManageReceivers = () => {
  const [receivers, setReceivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReceivers, setFilteredReceivers] = useState([]);
  
  useEffect(() => {
    const fetchReceivers = async () => {
      setLoading(true);
      try {
        const data = await getAllReceivers();
        setReceivers(data);
        setFilteredReceivers(data);
      } catch (error) {
        console.error('Error fetching receivers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReceivers();
  }, []);
  
  useEffect(() => {
    if (!searchTerm) {
      setFilteredReceivers(receivers);
    } else {
      const filtered = receivers.filter(receiver => 
        receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receiver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (receiver.bloodType && receiver.bloodType.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (receiver.hospital && receiver.hospital.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredReceivers(filtered);
    }
  }, [searchTerm, receivers]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Manage Receivers"
        description="View and manage all registered blood receivers"
      />
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search receivers by name, email, blood type, or hospital..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-medical">Loading receivers...</div>
        </div>
      ) : (
        <>
          {filteredReceivers.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Receiver
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blood Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hospital
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medical Condition
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReceivers.map((receiver) => (
                      <tr key={receiver.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{receiver.name}</div>
                              <div className="text-sm text-gray-500">{receiver.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blood-light text-blood-dark">
                            {receiver.bloodType || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{receiver.phone}</div>
                          <div className="text-sm text-gray-500">{receiver.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 text-medical mr-2" />
                            <span className="text-sm text-gray-900">{receiver.hospital}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {receiver.medicalCondition}
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
              <p className="text-gray-500 mb-2">No receivers found matching your search criteria</p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-medical-dark mb-4">Receiver Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Total Receivers</div>
                <div className="text-2xl font-bold text-medical-dark">{receivers.length}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Most Requested Blood Type</div>
                <div className="text-2xl font-bold text-medical-dark">AB-</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Top Medical Condition</div>
                <div className="text-2xl font-bold text-medical-dark">Surgery</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageReceivers;
