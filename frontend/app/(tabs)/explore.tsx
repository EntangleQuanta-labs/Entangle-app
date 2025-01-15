import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import axios from 'axios';
import colors from '@/constants/Colors';
import { WorkflowScreenProps } from '@/utils/types';

const WorkflowScreen: React.FC<WorkflowScreenProps> = ({ route }) => {
  const [workflowStatus, setWorkflowStatus] = useState<string>('Loading...');
  const { workflowId } = route.params;
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchWorkflowStatus = async () => {
      try {
        const response = await axios.get(`http://your-backend-url/status?workflowId=${workflowId}`);
        setWorkflowStatus(response.data.status);
        fadeIn();
      } catch (error) {
        setWorkflowStatus('Failed to fetch workflow status.');
      }
    };

    fetchWorkflowStatus();
  }, [workflowId]);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workflow Status</Text>
      {workflowStatus === 'Loading...' ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.status}>{workflowStatus}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: colors.text,
    textAlign: 'center',
  },
  status: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default WorkflowScreen;