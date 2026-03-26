import { AuthProvider } from './AuthContext';
import { DataProvider } from './DataContext';
import { NotificationProvider } from './NotificationContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <DataProvider>
          {children}
        </DataProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export { useAuth } from './AuthContext';
export { useData } from './DataContext';
export { useNotification } from './NotificationContext';
