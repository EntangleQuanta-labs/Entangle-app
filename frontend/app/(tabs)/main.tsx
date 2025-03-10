import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  Platform,
  Linking,
  PanResponder,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Sidebar from "@/components/SideNav";
import SubscriptionPopup from "@/components/Subscriptions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubscriptionPopupVisible, setIsSubscriptionPopupVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation<NavigationProp<any>>();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (!isSubscriptionPopupVisible) { // Only allow swipe if subscription popup is not visible
          if (gestureState.dx > 50 && !isSidebarOpen) {
            setIsSidebarOpen(true);
          }
          if (gestureState.dx < -50 && isSidebarOpen) {
            setIsSidebarOpen(false);
          }
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isSubscriptionPopupVisible) {
      setIsSidebarOpen(false); // Close sidebar if subscription popup is visible
    }
  }, [isSubscriptionPopupVisible]);

  useEffect(() => {
    const checkUserDeniedAccessibility = async () => {
      const userDenied = await AsyncStorage.getItem("userDeniedAccessibility");
      if (userDenied !== "true") {
        setShowModal(true);
      }
    };
    checkUserDeniedAccessibility();
  }, []);

  // const requestAccessibilityPermission = () => {
  //   if (Platform.OS === "android") {
  //     Linking.sendIntent("android.settings.ACCESSIBILITY_SETTINGS");
  //   } else if (Platform.OS === "ios") {
  //     Linking.openURL("app-settings:");
  //   }
  //   setShowModal(false);
  // };

  const handleDenyAccessibility = async () => {
    await AsyncStorage.setItem("userDeniedAccessibility", "true");
    setShowModal(false);
  };

  const handleSend = () => {
    if (message.trim()) {
      const id = Date.now().toString();
      navigation.navigate("Chat", { id, initialMessage: message });
      setMessage("");
    }
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          onPress={() => {
            if (!isSubscriptionPopupVisible) { // Only open sidebar if subscription popup is not visible
              setIsSidebarOpen(true);
            }
          }}
        >
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.getPlus}
          onPress={() => setIsSubscriptionPopupVisible(true)}
        >
          <Text style={styles.getPlusText}>Get Plus</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What can I help with?</Text>
      </View>

      {/* <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enable Accessibility</Text>
            <Text style={styles.modalText}>
              To use all features of this app, please enable accessibility
              settings.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonAllow}
                onPress={requestAccessibilityPermission}
              >
                <Text style={styles.modalButtonText}>Allow</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonDeny}
                onPress={handleDenyAccessibility}
              >
                <Text style={styles.modalButtonText}>Deny</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          placeholderTextColor="#666"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <AntDesign name="arrowup" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <SubscriptionPopup
        isVisible={isSubscriptionPopupVisible}
        onClose={() => setIsSubscriptionPopupVisible(false)}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
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
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 100,
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    color: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sendButton: {
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 8,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  modalButtonAllow: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonDeny: {
    flex: 1,
    backgroundColor: "#F44336",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default HomeScreen;
