import { StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Icon from "../assets/icons";
import { StatusBar } from "expo-status-bar";
import Backbutton from "../components/Backbutton";
import { useRouter } from "expo-router";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Inpute from "../components/Inpute";
import Button from "../components/Button";
import { supabase } from "../lib/supabase";

const SignUp: React.FC = () => {
  const router = useRouter();
  const emailRef = useRef<string | null>(null);
  const nameRef = useRef<string | null>(null);
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      alert("Please fill all fields");
      return;
    }
    // all fields are filled
    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();
    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // send request to server
    setLoading(false);
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Backbutton size={30} margin={0} router={router} />
        {/* welcome */}
        <View>
          <Text style={styles.welcomeText}>Let's </Text>
          <Text style={styles.welcomeText}>Get Started</Text>
        </View>
        {/* Form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please fill the details to create an account 👋
          </Text>
          <Inpute
            icon={
              <Icon name="user" size={26} color={"black"} strokeWidth={1.6} />
            }
            placeholder="Enter Your Name"
            onChangeText={(value: string) => (nameRef.current = value)}
          />
          <Inpute
            icon={
              <Icon name="mail" size={26} color={"black"} strokeWidth={1.6} />
            }
            placeholder="Enter Your Email"
            onChangeText={(value: string) => (emailRef.current = value)}
          />
          <Inpute
            icon={
              <Icon name="lock" size={26} color={"black"} strokeWidth={1.6} />
            }
            placeholder="Enter Your Password"
            secureTextEntry
            onChangeText={(value: string) => (passwordRef.current = value)}
          />
          {/* <Text style={styles.forgotpassword}>Forgot Password?</Text> */}
          {/* Button */}
          <Button title="SignUp" loading={loading} onPress={onSubmitHandler} />
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ color: theme.colors.text }}>
            Allready have an account?{}
          </Text>
          <Text
            style={{
              color: theme.colors.primary,
              fontWeight: "700",
            }}
            onPress={() => router.push("/login")}
          >
            Login
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.Fonts.bold as any,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  forgotpassword: {
    textAlign: "right",
    fontWeight: theme.Fonts.semibold as any,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
});
