
// Mock data for the Blood Bank application

// Blood inventory data
export const bloodInventory = [
  { type: 'A+', quantity: 25, status: 'Available' },
  { type: 'A-', quantity: 15, status: 'Low' },
  { type: 'B+', quantity: 30, status: 'Available' },
  { type: 'B-', quantity: 10, status: 'Critical' },
  { type: 'AB+', quantity: 12, status: 'Available' },
  { type: 'AB-', quantity: 5, status: 'Critical' },
  { type: 'O+', quantity: 45, status: 'Available' },
  { type: 'O-', quantity: 20, status: 'Low' },
];

// Donor data
export const donors = [
  { 
    id: 1, 
    name: 'John Donor', 
    email: 'donor@example.com', 
    bloodType: 'O+', 
    age: 28, 
    gender: 'Male',
    phone: '123-456-7890',
    address: '123 Main St, Anytown',
    lastDonation: '2023-11-15',
    donations: 5
  },
  { 
    id: 2, 
    name: 'Maria Garcia', 
    email: 'maria@example.com', 
    bloodType: 'A+', 
    age: 35, 
    gender: 'Female',
    phone: '234-567-8901',
    address: '456 Oak Ave, Somewhere',
    lastDonation: '2023-12-20',
    donations: 8
  },
  { 
    id: 3, 
    name: 'Robert Smith', 
    email: 'robert@example.com', 
    bloodType: 'B-', 
    age: 42, 
    gender: 'Male',
    phone: '345-678-9012',
    address: '789 Pine Rd, Elsewhere',
    lastDonation: '2024-01-05',
    donations: 12
  },
  { 
    id: 4, 
    name: 'Emily Johnson', 
    email: 'emily@example.com', 
    bloodType: 'AB+', 
    age: 29, 
    gender: 'Female',
    phone: '456-789-0123',
    address: '101 Elm St, Nowhere',
    lastDonation: '2024-02-18',
    donations: 3
  },
];

// Receiver data
export const receivers = [
  { 
    id: 1, 
    name: 'Sarah Receiver', 
    email: 'receiver@example.com', 
    bloodType: 'AB-', 
    age: 32, 
    gender: 'Female',
    phone: '567-890-1234',
    address: '202 Maple Dr, Anytown',
    medicalCondition: 'Surgery',
    hospital: 'General Hospital'
  },
  { 
    id: 2, 
    name: 'James Wilson', 
    email: 'james@example.com', 
    bloodType: 'O-', 
    age: 45, 
    gender: 'Male',
    phone: '678-901-2345',
    address: '303 Cedar Ln, Somewhere',
    medicalCondition: 'Anemia',
    hospital: 'City Medical Center'
  },
  { 
    id: 3, 
    name: 'Linda Martinez', 
    email: 'linda@example.com', 
    bloodType: 'A-', 
    age: 38, 
    gender: 'Female',
    phone: '789-012-3456',
    address: '404 Birch Blvd, Elsewhere',
    medicalCondition: 'Accident',
    hospital: 'Emergency Care Hospital'
  },
];

// Blood requests
export const bloodRequests = [
  { 
    id: 1, 
    receiverId: 1, 
    receiverName: 'Sarah Receiver', 
    bloodType: 'AB-', 
    units: 2, 
    requestDate: '2024-03-01',
    status: 'Approved',
    urgency: 'High',
    hospital: 'General Hospital',
    reason: 'Surgery scheduled for March 5th'
  },
  { 
    id: 2, 
    receiverId: 2, 
    receiverName: 'James Wilson', 
    bloodType: 'O-', 
    units: 3, 
    requestDate: '2024-03-10',
    status: 'Pending',
    urgency: 'Critical',
    hospital: 'City Medical Center',
    reason: 'Severe anemia requiring immediate transfusion'
  },
  { 
    id: 3, 
    receiverId: 3, 
    receiverName: 'Linda Martinez', 
    bloodType: 'A-', 
    units: 1, 
    requestDate: '2024-03-15',
    status: 'Rejected',
    urgency: 'Medium',
    hospital: 'Emergency Care Hospital',
    reason: 'Car accident victim'
  },
  { 
    id: 4, 
    receiverId: 1, 
    receiverName: 'Sarah Receiver', 
    bloodType: 'AB-', 
    units: 1, 
    requestDate: '2024-03-20',
    status: 'Approved',
    urgency: 'Low',
    hospital: 'General Hospital',
    reason: 'Follow-up treatment'
  },
];

