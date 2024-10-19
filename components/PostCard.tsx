import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { theme } from "@/constants/theme";
import Avatar from "./Avatar";
import { hp, wp } from "@/helpers/common";
import moment from "moment";
import Icon from "@/assets/icons";
import RenderHtml from "react-native-render-html";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Image } from "expo-image";
import { getSupabaseImageSrc } from "@/services/imageService";
import { ResizeMode, Video } from "expo-av";

const TextStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.76),
};
const tagStyles = {
  div: TextStyle,
  p: TextStyle,
  ol: TextStyle,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};
const PostCard = ({ post, currentUser, router, hasShadow = true }: any) => {
  const [isMuted, setIsMuted] = useState(false);
  const shadowStyle = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 0.6,
    elevation: 1,
  };
  const postTime = moment(post?.created_at).format("MMM D");
  const likesCount = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let Likes = true;
  const openPostDetails = () => {
    router.push(`/post/${post.id}`);
  };
  return (
    <View style={[styles.container, hasShadow && shadowStyle]}>
      <View style={styles.header}>
        {/* user info  and Post options */}
        <View style={styles.userInfo}>
          <Avatar
            uri={post.user.image}
            size={hp(5.6)}
            rounded={theme.radius.md}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.userName}>{post?.user?.name}</Text>
            <Text style={styles.postTime}>{postTime}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={openPostDetails}>
          <Icon
            name="threeDotsHorizontal"
            size={hp(3.5)}
            strokeWidth={3}
            color="black"
          />
        </TouchableOpacity>
      </View>
      {/* Post Body & media */}
      <View style={styles.content}>
        <View style={styles.postBody}>
          {post?.body && (
            <RenderHtml
              contentWidth={wp(100)}
              source={{ html: post?.body }}
              tagsStyles={tagStyles}
            />
          )}
        </View>
        <View>
          {/* post imag */}
          {post?.file && post?.file?.includes("postImage") && (
            <Image
              source={getSupabaseImageSrc(post?.file)}
              transition={100}
              style={styles.postmedia}
              contentFit="cover"
            />
          )}
        </View>
        {/* post v */}
        {post?.file && post?.file?.includes("postVideo") && (
          <View style={{ position: "relative" }}>
            <Video
              source={getSupabaseImageSrc(post?.file) as any}
              style={[styles.postmedia, { height: hp(30) }]}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping
              isMuted={isMuted}
            />
            <TouchableOpacity
              style={styles.muteButton}
              onPress={() => setIsMuted(!isMuted)}
            >
              <Icon
                name={isMuted ? "mute" : "unmute"}
                size={hp(3)}
                color="white"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Like, Comment, Share */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Icon
              name={Likes ? "filledHeart" : "heart"}
              size={hp(3.7)}
              color={
                Likes
                  ? (theme.colors.rose as any)
                  : (theme.colors.roselight as any)
              }
            />
          </TouchableOpacity>
          <Text style={styles.likeCount}>{likesCount.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Icon
              name={"comment"}
              size={hp(3.7)}
              color={
                "black"
              }
            />
          </TouchableOpacity>
          <Text style={styles.likeCount}>{likesCount.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Icon
              name={"share"}
              size={hp(3.7)}
              color={"black"}
            />
          </TouchableOpacity>
          
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    gap: 10,
  },
  userName: {
    fontSize: hp(1.92),
    color: theme.colors.dark,
    fontWeight: theme.Fonts.medium as any,
  },
  postTime: {
    color: "#808080",
    fontSize: hp(1.6),
  },
  content: {
    gap: 10,
  },
  postBody: {
    marginLeft: 5,
  },
  postText: {
    fontSize: hp(1.76),
    color: theme.colors.textlight,
    fontWeight: theme.Fonts.medium as any,
  },
  postmedia: {
    height: hp(38),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  muteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: 100,
  },
  footer: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  footerButton: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  likeCount: {
    fontSize: hp(1.76),
    color: "black",
    fontWeight: theme.Fonts.medium as any,
  },
});
