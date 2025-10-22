import { authenticateUser, registerUser, getUserProfile } from "../services /auth.service";
// --- Types ---
interface Credentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface DecodedUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// --- 1. LOGIN CONTROLLER ---
export async function handleLoginRequest(credentials: Credentials) {
  try {
    const { email, password } = credentials;

    if (!email || !password) throw new Error("Email and password are required");

    const result = await authenticateUser(email, password);

    return result; // { token, user }
  } catch (err) {
    console.error("❌ Controller Error (Login):", err);
    throw err;
  }
}

// --- 2. SIGNUP CONTROLLER ---
export async function handleSignupRequest(data: RegisterData) {
  try {
    if (!data.name || !data.email || !data.password) throw new Error("All fields are required");
    return await registerUser(data);
  } catch (err) {
    console.error("❌ Controller Error (Signup):", err);
    throw err;
  }
}

// --- 3. ME CONTROLLER ---
export async function handleMeRequest(user: DecodedUser) {
  try {
    if (!user.id) throw new Error("Invalid user");
    return await getUserProfile(user);
  } catch (err) {
    console.error("❌ Controller Error (Me):", err);
    throw err;
  }
}
