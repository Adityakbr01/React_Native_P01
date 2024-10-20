import Icon from "@/assets/icons";
import CommentItem from "@/components/CommentItem";
import Inpute from "@/components/Inpute";
import Loading from "@/components/Loading";
import PostCard from "@/components/PostCard";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { hp, wp } from "@/helpers/common";
import { supabase } from "@/lib/supabase";
import {
  createComment,
  fetchPostDetails,
  removePostComment,
} from "@/services/postService";
import { getUserData } from "@/services/userService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const postDetails = () => {
  const { postId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const [post, setPost] = useState(null);
  const InputRef = useRef<any>(null);
  const commentRef = useRef<string>("");
  const [loading, setLoading] = useState(false);



  const handleComment = async (payload: any) => {
    if (payload.new){
      let newComment = {...payload.new}
      let res = await getUserData(newComment?.userId)
      newComment.user = res.successs ? res.data : {}
      setPost((prevPost) => {
        return {
          ...prevPost,
          comments: [newComment, ...prevPost?.comments]
        }
      })
    }
    
  };

  useEffect(() => {
    let commentsChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleComment
      )
      .subscribe();
    getPostDetails();

    // getPosts();
    return () => {
      supabase.removeChannel(commentsChannel);
    };
  }, []);

  const getPostDetails = async () => {
    //fetch post details here
    let res = await fetchPostDetails(postId as any);
    if (res.success) {
      setPost(res.data);
    } else {
      console.log("Failed to fetch post details");
    }
    setStartLoading(false);
  };

  const onNewComment = async () => {
    if (!commentRef.current) return null;
    let data = {
      userId: user?.id,
      postId: postId as any,
      text: commentRef.current,
    };
    setLoading(true);
    let res = await createComment(data);
    if (res.success) {
      setLoading(false);
      InputRef.current.clear();
      commentRef.current = "";
    } else {
      alert(res.msg);
      setLoading(false);
    }
  };

  const onDeleteComment = async (item: any) => {
    let res = await removePostComment(item?.id);
    if (res.success) {
      setPost((prePost) => {
        let UpadatedPost = { ...prePost };
        UpadatedPost.comments = UpadatedPost?.comments?.filter(
          (comment: any) => comment?.id !== item?.id
        );
        return UpadatedPost;
      });
    } else {
      alert(res.msg);
    }
  };

  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading size="large" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Post not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <PostCard
          post={{ ...post, comments: [{ count: post?.comments?.length }] }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
        />
        {/* comment inpute */}
        <View style={styles.inputeContainer}>
          <Inpute
            inputRef={InputRef}
            placeholder="Add a comment..."
            onChangeText={(text: string) => (commentRef.current = text)}
            placeholderTextColor={theme.colors.textlight}
            containerStyles={{
              flex: 1,
              height: hp(6.2),
              borderRadius: theme.radius.xl,
            }}
          />
          {loading ? (
            <View style={styles.loading}>
              <Loading />
            </View>
          ) : (
            <TouchableOpacity style={styles.sendIcons} onPress={onNewComment}>
              <Icon name="send" color="black" />
            </TouchableOpacity>
          )}
        </View>
        {/* Comment List  */}
        <View style={{ marginVertical: 15, gap: 17 }}>
          {post?.comments?.map((item: any, index: number) => (
            <CommentItem
              item={item}
              key={index}
              onDelete={onDeleteComment}
              canDelete={
                item?.user?.id === user?.id || user?.id == post?.userid
              }
            />
          )) || <Text style={{ textAlign: "center" }}>No comments yet</Text>}
          {post?.comments?.length == 0 && (
            <Text
              style={{
                color: theme.colors.text,
                marginLeft: 5,
                fontSize: hp(2.2),
              }}
            >
              Be First to Comment!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default postDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: wp(7),
    backgroundColor: "#fff",
  },
  inputeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: hp(4),
  },
  list: {
    paddingHorizontal: wp(4),
  },
  sendIcons: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.dark,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    height: hp(5.8),
    width: hp(5.8),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    fontSize: hp(2.5),
    fontWeight: theme.Fonts.semibold as any,
    color: "#000",
    marginTop: hp(5),
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    alignItems: "center",
    justifyContent: "center",
  },
});
