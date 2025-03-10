import React, { useState, useCallback, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Markdown from "react-native-markdown-display";
import { BACKEND_URL } from "@/config";

interface Message {
  id: string;
  content: string;
  type: "text" | "file" | "system";
  role: "user" | "assistant" | "system";
  name?: string;
}

const GroqAccessibilityChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-system",
      content:
        "I'm ready to help you create Android Accessibility Service workflows. What task would you like to automate?",
      type: "system",
      role: "system",
    },
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<Message | null>(null);
  const flatListRef = useRef<FlatList>(null);

  /**
   * Parse the LLM response.
   *
   * First, it expects a JSON string containing a "response" property.
   * Then it extracts one or more <entangle ... /> tags from the "response" value.
   *
   * Each tag is parsed to extract attributes such as type, content, and name.
   * If no valid tag is found, the entire response is treated as plain text.
   */
  const parseEntangleResponse = (responseContent: string): Message[] => {
    const messagesArr: Message[] = [];
    // Use [\s\S] to match any character including newline
    const regex = /<entangle\s+([\s\S]*?)\/>/g;
    let match;
    while ((match = regex.exec(responseContent)) !== null) {
      const attributesStr = match[1];
      const attrRegex = /(\w+)="([^"]*?)"/g;
      let attrMatch;
      const attributes: { [key: string]: string } = {};
      while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
        attributes[attrMatch[1]] = attrMatch[2];
      }
      // Default type to text if missing
      const type = attributes["type"] || "text";
      const content = attributes["content"] || "";
      if (type === "file") {
        const name = attributes["name"] || "file.txt";
        messagesArr.push({
          id: Date.now().toString() + Math.random().toString(),
          type: "file",
          content,
          role: "assistant",
          name,
        });
      } else {
        messagesArr.push({
          id: Date.now().toString() + Math.random().toString(),
          type: "text",
          content,
          role: "assistant",
        });
      }
    }
    // If no <entangle .../> tags were found, fallback to treating the whole response as text.
    if (messagesArr.length === 0) {
      messagesArr.push({
        id: Date.now().toString(),
        type: "text",
        content: responseContent,
        role: "assistant",
      });
    }
    return messagesArr;
  };

  const saveFile = async (fileName: string, fileContent: string) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, fileContent);
      return fileUri;
    } catch (error) {
      console.error("Error saving file:", error);
      return null;
    }
  };

  const shareFile = async (fileName: string, fileContent: string) => {
    try {
      const fileUri = await saveFile(fileName, fileContent);
      if (fileUri) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  const sendMessage = useCallback(async (): Promise<void> => {
    Keyboard.dismiss();
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      type: "text",
      role: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Add a temporary assistant placeholder message
    const assistantPlaceholderId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantPlaceholderId,
        content: "Generating accessibility workflow...",
        type: "text",
        role: "assistant",
      },
    ]);

    try {
      const response = await fetch(`${BACKEND_URL}/api/groq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: inputText }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const responseText = await response.text();
      // First, parse the JSON response to extract the inner content.
      const jsonResponse = JSON.parse(responseText);
      const entangleContent = jsonResponse.response || "";

      // Parse the response content into one or more messages
      const parsedMessages = parseEntangleResponse(entangleContent);

      // Remove the placeholder and append the parsed messages
      setMessages((prev) => {
        const newMessages = prev.filter(
          (msg) => msg.id !== assistantPlaceholderId
        );
        return [...newMessages, ...parsedMessages];
      });
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantPlaceholderId
            ? {
                id: assistantPlaceholderId,
                content: "Sorry, error generating accessibility workflow.",
                type: "text",
                role: "assistant",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [inputText]);

  const renderMessage = useCallback(({ item }: { item: Message }) => {
    if (item.type === "text" || item.type === "system") {
      return (
        <View
          style={[
            styles.messageBubble,
            item.role === "user"
              ? styles.userMessage
              : item.role === "system"
              ? styles.systemMessage
              : styles.assistantMessage,
          ]}
        >
          <Markdown
            style={{
              body: {
                ...styles.messageText,
                ...(item.role === "user"
                  ? styles.userMessageText
                  : item.role === "system"
                  ? styles.systemMessageText
                  : styles.assistantMessageText),
              },
              code_inline: styles.codeInline,
              code_block: styles.codeBlock,
              list_item: styles.listItem,
              paragraph: styles.paragraph,
            }}
          >
            {item.content}
          </Markdown>
        </View>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => setSelectedFile(item)}
        style={styles.fileContainer}
      >
        <View style={styles.fileCard}>
          <View style={styles.fileIconContainer}>
            <MaterialIcons name="insert-drive-file" size={24} color="#3b82f6" />
          </View>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>{item.name}</Text>
            <Text style={styles.fileType}>
              {item.name?.split(".").pop()?.toUpperCase() || "FILE"}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Describe your Android Accessibility workflow..."
            multiline
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: inputText.trim() && !isLoading ? 1 : 0.5 },
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <MaterialIcons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {selectedFile && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={!!selectedFile}
            onRequestClose={() => setSelectedFile(null)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedFile.name}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      selectedFile?.name &&
                      selectedFile?.content &&
                      shareFile(selectedFile.name, selectedFile.content)
                    }
                  >
                    <MaterialIcons name="share" size={24} color="#3b82f6" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSelectedFile(null)}>
                    <MaterialIcons name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalScrollView}>
                  <Text style={styles.fileContentText}>
                    {selectedFile.content}
                  </Text>
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  assistantMessage: {
    backgroundColor: "#e0f7fa",
    alignSelf: "flex-start",
  },
  userMessage: {
    backgroundColor: "#d1e7dd",
    alignSelf: "flex-end",
  },
  sendButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  userMessageText: {
    color: "#000",
  },
  assistantMessageText: {
    color: "#000",
  },
  systemMessage: {
    backgroundColor: "#f0f0f0",
    alignSelf: "center",
  },
  fileBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    padding: 8,
  },
  fileText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  fileContentText: {
    fontFamily: "monospace",
    fontSize: 14,
  },
  codeInline: {
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    padding: 4,
    fontFamily: "monospace",
  },
  messageList: {
    padding: 10,
  },
  systemMessageText: {
    color: "#6b7280",
    fontStyle: "italic",
  },
  codeBlock: {
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    padding: 10,
    fontFamily: "monospace",
  },
  fileContainer: {
    marginVertical: 5,
    paddingHorizontal: 10,
    width: "100%",
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e6f0ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  fileType: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  paragraph: {
    marginVertical: 4,
  },
  listItem: {
    marginVertical: 2,
  },
});

export default GroqAccessibilityChat;
