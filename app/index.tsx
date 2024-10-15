import { View, Text, Button } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import Loading from "@/components/Loading";
import { theme } from "@/constants/theme";

const IndexPage = () => {
  const [isLoading, setIsLoading] = useState(true); // State to handle loading
  const router = useRouter();

  // Simulate loading or fetching data
  setTimeout(() => {
    setIsLoading(false);
  }, 3000); // Change this timeout duration as per your actual logic

  return (
    <ScreenWrapper bg="white">
      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Loading size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Index Page</Text>
          <Button title="Welcome" onPress={() => router.push("/welcome")} />
        </View>
      )}
    </ScreenWrapper>
  );
};

export default IndexPage;
