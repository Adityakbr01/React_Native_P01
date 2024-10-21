import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { hp, stripHtmplTags, wp } from "@/helpers/common";
import { downloadFile, getSupabaseImageSrc } from "@/services/imageService";
import { createPostLike, removePostLike } from "@/services/postService";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RenderHtml from "react-native-render-html";
import Avatar from "./Avatar";

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

const PostCard = ({
  post,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  
}: any) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const [likeCount, setLikeCount] = useState<{ postId: any; userId: any }[]>([]);

  const Likes = likeCount?.some((item: any) => item?.userId === currentUser?.id);

  useEffect(() => {
    setLikeCount(post?.postLikes || []);
  }, [post?.postLikes]);

  const openPostDetails = () => {
    if (!showMoreIcon) return;
    router?.push(`/postDetails?postId=${post?.id}`);
  };

  const onLike = async () => {
    if (Likes) {
      const updatedLikeCount = likeCount?.filter((item: any) => item?.userId !== currentUser?.id);
      setLikeCount(updatedLikeCount);
      const res = await removePostLike(post?.id, currentUser?.id);
      if (res?.success) {
        console.log("Post Unliked");
      }
    } else {
      const data = {
        postId: post?.id,
        userId: currentUser?.id,
      };
      setLikeCount([...likeCount, data]);
      const res = await createPostLike(data);
      if (res?.success) {
        console.log("Post Liked");
      } else {
        alert("Post Like: Something went wrong");
      }
    }
  };

  const onShareHandler = async () => {
    try {
      setIsLoading(true);
      const content: { message?: string; url?: string } = {
        message: stripHtmplTags(post?.body),
      };

      if (post?.file) {
        const supabaseUrl = getSupabaseImageSrc(post?.file)?.uri;
        const downloadedFileUri = await downloadFile(supabaseUrl as string);

        if (downloadedFileUri) {
          content.url = downloadedFileUri;
        }
      }

      setIsLoading(false);

      if (content?.url) {
        await Sharing.shareAsync(content?.url, { dialogTitle: "Share Post" });
      } else if (content?.message) {
        await Sharing.shareAsync(content?.message, {
          dialogTitle: "Share Post",
        });
      } else {
        console.error("No content available to share.");
      }
    } catch (error) {
      console.error("Error during sharing process:", error);
    }
  };

  return (
    <View style={[styles.container, hasShadow && shadowStyle]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar
            uri={post?.user?.image}
            size={hp(5.6)}
            rounded={theme.radius.md}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.userName}>{post?.user?.name}</Text>
            <Text style={styles.postTime}>{postTime}</Text>
          </View>
        </View>
        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name="threeDotsHorizontal"
              size={hp(3.5)}
              strokeWidth={3}
              color="black"
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        {post?.body && (
          <RenderHtml
            contentWidth={wp(100)}
            source={{ html: post?.body }}
            tagsStyles={tagStyles}
          />
        )}
        {post?.file?.includes("postImage") && (
          <Image
            source={getSupabaseImageSrc(post?.file)}
            transition={100}
            style={styles.postmedia}
            contentFit="cover"
          />
        )}
        {post?.file?.includes("postVideo") && (
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
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon
              name={Likes ? "filledHeart" : "heart"}
              size={hp(3.7)}
              color={"black"}
            />
          </TouchableOpacity>
          <Text style={styles.likeCount}>{likeCount?.length || 0}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name={"comment"} size={hp(3.7)} color={"black"} />
          </TouchableOpacity>
          <Text style={styles.likeCount}>{post?.comments?.[0]?.count || 0}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onShareHandler}>
            {isLoading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <Icon name="share" size={hp(3.7)} color="black" />
            )}
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
