import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Header from "@/components/Header";
import { Image } from "expo-image";
import { useAuth } from "@/contexts/AuthContext";
import { getUserImageSrc, uploadFile } from "@/services/imageService";
import Icon from "../../assets/icons";
import Inpute from "@/components/Inpute";
import Button from "@/components/Button";
import { updateUserData } from "@/services/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

type UserData = {
  name: string;
  phoneNumber: string;
  image: any;
  bio: string;
  address: string;
};

//Hey Brother

const EditProfile = () => {
  const { user: currentUser, setUserData: currentUserDataSet } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Initialize user data with default values or empty strings
  const [userData, setUserData] = useState<UserData>({
    name: currentUser?.name || "",
    phoneNumber: currentUser?.phoneNumber || "",
    image: currentUser?.image || null,
    bio: currentUser?.bio || "",
    address: currentUser?.address || "",
  });

  useEffect(() => {
    if (currentUser) {
      setUserData({
        name: currentUser.name || "",
        phoneNumber: currentUser.phoneNumber || "",
        image: currentUser.image || null,
        bio: currentUser.bio || "",
        address: currentUser.address || "",
      });
    }
  }, [currentUser]);

  // Image picker function
  const onPickupImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserData({ ...userData, image: result.assets[0] });
    }
  };

  let imageSource =
    userData.image && typeof userData.image === "object"
      ? { uri: userData.image.uri }
      : getUserImageSrc(userData.image!);

  const onSubmit = async () => {
    let UserData = { ...userData };
    let { name, phoneNumber, address, bio, image } = UserData;
    if (!name || !phoneNumber || !bio || !address || !image) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    if (typeof image === "object") {
      // Upload Image
      let imageRes = await uploadFile("profile", image?.uri, true);

      if (imageRes.success) {
        UserData.image = imageRes.data;
      } else {
        UserData.image = null;
      }
    }

    // Update user data in Supabase
    const res = await updateUserData(currentUser?.id, UserData);
    setLoading(false);

    if (res.successs) {
      currentUserDataSet({ ...currentUser, ...UserData });
      router.back();
    } else {
      alert("Failed to update profile");
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit Profile" />
          <View>
            <View style={styles.avatarContainer}>
              {/* Image component with updated image source */}
              <Image source={imageSource} style={styles.avatar} />
              <Pressable style={styles.cameraIcons} onPress={onPickupImage}>
                <Icon name="camera" size={20} color={"#000"} />
              </Pressable>
            </View>
          </View>
          <Text style={styles.instructionText}>
            Please fill your profile information
          </Text>
          <View style={{ gap: 10 }}>
            <Inpute
              icon={<Icon name="user" color={"#000"} />}
              placeholder="Name"
              value={userData.name || ""} // Ensure default empty string value
              onChangeText={(text: string) =>
                setUserData({ ...userData, name: text })
              }
            />
            <Inpute
              icon={<Icon name="call" color={"#000"} />}
              placeholder="Phone Number"
              value={userData.phoneNumber || ""} // Ensure default empty string value
              onChangeText={(text: string) =>
                setUserData({ ...userData, phoneNumber: text })
              }
            />
            <Inpute
              icon={<Icon name="location" color={"#000"} />}
              placeholder="Address"
              value={userData.address || ""} // Ensure default empty string value
              onChangeText={(text: string) =>
                setUserData({ ...userData, address: text })
              }
            />
            <Inpute
              multiline={true}
              containerStyle={styles.bioInput}
              placeholder="Bio"
              value={userData.bio || ""} // Ensure default empty string value
              onChangeText={(text: string) =>
                setUserData({ ...userData, bio: text })
              }
            />
            <Button title="Update" loading={loading} onPress={onSubmit} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  avatarContainer: {
    alignSelf: "center",
    alignItems: "center",
    height: wp(34),
    width: wp(34),
    position: "relative",
    backgroundColor: "blue",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: wp(18),
    borderWidth: 1,
    borderColor: theme.colors.darklight,
    backgroundColor: "red",
  },
  cameraIcons: {
    position: "absolute",
    bottom: 2,
    right: 5,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
    shadowColor: theme.colors.textlight,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 7,
    zIndex: 8,
  },
  instructionText: {
    fontSize: hp(1.7),
    color: theme.colors.text,
    textAlign: "center",
    marginVertical: 10,
  },
  bioInput: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
});
