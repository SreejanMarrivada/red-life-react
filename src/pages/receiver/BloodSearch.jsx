
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAvailableBlood, requestBlood } from '@/services/receiverService';
import { toast } from '@/components/ui/use-toast';
import PageHeader from '@/components/common/PageHeader';
import BloodTypeCard from '@/components/common/BloodTypeCard';
import { Button } from '@/components/ui/button';
import { Droplet, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

const BloodSearch = () => {
  const { currentUser } = useAuth();
  const [bloodInventory, setBloodInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('');
  const [filteredBlood, setFilteredBlood] = useState([]);
  
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [units, setUnits] = useState(1);
  const [hospital, setHospital] = useState(currentUser.hospital || '');
  const [urgency, setUrgency] = useState('Medium');
  const [reason, setReason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBloodInventory = async () => {
      setLoading(true);
      try {
        const data = await getAvailableBlood();
        setBloodInventory(data);
        setFilteredBlood(data);
      } catch (error) {
        console.error('Error fetching blood inventory:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blood inventory',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBloodInventory();
  }, []);

  const handleSearch = () => {
    if (!searchType) {
      setFilteredBlood(bloodInventory);
      return;
    }
    
    const filtered = bloodInventory.filter(blood => blood.type === searchType);
    setFilteredBlood(filtered);
  };

  const handleRequestBlood = (bloodType) => {
    setSelectedBloodType(bloodType);
    setIsDialogOpen(true);
  };

  const submitRequest = async () => {
    if (!hospital || !reason) {
      toast({
        title: 'Required Fields',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const requestData = {
        receiverId: currentUser.id,
        receiverName: currentUser.name,
        bloodType: selectedBloodType,
        units: parseInt(units, 10),
        hospital,
        urgency,
        reason
      };
      
      await requestBlood(requestData);
      
      toast({
        title: 'Success',
        description: 'Blood request submitted successfully',
      });
      
      setIsDialogOpen(false);
      setSelectedBloodType('');
      setUnits(1);
      setUrgency('Medium');
      setReason('');
    } catch (error) {
      console.error('Error submitting blood request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit blood request',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Blood Search"
        description="Search available blood types and request blood"
      />
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="form-field flex-grow">
            <label htmlFor="searchType" className="block text-sm font-medium text-gray-700 mb-1">
              Blood Type
            </label>
            <select
              id="searchType"
              className="input-field"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="">All Blood Types</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <Button onClick={handleSearch} className="h-10 px-4">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-medical">Loading...</div>
        </div>
      ) : (
        <>
          {filteredBlood.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBlood.map(blood => (
                <div key={blood.type} className="flex flex-col">
                  <BloodTypeCard
                    type={blood.type}
                    quantity={blood.quantity}
                    status={blood.status}
                  />
                  <Button
                    variant={blood.status === 'Available' ? 'default' : 'outline'}
                    className="mt-2"
                    disabled={blood.status === 'Critical' || blood.quantity === 0}
                    onClick={() => handleRequestBlood(blood.type)}
                  >
                    <Droplet className="h-4 w-4 mr-2" />
                    Request {blood.type}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No blood types found matching your criteria</p>
            </div>
          )}
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-medical-dark mb-4">Blood Compatibility Guide</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blood Type
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Can Receive From
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Can Donate To
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">A+</td>
                    <td className="px-6 py-4 whitespace-nowrap">A+, A-, O+, O-</td>
                    <td className="px-6 py-4 whitespace-nowrap">A+, AB+</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">A-</td>
                    <td className="px-6 py-4 whitespace-nowrap">A-, O-</td>
                    <td className="px-6 py-4 whitespace-nowrap">A+, A-, AB+, AB-</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">B+</td>
                    <td className="px-6 py-4 whitespace-nowrap">B+, B-, O+, O-</td>
                    <td className="px-6 py-4 whitespace-nowrap">B+, AB+</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">B-</td>
                    <td className="px-6 py-4 whitespace-nowrap">B-, O-</td>
                    <td className="px-6 py-4 whitespace-nowrap">B+, B-, AB+, AB-</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">AB+</td>
                    <td className="px-6 py-4 whitespace-nowrap">All Blood Types</td>
                    <td className="px-6 py-4 whitespace-nowrap">AB+</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">AB-</td>
                    <td className="px-6 py-4 whitespace-nowrap">AB-, A-, B-, O-</td>
                    <td className="px-6 py-4 whitespace-nowrap">AB+, AB-</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">O+</td>
                    <td className="px-6 py-4 whitespace-nowrap">O+, O-</td>
                    <td className="px-6 py-4 whitespace-nowrap">A+, B+, AB+, O+</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">O-</td>
                    <td className="px-6 py-4 whitespace-nowrap">O-</td>
                    <td className="px-6 py-4 whitespace-nowrap">All Blood Types</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {/* Blood Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request {selectedBloodType} Blood</DialogTitle>
            <DialogDescription>
              Fill out this form to submit a request for blood units.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-field">
                  <label htmlFor="units" className="block text-sm font-medium text-gray-700">
                    Units Required *
                  </label>
                  <input
                    id="units"
                    type="number"
                    min="1"
                    max="10"
                    className="input-field"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                    Urgency Level *
                  </label>
                  <select
                    id="urgency"
                    className="input-field"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div className="form-field">
                <label htmlFor="hospital" className="block text-sm font-medium text-gray-700">
                  Hospital Name *
                </label>
                <input
                  id="hospital"
                  type="text"
                  className="input-field"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Reason for Request *
                </label>
                <textarea
                  id="reason"
                  className="input-field min-h-[100px]"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why you need this blood, e.g. surgery, accident, etc."
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={submitRequest} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BloodSearch;
