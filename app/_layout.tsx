import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // console.log("session User Id", session?.user.id);

        if (session?.user) {
          setAuth(session.user);
          updateUserData(session?.user, session?.user?.email!);
          router.replace("/home");
        } else {
          //set auth null
          setAuth(null);
          //navigate to login
          router.replace("/welcome");
        }
      }
    );
  }, []);

  const updateUserData = async (user: { id: string }, email: string) => {
    let res = await getUserData(user?.id);
    if (res.successs) setUserData({ ...res.data, email: email });
    // console.log(res);
  };

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default _layout;

const styles = StyleSheet.create({});
