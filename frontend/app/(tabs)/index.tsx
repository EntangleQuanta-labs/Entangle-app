import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import colors from '@/constants/Colors'; // Use the provided colors object
import { HomeScreenProps } from '@/utils/types';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [workflowCommand, setWorkflowCommand] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async () => {
    if (!workflowCommand.trim()) {
      Alert.alert('Error', 'Please enter a workflow command.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/create`, {
        request: workflowCommand,
      });
      setMessage(response.data.message);
      // navigation.navigate('Workflow', { workflowId: response.data.workflowId });
    } catch (error) {
      Alert.alert('Error', 'Failed to create workflow. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Enter Workflow Command</Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Type a command to start a new workflow
          </Text>
          <Text style={{ color: colors.text }}>{message}</Text>
        </View>

        {/* Chat Input Container */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.white, borderTopColor: colors.primary },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.white,
                color: colors.text,
                borderColor: colors.primary,
              },
            ]}
            placeholder="e.g., Block Instagram Reels"
            placeholderTextColor={colors.placeholder}
            value={workflowCommand}
            onChangeText={setWorkflowCommand}
            autoCapitalize="none"
            autoCorrect={false}
          />
           <TouchableOpacity style={styles.voiceButton}>
            <Ionicons name="mic-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Ionicons name="send" size={24} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    fontSize: 16,
  },
  voiceButton: {
    padding: 12,
    justifyContent: 'center',
  },
  sendButton: {
    borderRadius: 24,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;