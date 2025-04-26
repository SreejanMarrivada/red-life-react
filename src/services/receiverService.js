
import { bloodInventory, bloodRequests } from '../data/mockData';

export const getAvailableBlood = () => {
  return Promise.resolve(bloodInventory);
};

export const searchBloodByType = (bloodType) => {
  const result = bloodInventory.find(item => item.type === bloodType);
  return Promise.resolve(result);
};

export const getReceiverRequests = (receiverId) => {
  const requests = bloodRequests.filter(request => request.receiverId === receiverId);
  return Promise.resolve(requests);
};

export const requestBlood = (requestData) => {
  // In a real app this would be an API call
  const newRequest = {
    id: bloodRequests.length + 1,
    ...requestData,
    requestDate: new Date().toISOString().split('T')[0],
    status: 'Pending'
  };
  
  bloodRequests.push(newRequest);
  return Promise.resolve(newRequest);
};

export const updateReceiverProfile = (receiverId, profileData) => {
  // In a real app this would update the database
  return Promise.resolve({
    success: true,
    message: 'Profile updated successfully',
    data: profileData
  });
};
