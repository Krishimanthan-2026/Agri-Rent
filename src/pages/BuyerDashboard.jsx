import { useState } from 'react';
import { useAuth, useData, useNotification } from '../context';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icon in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const EQUIPMENT_OPTIONS = [
  'Tractor', 'Plough', 'Rotavator', 'Harrow', 'Cultivator', 'Land Leveler', 
  'Subsoiler', 'Seed Drill', 'Planter', 'Combine Harvester', 'Reaper', 
  'Thresher', 'Forage Harvester', 'Crop Cutter', 'Seed Cum Fertilizer Drill', 
  'Paddy Transplanter', 'Broadcast Seeder', 'Dibber', 'Winnower', 
  'Tractor Trolley', 'Mini Trucks', 'Pickup Vehicles', 'Bullock Cart', 
  'Grain Dryer', 'Cleaning Machine', 'Rice Mill'
];

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { equipments, createBooking, userBookings, reportEquipment, addToNotifyQueue } = useData();
  const { addNotification } = useNotification();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]); // Default Bengaluru
  const [selectedEquipmentDetails, setSelectedEquipmentDetails] = useState(null);
  const [clickedMapLocation, setClickedMapLocation] = useState(null);

  const [showBookingForm, setShowBookingForm] = useState(null);
  const [bookingFormData, setBookingFormData] = useState({ renterName: user?.name || '', renterLocation: '', contactNumber: user?.email || '', rentalDate: '', drivingLicense: '' });

  const cleanText = (text) => {
    if (!text) return '';
    // Remove markdown images: ![alt](url)
    let cleaned = text.replace(/!\[.*?\]\(.*?\)/g, '');
    // Remove raw HTTP/HTTPS URLs entirely
    cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '');
    return cleaned.trim();
  };

  const handleBookClick = (eq) => {
    setShowBookingForm(eq);
    setBookingFormData({ renterName: user?.name || '', renterLocation: '', contactNumber: user?.email || '', rentalDate: '', drivingLicense: '' });
  };

  const handleLicenseUpload = (e) => {
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
          setBookingFormData({ ...bookingFormData, drivingLicense: canvas.toDataURL('image/jpeg', 0.6) });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const submitBooking = (e) => {
    e.preventDefault();
    createBooking(showBookingForm, bookingFormData);
    addNotification(
      showBookingForm.sellerId,
      'booking request',
      `A new booking request from ${bookingFormData.renterName} for ${showBookingForm.name}. Please check your dashboard.`
    );
    alert('Booking request sent successfully!');
    setShowBookingForm(null);
  };

  const handleNotifyClick = (eq) => {
    if (!user) {
      alert('Please log in to be notified.');
      return;
    }
    addToNotifyQueue(eq.id, user.id);
    alert('You will be notified when this equipment becomes available.');
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        () => alert('Could not get your location.')
      );
    }
  };

  const handleReport = (eq) => {
    if (window.confirm(`Are you sure you want to report "${eq.name}" as a fake or suspicious listing?`)) {
      reportEquipment(eq.id, eq.sellerId);
      alert('Listing reported successfully. The user trust score has been affected.');
    }
  };

  const filteredEquipments = equipments.filter(eq => {
    const matchSearch = searchTerm ? eq.name === searchTerm : true;
    const matchPrice = maxPrice ? eq.price <= Number(maxPrice) : true;
    const matchLocation = locationSearchTerm ? eq.location?.toLowerCase().includes(locationSearchTerm.toLowerCase()) : true;
    return matchSearch && matchPrice && matchLocation && eq.status !== 'Blocked';
  });

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setClickedMapLocation(e.latlng);
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.address) {
               const city = data.address.city || data.address.town || data.address.village || data.address.county || '';
               if (city) {
                 setLocationSearchTerm(city);
               }
            }
          }).catch(err => console.error(err));
      }
    });
    return null;
  }

  return (
    <div className="container p-6 mt-4">
      
      {/* Search and Filters */}
      <div className="card p-6 mb-8" style={{ borderTop: '4px solid var(--color-primary)' }}>
        <h3 className="mb-4">Find Machinery</h3>
        <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
          <select 
            className="form-input" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ flex: '1 1 300px' }}
          >
            <option value="">All Equipment</option>
            {EQUIPMENT_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <div className="flex items-center gap-2" style={{ flex: '0 1 200px' }}>
            <label>Max Price:</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder=""
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2" style={{ flex: '1 1 200px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by Location"
              value={locationSearchTerm}
              onChange={e => setLocationSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleLocateMe}>
            Show Nearby (Use My GPS)
          </button>
        </div>
      </div>

      <div className="flex gap-6" style={{ flexWrap: 'wrap' }}>
        
        {/* Main Content Area: Map and Listings */}
        <div style={{ flex: '2 1 600px' }}>
          {/* Map Section */}
          <div className="card mb-6" style={{ height: '400px', zIndex: 0 }}>
            <MapContainer center={mapCenter} zoom={10} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={mapCenter}>
                <Popup>Farmer Location (You)</Popup>
              </Marker>
              {clickedMapLocation && (
                <Marker position={clickedMapLocation}>
                  <Popup>Selected Search Location</Popup>
                </Marker>
              )}
              <MapClickHandler />
              
              {/* Plot Equipments on map if lat/lng exists */}
              {filteredEquipments.map(eq => (
                eq.lat && eq.lng && (
                  <Marker key={eq.id} position={[eq.lat, eq.lng]}>
                    <Popup>
                      <img src={eq.image} alt={eq.name} onClick={() => setSelectedEquipmentDetails(eq)} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '4px', cursor: 'pointer' }} />
                      <br/>
                      <strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {eq.name}
                        {eq.status === 'Verified' ? (
                          <span style={{ fontSize: '0.65rem', backgroundColor: '#e8f5e9', color: 'var(--color-primary)', padding: '1px 4px', borderRadius: '4px' }}>✅</span>
                        ) : (
                          <span style={{ fontSize: '0.65rem', backgroundColor: '#fff3e0', color: '#e65100', padding: '1px 4px', borderRadius: '4px' }}>⚠️</span>
                        )}
                      </strong><br/>
                      Owner: <Link to={`/user/${eq.sellerId}`}>{eq.ownerName}</Link><br/>
                      ₹{eq.price} / {eq.pricingUnit || 'Day'} <br/>
                      {eq.location}
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>

          {/* Equipment Listed Cards */}
          <h3>Available Equipment ({filteredEquipments.length})</h3>
          <div className="flex-col gap-4 mt-4">
            {filteredEquipments.length === 0 ? (
              <p>No equipment matches your search.</p>
            ) : (
              filteredEquipments.map(eq => (
                <div key={eq.id} className="card p-4 flex gap-4" style={{ alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '150px' }}>
                    <img src={eq.image} alt={eq.name} onClick={() => setSelectedEquipmentDetails(eq)} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-primary)', textAlign: 'center', backgroundColor: '#e8f5e9', padding: '4px', borderRadius: '4px' }}>
                      <Link to={`/user/${eq.sellerId}`} style={{ textDecoration: 'none', color: 'inherit' }}>Owner: {eq.ownerName}</Link>
                    </div>
                  </div>
                  <div className="flex-col justify-between" style={{ flex: 1, minHeight: '120px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.2rem 0', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {eq.name}
                        {eq.status === 'Verified' ? (
                          <span style={{ fontSize: '0.7rem', backgroundColor: '#e8f5e9', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px' }}>✅ Verified</span>
                        ) : (
                          <span style={{ fontSize: '0.7rem', backgroundColor: '#fff3e0', color: '#e65100', padding: '2px 6px', borderRadius: '4px' }}>⚠️ {eq.status}</span>
                        )}
                      </h3>
                      {eq.validationReason && eq.status !== 'Verified' && (
                        <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.8rem', color: '#e65100' }}>Warning: {eq.validationReason}</p>
                      )}
                      <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>Owner: <Link to={`/user/${eq.sellerId}`} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>{eq.ownerName}</Link> | 📍 {eq.location}</p>
                      <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold', fontSize: '1.2rem' }}>₹{eq.price} <span style={{fontSize: '0.9rem', fontWeight: 'normal'}}>/ {eq.pricingUnit || 'Per Day'}</span></p>
                    </div>
                    {eq.isAvailable === false ? (
                      <div style={{ marginTop: '0.5rem', padding: '0.8rem', backgroundColor: '#ffebee', borderRadius: '4px', border: '1px solid #ffcdd2' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#c62828', fontSize: '0.9rem' }}>Sorry, this product is unavailable. Please click the Notify button to get reminded when it becomes available.</p>
                        <button className="btn btn-outline" style={{ borderColor: '#c62828', color: '#c62828', backgroundColor: 'white' }} onClick={() => handleNotifyClick(eq)}>Notify Me</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-primary mt-2" onClick={() => setSelectedEquipmentDetails(eq)}>View Details</button>
                        <button className="btn btn-secondary mt-2" onClick={() => handleBookClick(eq)}>Book Now</button>
                        <button className="btn btn-outline mt-2" style={{ borderColor: '#e65100', color: '#e65100' }} onClick={() => handleReport(eq)}>Report</button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar: Booking History */}
        <div className="card p-6" style={{ flex: '1 1 300px', height: 'fit-content' }}>
          <h3 className="mb-4">My Bookings</h3>
          <div className="flex-col gap-4">
            {userBookings.length === 0 ? (
              <p style={{ color: '#666' }}>You have not booked anything yet.</p>
            ) : (
              userBookings.slice().reverse().map(b => (
                <div key={b.id} style={{ 
                  borderLeft: `4px solid ${b.status === 'accepted' ? 'var(--color-secondary)' : '#f39c12'}`,
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--color-gray)'
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{b.equipmentName}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{new Date(b.date).toLocaleDateString()}</div>
                  <div style={{ marginTop: '0.5rem', display: 'inline-block', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: b.status === 'accepted' ? '#e8f5e9' : '#fff3e0', color: b.status === 'accepted' ? 'var(--color-primary)' : '#e65100', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {b.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Detailed Equipment Modal */}
      {selectedEquipmentDetails && (
        <div className="modal-overlay" onClick={() => setSelectedEquipmentDetails(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <button className="modal-close" onClick={() => setSelectedEquipmentDetails(null)}>&times;</button>
            <h2 className="mb-0" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {selectedEquipmentDetails.name}
              {selectedEquipmentDetails.status === 'Verified' ? (
                <span style={{ fontSize: '0.8rem', backgroundColor: '#e8f5e9', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '4px' }}>✅ Verified</span>
              ) : (
                <span style={{ fontSize: '0.8rem', backgroundColor: '#fff3e0', color: '#e65100', padding: '2px 8px', borderRadius: '4px' }}>⚠️ {selectedEquipmentDetails.status}</span>
              )}
            </h2>
            <img src={selectedEquipmentDetails.image} alt={selectedEquipmentDetails.name} style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '8px' }} />
            
            <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px', border: '1px solid #eee' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>₹{selectedEquipmentDetails.price} <span style={{fontSize: '1rem', fontWeight: 'normal', color: '#444'}}>/ {selectedEquipmentDetails.pricingUnit || 'Per Day'}</span></p>
              <p style={{ margin: '0 0 0.6rem 0', fontSize: '1.05rem' }}><strong>📍 Location:</strong> {selectedEquipmentDetails.location}</p>
              <p style={{ margin: '0 0 0.6rem 0', fontSize: '1.05rem' }}><strong>🚜 Vehicle/Model Number:</strong> {selectedEquipmentDetails.vehicleNumber || 'N/A'}</p>
              <p style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', lineHeight: '1.5' }}><strong>📝 Equipment Description:</strong> {cleanText(selectedEquipmentDetails.description) || 'No specific description provided by the owner.'}</p>
              
              <div style={{ margin: '1rem 0 0 0', paddingTop: '1rem', borderTop: '2px dashed #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.05rem' }}><strong>👤 Owner:</strong> <Link to={`/user/${selectedEquipmentDetails.sellerId}`} style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 'bold' }}>{selectedEquipmentDetails.ownerName}</Link></span>
                <span style={{ fontSize: '1.05rem' }}><strong>📞 Contact:</strong> {selectedEquipmentDetails.contact || 'Hidden'}</span>
              </div>
            </div>
            
            {selectedEquipmentDetails.isAvailable === false ? (
              <div style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '8px', border: '1px solid #ffcdd2', textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.8rem 0', color: '#c62828', fontSize: '1.05rem' }}>Sorry, this product is unavailable. Please click the Notify button to get reminded when it becomes available.</p>
                <button className="btn btn-outline" style={{ width: '100%', padding: '0.8rem', fontSize: '1.1rem', borderColor: '#c62828', color: '#c62828', backgroundColor: 'white' }} onClick={() => handleNotifyClick(selectedEquipmentDetails)}>Notify Me</button>
              </div>
            ) : (
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', padding: '0.8rem', fontSize: '1.1rem' }} 
                onClick={() => {
                  handleBookClick(selectedEquipmentDetails);
                  setSelectedEquipmentDetails(null);
                }}
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="modal-overlay" onClick={() => setShowBookingForm(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBookingForm(null)}>&times;</button>
            <h2 className="mb-4">Book {showBookingForm.name}</h2>
            <form onSubmit={submitBooking}>
              <div className="form-group">
                <label className="form-label">Renter Name</label>
                <input required type="text" className="form-input" value={bookingFormData.renterName} onChange={e => setBookingFormData({...bookingFormData, renterName: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Renter Location</label>
                <input required type="text" className="form-input" placeholder="e.g. Village or City" value={bookingFormData.renterLocation} onChange={e => setBookingFormData({...bookingFormData, renterLocation: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input required type="text" className="form-input" value={bookingFormData.contactNumber} onChange={e => setBookingFormData({...bookingFormData, contactNumber: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Rental Date</label>
                <input required type="date" className="form-input" value={bookingFormData.rentalDate} onChange={e => setBookingFormData({...bookingFormData, rentalDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Upload Driving License</label>
                <input type="file" accept="image/*" className="form-input" onChange={handleLicenseUpload} />
              </div>
              <button type="submit" className="btn btn-secondary mt-4" style={{ width: '100%' }}>Submit Booking Request</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
