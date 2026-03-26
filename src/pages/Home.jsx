import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, MapPin, CheckCircle, Settings, Users } from 'lucide-react';

const SLIDER_IMAGES = [
  '/slider/r4k079335-rrd-1024x576.webp',
  '/slider/360_F_1086894583_9DujIKoFsacXFZ05n4UpWUMp6H7gVid8.webp',
  '/slider/farmer-driving-a-tractor-harvesting-the-land.webp',
  '/slider/IMAGE2.png'
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 2000); 
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="flex-col" style={{ flex: 1, backgroundColor: '#fcfdfc' }}>
      
      {/* Main Intro Section */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '6rem 1rem', minHeight: 'calc(100vh - 74px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#121212' }}>
        
        {SLIDER_IMAGES.map((img, index) => (
          <div
            key={img}
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.6)), url("${img}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out'
            }}
          />
        ))}

        <div className="container" style={{ textAlign: 'center', maxWidth: '900px', position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'white', marginBottom: '1rem', fontWeight: '800' }}>
            Welcome to Agri-Rent
          </h1>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--color-secondary)', marginBottom: '2rem', fontWeight: '600' }}>
            Connecting Farmers to Nearby Equipment, Anytime
          </h2>
          
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#e0e0e0', margin: '0 auto', maxWidth: '800px' }}>
            Agri-Rent is a location-based web platform that connects farmers with nearby agricultural equipment owners, allowing farmers to easily search, book, and use machinery when needed.
          </p>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section style={{ backgroundColor: '#f5f9f5', padding: '4rem 1rem 6rem' }}>
        <div className="container">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Card 1: Platform Advantages */}
            <div className="feature-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                <Settings size={28} />
                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>🔸 Platform Advantages</h3>
              </div>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: '#555' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><CheckCircle size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Provides real-time location-based search</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><CheckCircle size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Uses distance calculation to show nearest equipment</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><CheckCircle size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Includes AI-based suggestions for better decisions</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><CheckCircle size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Simple design focused on rural usability</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><CheckCircle size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Allows both farmer + owner interaction in one platform</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><CheckCircle size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Lightweight system (works even with low internet)</li>
              </ul>
            </div>

            {/* Card 2: How It Works */}
            <div className="feature-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                <Users size={28} />
                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>🔸 How It Works</h3>
              </div>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: '#555' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} /> User opens Agri-Rent website</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Selects equipment type (Tractor, Plough, etc.)</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} /> System shows nearby available machines</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} /> User views details (price, distance, owner info)</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Books equipment</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} /> Owner receives request and confirms</li>
              </ul>
            </div>

            {/* Card 3: Features & Benefits */}
            <div className="feature-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                <Leaf size={28} />
                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>🔸 Features & Benefits</h3>
              </div>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#555', fontSize: '0.95rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>• Location-based equipment search</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>• Equipment category selection</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>• Booking and scheduling system</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>• User login and profile management</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>• Owner equipment listing & editing</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>• Distance calculation feature</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>• AI-based equipment recommendation</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>• Simple and responsive UI</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>• Saves time in searching manually</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>• Helps owners earn from unused machines</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>• Simple and user-friendly interface</li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>• Supports small and medium farmers</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
