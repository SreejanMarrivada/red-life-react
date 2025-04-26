
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { UserPlus, Droplet } from 'lucide-react';

const Register = () => {
  const [userType, setUserType] = useState('donor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');
  const [hospital, setHospital] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (userType === 'donor' && !bloodType) {
      setError('Blood type is required for donors');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = {
        name,
        email,
        password,
        age: parseInt(age, 10) || 0,
        gender,
        phone,
        address,
      };
      
      if (userType === 'donor') {
        userData.bloodType = bloodType;
      } else {
        userData.medicalCondition = medicalCondition;
        userData.hospital = hospital;
      }
      
      const result = await register(userData, userType);
      
      if (result.success) {
        // Redirect based on user type
        if (userType === 'donor') {
          navigate('/donor');
        } else {
          navigate('/receiver');
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 blood-drop-pattern py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-blood-light rounded-full p-3">
              <Droplet className="h-8 w-8 text-blood" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-medical-dark">Create an account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blood hover:underline">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            className={`w-1/2 py-2 text-center text-sm font-medium ${
              userType === 'donor' ? 'text-blood border-b-2 border-blood' : 'text-gray-500'
            }`}
            onClick={() => setUserType('donor')}
          >
            Register as Donor
          </button>
          <button
            type="button"
            className={`w-1/2 py-2 text-center text-sm font-medium ${
              userType === 'receiver' ? 'text-blood border-b-2 border-blood' : 'text-gray-500'
            }`}
            onClick={() => setUserType('receiver')}
          >
            Register as Receiver
          </button>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-field"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="input-field"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="18"
                  max="100"
                  className="input-field"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="input-field"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {userType === 'donor' && (
                <div>
                  <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Type *
                  </label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    required={userType === 'donor'}
                    className="input-field"
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
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
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input-field"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="input-field"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            
            {userType === 'receiver' && (
              <>
                <div>
                  <label htmlFor="medicalCondition" className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Condition
                  </label>
                  <input
                    id="medicalCondition"
                    name="medicalCondition"
                    type="text"
                    className="input-field"
                    placeholder="Medical Condition"
                    value={medicalCondition}
                    onChange={(e) => setMedicalCondition(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-1">
                    Hospital Name
                  </label>
                  <input
                    id="hospital"
                    name="hospital"
                    type="text"
                    className="input-field"
                    placeholder="Hospital Name"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-full bg-blood hover:bg-blood-dark"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
