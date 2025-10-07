import { jwtDecode } from "jwt-decode";

export interface UserPayload {
  name: string;
  email: string;
  role: "admin" | "HR" | "Team Lead" | "simple user";
}

// Safely decode a JWT token
export function getUserFromToken(token: string): UserPayload | null {
  if (!token) return null;

  try {
    const decoded = jwtDecode<UserPayload>(token);
    if (!decoded?.name || !decoded?.role) return null;
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
