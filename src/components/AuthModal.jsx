import { useState } from 'react';
import { useAuth } from '../context';

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const contact = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(contact) && !mobileRegex.test(contact)) {
      setError('Please enter a valid email address or a 10-digit mobile number.');
      return;
    }

    if (isLogin) {
      const result = login(contact, formData.password);
      if (result.success) {
        onClose();
      } else {
        setError(result.error);
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      const result = register({ name: formData.name, email: contact, password: formData.password });
      if (result.success) {
        setIsLogin(true);
        setFormData({ ...formData, password: '', confirmPassword: '' });
        setError('');
        alert('Registration successful. Please login.');
      } else {
        setError(result.error);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{isLogin ? 'Login' : 'Register'}</h2>
        
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email/Phone Number</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder=""
              required 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              required 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input 
                type="password" 
                className="form-input" 
                required 
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? 'Register Here' : 'Login Here'}
          </span>
        </p>
      </div>
    </div>
  );
}
