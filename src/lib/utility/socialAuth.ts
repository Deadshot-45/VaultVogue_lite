import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { authService } from "@/lib/services/authServices";

export const handleGoogleLogin = async () => {
  try {
    // 1. Sign in on the frontend
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    console.log("UserData: ", user);

    // 2. Fetch the ID token from Firebase
    const token = await user.getIdToken();

    // 3. Send the token to your Express backend via authService
    const data = await authService.googleLogin(token);

    console.log("Backend Session Active:", data);
    return data;
  } catch (error) {
    console.error("Authentication mapping failed:", error);
    throw error;
  }
};
