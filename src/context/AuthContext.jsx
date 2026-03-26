import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agrirent_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('agrirent_users');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('agrirent_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('agrirent_user', JSON.stringify({ ...user, password: '' }));
    } else {
      localStorage.removeItem('agrirent_user');
    }
  }, [user]);

  const loginAdmin = (username, password) => {
    if (username === 'AgriRent' && password === 'AgriRent@3156') {
      const adminUser = { id: 'admin-1', name: 'Admin', role: 'Admin', email: 'AgriRent' };
      setUser(adminUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials' };
  };

  const login = (email, password) => {
    const existingUser = users.find(u => u.email === email);
    if (!existingUser) return { success: false, error: 'User not found' };
    if (existingUser.password !== password) return { success: false, error: 'Incorrect password' };

    const fullUser = { ...existingUser, trustScore: existingUser.trustScore ?? 50 };
    setUser(fullUser);
    return { success: true };
  };

  const register = (userData) => {
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'User already exists' };
    }
    const newUser = { ...userData, role: 'User', id: Date.now().toString(), trustScore: 50 };
    setUsers([...users, newUser]);
    return { success: true };
  };

  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    setUsers(users.map(u => u.id === user.id ? newUserData : u));
  };

  const updateUserTrustScore = (userId, delta) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const currentScore = u.trustScore ?? 50;
        const newScore = Math.max(0, Math.min(100, currentScore + delta));
        if (user && user.id === userId) {
          setUser(prev => ({ ...prev, trustScore: newScore }));
        }
        return { ...u, trustScore: newScore };
      }
      return u;
    }));
  };

  const logout = () => {
    setUser(null);
  };

  const deleteAccount = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
    if (user && user.id === userId) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, loginAdmin, updateUser, updateUserTrustScore, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
