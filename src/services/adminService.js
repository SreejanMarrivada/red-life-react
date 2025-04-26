
import { 
  donors, 
  receivers, 
  bloodInventory, 
  bloodRequests, 
  donationCamps, 
  appointments 
} from '../data/mockData';

export const getAllDonors = () => {
  return Promise.resolve(donors);
};

export const getAllReceivers = () => {
  return Promise.resolve(receivers);
};

export const getBloodInventory = () => {
  return Promise.resolve(bloodInventory);
};

export const getAllRequests = () => {
  return Promise.resolve(bloodRequests);
};

export const getDonationCamps = () => {
  return Promise.resolve(donationCamps);
};

export const updateBloodInventory = (bloodType, quantity) => {
  const index = bloodInventory.findIndex(item => item.type === bloodType);
  
  if (index !== -1) {
    bloodInventory[index].quantity = quantity;
    
    // Update status based on quantity
    if (quantity <= 5) {
      bloodInventory[index].status = 'Critical';
    } else if (quantity <= 15) {
      bloodInventory[index].status = 'Low';
    } else {
      bloodInventory[index].status = 'Available';
    }
    
    return Promise.resolve({
      success: true,
      message: 'Inventory updated successfully',
      data: bloodInventory[index]
    });
  }
  
  return Promise.resolve({
    success: false,
    message: 'Blood type not found'
  });
};

export const updateRequestStatus = (requestId, status) => {
  const index = bloodRequests.findIndex(req => req.id === requestId);
  
  if (index !== -1) {
    bloodRequests[index].status = status;
    
    // If approved, update inventory
    if (status === 'Approved') {
      const request = bloodRequests[index];
      const bloodTypeIndex = bloodInventory.findIndex(item => item.type === request.bloodType);
      
      if (bloodTypeIndex !== -1) {
        bloodInventory[bloodTypeIndex].quantity -= request.units;
        
        // Update status if needed
        if (bloodInventory[bloodTypeIndex].quantity <= 5) {
          bloodInventory[bloodTypeIndex].status = 'Critical';
        } else if (bloodInventory[bloodTypeIndex].quantity <= 15) {
          bloodInventory[bloodTypeIndex].status = 'Low';
        }
      }
    }
    
    return Promise.resolve({
      success: true,
      message: `Request ${status.toLowerCase()}`,
      data: bloodRequests[index]
    });
  }
  
  return Promise.resolve({
    success: false,
    message: 'Request not found'
  });
};

export const addDonationCamp = (campData) => {
  const newCamp = {
    id: donationCamps.length + 1,
    ...campData,
    status: 'Upcoming'
  };
  
  donationCamps.push(newCamp);
  return Promise.resolve({
    success: true,
    message: 'Donation camp added successfully',
    data: newCamp
  });
};

export const updateDonationCamp = (campId, campData) => {
  const index = donationCamps.findIndex(camp => camp.id === campId);
  
  if (index !== -1) {
    donationCamps[index] = {
      ...donationCamps[index],
      ...campData
    };
    
    return Promise.resolve({
      success: true,
      message: 'Donation camp updated successfully',
      data: donationCamps[index]
    });
  }
  
  return Promise.resolve({
    success: false,
    message: 'Donation camp not found'
  });
};
