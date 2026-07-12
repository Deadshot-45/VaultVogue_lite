import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { auth, googleProvider } from "./firebase";

export const handleGoogleLogin = async () => {
  try {
    // 1. Sign in on the frontend
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // 2. Fetch the ID token from Firebase
    const token = await user.getIdToken();

    // 3. Send the token to your Express backend
    const response = await axios.post(
      "http://localhost:5000/api/auth/google",
      {}, // Request body (optional data here)
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("Backend Session Active:", response.data);
    return response.data;
  } catch (error) {
    console.error("Authentication mapping failed:", error);
  }
};
