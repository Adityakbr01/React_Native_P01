<<<<<<< HEAD
<<<<<<< HEAD
import { supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
=======
>>>>>>> 446f976cf95532d4d67dd3bfec1972b561b8a6df
=======
>>>>>>> 446f976cf95532d4d67dd3bfec1972b561b8a6df
import { supabaseUrl } from "@/constants";

export const getUserImageSrc = (imagePath: string | undefined) => {
  if (imagePath) {
<<<<<<< HEAD
<<<<<<< HEAD
    return getSupabaseImageSrc(imagePath);
=======
    return {
      uri: `${supabaseUrl}/storage/v1/object/public/Uploads/${imagePath}`,
    };
>>>>>>> 446f976cf95532d4d67dd3bfec1972b561b8a6df
=======
    return {
      uri: `${supabaseUrl}/storage/v1/object/public/Uploads/${imagePath}`,
    };
>>>>>>> 446f976cf95532d4d67dd3bfec1972b561b8a6df
  } else {
    return require("../assets/images/defaultUser.png");
  }
};

export const getSupabaseImageSrc = (filePath: any) => {
  if (filePath) {
    return {
      uri: `https://jpeecghjhpmpupbhijgu.supabase.co/storage/v1/object/public/Uploads/${filePath}`,
    };
  } else {
    return null;
  }
};

interface UploadResult {
  success: boolean;
  data?: string;
  msg?: string;
}

export const uploadFile = async (
  folderName: string,
  fileUri: string,
  isImage: boolean = true
): Promise<UploadResult> => {
  try {
    // Generate file path
    let fileName = getFilePath(folderName, isImage);

    // Read file as base64 string
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Decode base64 to ArrayBuffer
    let imagesData = decode(fileBase64); // array buffer

    // Upload to Supabase storage
    let { data, error } = await supabase.storage
      .from("Uploads")
      .upload(fileName, imagesData, {
        cacheControl: "3600",
        upsert: false,
        contentType: isImage ? "image/*" : "video/*",
      });

    if (error) {
      console.error("File upload error:", error);
      return { success: false, msg: "Could not upload media" };
    }

    // console.log("File uploaded successfully:", data);
    console.log("File uploaded successfully:", data);
    return { success: true, data: data?.path };
  } catch (error) {
    console.error("File upload error:", error);
    return { success: false, msg: "Could not upload media" };
  }
};

// Helper function to generate file path
export const getFilePath = (folderName: string, isImage: boolean): string => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};
