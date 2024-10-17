import { supabase } from "@/lib/supabase";

// Define the type for the user data returned from Supabase
interface UserData {
  id?: string; // Adjust this to the actual type of your user ID
  name?: string; // Adjust this based on your user schema
  email?: string; // Adjust based on your user schema
  // Add more fields as per your user table structure
}

interface ApiResponse<T> {
  successs: boolean;
  data?: T; // Data will be of generic type T
  msg?: string;
}

export const getUserData = async (
  userId: string
): Promise<ApiResponse<UserData>> => {
  try {
    const { data, error } = await supabase
      .from("users") // Specify the UserData type for the query
      .select()
      .eq("id", userId)
      .single();

    if (error) {
      return { successs: false, msg: error.message };
    }

    return { successs: true, data: data as UserData }; // Type assertion for data
  } catch (error) {
    console.log("got Error:", error);
    return { successs: false, msg: (error as Error).message }; // Ensure proper error typing
  }
};
// Update user data
export const updateUserData = async (
  userId: string,
  updatedUserData: Partial<UserData>
): Promise<ApiResponse<UserData>> => {
  try {
    const { error } = await supabase
      .from("users")
      .update(updatedUserData)
      .eq("id", userId);

    if (error) {
      return { successs: false, msg: error.message };
    }

    return { successs: true, data: updatedUserData };
  } catch (error) {
    console.log("Error updating user data:", error);
    return { successs: false, msg: (error as Error).message };
  }
};
