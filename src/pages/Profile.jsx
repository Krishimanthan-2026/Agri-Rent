import { useState } from 'react';
import { useAuth, useData, useNotification } from '../context';

const EQUIPMENT_OPTIONS = [
  'Tractor', 'Plough', 'Rotavator', 'Harrow', 'Cultivator', 'Seed Drill', 
  'Planter', 'Transplanter', 'Dibber', 'Water Pump', 'Drip Irrigation System', 
  'Sprinkler System', 'Pipes & Hoses', 'Sprayer', 'Duster', 'Weed Cutter', 
  'Fertilizer Spreader', 'Combine Harvester', 'Reaper', 'Thresher', 'Sickle', 
  'Grain Cleaner', 'Dryer', 'Sorting/Grading Machine', 'Tractor Trolley', 
  'Agriculture Drone', 'GPS Tractor', 'Soil Testing Kit', 'Smart Irrigation System'
];

export default function Profile() {
  const { user, updateUser, deleteAccount } = useAuth();
  const { sellerEquipment, sellerBookings, userBookings, acceptBooking, updateEquipment, deleteEquipment, deleteUserData } = useData();
  const { addNotification } = useNotification();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: user.name, email: user.email });

  const [editingEqId, setEditingEqId] = useState(null);
  const [eqFormData, setEqFormData] = useState({});

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateUser(profileData);
    setIsEditingProfile(false);
  };

  const startEditEq = (eq) => {
    setEditingEqId(eq.id);
    setEqFormData({ 
      name: eq.name, price: eq.price, pricingUnit: eq.pricingUnit || 'Per Day', 
      location: eq.location, contact: eq.contact, image: eq.image,
      vehicleNumber: eq.vehicleNumber || '', description: eq.description || '' 
    });
  };

  const handleEqSubmit = (e) => {
    e.preventDefault();
    updateEquipment(editingEqId, eqFormData);
    setEditingEqId(null);
  };

  const handleEqDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      deleteEquipment(id);
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

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and will remove all your listings and bookings.')) {
      deleteUserData(user.id);
      deleteAccount(user.id);
    }
  };

  return (
    <div className="container p-6 mt-4">
      <h2 style={{ color: 'var(--color-primary)', marginBottom: '2rem' }}>Profile</h2>
      
      <div className="card p-6 mb-8" style={{ borderTop: '4px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Account Details</h3>
          {!isEditingProfile && (
            <button className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setIsEditingProfile(true)}>
              Edit Profile
            </button>
          )}
        </div>
        
        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit} className="mt-4" style={{ maxWidth: '400px' }}>
            <div className="form-group mb-3">
              <label className="form-label">Name</label>
              <input required type="text" className="form-input" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Email/Phone Number</label>
              <input required type="text" className="form-input" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-outline" onClick={() => { setIsEditingProfile(false); setProfileData({ name: user.name, email: user.email }); }}>Cancel</button>
            </div>
          </form>
        ) : (
          (() => {
            const trustScore = user.trustScore ?? 50;
            const trustCategory = trustScore >= 80 ? 'High Trust' : trustScore >= 40 ? 'Medium Trust' : 'Low Trust';
            const trustColor = trustScore >= 80 ? '#2e7d32' : trustScore >= 40 ? '#f57f17' : '#c62828';
            const successfulRentals = sellerBookings.filter(b => b.status === 'accepted').length;
            
            return (
              <div className="mt-2" style={{ lineHeight: '1.8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{user.name}</h3>
                  <span style={{ 
                    backgroundColor: trustScore >= 80 ? '#e8f5e9' : trustScore >= 40 ? '#fff8e1' : '#ffebee', 
                    color: trustColor, padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 'bold' 
                  }}>
                    {trustScore >= 80 ? '✅ Verified User' : trustScore >= 40 ? '⚠️ Suspicious User' : '🚫 Unverified'}
                    <span style={{ marginLeft: '6px', fontWeight: 'normal', opacity: 0.8 }}>({trustScore}/100)</span>
                  </span>
                </div>
                <p><strong>Successful Rentals:</strong> {successfulRentals}</p>
                <p><strong>Email/Phone Number:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                  <button onClick={handleDeleteAccount} className="btn" style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                    Delete Account
                  </button>
                </div>
              </div>
            );
          })()
        )}
      </div>

      <div className="flex gap-6" style={{ flexWrap: 'wrap' }}>
        
        {/* Buyer Compartment */}
        <div style={{ flex: '1 1 400px' }}>
          <h3>My Bookings</h3>
          <div className="card p-6 mt-4">
            <div className="flex-col gap-4">
              {userBookings.length === 0 ? (
                <p style={{ color: '#666' }}>You have not booked any equipment yet.</p>
              ) : (
                userBookings.slice().reverse().map(b => (
                  <div key={b.id} style={{ 
                    borderLeft: `4px solid ${b.status === 'accepted' ? 'var(--color-secondary)' : '#f39c12'}`,
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--color-gray)'
                  }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{b.equipmentName}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Placed on {new Date(b.date).toLocaleDateString()}</div>
                    <div style={{ marginTop: '0.5rem', display: 'inline-block', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: b.status === 'accepted' ? '#e8f5e9' : '#fff3e0', color: b.status === 'accepted' ? 'var(--color-primary)' : '#e65100', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      Status: {b.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Seller Compartment */}
        <div style={{ flex: '1 1 400px' }}>
          <h3>My Equipments</h3>
          <div className="card p-6 mt-4">
            <div className="flex-col gap-4 mb-6">
              {sellerEquipment.length === 0 ? (
                <p style={{ color: '#666', fontSize: '0.9rem' }}>You have no equipment listed.</p>
              ) : (
                sellerEquipment.map(eq => (
                  <div key={eq.id} className="flex-col" style={{ gap: '0.5rem', border: '1px solid #eee', padding: '1rem', borderRadius: '4px' }}>
                    {editingEqId === eq.id ? (
                      <form onSubmit={handleEqSubmit}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                          <select required className="form-input" value={eqFormData.name} onChange={e => setEqFormData({...eqFormData, name: e.target.value})} style={{ flex: '1 1 150px' }}>
                            {EQUIPMENT_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                          <input required type="number" className="form-input" placeholder="Price" value={eqFormData.price} onChange={e => setEqFormData({...eqFormData, price: e.target.value})} style={{ flex: '1 1 80px' }} />
                          <select required className="form-input" value={eqFormData.pricingUnit} onChange={e => setEqFormData({...eqFormData, pricingUnit: e.target.value})} style={{ flex: '1 1 100px' }}>
                            <option value="Per Hour">Per Hour</option>
                            <option value="Per Day">Per Day</option>
                            <option value="Per Acre">Per Acre</option>
                          </select>
                          <input required type="text" className="form-input" placeholder="Location" value={eqFormData.location} onChange={e => setEqFormData({...eqFormData, location: e.target.value})} style={{ flex: '1 1 150px' }} />
                          <input required type="text" className="form-input" placeholder="Contact" value={eqFormData.contact} onChange={e => setEqFormData({...eqFormData, contact: e.target.value})} style={{ flex: '1 1 150px' }} />
                          <input required type="text" className="form-input" placeholder="Vehicle/Model No" value={eqFormData.vehicleNumber} onChange={e => setEqFormData({...eqFormData, vehicleNumber: e.target.value})} style={{ flex: '1 1 150px' }} />
                          <input required type="text" className="form-input" placeholder="Short Description" value={eqFormData.description} onChange={e => setEqFormData({...eqFormData, description: e.target.value})} style={{ flex: '1 1 100%' }} />
                          <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', color: '#555', fontWeight: '500' }}>Update Equipment Photo (Optional)</label>
                            <input type="file" accept="image/*" className="form-input" onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setEqFormData({...eqFormData, image: reader.result});
                                };
                                reader.readAsDataURL(file);
                              }
                            }} style={{ border: '1px dashed #ccc', padding: '0.5rem', background: '#f9f9f9', cursor: 'pointer' }} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="submit" className="btn btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>Save Changes</button>
                          <button type="button" className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setEditingEqId(null)}>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex" style={{ gap: '1rem', alignItems: 'center' }}>
                        <img src={eq.image} alt={eq.name} style={{ width: '60px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {eq.name}
                            {eq.status === 'Verified' ? (
                              <span style={{ fontSize: '0.7rem', backgroundColor: '#e8f5e9', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px' }}>✅ Verified</span>
                            ) : (
                              <span style={{ fontSize: '0.7rem', backgroundColor: '#fff3e0', color: '#e65100', padding: '2px 6px', borderRadius: '4px' }}>⚠️ {eq.status}</span>
                            )}
                          </div>
                          {eq.validationReason && eq.status !== 'Verified' && (
                            <div style={{ fontSize: '0.8rem', color: '#e65100', marginBottom: '4px' }}>Reason: {eq.validationReason}</div>
                          )}
                          <div style={{ fontSize: '0.85rem', color: '#555' }}>₹{eq.price} / {eq.pricingUnit || 'Per Day'} | {eq.location}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-outline" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }} onClick={() => startEditEq(eq)}>Edit</button>
                          <button className="btn btn-outline" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', borderColor: '#e65100', color: '#e65100' }} onClick={() => handleEqDelete(eq.id)}>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Received Bookings</h4>
            <div className="flex-col gap-4">
              {sellerBookings.length === 0 ? (
                <p style={{ color: '#666', fontSize: '0.9rem' }}>No booking requests received.</p>
              ) : (
                sellerBookings.slice().reverse().map(b => (
                  <div key={b.id} style={{ 
                    borderLeft: `4px solid ${b.status === 'accepted' ? 'var(--color-secondary)' : '#f39c12'}`,
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--color-gray)'
                  }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{b.equipmentName}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>From: {b.buyerName} ({b.buyerContact})</div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                      Status: <strong style={{ textTransform: 'uppercase' }}>{b.status}</strong>
                    </div>
                    {b.status === 'pending' && (
                      <button 
                        className="btn btn-primary mt-2" 
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        onClick={() => handleAccept(b)}
                      >
                        Accept
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
