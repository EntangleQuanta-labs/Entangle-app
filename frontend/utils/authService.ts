// src/services/authService.ts
import axios from 'axios';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import auth from './fireConfig';

// Base URL for your FastAPI backend
const API_BASE_URL = process.env.API_BASE_URL;

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    // Add other user fields
  };
}

export const authService = {
  // Email Authentication
  async loginWithEmail(email: string, password: string): Promise<LoginResponse> {
    try {
      // Check existing authentication methods
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      
      let userCredential;
      if (signInMethods.length > 0) {
        // Existing user - sign in
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // New user - create account
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();

      // Send token to backend for verification and user management
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, {
        token: idToken,
        email: email
      });

      return response.data;
    } catch (error: any) {
      console.error('Email Login Error:', error);
      throw error;
    }
  },

  // Google Authentication
  async loginWithGoogle(idToken: string): Promise<LoginResponse> {
    try {
      // Create Google credential
      const credential = GoogleAuthProvider.credential(idToken);
      
      // Sign in with Firebase
      const userCredential = await signInWithCredential(auth, credential);

      // Get Firebase ID token
      const token = await userCredential.user.getIdToken();

      // Send token to backend
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/google`, {
        token: token
      });

      return response.data;
    } catch (error: any) {
      console.error('Google Login Error:', error);
      throw error;
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      // Sign out from Firebase
      await auth.signOut();

      // Call backend logout endpoint
      await axios.post(`${API_BASE_URL}/auth/logout`);
    } catch (error: any) {
      console.error('Logout Error:', error);
      throw error;
    }
  }
};