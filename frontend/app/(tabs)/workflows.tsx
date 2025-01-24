import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Switch } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

// Dummy data for workflows
const dummyWorkflows = [
  { id: "1", title: "Daily Task Summarizer", isActive: true },
  { id: "2", title: "Email Classifier", isActive: false },
  { id: "3", title: "Meeting Notes Generator", isActive: true },
  { id: "4", title: "Code Reviewer", isActive: false },
  { id: "5", title: "Social Media Post Scheduler", isActive: true },
]

const WorksScreen = () => {
  const [workflows, setWorkflows] = useState(dummyWorkflows)
  const navigation = useNavigation()

  const toggleWorkflow = (id) => {
    setWorkflows(
      workflows.map((workflow) => (workflow.id === id ? { ...workflow, isActive: !workflow.isActive } : workflow)),
    )
  }

  const renderWorkflowItem = ({ item }:any) => (
    <View style={styles.workflowItem}>
      <Text style={styles.workflowTitle}>{item.title}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={item.isActive ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => toggleWorkflow(item.id)}
        value={item.isActive}
      />
    </View>
  )

  const handleAddWorkflow = () => {
    navigation.navigate("index", { activateSearch: true })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workflows</Text>
      <FlatList data={workflows} renderItem={renderWorkflowItem} keyExtractor={(item) => item.id} style={styles.list} />
      <TouchableOpacity style={styles.addButton} onPress={handleAddWorkflow}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  )
}

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

