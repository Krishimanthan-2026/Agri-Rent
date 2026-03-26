import { useState } from 'react';
import { useAuth, useData } from '../context';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { users } = useAuth();
  const { equipments, bookings } = useData();

  const [activeTab, setActiveTab] = useState('users');

  const regularUsers = users.filter(u => u.role !== 'Admin');

  return (
    <div className="container p-6 mt-4">
      <h2 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Admin Control Center</h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('users')}>Users ({regularUsers.length})</button>
        <button className={`btn ${activeTab === 'equipments' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('equipments')}>Equipments ({equipments.length})</button>
        <button className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('bookings')}>Transactions ({bookings.length})</button>
      </div>

      {activeTab === 'users' && (
        <div className="card p-6">
          <h3 className="mb-4">Users</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-gray)', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px' }}>Name</th>
                  <th style={{ padding: '12px' }}>Email/Phone Number</th>
                  <th style={{ padding: '12px' }}>Activity</th>
                  <th style={{ padding: '12px' }}>Trust Score</th>
                </tr>
              </thead>
              <tbody>
                {regularUsers.length === 0 ? <tr><td colSpan="4" style={{ padding: '12px' }}>No users found.</td></tr> : regularUsers.map(u => {
                  const userListed = equipments.filter(e => e.sellerId === u.id).length;
                  const userBookings = bookings.filter(b => b.buyerId === u.id).length;
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}><Link to={`/user/${u.id}`} style={{color:'var(--color-primary)', textDecoration:'underline'}}>{u.name}</Link></td>
                      <td style={{ padding: '12px' }}>{u.email}</td>
                      <td style={{ padding: '12px' }}>Listed: {userListed} | Booked: {userBookings}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          backgroundColor: u.trustScore >= 80 ? '#e8f5e9' : u.trustScore >= 40 ? '#fff8e1' : '#ffebee', 
                          color: u.trustScore >= 80 ? '#2e7d32' : u.trustScore >= 40 ? '#f57f17' : '#c62828', 
                          padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' 
                        }}>
                          {u.trustScore}/100
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'equipments' && (
        <div className="card p-6">
          <h3 className="mb-4">All Equipment</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-gray)', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px' }}>Equipment Name</th>
                  <th style={{ padding: '12px' }}>Owner</th>
                  <th style={{ padding: '12px' }}>Vehicle/Model Number</th>
                  <th style={{ padding: '12px', maxWidth: '300px' }}>Equipment Description</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {equipments.length === 0 ? <tr><td colSpan="5" style={{ padding: '12px' }}>No equipments listed.</td></tr> : equipments.map(eq => (
                  <tr key={eq.id} style={{ borderBottom: '1px solid #eee', verticalAlign: 'top' }}>
                    <td style={{ padding: '12px' }}>
                      <strong>{eq.name}</strong><br/>
                      <span style={{ fontSize: '0.85rem', color: '#666' }}>📍 {eq.location} | ₹{eq.price}/{eq.pricingUnit}</span>
                    </td>
                    <td style={{ padding: '12px' }}><Link to={`/user/${eq.sellerId}`} style={{color:'var(--color-primary)', textDecoration:'underline'}}>{eq.ownerName}</Link></td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{eq.vehicleNumber || 'N/A'}</td>
                    <td style={{ padding: '12px', maxWidth: '300px', fontSize: '0.9rem', color: '#555' }}>{eq.description || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      {eq.status === 'Verified' ? (
                        <span style={{ fontSize: '0.8rem', backgroundColor: '#e8f5e9', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px' }}>✅ Verified</span>
                      ) : (
                        <span style={{ fontSize: '0.8rem', backgroundColor: '#fff3e0', color: '#e65100', padding: '2px 6px', borderRadius: '4px' }}>⚠️ {eq.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="card p-6">
          <h3 className="mb-4">Transactions</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-gray)', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px' }}>Date</th>
                  <th style={{ padding: '12px' }}>Equipment Name</th>
                  <th style={{ padding: '12px' }}>Owner</th>
                  <th style={{ padding: '12px' }}>Buyer</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? <tr><td colSpan="5" style={{ padding: '12px' }}>No bookings found.</td></tr> : bookings.slice().reverse().map(b => {
                  const owner = users.find(u => u.id === b.sellerId);
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid #eee', verticalAlign: 'top' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{b.rentalDate}</td>
                      <td style={{ padding: '12px', color: 'var(--color-primary)', fontWeight: 'bold' }}>{b.equipmentName}</td>
                      <td style={{ padding: '12px' }}><Link to={`/user/${b.sellerId}`} style={{color:'var(--color-primary)', textDecoration:'underline'}}>{owner ? owner.name : 'Unknown'}</Link></td>
                      <td style={{ padding: '12px' }}>
                        <Link to={`/user/${b.buyerId}`} style={{color:'var(--color-secondary)', textDecoration:'underline'}}>{b.buyerName}</Link>
                        <br/><span style={{ fontSize: '0.8rem', color: '#666' }}>📞 {b.buyerContact}</span>
                        <br/><span style={{ fontSize: '0.8rem', color: '#666' }}>📍 {b.renterLocation}</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <strong style={{ 
                          textTransform: 'uppercase', fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid currentColor',
                          backgroundColor: b.status === 'accepted' ? '#e8f5e9' : b.status === 'rejected' ? '#ffebee' : '#fff8e1',
                          color: b.status === 'accepted' ? '#2e7d32' : b.status === 'rejected' ? '#c62828' : '#f57f17'
                        }}>{b.status}</strong>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
