import { useParams, Link } from 'react-router-dom';
import { useAuth, useData } from '../context';

export default function UserProfile() {
  const { userId } = useParams();
  const { users } = useAuth();
  const { equipments } = useData();

  // Find the user from the mock DB
  const profileUser = users.find(u => u.id === userId);
  
  if (!profileUser) {
    return (
      <div className="container p-6 mt-4 text-center">
        <h2>User Not Found</h2>
        <Link to="/" className="btn btn-primary mt-4">Go Home</Link>
      </div>
    );
  }

  // Find user's equipments (if they are acting as a seller)
  const userEquipments = equipments.filter(eq => eq.sellerId === userId);
  
  // Extract contact numbers and locations from the equipments they listed
  // so we have a reliable way of showing their contact details to the public.
  const contactDetails = Array.from(new Set(userEquipments.map(e => e.contact).filter(Boolean)));
  const locations = Array.from(new Set(userEquipments.map(e => e.location).filter(Boolean)));

  return (
    <div className="container p-6 mt-4">
      <div className="card p-6 mb-8" style={{ borderTop: '4px solid var(--color-primary)' }}>
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {profileUser.name}
          {(() => {
            const trustScore = profileUser.trustScore ?? 50;
            const trustCategory = trustScore >= 80 ? 'High Trust' : trustScore >= 40 ? 'Medium Trust' : 'Low Trust';
            const trustColor = trustScore >= 80 ? '#2e7d32' : trustScore >= 40 ? '#f57f17' : '#c62828';
            return (
              <span style={{ 
                backgroundColor: trustScore >= 80 ? '#e8f5e9' : trustScore >= 40 ? '#fff8e1' : '#ffebee', 
                color: trustColor, padding: '4px 12px', borderRadius: '16px', fontSize: '1rem', fontWeight: 'bold' 
              }}>
                {trustScore >= 80 ? '✅ Verified User' : trustScore >= 40 ? '⚠️ Suspicious User' : '🚫 Unverified'}
                <span style={{ marginLeft: '6px', fontWeight: 'normal', opacity: 0.8 }}>({trustScore}/100)</span>
              </span>
            );
          })()}
        </h2>
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          <p><strong>Email Address:</strong> {profileUser.email}</p>
          {contactDetails.length > 0 && <p><strong>Contact Numbers:</strong> {contactDetails.join(', ')}</p>}
          {locations.length > 0 && <p><strong>Active Locations:</strong> {locations.join(' | ')}</p>}
        </div>
      </div>

      <h3>Equipment Listed ({userEquipments.length})</h3>
      
      <div className="flex-col gap-4 mt-4">
        {userEquipments.length === 0 ? (
          <p style={{ color: '#666' }}>This user has not listed any equipment for rent.</p>
        ) : (
          userEquipments.map(eq => (
            <div key={eq.id} className="card p-4 flex gap-4" style={{ alignItems: 'flex-start' }}>
              <img src={eq.image} alt={eq.name} style={{ width: '150px', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
              <div className="flex-col justify-between" style={{ flex: 1 }}>
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
                  <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>📍 {eq.location} | 📞 {eq.contact}</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold', fontSize: '1.2rem' }}>₹{eq.price} <span style={{fontSize: '0.9rem', fontWeight: 'normal'}}>/ {eq.pricingUnit || 'Per Day'}</span></p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
