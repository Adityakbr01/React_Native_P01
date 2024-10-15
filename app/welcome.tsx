import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Button from "@/components/Button";
import { useRouter } from "expo-router";

const welcome: React.FC = (): JSX.Element => {
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Welcome Image */}
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={require("../assets/images/welcome.png")}
        />
        {/* Tittle */}
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>LinkUp</Text>
          <Text style={styles.punchline}>
            Where ideas find their space and every picture speaks a tale
          </Text>
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Button
            title="Getting Started"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={() => router.push("/signUp")}
          />
          <View style={styles.buttomTextContainer}>
            <Text style={{ color: theme.colors.text }}>
              Already have an account?{" "}
              <Text
                style={{
                  color: theme.colors.primary,
                  fontWeight: theme.Fonts.bold as any,
                }}
                onPress={() => router.push("/login")}
              >
                Login
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "space-around",
    paddingHorizontal: wp(10),
    backgroundColor: "white",
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
    alignSelf: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: theme.Fonts.extrabold as any,
  },
  punchline: {
    textAlign: "center",
    padding: wp(10),
    fontSize: hp(1.8),
    color: theme.colors.text,
  },
  footer: {
    gap: 30,
    width: "100%",
  },
  buttomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
