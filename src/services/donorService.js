
import { appointments, donationCamps, donationHistory } from '../data/mockData';

export const getDonationCamps = () => {
  return Promise.resolve(donationCamps);
};

export const getUpcomingDonationCamps = () => {
  const upcoming = donationCamps.filter(camp => camp.status === 'Upcoming');
  return Promise.resolve(upcoming);
};

export const getDonorAppointments = (donorId) => {
  const donorAppointments = appointments.filter(app => app.donorId === donorId);
  return Promise.resolve(donorAppointments);
};

export const getDonorHistory = (donorId) => {
  const history = donationHistory.filter(donation => donation.donorId === donorId);
  return Promise.resolve(history);
};

export const bookAppointment = (appointmentData) => {
  // In a real app this would be an API call
  const newAppointment = {
    id: appointments.length + 1,
    ...appointmentData,
    status: 'Scheduled'
  };
  
  appointments.push(newAppointment);
  return Promise.resolve(newAppointment);
};

export const updateDonorProfile = (donorId, profileData) => {
  // In a real app this would update the database
  return Promise.resolve({
    success: true,
    message: 'Profile updated successfully',
    data: profileData
  });
};
