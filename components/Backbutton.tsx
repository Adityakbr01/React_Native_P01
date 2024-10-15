import { Pressable, StyleSheet } from "react-native";
import React from "react";
import Icon from "../assets/icons";
import { theme } from "@/constants/theme";

// Define the router interface
interface Router {
  back: () => void;
  // Add other methods if needed
}

// Define the props type for Backbutton
interface BackButtonProps {
  size?: number; // Optional size prop
  router: Router; // Specify the router type
  margin?: number;
}

const Backbutton: React.FC<BackButtonProps> = ({
  size = 20,
  router,
  margin,
}) => {
  return (
    <Pressable
      style={[styles.button, { marginLeft: margin }]}
      onPress={() => router.back()}
    >
      <Icon name="arrowLeft" strokeWidth={2.5} size={size} color={"#000000"} />
    </Pressable>
  );
};

export default Backbutton;

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 100,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
