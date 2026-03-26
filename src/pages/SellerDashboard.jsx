import { useState } from 'react';
import { useAuth, useData, useNotification } from '../context';
import { Link } from 'react-router-dom';

const EQUIPMENT_OPTIONS = [
  'Tractor', 'Plough', 'Rotavator', 'Harrow', 'Cultivator', 'Land Leveler', 
  'Subsoiler', 'Seed Drill', 'Planter', 'Combine Harvester', 'Reaper', 
  'Thresher', 'Forage Harvester', 'Crop Cutter', 'Seed Cum Fertilizer Drill', 
  'Paddy Transplanter', 'Broadcast Seeder', 'Dibber', 'Winnower', 
  'Tractor Trolley', 'Mini Trucks', 'Pickup Vehicles', 'Bullock Cart', 
  'Grain Dryer', 'Cleaning Machine', 'Rice Mill'
];

export default function SellerDashboard() {
  const { user } = useAuth();
  const { sellerEquipment, sellerBookings, addEquipment, acceptBooking, rejectBooking, markAsAvailable } = useData();
  const { addNotification } = useNotification();
  
  const [formData, setFormData] = useState({ name: EQUIPMENT_OPTIONS[0], price: '', pricingUnit: 'Per Day', location: '', image: '', contact: '', vehicleNumber: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          setFormData({ ...formData, image: canvas.toDataURL('image/jpeg', 0.6) });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const priceNum = Number(formData.price);
    const finalImage = formData.image || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c86?w=500&q=80';
    const finalContact = formData.contact || user.email;

    const finalizeSubmit = (status, validationReason) => {
      addEquipment({
        name: formData.name, price: priceNum, pricingUnit: formData.pricingUnit,
        location: formData.location, image: finalImage, contact: finalContact,
        vehicleNumber: formData.vehicleNumber, description: formData.description,
        ownerName: user.name, status, validationReason
      });
      setFormData({ name: EQUIPMENT_OPTIONS[0], price: '', pricingUnit: 'Per Day', location: '', image: '', contact: '', vehicleNumber: '', description: '' });
      setShowAddForm(false);
      setIsSubmitting(false);
    };

    // 1. Primary Layer: Rule-Based Validation
    if (priceNum < 100 || priceNum > 10000) {
      return finalizeSubmit('Suspicious', 'Unrealistic price (must be between ₹100 and ₹10,000)');
    }
    if (!formData.image) {
      return finalizeSubmit('Suspicious', 'Missing authentic equipment photo');
    }
    const isDuplicate = sellerEquipment.some(eq => eq.name === formData.name && eq.location === formData.location && eq.price === priceNum);
    if (isDuplicate) {
      return finalizeSubmit('Suspicious', 'Duplicate listing detected');
    }

    // 2. Secondary Layer: AI-Based Validation
    try {
      const prompt = `Analyze this equipment rental listing for farming: \nName: ${formData.name}\nPrice: ₹${priceNum} ${formData.pricingUnit}\nLocation: ${formData.location}\nDescription: ${formData.description}\nDoes this combination of equipment, price, description, and location seem like a REAL and realistic farming rental, or could it be FAKE/misleading? Respond with exactly a JSON object (no markdown, no extra text) in this format: {"result": "REAL" or "FAKE", "reason": "Short reason"}`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAxFio0a_lFHhMSpaGaaxpSqywLxZoCLQU`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
      });
      
      const data = await response.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{"result": "REAL", "reason": "AI check failed"}';
      
      let aiResult = { result: "REAL", reason: "" };
      try {
        const cleanJson = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
        aiResult = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Failed to parse AI response", replyText);
      }

      finalizeSubmit(aiResult.result === 'FAKE' ? 'Suspicious' : 'Verified', aiResult.result === 'FAKE' ? aiResult.reason : 'Verified by AI');
    } catch (error) {
      finalizeSubmit('Verified', 'Rule checks passed (AI offline)');
    }
  };

  const handleAccept = (booking) => {
    acceptBooking(booking.id);
    addNotification(
      booking.buyerId, 
      'booking accepted', 
      `Your booking request for ${booking.equipmentName} has been accepted. Please contact the seller (${user.name}: ${user.email}).`
    );
  };

  const handleReject = (booking) => {
    if (window.confirm("Are you sure you want to reject this booking?")) {
      rejectBooking(booking.id);
      addNotification(
        booking.buyerId, 
        'booking rejected', 
        `Your booking request for ${booking.equipmentName} was declined by the seller.`
      );
    }
  };

  return (
    <div className="container p-6 mt-4">
      <div className="flex justify-between items-center mb-6">
        <h2>Seller Dashboard</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Equipment'}
        </button>
      </div>

      {showAddForm && (
        <div className="card p-6 mb-8" style={{ border: '2px solid var(--color-primary)' }}>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label className="form-label">Equipment Name</label>
                <select required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}>
                  {EQUIPMENT_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label className="form-label">Price Data</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input required type="number" className="form-input" placeholder="" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ flex: 1 }} />
                  <select required className="form-input" value={formData.pricingUnit} onChange={e => setFormData({...formData, pricingUnit: e.target.value})} style={{ flex: 1 }}>
                    <option value="Per Hour">Per Hour</option>
                    <option value="Per Day">Per Day</option>
                    <option value="Per Acre">Per Acre</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label className="form-label">Location</label>
                <input required type="text" className="form-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label className="form-label">Contact Number</label>
                <input required type="text" className="form-input" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
              </div>
              <div className="form-group" style={{ flex: '1 1 200px' }}>
                <label className="form-label">Vehicle/Model Number</label>
                <input required type="text" className="form-input" placeholder="e.g. MH-12-AB-1234 or N/A" value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} />
              </div>
              <div className="form-group" style={{ flex: '1 1 100%' }}>
                <label className="form-label">Equipment Description</label>
                <textarea required className="form-input" rows="3" placeholder="" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="form-group" style={{ flex: '1 1 100%' }}>
                <label className="form-label">Equipment Photo</label>
                <input type="file" accept="image/*" className="form-input" onChange={handleImageUpload} />
                {formData.image && <img src={formData.image} alt="Preview" style={{ marginTop: '10px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />}
              </div>
            </div>
            <button type="submit" className="btn btn-secondary mt-4" disabled={isSubmitting}>
              {isSubmitting ? '...' : 'Submit Listing'}
            </button>
          </form>
        </div>
      )}

      <div className="flex gap-6" style={{ flexWrap: 'wrap' }}>
        
        {/* Listings */}
        <div style={{ flex: '2 1 500px' }}>
          <h3>My Equipments</h3>
          <div className="flex-col gap-4 mt-4">
            {sellerEquipment.length === 0 ? (
              <p style={{ color: '#666' }}>You have not listed any equipment yet.</p>
            ) : (
              sellerEquipment.map(eq => (
                <div key={eq.id} className="card flex" style={{ padding: '1rem', gap: '1rem' }}>
                  <img src={eq.image} alt={eq.name} style={{ width: '120px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {eq.name}
                      {eq.status === 'Verified' ? (
                        <span style={{ fontSize: '0.7rem', backgroundColor: '#e8f5e9', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px' }}>✅ Verified</span>
                      ) : (
                        <span style={{ fontSize: '0.7rem', backgroundColor: '#fff3e0', color: '#e65100', padding: '2px 6px', borderRadius: '4px' }}>⚠️ {eq.status}</span>
                      )}
                    </h4>
                    {eq.validationReason && eq.status !== 'Verified' && (
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#e65100' }}>Reason: {eq.validationReason}</p>
                    )}
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>📍 {eq.location}</p>
                    <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold' }}>₹{eq.price} / {eq.pricingUnit || 'Per Day'}</p>
                    {eq.isAvailable === false && (
                      <button 
                        className="btn btn-outline mt-2" 
                        style={{ borderColor: 'var(--color-secondary)', color: 'var(--color-secondary)', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} 
                        onClick={() => {
                          markAsAvailable(eq.id, addNotification);
                          alert(`${eq.name} is now marked as available! Notifications sent.`);
                        }}
                      >
                        Mark as Available (Reset)
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bookings */}
        <div style={{ flex: '1 1 350px' }}>
          <h3>Received Bookings</h3>
          <div className="flex-col gap-4 mt-4">
            {sellerBookings.length === 0 ? (
              <p style={{ color: '#666' }}>No booking requests yet.</p>
            ) : (
              sellerBookings.slice().reverse().map(b => (
                <div key={b.id} className="card p-4" style={{ 
                  borderLeft: `4px solid ${b.status === 'accepted' ? 'var(--color-secondary)' : b.status === 'rejected' ? '#e74c3c' : '#f39c12'}` 
                }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>{b.equipmentName}</p>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>Buyer: <Link to={`/user/${b.buyerId}`} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>{b.buyerName}</Link></p>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>Contact Number: {b.buyerContact}</p>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>Location: {b.renterLocation || 'N/A'}</p>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>Date Needed: {b.rentalDate}</p>
                  {b.drivingLicense && (
                    <div style={{ margin: '0.5rem 0' }}>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Renter License/ID:</p>
                      <img 
                        src={b.drivingLicense} 
                        alt="Driving License" 
                        onClick={() => {
                          const w = window.open("");
                          if(w) w.document.write(`<img src="${b.drivingLicense}" style="max-width:100%;" />`);
                        }}
                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#f9f9f9' }} 
                        title="Click to view full image"
                      />
                    </div>
                  )}

                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#666' }}>
                    Sent: {new Date(b.date).toLocaleDateString()} - Status: <strong style={{ textTransform: 'uppercase' }}>{b.status}</strong>
                  </p>
                  {b.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                       <button 
                         className="btn btn-primary" 
                         style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', flex: 1 }}
                         onClick={() => handleAccept(b)}
                       >
                         Accept
                       </button>
                       <button 
                         className="btn btn-outline" 
                         style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', flex: 1, borderColor: '#e74c3c', color: '#e74c3c' }}
                         onClick={() => handleReject(b)}
                       >
                         Reject
                       </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
