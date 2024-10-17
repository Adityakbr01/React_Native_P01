import { StyleSheet } from "react-native";
import React from "react";
import { hp } from "@/helpers/common"; // Ensure this path is correct
import { theme } from "@/constants/theme"; // Ensure this path is correct
import { Image } from "expo-image";
import { getUserImageSrc } from "@/services/imageService";

// Define the props interface
interface AvatarProps {
  uri: string | undefined; // Allow uri to be a string or undefined
  size?: number; // Optional size prop
  rounded?: number; // Optional rounded prop
  style?: object; // Optional style prop
}

const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = hp(4.3),
  rounded = theme.radius.sm,
  style = {},
}) => {
  console.log(getUserImageSrc(uri));
  return (
    <Image
      source={getUserImageSrc(uri)} // Ensure getUserImageSrc can handle undefined
      transition={100}
      style={[
        styles.avatar,
        { height: size, width: size, borderRadius: size / 2 },
        style,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 1,
    borderColor: theme.colors.darklight,
    // Add any other styles you want for the avatar
  },
});
