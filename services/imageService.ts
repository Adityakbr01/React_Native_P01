import { supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import * as Sharing from 'expo-sharing';
import { supabaseUrl } from "@/constants";

export const getUserImageSrc = (imagePath: string | undefined) => {
  if (imagePath) {
    return getSupabaseImageSrc(imagePath);

    return {
      uri: `${supabaseUrl}/storage/v1/object/public/Uploads/${imagePath}`,
    };

    return {
      uri: `${supabaseUrl}/storage/v1/object/public/Uploads/${imagePath}`,
    };
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



//downloadFile
export const downloadFile = async (filePath: string) => {
  try {
    let { uri } = await FileSystem.downloadAsync(filePath, getLocalFilePath(filePath));
    console.log("uri ImageService", uri);
    return uri;
  } catch (error) {
    console.error("Error downloading file:", error);
    return null; // Return null if there's an error during download
  }
};

//getLocalFilePath
export const getLocalFilePath = (filePath: string) => {
  if (!filePath) {
    throw new Error("Invalid file path");
  }
  let fileName = filePath.split("/").pop();
  return `${FileSystem.documentDirectory}${fileName}`;
};

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
