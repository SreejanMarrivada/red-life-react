
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateDonorProfile } from '@/services/donorService';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { User, Mail, Phone, Home, Droplet, Calendar } from 'lucide-react';

const DonorProfile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    address: currentUser.address || '',
    bloodType: currentUser.bloodType || '',
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
      await updateDonorProfile(currentUser.id, formData);
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
              <div className="w-24 h-24 rounded-full bg-blood-light flex items-center justify-center">
                <User className="h-12 w-12 text-blood" />
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-medical-dark">{currentUser.name}</h3>
              <div className="mt-1 text-gray-500">{currentUser.email}</div>
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blood-light text-blood-dark">
                  <Droplet className="h-4 w-4 mr-1" />
                  {currentUser.bloodType}
                </span>
              </div>
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
                <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                <span>Age: {currentUser.age || 'Not provided'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h4 className="font-medium text-medical-dark mb-4">Donation Eligibility</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>At least 17 years old</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>Weigh at least 110 lbs (50 kg)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>In good general health</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>56 days since last whole blood donation</span>
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
                    <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">Blood Type</label>
                    <div className="mt-1 relative">
                      <select
                        name="bloodType"
                        id="bloodType"
                        className="input-field pl-10"
                        value={formData.bloodType}
                        onChange={handleChange}
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Droplet className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
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
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="form-field">
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="age"
                        id="age"
                        min="17"
                        max="100"
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

export default DonorProfile;
