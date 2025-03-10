import type React from "react"
import { useState, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

interface SubscriptionCardProps {
  title: string
  price: string
  description: string
  features: string[]
  onSubscribe: () => void
  isActive: boolean
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  price,
  description,
  features,
  onSubscribe,
  isActive,
}) => (
  <Animated.View
    style={[
      styles.card,
      {
        opacity: isActive ? 1 : 0.5,
        transform: [{ scale: isActive ? 1 : 0.95 }],
      },
    ]}
  >
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
    <TouchableOpacity
      style={[styles.subscribeButton, !isActive && styles.subscribeButtonInactive]}
      onPress={onSubscribe}
    >
      <Text style={styles.subscribeButtonText}>Subscribe</Text>
    </TouchableOpacity>
  </Animated.View>
)

interface SubscriptionPopupProps {
  isVisible: boolean
  onClose: () => void
}

const SubscriptionPopup: React.FC<SubscriptionPopupProps> = ({ isVisible, onClose }) => {
  const [currentPanel, setCurrentPanel] = useState(0)
  const scrollX = useRef(new Animated.Value(0)).current
  const scrollViewRef = useRef<ScrollView>(null)

  if (!isVisible) return null

  const subscriptions = [
    {
      title: "Basic Tier",
      price: "$4.99/month",
      description: "Perfect for casual users or beginners",
      features: ["Access to basic AI models", "100 AI queries per month", "Standard response time", "Email support"],
    },
    {
      title: "Pro Tier",
      price: "$9.99/month",
      description: "For enthusiasts and semi-professional users",
      features: [
        "Access to advanced AI models",
        "500 AI queries per month",
        "Faster response time",
        "Priority email support",
        "Custom AI fine-tuning",
      ],
    },
    {
      title: "Premium Tier",
      price: "$19.99/month",
      description: "For professionals and power users",
      features: [
        "Access to all AI models, including cutting-edge ones",
        "Unlimited AI queries",
        "Fastest response time",
        "24/7 priority support",
        "Advanced AI fine-tuning and customization",
        "API access for integration",
        "Dedicated account manager",
      ],
    },
  ]

  const scrollToPanel = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    })
    setCurrentPanel(index)
  }

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })

  const handleMomentumScrollEnd = (event: any) => {
    const position = event.nativeEvent.contentOffset.x
    const index = Math.round(position / width)
    setCurrentPanel(index)
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#FF6B00" />
        </TouchableOpacity>

        <Text style={styles.title}>Choose Your Plan</Text>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          decelerationRate="fast"
          snapToInterval={width}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        >
          {subscriptions.map((subscription, index) => (
            <View key={index} style={styles.cardWrapper}>
              <View style={styles.cardContainer}>
                <SubscriptionCard
                  {...subscription}
                  isActive={index === currentPanel}
                  onSubscribe={() => console.log(`${subscription.title} Subscribed`)}
                />
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.navButton, currentPanel === 0 && styles.navButtonDisabled]}
            onPress={() => scrollToPanel(currentPanel - 1)}
            disabled={currentPanel === 0}
          >
            <Ionicons name="chevron-back" size={24} color={currentPanel === 0 ? "#666" : "#FF6B00"} />
          </TouchableOpacity>

          <View style={styles.dots}>
            {subscriptions.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => scrollToPanel(index)}
                style={[styles.dot, currentPanel === index && styles.dotActive]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.navButton, currentPanel === subscriptions.length - 1 && styles.navButtonDisabled]}
            onPress={() => scrollToPanel(currentPanel + 1)}
            disabled={currentPanel === subscriptions.length - 1}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={currentPanel === subscriptions.length - 1 ? "#666" : "#FF6B00"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

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
    maxHeight: "90%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  cardWrapper: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: width - 40,
    alignItems: 'center',
  },
  card: {
    backgroundColor: "#2C2C2E",
    width: '100%',
    borderRadius: 10,
    padding: 20,
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
  subscribeButtonInactive: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF6B00",
  },
  subscribeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1001,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#666",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#FF6B00",
  },
  navButton: {
    padding: 10,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
})

export default SubscriptionPopup