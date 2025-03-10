import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch,
  Alert,
  NativeModules,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { AccessibilityServiceManager } = NativeModules;

const WorksScreen = () => {
  interface Workflow {
    id: string;
    name: string;
    isActive: boolean;
  }
  
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  useEffect(() => {
    const loadWorkflows = async () => {
      const storedWorkflows = await AsyncStorage.getItem("workflows");
      if (storedWorkflows) setWorkflows(JSON.parse(storedWorkflows));
    };
    loadWorkflows();
  }, []);

  const checkAccessibilityEnabled = async () => {
    const enabled = await AccessibilityServiceManager.isAccessibilityEnabled();
    return enabled;
  };

  const toggleWorkflow = async (id: string) => {
    const updatedWorkflows = workflows.map((workflow) =>
      workflow.id === id ? { ...workflow, isActive: !workflow.isActive } : workflow
    );

    setWorkflows(updatedWorkflows);
    await AsyncStorage.setItem("workflows", JSON.stringify(updatedWorkflows));

    const isEnabled = await checkAccessibilityEnabled();
    if (!isEnabled) {
      Alert.alert("Error", "Enable Accessibility Service first!");
      return;
    }

    const workflow = updatedWorkflows.find((w) => w.id === id);
    if (workflow?.isActive) {
      AccessibilityServiceManager.startService(id);
      Alert.alert("Activated", `${workflow.name} is now running.`);
    } else {
      AccessibilityServiceManager.stopService(id);
      Alert.alert("Deactivated", `${workflow?.name ?? 'Workflow'} is now off.`);
    }
  };

  const renderWorkflowItem = ({ item }: any) => (
    <View style={styles.workflowItem}>
      <Text style={styles.workflowTitle}>{item.name}</Text>
      <Switch onValueChange={() => toggleWorkflow(item.id)} value={item.isActive} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={workflows} renderItem={renderWorkflowItem} keyExtractor={(item) => item.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    padding: 16,
  },
  list: {
    flex: 1,
  },
  workflowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
  },
  workflowTitle: {
    fontSize: 16,
    color: "white",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#FF6B00",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
})

export default WorksScreen
