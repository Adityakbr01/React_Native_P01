import { StyleSheet, View } from "react-native";
import React, { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Define the props interface
interface ScreenWrapperProps {
  children: ReactNode;
  bg: string;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, bg }) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop }}>{children}</View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});

///////////////////////////////////////

//////////////////////////////////////

// import { StyleSheet, Text, View } from "react-native";
// import React from "react";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// const ScreenWrapper = ({ children, bg }) => {
//   const { top } = useSafeAreaInsets();
//   const paddingTop = top > 0 ? top + 5 : 30;
//   return <View style={{ flex: 1, backgroundColor: bg, paddingTop }}></View>;
// };

// export default ScreenWrapper;

// const styles = StyleSheet.create({});
