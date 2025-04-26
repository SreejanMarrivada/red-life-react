
import React, { useState, useEffect } from 'react';
import { getBloodInventory, updateBloodInventory } from '@/services/adminService';
import PageHeader from '@/components/common/PageHeader';
import { Droplet, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ManageInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const data = await getBloodInventory();
        setInventory(data);
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
    
    fetchInventory();
  }, []);
  
  const handleEdit = (bloodType, currentQuantity) => {
    setEditingId(bloodType);
    setEditValue(currentQuantity.toString());
  };
  
  const handleSave = async (bloodType) => {
    if (editValue === '' || isNaN(parseInt(editValue))) {
      toast({
        title: 'Invalid Value',
        description: 'Please enter a valid number',
        variant: 'destructive',
      });
      return;
    }
    
    const quantity = parseInt(editValue);
    if (quantity < 0) {
      toast({
        title: 'Invalid Value',
        description: 'Quantity cannot be negative',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const result = await updateBloodInventory(bloodType, quantity);
      
      if (result.success) {
        // Update local state
        setInventory(prev => prev.map(item => 
          item.type === bloodType ? { ...item, quantity, status: result.data.status } : item
        ));
        
        toast({
          title: 'Success',
          description: `Updated ${bloodType} inventory to ${quantity} units`,
        });
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to update inventory',
        variant: 'destructive',
      });
    } finally {
      setEditingId(null);
      setEditValue('');
    }
  };
  
  const handleIncrement = (bloodType, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    handleEdit(bloodType, newQuantity);
    handleSave(bloodType);
  };
  
  const handleDecrement = (bloodType, currentQuantity) => {
    if (currentQuantity > 0) {
      const newQuantity = currentQuantity - 1;
      handleEdit(bloodType, newQuantity);
      handleSave(bloodType);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Manage Blood Inventory"
        description="Monitor and update blood inventory levels"
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-medical">Loading inventory...</div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blood Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available Units
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item.type} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-blood-light rounded-full p-1 mr-2">
                            <Droplet className="h-4 w-4 text-blood" />
                          </div>
                          <span className="font-semibold text-lg">{item.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === item.type ? (
                          <input
                            type="number"
                            min="0"
                            className="input-field w-24"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSave(item.type);
                              }
                            }}
                          />
                        ) : (
                          <span className="text-lg font-semibold">{item.quantity}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'Available' ? 'bg-green-100 text-green-800' :
                          item.status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {editingId === item.type ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleSave(item.type)}
                            >
                              Save
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEdit(item.type, item.quantity)}
                            >
                              Edit
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleIncrement(item.type, item.quantity)}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDecrement(item.type, item.quantity)}
                            disabled={item.quantity === 0}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-medical-dark mb-4">Critical Levels</h3>
              <div className="space-y-4">
                {inventory.filter(item => item.status === 'Critical').length > 0 ? (
                  inventory
                    .filter(item => item.status === 'Critical')
                    .map(item => (
                      <div key={item.type} className="flex items-center justify-between bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                          <span className="font-semibold">{item.type}</span>
                        </div>
                        <span>{item.quantity} units</span>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No critical levels at the moment</p>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-medical-dark mb-4">Inventory Status</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Blood Type</span>
                  <span className="text-gray-600">Status</span>
                </div>
                {inventory.map(item => (
                  <div key={item.type} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <span className="font-medium">{item.type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        item.status === 'Available' ? 'bg-green-500' :
                        item.status === 'Low' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></span>
                      <span className="text-sm text-gray-700">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-medical-dark mb-4">Blood Level Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-50">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <h4 className="font-medium">Available</h4>
                </div>
                <p className="text-sm text-gray-600">More than 15 units. Blood supply is adequate.</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-50">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <h4 className="font-medium">Low</h4>
                </div>
                <p className="text-sm text-gray-600">6-15 units. Blood supply is limited, consider organizing donation drives.</p>
              </div>
              <div className="p-4 rounded-lg bg-red-50">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <h4 className="font-medium">Critical</h4>
                </div>
                <p className="text-sm text-gray-600">5 units or less. Urgent need for donations. Notify management.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageInventory;
