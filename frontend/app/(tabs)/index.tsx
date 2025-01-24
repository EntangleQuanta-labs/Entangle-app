import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Sidebar from "@/components/SideNav";
import SubscriptionPopup from "@/components/Subscriptions";

type RootStackParamList = {
  Chat: { id: string };
};

const dummyDb: { [key: string]: string[] } = {};

const HomeScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubscriptionPopupVisible, setIsSubscriptionPopupVisible] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(-300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? -300 : 0;
    Animated.spring(sidebarAnimation, {
      toValue,
      useNativeDriver: false,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSend = () => {
    if (message.trim()) {
      const id = Date.now().toString();
      dummyDb[id] = [message];
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        navigation.navigate("Chat", { id });
      });
      setMessage("");
    }
  };

  const handleSubmitEditing = () => {
    if (message.trim()) {
      handleSend();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.getPlus} onPress={() => setIsSubscriptionPopupVisible(true)}>
          <Text style={styles.getPlusText}>Get Plus</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>What can I help with?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="create-outline" size={24} color="#4CAF50" />
            <Text style={styles.buttonText}>Create image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="eye-outline" size={24} color="#2196F3" />
            <Text style={styles.buttonText}>Analyze images</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="document-text-outline" size={24} color="#FF9800" />
            <Text style={styles.buttonText}>Summarize text</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#9E9E9E" />
            <Text style={styles.buttonText}>More</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          placeholderTextColor="#666"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSubmitEditing}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <SubscriptionPopup isVisible={isSubscriptionPopupVisible} onClose={() => setIsSubscriptionPopupVisible(false)} />
      <Sidebar animation={sidebarAnimation} onClose={toggleSidebar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
  },
  getPlus: {
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  getPlusText: {
    color: "white",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#2C2C2E",
    padding: 16,
    borderRadius: 8,
    margin: 8,
    alignItems: "center",
    width: "40%",
  },
  buttonText: {
    color: "white",
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#2C2C2E",
  },
  input: {
    flex: 1,
    backgroundColor: "#3C3C3E",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "white",
  },
  sendButton: {
    padding: 8,
  },
});

export default HomeScreen;