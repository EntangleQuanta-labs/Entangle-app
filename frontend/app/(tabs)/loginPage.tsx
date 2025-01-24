import React, { useState } from "react";
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
} from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import * as Google from 'expo-auth-session/providers/google';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from "@/utils/fireConfig";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Firebase Email/Password Authentication
  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      // Try to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Home");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        // If user not found, create a new account
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          navigation.replace("Home");
        } catch (registerError: any) {
          Alert.alert("Error", registerError.message);
        }
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  // Google Sign-In
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "YOUR_GOOGLE_CLIENT_ID", // Replace with your Google Client ID
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          navigation.replace("Home");
        })
        .catch((error: any) => {
          Alert.alert("Error", error.message);
        });
    }
  }, [response]);

  const handleGoogleLogin = () => {
    promptAsync();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.logo}>Claude</Text>
          <Text style={styles.title}>Do your best work with Claude</Text>
          <Text style={styles.subtitle}>Enter your email address and password to get started</Text>
          <TextInput
            style={styles.input}
            placeholder="name@yourcompany.com"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.emailButton} onPress={handleEmailLogin}>
            <Text style={styles.buttonText}>Continue with Email</Text>
          </TouchableOpacity>
          <Text style={styles.orText}>OR</Text>
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            By continuing, you agree to Anthropic's{"\n"}
            <Text style={styles.link}>Consumer Terms</Text> and <Text style={styles.link}>Usage Policy</Text>, and{"\n"}
            acknowledge their <Text style={styles.link}>Privacy Policy</Text>.
          </Text>
          <Text style={styles.anthropicText}>ANTHROPIC</Text>
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
    justifyContent: "center",
    alignItems: "center",
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
  anthropicText: {
    color: "#CCCCCC",
    fontSize: 12,
    marginTop: 20,
  },
});

export default LoginScreen;