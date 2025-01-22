import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

// Dummy database simulation
const dummyDb: { [key: string]: { id: number; text: string; sender: string }[] } = {};

const ChatScreen = () => {
  const [messages, setMessages] = useState<{ id: number; text: string; sender: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };

  // Load chat history from the dummy database when the screen mounts
  useEffect(() => {
    if (dummyDb[id]) {
      setMessages(dummyDb[id]);
    }
  }, [id]);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = { id: Date.now(), text: inputText, sender: "user" };
      const updatedMessages = [...messages, newMessage];

      // Save the message to the dummy database
      dummyDb[id] = updatedMessages;
      setMessages(updatedMessages);
      setInputText("");

      // Simulate AI response
      setTimeout(() => {
        const aiMessage = { id: Date.now(), text: "This is a simulated AI response.", sender: "ai" };
        const updatedMessagesWithAI = [...updatedMessages, aiMessage];

        // Save the AI response to the dummy database
        dummyDb[id] = updatedMessagesWithAI;
        setMessages(updatedMessagesWithAI);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat {id}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.messageBubble, message.sender === "user" ? styles.userMessage : styles.aiMessage]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          onSubmitEditing={handleSend} // Send message on "Enter" key press
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
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
    backgroundColor: "#2C2C2E",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0A84FF",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#2C2C2E",
  },
  messageText: {
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#2C2C2E",
  },
  input: {
    flex: 1,
    backgroundColor: "#3C3C3E",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "white",
  },
  sendButton: {
    padding: 8,
  },
});

export default ChatScreen;