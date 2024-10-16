import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import Avatar from "@/components/Avatar";

// Define the User type
type User = {
  name: string;
  image?: string;
  address?: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
};

const Profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();

  const LogOutHandler = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Sign Out Failed!");
    }
  };

  const handleLogOut = async () => {
    // Show confirmation dialog for logout
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            LogOutHandler();
            router.replace("/welcome");
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScreenWrapper bg="white">
      <UserHeader user={user} handleLogOut={handleLogOut} router={router} />
    </ScreenWrapper>
  );
};

type UserHeaderProps = {
  user: User | null;
  handleLogOut: () => void;
  router: ReturnType<typeof useRouter>;
};

const UserHeader: React.FC<UserHeaderProps> = ({
  user,
  router,
  handleLogOut,
}) => {
  console.log(user?.image);
  return (
    <View
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: wp(4) }}
    >
      <View>
        <Header title={"Profile"} showBackButton={true} mb={40} />
        <TouchableOpacity style={styles.logoutBTN} onPress={handleLogOut}>
          <Icon name="logout" color={"#EF4444"} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={user?.image}
              size={hp(18)}
              rounded={theme.radius.xxl}
            />
            <Pressable
              style={styles.editIcon}
              onPress={() => router.push("/editProfile" as any)}
            >
              <Icon name="edit" color={"#000"} size={20} />
            </Pressable>
          </View>
          {/* username and Address */}
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.infoText}>
              {user?.address || "Address Not Found"}
            </Text>
          </View>
          {/* email,phone,bio */}
          <View style={{ gap: 10 }}>
            <View style={styles.info}>
              <Icon name="mail" color={"#000"} size={20} />
              <Text style={styles.infoText}>{user?.email}</Text>
            </View>
            {user?.phoneNumber && (
              <View style={styles.info}>
                <Icon name="call" color={"#000"} size={20} />
                <Text style={styles.infoText}>{user?.phoneNumber}</Text>
              </View>
            )}
            {user?.bio && (
              <View style={styles.info}>
                <Icon name="mail" color={"#000"} size={20} />
                <Text style={styles.infoText}>{user?.bio}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    alignSelf: "center",
    alignItems: "center",
    height: wp(18),
    width: wp(18),
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: -80,
    right: -30,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
    shadowColor: theme.colors.textlight,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: theme.Fonts.semibold as any,
    color: "#000",
    marginTop: 80,
  },
  infoText: {
    fontSize: hp(1.5),
    color: theme.colors.textlight,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoutBTN: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "white",
  },
});
