export default function About() {

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: 'calc(100vh - 74px)', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ color: '#fff', marginBottom: '2rem', textAlign: 'center', fontWeight: 'bold' }}>About Us</h2>
        
        <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '1rem', textAlign: 'center', color: '#fff' }}>Welcome to Agri-Rent</h3>
          <p style={{ lineHeight: '1.6', color: '#ddd', marginBottom: '2.5rem', fontSize: '1.1rem', textAlign: 'center' }}>
            AgriRent is a modern platform designed to connect farmers with owners of agricultural equipment. Our goal is to make farming more efficient and affordable.
          </p>

          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#fff', borderBottom: '2px solid #555', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Key Features</h3>
            <ul style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#ddd', paddingLeft: '1.5rem' }}>
              <li><strong style={{ color: '#fff' }}>Location-Based Search:</strong> Easily find agricultural machinery available near your farm.</li>
              <li><strong style={{ color: '#fff' }}>AI-Powered Assistance:</strong> Get quick help and smart suggestions using our built-in AI assistant.</li>
              <li><strong style={{ color: '#fff' }}>Secure Booking System:</strong> Seamlessly book equipment with transparent pricing and direct owner communication.</li>
              <li><strong style={{ color: '#fff' }}>Verified Listings:</strong> Trust score system and verification badges for quality assurance.</li>
            </ul>
          </div>
          
          <div className="grid mt-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div className="p-6" style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', borderLeft: '4px solid #fff' }}>
              <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.2rem' }}>Advantages For Farmers</h4>
              <ul style={{ lineHeight: '1.6', paddingLeft: '1.2rem', color: '#ddd' }}>
                <li style={{ marginBottom: '0.5rem' }}>Access to high-quality equipment without heavy capital investment.</li>
                <li style={{ marginBottom: '0.5rem' }}>Save time with instant nearby searches.</li>
                <li>Affordable pay-per-use rental models (per hour, day, or acre).</li>
              </ul>
            </div>
            <div className="p-6" style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', borderLeft: '4px solid #aaa' }}>
              <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.2rem' }}>Advantages For Owners</h4>
              <ul style={{ lineHeight: '1.6', paddingLeft: '1.2rem', color: '#ddd' }}>
                <li style={{ marginBottom: '0.5rem' }}>Monetize idle machinery and generate extra income.</li>
                <li style={{ marginBottom: '0.5rem' }}>Manage bookings and fleet availability from a single dashboard.</li>
                <li>Build a strong reputation with our trust rating system.</li>
              </ul>
            </div>
          </div>

          <div className="p-6 text-center" style={{ backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#fff' }}>Contact Us</h3>
            <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#ddd' }}>
              <p><strong style={{ color: '#fff' }}>Email:</strong> <a href="mailto:support@agrirent.com" style={{ color: '#fff', textDecoration: 'underline' }}>support@agrirent.com</a></p>
              <p><strong style={{ color: '#fff' }}>Headquarters:</strong> Bangalore, India</p>
              <p><strong style={{ color: '#fff' }}>Helpline:</strong> 1800-123-4567</p>
              <p><strong style={{ color: '#fff' }}>Contact Numbers:</strong> 6362806242, 7676879012</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
