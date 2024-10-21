import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/contexts/AuthContext";
import RichTextEditor from "@/components/RichTextEditor";
import { RichEditor } from "react-native-pell-rich-editor";
import { useRouter } from "expo-router";
import Icon from "@/assets/icons";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { getSupabaseImageSrc } from "@/services/imageService";
import { ResizeMode, Video } from "expo-av";
import { createPostORupdatePost } from "@/services/postService";

type FileType = {
  uri: string;
  type: string;
  name: string;
};

const NewPost = () => {
  const { user: currentUser } = useAuth();
  const bodyRef = useRef<RichEditor>(null);
  const editorRef = useRef<RichEditor>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<FileType | null>(null);
  const [bodyContent, setBodyContent] = useState<string>("");

  const onPick = async (isImage: boolean) => {
    let mediaConfig: ImagePicker.ImagePickerOptions = {
      mediaTypes: isImage
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    };

    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setFile({
        uri: asset.uri,
        type: asset.type || 'image',
        name: asset.fileName || 'image.jpg',
      } as FileType);
    }
  };

  const isLocalFile = (file: FileType): boolean => {
    return !file.uri.startsWith('http');
  };

  const getFileType = (file: FileType): string => {
    if (!file) return "";
    if (isLocalFile(file)) {
      return file.type.split('/')[0];
    }
    return file.uri.includes("postImages") ? "image" : "video";
  };

  const getFileUri = (file: FileType | null): string | null => {
    if (!file) return null;
    return isLocalFile(file) ? file.uri : getSupabaseImageSrc(file.uri)?.uri || null;
  };

  useEffect(() => {
    if (bodyRef.current) {
      
    }
  }, [bodyRef.current]);

  const onPost = async () => {
    if (!bodyContent || !file) {
      alert("Please add some content to your post");
      return;
    }
    let data = {
      file,
      body: bodyContent,
      userId: currentUser?.id,
    };
    setLoading(true);
    let res = await createPostORupdatePost(data);
    if (res?.success) {
      setLoading(false);
      router.back();
    } else {
      setLoading(false);
      alert(res?.data);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <Header title="Create Post" />
        <ScrollView>
          <View style={styles.avatarContainer}>
            <Avatar
              size={wp(10)}
              uri={currentUser?.image}
              rounded={theme.radius.xl}
            />
            <View style={styles.userInfoContainer}>
              <Text style={styles.username}>
                {currentUser ? `@${currentUser.name}` : ""}
              </Text>
              <Text style={styles.publicText}>Public</Text>
            </View>
          </View>
          <View style={styles.textEditor}>
            <RichTextEditor
              editorRef={editorRef}
              onChange={(body) => {
                setBodyContent(body);
                if (bodyRef.current) {
                  bodyRef.current.setContentHTML(body);
                }
              }}
            />
          </View>
          {file && (
            <View style={styles.file}>
              {getFileType(file) === "video" ? (
                <Video 
                  source={{uri: getFileUri(file) || ''}} 
                  style={{flex: 1}} 
                  useNativeControls 
                  resizeMode={ResizeMode.COVER} 
                />
              ) : (
                <Image 
                  source={{uri: getFileUri(file) || ''}} 
                  resizeMode="cover" 
                  style={{flex: 1}}  
                />
              )}
              <Pressable style={styles.deleteButton} onPress={() => setFile(null)}>
                <Icon name="delete" size={20} color={"#fff"} />
              </Pressable>
            </View>
          )}
          <View style={styles.media}>
            <Text style={styles.mediaText}>Add Your Post</Text>
            <View style={styles.mediaIcon}>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon name="image" size={30} color={"#000"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPick(false)}>
                <Icon name="video" size={33} color={"#000"} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Button
          buttonStyle={{ height: hp(6.2) }}
          title="Post"
          loading={loading}
          onPress={onPost}
          hasShadow={false}
        />
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),

  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
    marginTop: hp(2),
  },
  userInfoContainer: {
    marginLeft: wp(3),
    gap: hp(1),
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.Fonts.semibold as any,
    color: theme.colors.text,
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.Fonts.medium as any,
    color: "#8e8e93",
  },
  textEditor: {
    flex: 1,
  },
  media: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    padding: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.gray,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    marginTop: 10,
    marginBottom: hp(4),
    
  },
  mediaIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  mediaText: {
    fontSize: hp(1.9),
    fontWeight: theme.Fonts.semibold as any,
    color: theme.colors.text,
  },
  file: {
    height: hp(30),
    width: "100%",
    backgroundColor: theme.colors.gray,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    marginTop: 5,
    overflow: "hidden",
    alignSelf: "center",
  },
  deleteButton: {
    position: "absolute", 
    top: 5, 
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
});
