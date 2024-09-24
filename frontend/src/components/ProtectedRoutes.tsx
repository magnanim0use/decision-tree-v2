import { Navigate, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useEffect, useState } from 'react';

import { ReactNode } from 'react';

export default function protectedRoute({ children }: { children: ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<Boolean | null>(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  });

  const refreshToken = async () => {
    const token = localStorage.getItem(REFRESH_TOKEN);
    if (!token) {
      return;
    }

    try {
      const response = await api.post('/api/token/refresh/', {
        refresh: token,
      });

      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(token);
    if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}