// Donation camps
export const donationCamps = [
  {
    id: 1,
    name: 'City Community Center Drive',
    location: 'Community Center, 123 Main St',
    date: '2024-04-15',
    time: '9:00 AM - 5:00 PM',
    organizer: 'Red Cross',
    contactPhone: '555-123-4567',
    status: 'Upcoming',
    slots: 50,
    description: 'Annual blood donation drive at the city community center. Walk-ins welcome, but appointments preferred.'
  },
  {
    id: 2,
    name: 'University Campus Drive',
    location: 'Student Union Building, State University',
    date: '2024-04-22',
    time: '10:00 AM - 6:00 PM',
    organizer: 'State University Medical School',
    contactPhone: '555-234-5678',
    status: 'Upcoming',
    slots: 100,
    description: 'Blood donation drive targeting university students and staff. Free refreshments provided to all donors.'
  },
  {
    id: 3,
    name: 'Corporate Office Drive',
    location: 'Tech Plaza, 456 Business Ave',
    date: '2024-05-05',
    time: '8:00 AM - 2:00 PM',
    organizer: 'Blood Connect Foundation',
    contactPhone: '555-345-6789',
    status: 'Upcoming',
    slots: 40,
    description: 'Blood donation drive for corporate employees. Special recognition for first-time donors.'
  },
  {
    id: 4,
    name: 'Downtown Health Fair',
    location: 'Central Park, Downtown',
    date: '2024-03-10',
    time: '9:00 AM - 4:00 PM',
    organizer: 'City Health Department',
    contactPhone: '555-456-7890',
    status: 'Completed',
    slots: 75,
    description: 'Part of the annual city health fair, featuring blood donation, health screenings, and family activities.'
  },
];

// Donor appointments
export const appointments = [
  {
    id: 1,
    donorId: 1,
    donorName: 'John Donor',
    campId: 1,
    campName: 'City Community Center Drive',
    date: '2024-04-15',
    time: '10:30 AM',
    status: 'Scheduled'
  },
  {
    id: 2,
    donorId: 2,
    donorName: 'Maria Garcia',
    campId: 2,
    campName: 'University Campus Drive',
    date: '2024-04-22',
    time: '1:15 PM',
    status: 'Scheduled'
  },
  {
    id: 3,
    donorId: 3,
    donorName: 'Robert Smith',
    campId: 1,
    campName: 'City Community Center Drive',
    date: '2024-04-15',
    time: '3:45 PM',
    status: 'Scheduled'
  },
  {
    id: 4,
    donorId: 4,
    donorName: 'Emily Johnson',
    campId: 4,
    campName: 'Downtown Health Fair',
    date: '2024-03-10',
    time: '11:00 AM',
    status: 'Completed'
  },
];

// Donation history
export const donationHistory = [
  {
    id: 1,
    donorId: 1,
    donorName: 'John Donor',
    bloodType: 'O+',
    amount: '450ml',
    date: '2023-11-15',
    center: 'Main Blood Bank',
    status: 'Successful'
  },
  {
    id: 2,
    donorId: 2,
    donorName: 'Maria Garcia',
    bloodType: 'A+',
    amount: '450ml',
    date: '2023-12-20',
    center: 'University Medical Center',
    status: 'Successful'
  },
  {
    id: 3,
    donorId: 3,
    donorName: 'Robert Smith',
    bloodType: 'B-',
    amount: '450ml',
    date: '2024-01-05',
    center: 'Community Blood Drive',
    status: 'Successful'
  },
  {
    id: 4,
    donorId: 1,
    donorName: 'John Donor',
    bloodType: 'O+',
    amount: '450ml',
    date: '2023-08-22',
    center: 'Mobile Blood Drive Unit',
    status: 'Successful'
  },
  {
    id: 5,
    donorId: 4,
    donorName: 'Emily Johnson',
    bloodType: 'AB+',
    amount: '450ml',
    date: '2024-02-18',
    center: 'Downtown Health Fair',
    status: 'Successful'
  },
];
