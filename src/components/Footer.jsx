export default function Footer() {

  return (
    <footer style={{ backgroundColor: 'var(--color-dark-gray)', color: 'var(--color-white)', padding: '2rem 1rem', marginTop: 'auto' }}>
      <div className="container flex-col items-center gap-2">
        <h2 style={{ color: 'var(--color-white)', margin: 0 }}>AgriRent</h2>
        <p>Contact: support@agrirent.com</p>
        <p>HQ: Bangalore, India | Helpline: 1800-123-4567</p>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} AgriRent. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
