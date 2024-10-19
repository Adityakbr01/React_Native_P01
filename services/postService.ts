import { supabase } from "@/lib/supabase";
import { uploadFile } from "./imageService";

export const createPostORupdatePost = async (post: any) => {
  console.log("Post > Post Servive", post);
  try {
    //upload image
    if (post.file && typeof post.file == "object") {
      let isImage = post.file?.type == "image";
      let folderName = isImage ? "postImages" : "postVideos";

      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
      if (fileResult.success) post.file = fileResult.data;
      else {
        return fileResult;
      }
    }

    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (error) {
      console.log("Create Post Error", error);
      return { success: false, msg: "Could not create post" };
    }
    return { success: true, data };
  } catch (error) {
    console.log("Create Post Error", error);
    return { success: false, msg: "Could not create post Catch" };
  }
};
export const fetchPost = async (limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
    *,
    user:users(
      id,
      name,
      image
    ),
    postLikes (*)
    `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("Fetch Post Error", error);
      return { success: false, msg: "Could not fetch post" };
    }
    return { success: true, data };
  } catch (error) {
    console.log("Fetch Post Error", error);
    return { success: false, msg: "Could not fetch post Catch" };
  }
};
export const createPostLike = async (postLike: any) => {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.log("Fetch PostLike Error", error);
      return { success: false, msg: "Could not Like the Post" };
    }
    return { success: true, data };
  } catch (error) {
    console.log("Fetch PostLike Error", error);
    return { success: false, msg: "Could not Like the Post" };
  }
};
export const removePostLike = async (postId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (error) {
      console.log("Fetch PostLike Error", error);
      return { success: false, msg: "Could not remove Post Like" };
    }
    return { success: true };
  } catch (error) {
    console.log("Fetch PostLike Error", error);
    return { success: false, msg: "Could not remove Post Like" };
  }
};
