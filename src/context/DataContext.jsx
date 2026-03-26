import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { user, updateUserTrustScore } = useAuth();
  
  const [equipments, setEquipments] = useState(() => {
    const saved = localStorage.getItem('agrirent_equipments');
    return saved ? JSON.parse(saved) : [
      { id: 'eq1', sellerId: '1', ownerName: 'Ramesh', contact: '9876543210', location: 'Bengaluru', lat: 12.9716, lng: 77.5946, name: 'Tractor', price: 1500, pricingUnit: 'Per Day', image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c86?w=500&q=80', status: 'Verified', validationReason: '', vehicleNumber: 'KA-01-AB-1234', description: 'Strong heavy duty 50HP tractor suitable for deep plowing and cultivation.', isAvailable: true, notifyQueue: [] },
      { id: 'eq2', sellerId: '1', ownerName: 'Ramesh', contact: '9876543210', location: 'Mysuru', lat: 12.2958, lng: 76.6394, name: 'Sprayer', price: 500, pricingUnit: 'Per Day', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&q=80', status: 'Verified', validationReason: '', vehicleNumber: 'N/A', description: 'Electric backpack sprayer with 16L capacity for applying fertilizers and pesticides.', isAvailable: true, notifyQueue: [] }
    ];
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('agrirent_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('agrirent_equipments', JSON.stringify(equipments));
    } catch (e) {
      console.error('Failed to save equipments. Storage quota may be exceeded.', e);
      alert('Warning: Could not save equipment. Please use smaller images to avoid exceeding memory limits.');
    }
  }, [equipments]);

  useEffect(() => {
    try {
      localStorage.setItem('agrirent_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings. Storage quota may be exceeded.', e);
    }
  }, [bookings]);

  const addEquipment = (equipment) => {
    const newEq = { 
      ...equipment, 
      id: Date.now().toString(), 
      sellerId: user.id,
      status: equipment.status || 'Verified',
      validationReason: equipment.validationReason || '',
      isAvailable: true,
      notifyQueue: []
    };
    setEquipments([...equipments, newEq]);
    return newEq;
  };

  const updateEquipment = (id, updatedData) => {
    setEquipments(equipments.map(eq => eq.id === id ? { ...eq, ...updatedData } : eq));
  };

  const deleteEquipment = (id) => {
    setEquipments(equipments.filter(eq => eq.id !== id));
  };

  const createBooking = (equipment, bookingDetails) => {
    const newBooking = {
      id: Date.now().toString(),
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      sellerId: equipment.sellerId,
      buyerId: user.id,
      buyerName: bookingDetails.renterName || user.name,
      buyerContact: bookingDetails.contactNumber || bookingDetails.contact || user.email,
      renterLocation: bookingDetails.renterLocation || '',
      rentalDate: bookingDetails.rentalDate || new Date().toISOString().split('T')[0],
      drivingLicense: bookingDetails.drivingLicense || '',
      date: new Date().toISOString(),
      status: 'pending' // pending, accepted, rejected
    };
    setBookings([...bookings, newBooking]);
    setEquipments(equipments.map(eq => eq.id === equipment.id ? { ...eq, isAvailable: false } : eq));
    return newBooking;
  };

  const acceptBooking = (bookingId) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'accepted' } : b));
    const booking = bookings.find(b => b.id === bookingId);
    if (booking && updateUserTrustScore) {
       updateUserTrustScore(booking.sellerId, 5); // Increase trust score for successful rental
    }
  };

  const rejectBooking = (bookingId) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'rejected' } : b));
  };

  const reportEquipment = (equipmentId, sellerId) => {
    setEquipments(equipments.map(eq => eq.id === equipmentId ? { ...eq, status: 'Suspicious', validationReason: 'Reported by user' } : eq));
    if (updateUserTrustScore) {
       updateUserTrustScore(sellerId, -10); // Decrease trust score
    }
  };

  const deleteUserData = (userId) => {
    setEquipments(equipments.filter(e => e.sellerId !== userId));
    setBookings(bookings.filter(b => b.buyerId !== userId && b.sellerId !== userId));
  };

  const addToNotifyQueue = (equipmentId, userId) => {
    setEquipments(equipments.map(eq => {
      if (eq.id === equipmentId) {
        const queue = eq.notifyQueue || [];
        if (!queue.includes(userId)) {
          return { ...eq, notifyQueue: [...queue, userId] };
        }
      }
      return eq;
    }));
  };

  const markAsAvailable = (equipmentId, addNotification) => {
    const equipment = equipments.find(eq => eq.id === equipmentId);
    if (equipment && equipment.notifyQueue && equipment.notifyQueue.length > 0) {
      equipment.notifyQueue.forEach(userId => {
        if (addNotification) {
          addNotification(userId, 'equipment available', `Good news! The equipment "${equipment.name}" is now available for rent.`);
        }
      });
    }
    
    setEquipments(equipments.map(eq => 
      eq.id === equipmentId 
        ? { ...eq, isAvailable: true, notifyQueue: [] } 
        : eq
    ));
  };

  return (
    <DataContext.Provider value={{
      equipments,
      bookings,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      createBooking,
      acceptBooking,
      rejectBooking,
      reportEquipment,
      deleteUserData,
      addToNotifyQueue,
      markAsAvailable,
      userBookings: bookings.filter(b => b.buyerId === user?.id),
      sellerEquipment: equipments.filter(e => e.sellerId === user?.id),
      sellerBookings: bookings.filter(b => b.sellerId === user?.id)
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
