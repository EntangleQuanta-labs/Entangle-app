import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

interface SubscriptionCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  onSubscribe: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ title, price, description, features, onSubscribe }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.price}>{price}</Text>
    <Text style={styles.description}>{description}</Text>
    <View style={styles.featureList}>
      {features.map((feature, index) => (
        <Text key={index} style={styles.feature}>
          • {feature}
        </Text>
      ))}
    </View>
    <TouchableOpacity style={styles.subscribeButton} onPress={onSubscribe}>
      <Text style={styles.subscribeButtonText}>Subscribe</Text>
    </TouchableOpacity>
  </View>
);

interface SubscriptionPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const SubscriptionPopup: React.FC<SubscriptionPopupProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <ScrollView>
          <Text style={styles.title}>Choose Your Plan</Text>

          <SubscriptionCard
            title="Basic Tier"
            price="$4.99/month"
            description="Perfect for casual users or beginners"
            features={[
              "Access to basic AI models",
              "100 AI queries per month",
              "Standard response time",
              "Email support",
            ]}
            onSubscribe={() => console.log("Basic Tier Subscribed")}
          />

          <SubscriptionCard
            title="Pro Tier"
            price="$9.99/month"
            description="For enthusiasts and semi-professional users"
            features={[
              "Access to advanced AI models",
              "500 AI queries per month",
              "Faster response time",
              "Priority email support",
              "Custom AI fine-tuning",
            ]}
            onSubscribe={() => console.log("Pro Tier Subscribed")}
          />

          <SubscriptionCard
            title="Premium Tier"
            price="$19.99/month"
            description="For professionals and power users"
            features={[
              "Access to all AI models, including cutting-edge ones",
              "Unlimited AI queries",
              "Fastest response time",
              "24/7 priority support",
              "Advanced AI fine-tuning and customization",
              "API access for integration",
              "Dedicated account manager",
            ]}
            onSubscribe={() => console.log("Premium Tier Subscribed")}
          />
        </ScrollView>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#2C2C2E",
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    color: "#FF6B00",
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    color: "#CCCCCC",
    marginBottom: 10,
  },
  featureList: {
    marginTop: 10,
  },
  feature: {
    color: "white",
    marginBottom: 5,
  },
  subscribeButton: {
    backgroundColor: "#FF6B00",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
  },
  subscribeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FF6B00",
    fontSize: 16,
  },
});

export default SubscriptionPopup;