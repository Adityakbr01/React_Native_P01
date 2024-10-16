import { supabaseUrl } from "@/constants";

export const getUserImageSrc = (imagePath: string | undefined) => {
  if (imagePath) {
    return {
      uri: `${supabaseUrl}/storage/v1/object/public/Uploads/${imagePath}`,
    };
  } else {
    return require("../assets/images/defaultUser.png");
  }
};
