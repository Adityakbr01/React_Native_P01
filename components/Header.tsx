import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Backbutton from "./Backbutton";
import { hp } from "@/helpers/common";
import { theme } from "@/constants/theme";

// Correctly define the HeaderProps interface
interface HeaderProps {
  title?: string; // Title is optional
  showBackButton?: boolean; // Show back button is optional
  mb?: number; // Margin bottom is optional
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  mb = 10,
}) => {
  const router = useRouter();

  return (
    <View style={[styles.container, { marginBottom: mb }]}>
      {showBackButton && (
        <View style={styles.BackButton}>
          <Backbutton router={router} />
        </View>
      )}
      <Text style={styles.title}>{title || ""}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    gap: 10,
  },
  BackButton: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  title: {
    fontSize: hp(2.7),
    fontWeight: theme.Fonts.semibold as any,
    color: theme.colors.textdark,
  },
});
