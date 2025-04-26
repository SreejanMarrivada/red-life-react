
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateReceiverProfile } from '@/services/receiverService';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { User, Mail, Phone, Home, Building, HeartPulse } from 'lucide-react';

const ReceiverProfile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    address: currentUser.address || '',
    hospital: currentUser.hospital || '',
    medicalCondition: currentUser.medicalCondition || '',
    gender: currentUser.gender || '',
    age: currentUser.age || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateReceiverProfile(currentUser.id, formData);
      toast({
        title: 'Success',
        description: 'Your profile has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="My Profile"
        description="View and update your personal information"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-medical-light flex items-center justify-center">
                <User className="h-12 w-12 text-medical" />
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-medical-dark">{currentUser.name}</h3>
              <div className="mt-1 text-gray-500">{currentUser.email}</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-3 text-gray-400" />
                <span>{currentUser.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Home className="h-4 w-4 mr-3 text-gray-400" />
                <span>{currentUser.address || 'Not provided'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Building className="h-4 w-4 mr-3 text-gray-400" />
                <span>{currentUser.hospital || 'Not provided'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <HeartPulse className="h-4 w-4 mr-3 text-gray-400" />
                <span>{currentUser.medicalCondition || 'Not provided'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h4 className="font-medium text-medical-dark mb-4">Blood Request Guidelines</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start">
                <span className="text-blood mr-2">•</span>
                <span>Verify your blood type with a healthcare provider before requesting.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blood mr-2">•</span>
                <span>Ensure your hospital information is current and accurate.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blood mr-2">•</span>
                <span>Critical requests require medical documentation.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blood mr-2">•</span>
                <span>Provide accurate contact information for follow-up.</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Profile Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-medical-dark mb-6">Edit Profile</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="form-field">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="input-field pl-10"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-field">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="mt-1 relative">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="input-field pl-10"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="form-field">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="mt-1 relative">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        className="input-field pl-10"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-field">
                    <label htmlFor="hospital" className="block text-sm font-medium text-gray-700">Hospital</label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        name="hospital"
                        id="hospital"
                        className="input-field pl-10"
                        value={formData.hospital}
                        onChange={handleChange}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="form-field">
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="age"
                        id="age"
                        min="1"
                        max="120"
                        className="input-field"
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-field">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                    <div className="mt-1">
                      <select
                        name="gender"
                        id="gender"
                        className="input-field"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="form-field">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      className="input-field pl-10"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Home className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="form-field">
                  <label htmlFor="medicalCondition" className="block text-sm font-medium text-gray-700">Medical Condition</label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      name="medicalCondition"
                      id="medicalCondition"
                      className="input-field pl-10"
                      value={formData.medicalCondition}
                      onChange={handleChange}
                      placeholder="E.g., Thalassemia, Surgery, Accident"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HeartPulse className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverProfile;
