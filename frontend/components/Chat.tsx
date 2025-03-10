import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

type RouteParams = {
  id: string;
  initialMessage: string;
};

const ChatScreen = () => {
  const route = useRoute();
  const { id, initialMessage } = route.params as RouteParams;
  const [messages, setMessages] = useState<
    Array<{
      id: number;
      text: string;
      sender: string;
      timestamp: Date;
    }>
  >([]);
  const [inputText, setInputText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (initialMessage) {
      setMessages([
        {
          id: Date.now(),
          text: initialMessage,
          sender: "user",
          timestamp: new Date(),
        },
      ]);
    }
  }, [initialMessage]);

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: inputText,
          sender: "user",
          timestamp: new Date(),
        },
      ]);
      setInputText("");
    }
  };

  const handleDeleteMessage = (id: number) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
    setIsModalVisible(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Entangle 1.0</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate("index" as never)}>
            <AntDesign name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.contentContainer}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === "user"
                ? styles.userMessage
                : styles.botMessage,
            ]}
          >
            <View style={styles.messageContent}>
              <Text style={styles.messageText}>{message.text}</Text>
              <Text style={styles.timestamp}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Message"
          placeholderTextColor="#999999"
          multiline
        />
        {inputText.trim() && (
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <AntDesign name="arrowup" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalOptionText}>Delete Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#1C1C1E",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  messageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#333333",
    marginBottom: 16,
    borderRadius: 16,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#2C2C2E",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#333333",
  },
  messageContent: {
    padding: 12,
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
  },
  timestamp: {
    color: "#999999",
    fontSize: 12,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 100,
    backgroundColor: "#333333",
    borderRadius: 20,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    marginRight: 8,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: "#1C1C1E",
    borderRadius: 50,
    padding: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  modalOptionText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
  },
});

export default ChatScreen;
