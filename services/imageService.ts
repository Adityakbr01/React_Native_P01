export const getUserImageSrc = (imagePath: string | undefined) => {
  if (imagePath) {
    return {
      uri: `https://jpeecghjhpmpupbhijgu.supabase.co/storage/v1/object/public/Uploads/profile/${imagePath}`,
    };
  } else {
    return require("../assets/images/defaultUser.png");
  }
};
