import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Icon from "../../assets/icons";
import { useRouter } from "expo-router";
import Avatar from "@/components/Avatar";
import { fetchPost } from "@/services/postService";
import PostCard from "@/components/PostCard";

var limit = 0
const Home = () => {
  const { setAuth, user } = useAuth();
  const router = useRouter();

  const LogOutHandler = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Sign Out Failed!");
    }
  };
  //posts
  const [posts, setPosts] = useState<any>([])

//call get posts
useEffect(() => {
  getPosts()
}, [])


const getPosts = async ()=>{
  //get posts from supabase
limit += 10
let result = await fetchPost(limit)
 if(result.success){
  setPosts(result.data)
 }

}


  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PlusIG</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("/notifications")}>
              <Icon
                name="heart"
                size={hp(3.2)}
                color={"#000000"}
                strokeWidth={2}
              />
            </Pressable>
            <Pressable onPress={() => router.push("/newPost")}>
              <Icon
                name="plus"
                size={hp(3.2)}
                color={"#000000"}
                strokeWidth={2}
              />
            </Pressable>
            <Pressable onPress={() => router.push("/profile")}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>

        {/* Posts */}
        <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item)=>item.id.toString()}
        renderItem={({item})=>{
          return(
            <View>
              <PostCard post={item}  currentUser={user} router={router}/>
            </View>
          )
        }}
        />
      </View>

      {/* <Button title="LogOut" onPress={LogOutHandler} /> */}
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.Fonts.bold as any,
  fontFamily: 'Helvetica',
  },
  avataImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "circular",
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },

  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPost: {
    fontSize: hp(2),
    color: theme.colors.text,
    textAlign: "center",
    fontWeight: theme.Fonts.bold as any,
  },
  pill: {},
});
