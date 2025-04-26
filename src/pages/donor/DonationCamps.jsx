
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { getDonationCamps, bookAppointment } from '@/services/donorService';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Phone, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

const DonationCamps = () => {
  const { currentUser } = useAuth();
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingCamp, setBookingCamp] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCamps = async () => {
      setLoading(true);
      try {
        const campsData = await getDonationCamps();
        setCamps(campsData);
      } catch (error) {
        console.error('Error fetching donation camps:', error);
        toast({
          title: 'Error',
          description: 'Failed to load donation camps',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCamps();
  }, []);

  const handleBooking = (camp) => {
    setBookingCamp(camp);
    setSelectedTime('');
    setIsDialogOpen(true);
  };

  const confirmBooking = async () => {
    if (!selectedTime) {
      toast({
        title: 'Required',
        description: 'Please select an appointment time',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const appointmentData = {
        donorId: currentUser.id,
        donorName: currentUser.name,
        campId: bookingCamp.id,
        campName: bookingCamp.name,
        date: bookingCamp.date,
        time: selectedTime
      };
      
      await bookAppointment(appointmentData);
      
      toast({
        title: 'Success',
        description: 'Appointment booked successfully',
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to book appointment',
        variant: 'destructive',
      });
    }
  };

  // Generate available time slots for the selected camp
  const generateTimeSlots = () => {
    if (!bookingCamp) return [];
    
    const [startTime, endTime] = bookingCamp.time.split(' - ');
    const slots = [];
    
    // Parse start and end times
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinutes = startTime.includes('PM') && startHour !== 12 ? startHour + 12 : startHour;
    
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinutes = endTime.includes('PM') && endHour !== 12 ? endHour + 12 : endHour;
    
    // Generate slots at 30-minute intervals
    for (let hour = startMinutes; hour < endMinutes; hour++) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const period = hour >= 12 ? 'PM' : 'AM';
      
      slots.push(`${formattedHour}:00 ${period}`);
      slots.push(`${formattedHour}:30 ${period}`);
    }
    
    return slots;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Donation Camps"
        description="Find and book appointments at upcoming blood donation camps"
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-medical">Loading...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {camps.length > 0 ? (
            camps.map(camp => (
              <div key={camp.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className={`p-4 text-white ${camp.status === 'Upcoming' ? 'bg-medical' : 'bg-gray-500'}`}>
                  <h4 className="font-semibold">{camp.name}</h4>
                  <div className="text-sm mt-1 flex items-center">
                    <span className={`px-2 py-0.5 rounded-full ${
                      camp.status === 'Upcoming' ? 'bg-green-600' : 'bg-gray-600'
                    } text-white text-xs mr-2`}>
                      {camp.status}
                    </span>
                    <span>{camp.slots} slots available</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start mb-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{camp.location}</span>
                  </div>
                  <div className="flex items-start mb-2">
                    <Calendar className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{camp.date}</span>
                  </div>
                  <div className="flex items-start mb-2">
                    <Clock className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{camp.time}</span>
                  </div>
                  <div className="flex items-start mb-2">
                    <Phone className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{camp.contactPhone}</span>
                  </div>
                  <div className="flex items-start mb-4">
                    <Info className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{camp.description}</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    disabled={camp.status !== 'Upcoming'}
                    onClick={() => handleBooking(camp)}
                  >
                    {camp.status === 'Upcoming' ? 'Book Appointment' : 'Not Available'}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No donation camps available at the moment</p>
            </div>
          )}
        </div>
      )}
      
      {/* Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              {bookingCamp && `Select a time for your appointment at ${bookingCamp.name}.`}
            </DialogDescription>
          </DialogHeader>
          
          {bookingCamp && (
            <div className="py-4">
              <div className="mb-4">
                <div className="text-sm font-medium mb-1">Date</div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{bookingCamp.date}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm font-medium mb-1">Select Time</div>
                <div className="grid grid-cols-3 gap-2">
                  {generateTimeSlots().map((time, index) => (
                    <button
                      key={index}
                      className={`py-1 px-2 text-sm border rounded ${
                        selectedTime === time 
                          ? 'border-blood bg-blood-light text-blood-dark' 
                          : 'border-gray-300 hover:border-blood'
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={confirmBooking}>
              Confirm Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonationCamps;
