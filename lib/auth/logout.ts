import { signOut } from "next-auth/react";
import { logInfo, logError } from "@/lib/logger";
import axios from "axios";

export async function logout() {
    try {
      await axios.post("/api/auth/logout")
      logInfo("Refresh tokens revoked successfully")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logError(error.response?.data || error.message, "Failed to revoke refresh tokens")
      } else {
        logError(error, "Error during logout API call")
      }
    }
  
    await signOut({
      redirect: true,
      callbackUrl: "/login",
    })
  }