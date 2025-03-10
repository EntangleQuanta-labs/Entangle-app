import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const dummyChats = [
  { id: "1", title: "Chat about AI", date: "2023-05-01" },
  { id: "2", title: "Travel plans", date: "2023-04-28" },
  { id: "3", title: "Book recommendations", date: "2023-04-25" },
  { id: "4", title: "Coding help", date: "2023-04-22" },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const insets = useSafeAreaInsets();
  const animation = React.useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Trigger gesture detection only if the user swipes left
        if (gestureState.dx < -10) {
          console.log("Swipe detected: dx =", gestureState.dx);
          return true;
        }
        return false;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          // Allow dragging the sidebar left during swipe
          const newValue = Math.max(-300, gestureState.dx);
          console.log("Dragging: translateX =", newValue);
          animation.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        console.log("Release gesture: dx =", gestureState.dx);
        if (gestureState.dx < -150) {
          // Close the sidebar if swiped more than halfway
          console.log("Closing sidebar");
          onClose();
        } else {
          Animated.timing(animation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.sidebar,
        {
          transform: [{ translateX: animation }],
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
        },
      ]}
      {...panResponder.panHandlers} // Attach gesture handling
    >
      <TouchableOpacity
        style={[styles.closeButton, { top: insets.top + 16 }]}
        onPress={onClose}
      >
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Chat History</Text>
        {dummyChats.map((chat) => (
          <TouchableOpacity key={chat.id} style={styles.chatItem}>
            <Ionicons name="chatbubble-outline" size={24} color="white" />
            <View style={styles.chatInfo}>
              <Text style={styles.chatTitle}>{chat.title}</Text>
              <Text style={styles.chatDate}>{chat.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 4,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 16,
    zIndex: 1000,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 24,
    marginTop: 8,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3C3C3E",
  },
  chatInfo: {
    marginLeft: 16,
    flex: 1,
  },
  chatTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  chatDate: {
    color: "#999",
    fontSize: 12,
  },
});

export default Sidebar;
