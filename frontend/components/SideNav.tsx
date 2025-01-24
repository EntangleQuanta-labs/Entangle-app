import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SidebarProps {
  animation: Animated.Value;
  onClose: () => void; // Add this prop to handle closing the sidebar
}

const dummyChats = [
  { id: "1", title: "Chat about AI", date: "2023-05-01" },
  { id: "2", title: "Travel plans", date: "2023-04-28" },
  { id: "3", title: "Book recommendations", date: "2023-04-25" },
  { id: "4", title: "Coding help", date: "2023-04-22" },
];

const Sidebar: React.FC<SidebarProps> = ({ animation, onClose }) => {
  return (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: animation }] }]}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>
      <ScrollView>
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
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: "#2C2C2E",
    padding: 16,
    paddingTop: 50,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3C3C3E",
  },
  chatInfo: {
    marginLeft: 12,
  },
  chatTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  chatDate: {
    color: "#999",
    fontSize: 12,
  },
});

export default Sidebar;