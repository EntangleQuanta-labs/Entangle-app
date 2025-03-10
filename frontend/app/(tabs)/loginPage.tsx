import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/utils/authService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  // Google OAuth configuration
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.GOOGLE_CLIENT_ID,
  });

  // Handle email login
  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const loginResponse = await authService.loginWithEmail(email, password);
      
      // Update user state
      setUser({
        id: loginResponse.user.id,
        email: loginResponse.user.email
      });

      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Login Error', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign-in
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    setLoading(true);
    try {
      const loginResponse = await authService.loginWithGoogle(idToken);
      
      // Update user state
      setUser({
        id: loginResponse.user.id,
        email: loginResponse.user.email
      });

      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Google Login Error', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image 
            source={require('../assets/images/logo.png')} 
            style={styles.logo} 
          />
          <Text style={styles.title}>Welcome to Your App</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleEmailLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={loading}
          >
            <Image 
              source={require('../assets/google-icon.png')} 
              style={styles.googleIcon} 
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#2C2C2E",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 20
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#3C3C3E",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  emailButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF6B00",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    color: "#CCCCCC",
    fontSize: 16,
    marginVertical: 15,
  },
  googleButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10, 
  },
  googleIcon: {
    width: 30, 
    height: 30, 
    marginRight: 10, 
  },
  entangleIcon: {
    width: 60, 
    height: 60, 
    marginRight: 10, 
    borderRadius : 20
  },
  googleButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  termsText: {
    color: "#CCCCCC",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
  },
  link: {
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
  entangleText: {
    color: "#CCCCCC",
    fontSize: 12,
    marginTop: 20,
  },

});

export default LoginScreen;
