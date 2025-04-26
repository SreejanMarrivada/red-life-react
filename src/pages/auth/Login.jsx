
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, Droplet } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect based on user role
        if (result.user.role === 'donor') {
          navigate('/donor');
        } else if (result.user.role === 'receiver') {
          navigate('/receiver');
        } else if (result.user.role === 'admin') {
          navigate('/admin');
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An error occurred during login');
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
          <h2 className="mt-4 text-3xl font-extrabold text-medical-dark">
            Sign in to BloodBank
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-blood hover:underline">
              register for a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
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
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blood focus:ring-blood border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blood hover:underline">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-full bg-blood hover:bg-blood-dark"
            >
              <LogIn className="h-4 w-4 mr-2" />
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>

          <div className="mt-6">
            <div className="text-center">
              <div className="text-sm text-gray-600">Demo credentials:</div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('donor@example.com');
                    setPassword('password');
                  }}
                  className="py-1 px-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
                >
                  Donor Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('receiver@example.com');
                    setPassword('password');
                  }}
                  className="py-1 px-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
                >
                  Receiver Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@example.com');
                    setPassword('password');
                  }}
                  className="py-1 px-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
                >
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
