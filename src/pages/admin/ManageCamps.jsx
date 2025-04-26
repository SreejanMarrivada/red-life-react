
import React, { useState, useEffect } from 'react';
import { getDonationCamps, addDonationCamp, updateDonationCamp } from '@/services/adminService';
import PageHeader from '@/components/common/PageHeader';
import { Calendar, MapPin, Clock, Phone, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const ManageCamps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    time: '',
    organizer: '',
    contactPhone: '',
    slots: 50,
    description: ''
  });
  
  useEffect(() => {
    const fetchCamps = async () => {
      setLoading(true);
      try {
        const data = await getDonationCamps();
        setCamps(data);
      } catch (error) {
        console.error('Error fetching donation camps:', error);
        toast({
          title: 'Error',
          description: 'Failed to load donation camps',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCamps();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleOpenAddDialog = () => {
    setEditingCamp(null);
    setFormData({
      name: '',
      location: '',
      date: '',
      time: '',
      organizer: '',
      contactPhone: '',
      slots: 50,
      description: ''
    });
    setIsDialogOpen(true);
  };
  
  const handleOpenEditDialog = (camp) => {
    setEditingCamp(camp);
    setFormData({
      name: camp.name || '',
      location: camp.location || '',
      date: camp.date || '',
      time: camp.time || '',
      organizer: camp.organizer || '',
      contactPhone: camp.contactPhone || '',
      slots: camp.slots || 50,
      description: camp.description || ''
    });
    setIsDialogOpen(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['name', 'location', 'date', 'time', 'organizer', 'contactPhone'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: 'Required Fields',
        description: 'Please fill out all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      let result;
      
      if (editingCamp) {
        // Update existing camp
        result = await updateDonationCamp(editingCamp.id, formData);
        if (result.success) {
          // Update local state
          setCamps(prev => prev.map(camp => 
            camp.id === editingCamp.id ? { ...camp, ...formData } : camp
          ));
        }
      } else {
        // Add new camp
        result = await addDonationCamp(formData);
        if (result.success) {
          // Add to local state
          setCamps(prev => [...prev, result.data]);
        }
      }
      
      if (result.success) {
        toast({
          title: 'Success',
          description: editingCamp 
            ? 'Donation camp updated successfully' 
            : 'New donation camp added successfully',
        });
        setIsDialogOpen(false);
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting camp:', error);
      toast({
        title: 'Error',
        description: 'Failed to save donation camp',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Manage Donation Camps"
        description="Organize and manage blood donation camps"
        action={
          <Button onClick={handleOpenAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Camp
          </Button>
        }
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-medical">Loading donation camps...</div>
        </div>
      ) : (
        <>
          {camps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {camps
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map(camp => (
                  <div key={camp.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                    <div className={`p-4 text-white ${camp.status === 'Upcoming' ? 'bg-medical' : 'bg-gray-500'}`}>
                      <h4 className="font-semibold">{camp.name}</h4>
                      <div className="text-sm mt-1 flex items-center">
                        <span className={`px-2 py-0.5 rounded-full ${
                          camp.status === 'Upcoming' ? 'bg-green-600' : 'bg-gray-600'
                        } text-white text-xs mr-2`}>
                          {camp.status}
                        </span>
                        <span>{camp.slots} slots available</span>
                      </div>
                    </div>
                    <div className="p-4 flex-grow">
                      <div className="flex items-start mb-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{camp.location}</span>
                      </div>
                      <div className="flex items-start mb-2">
                        <Calendar className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{camp.date}</span>
                      </div>
                      <div className="flex items-start mb-2">
                        <Clock className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{camp.time}</span>
                      </div>
                      <div className="flex items-start mb-2">
                        <Phone className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{camp.contactPhone}</span>
                      </div>
                      <div className="flex items-start mb-4">
                        <span className="text-gray-600 text-sm">{camp.description}</span>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleOpenEditDialog(camp)}
                      >
                        Edit Details
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 mb-4">No donation camps have been organized yet</p>
              <Button onClick={handleOpenAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Camp
              </Button>
            </div>
          )}
        </>
      )}
      
      {/* Camp Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingCamp ? 'Edit Donation Camp' : 'Add New Donation Camp'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-field">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Camp Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="input-field"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">
                    Organizer *
                  </label>
                  <input
                    id="organizer"
                    name="organizer"
                    type="text"
                    className="input-field"
                    value={formData.organizer}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-field">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="input-field"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-field">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date *
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className="input-field"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Time *
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="text"
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    className="input-field"
                    value={formData.time}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="slots" className="block text-sm font-medium text-gray-700">
                    Available Slots
                  </label>
                  <input
                    id="slots"
                    name="slots"
                    type="number"
                    min="1"
                    className="input-field"
                    value={formData.slots}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-field">
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                  Contact Phone *
                </label>
                <input
                  id="contactPhone"
                  name="contactPhone"
                  type="text"
                  className="input-field"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="input-field min-h-[100px]"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCamp ? 'Save Changes' : 'Add Camp'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageCamps;
