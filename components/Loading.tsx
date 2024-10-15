import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";

// Define props types
interface LoadingProps {
  size?: "small" | "large" | number; // Allow string sizes and numeric values
  color?: string; // Use string for color
}

const Loading: React.FC<LoadingProps> = ({
  size = "large",
  color = theme.colors.primary,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1, // Ensures it takes full space if needed
  },
});
