
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Layout
import Navbar from "@/components/layout/Navbar";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Public Pages
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

// Donor Pages
import DonorDashboard from "@/pages/donor/DonorDashboard";
import DonationCamps from "@/pages/donor/DonationCamps";
import DonorAppointments from "@/pages/donor/DonorAppointments";
import DonationHistory from "@/pages/donor/DonationHistory";
import DonorProfile from "@/pages/donor/DonorProfile";

// Receiver Pages
import ReceiverDashboard from "@/pages/receiver/ReceiverDashboard";
import BloodSearch from "@/pages/receiver/BloodSearch";
import RequestHistory from "@/pages/receiver/RequestHistory";
import ReceiverProfile from "@/pages/receiver/ReceiverProfile";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageDonors from "@/pages/admin/ManageDonors";
import ManageReceivers from "@/pages/admin/ManageReceivers";
import ManageInventory from "@/pages/admin/ManageInventory";
import ManageRequests from "@/pages/admin/ManageRequests";
import ManageCamps from "@/pages/admin/ManageCamps";

// Private Route Component
const PrivateRoute = ({ children, allowedRole }) => {
  const storedUser = localStorage.getItem('bloodBankUser');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    // Redirect based on role
    if (user.role === 'donor') {
      return <Navigate to="/donor" replace />;
    } else if (user.role === 'receiver') {
      return <Navigate to="/receiver" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
  }
  
  return children;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Donor Routes */}
                <Route path="/donor" element={
                  <PrivateRoute allowedRole="donor">
                    <DonorDashboard />
                  </PrivateRoute>
                } />
                <Route path="/donor/camps" element={
                  <PrivateRoute allowedRole="donor">
                    <DonationCamps />
                  </PrivateRoute>
                } />
                <Route path="/donor/appointments" element={
                  <PrivateRoute allowedRole="donor">
                    <DonorAppointments />
                  </PrivateRoute>
                } />
                <Route path="/donor/history" element={
                  <PrivateRoute allowedRole="donor">
                    <DonationHistory />
                  </PrivateRoute>
                } />
                <Route path="/donor/profile" element={
                  <PrivateRoute allowedRole="donor">
                    <DonorProfile />
                  </PrivateRoute>
                } />
                
                {/* Receiver Routes */}
                <Route path="/receiver" element={
                  <PrivateRoute allowedRole="receiver">
                    <ReceiverDashboard />
                  </PrivateRoute>
                } />
                <Route path="/receiver/search" element={
                  <PrivateRoute allowedRole="receiver">
                    <BloodSearch />
                  </PrivateRoute>
                } />
                <Route path="/receiver/history" element={
                  <PrivateRoute allowedRole="receiver">
                    <RequestHistory />
                  </PrivateRoute>
                } />
                <Route path="/receiver/profile" element={
                  <PrivateRoute allowedRole="receiver">
                    <ReceiverProfile />
                  </PrivateRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <PrivateRoute allowedRole="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                } />
                <Route path="/admin/donors" element={
                  <PrivateRoute allowedRole="admin">
                    <ManageDonors />
                  </PrivateRoute>
                } />
                <Route path="/admin/receivers" element={
                  <PrivateRoute allowedRole="admin">
                    <ManageReceivers />
                  </PrivateRoute>
                } />
                <Route path="/admin/inventory" element={
                  <PrivateRoute allowedRole="admin">
                    <ManageInventory />
                  </PrivateRoute>
                } />
                <Route path="/admin/requests" element={
                  <PrivateRoute allowedRole="admin">
                    <ManageRequests />
                  </PrivateRoute>
                } />
                <Route path="/admin/camps" element={
                  <PrivateRoute allowedRole="admin">
                    <ManageCamps />
                  </PrivateRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
