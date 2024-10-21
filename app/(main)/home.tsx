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
import Loading from "@/components/Loading";
import { getUserData } from "@/services/userService";

interface Post {
  id: string;
  userId: string;
  user: any;
  // Add other properties as needed
}

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(3); // Keep limit in state
  const [posts, setPosts] = useState<Post[]>([]);

  const handlePostEvent = async (payload: any) => {
    if (payload?.eventType === "INSERT" && payload?.new?.id) {
      let newPost: Post = { ...payload?.new };
      console.log("NEW POST", newPost);
      let res = await getUserData(newPost?.userId);
      if (res?.successs) {
        newPost.user = res?.data;
      } else {
        newPost.user = {}; // Handle case where user data can't be fetched
      }
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, handlePostEvent)
      .subscribe();

    getPosts(); // Ensure posts are fetched when the component mounts

    return () => {
      supabase.removeChannel(postChannel); // Cleanup on unmount
    };
  }, []);

  const getPosts = async () => {
    if (!hasMore) return null;

    let result = await fetchPost(limit); // Fetch with current limit
    if (result?.success && result?.data) {
      if (posts.length === result?.data.length) {
        setHasMore(false); // No more posts available
      } else {
        setPosts(result?.data);
        setLimit(limit + 3); // Increase the limit for the next fetch
      }
    }
  };

  console.log("POSTS", posts);

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PlusIG</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("/notifications")}>
              <Icon name="heart" size={hp(3.2)} color={"#000000"} strokeWidth={2} />
            </Pressable>
            <Pressable onPress={() => router.push("/newPost")}>
              <Icon name="plus" size={hp(3.2)} color={"#000000"} strokeWidth={2} />
            </Pressable>
            <Pressable onPress={() => router.push("/profile")}>
              <Avatar
                uri={user?.image} // Option chaining applied here
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
          keyExtractor={(item) => item?.id} // Option chaining applied here
          renderItem={({ item }) => (
            <View>
              <PostCard post={item} currentUser={user} router={router} />
            </View>
          )}
          onEndReached={getPosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={hasMore ? (
            <View style={{ marginVertical: posts.length < 0 ? 200 : 30 }}>
              <Loading />
            </View>
          ) : (
            <View style={{ marginVertical: 30 }}>
              <Text style={styles.noPost}>No more posts</Text>
            </View>
          )}
        />
      </View>
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
  },
  avataImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
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
});
