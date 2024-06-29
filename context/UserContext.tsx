'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface UserContextProps {
  userData: any;
  loading: boolean;
  fetchUserData: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const session = await axios.get('/api/auth/session');
      if (session && session.data.user) {
        const res = await axios.get(`/api/user/${session.data.user.id}`);
        setUserData(res.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, loading, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
/*'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface UserContextProps {
  userData: any;
  loading: boolean;
  fetchUserData: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const session = await axios.get('/api/auth/session');
      if (session && session.data.user) {
        const res = await axios.get(`/api/user/${session.data.user.id}`);
        setUserData(res.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, loading, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};*/
