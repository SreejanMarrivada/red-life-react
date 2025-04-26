
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Droplet, Heart, UserPlus, LogIn } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blood to-blood-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Give the gift of life
            </h1>
            <p className="mt-6 text-xl max-w-3xl">
              Your blood donation can save up to 3 lives. Join our community of donors today and make a difference.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button className="btn-primary bg-white text-blood hover:bg-gray-100 py-6 px-8 text-lg">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Register Now
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="py-6 px-8 text-lg border-white text-white hover:bg-blood-dark">
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 hidden lg:block">
          <svg width="420" height="250" viewBox="0 0 84 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M42 0C42 0 52 10 62 10C72 10 82 0 82 0V50H2V0C2 0 12 10 22 10C32 10 42 0 42 0Z" fill="#FF8B98" fillOpacity="0.5" />
          </svg>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-medical-dark sm:text-4xl">
              Why Donate Blood?
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Blood donation is a simple process that can make a significant impact on someone's life.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-blood-light rounded-full p-3 w-12 h-12 flex items-center justify-center">
                <Heart className="h-6 w-6 text-blood" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-medical-dark">Save Lives</h3>
              <p className="mt-2 text-base text-gray-500">
                A single donation can save up to three lives, helping those in emergency situations.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-blood-light rounded-full p-3 w-12 h-12 flex items-center justify-center">
                <Droplet className="h-6 w-6 text-blood" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-medical-dark">Health Benefits</h3>
              <p className="mt-2 text-base text-gray-500">
                Regular blood donation can reduce the risk of heart disease and help maintain good health.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-blood-light rounded-full p-3 w-12 h-12 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-blood" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-medical-dark">Community Impact</h3>
              <p className="mt-2 text-base text-gray-500">
                Join a community of donors making a difference in the lives of patients in need.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blood Types */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-medical-dark sm:text-4xl">
              Blood Types
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Understanding blood types is essential for effective blood donation and transfusion.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
              <div key={type} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blood">{type}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Don't know your blood type? Register as a donor and find out!
            </p>
            <div className="mt-4">
              <Link to="/register">
                <Button className="btn-primary bg-blood hover:bg-blood-dark">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-medical-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-medical rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Ready to make a difference?
                </h2>
                <p className="mt-2 text-lg text-white text-opacity-80">
                  Join our blood donation community today.
                </p>
              </div>
              <div className="mt-8 md:mt-0 md:ml-8">
                <Link to="/register">
                  <Button className="bg-white text-medical-dark hover:bg-gray-100">
                    Register as Donor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex items-center">
              <Droplet className="h-8 w-8 text-blood" />
              <span className="ml-2 text-xl font-bold text-medical-dark">BloodBank</span>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-base text-gray-500">
                &copy; 2024 BloodBank Management System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
