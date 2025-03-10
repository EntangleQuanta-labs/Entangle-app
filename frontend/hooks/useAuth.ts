// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@/utils/fireConfig';

interface AuthUser {
  id: string;
  email: string;
  // Add other user fields
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Check Firebase authentication state
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            // Retrieve user token
            const token = await firebaseUser.getIdToken();

            // Store token in AsyncStorage
            await AsyncStorage.setItem('user_token', token);

            // Optional: Fetch user details from your backend
            // You might want to implement this based on your backend structure
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || ''
            });
          } else {
            // Clear user and token on logout
            await AsyncStorage.removeItem('user_token');
            setUser(null);
          }
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Auth state check error:', error);
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Method to manually set user (useful for login scenarios)
  const setAuthUser = (userData: AuthUser | null) => {
    setUser(userData);
  };

  return { 
    user, 
    loading, 
    setUser: setAuthUser 
  };
};