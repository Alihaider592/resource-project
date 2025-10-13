import connectDatabase from "@/app/(backend)/lib/db";
import SignupUser from "@/app/(backend)/models/signupuser";
import AddUser from "@/app/(backend)/models/adduser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

// --- Type Definitions ---
interface UserDocument {
  _id: string | Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
}

interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    source: string;
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// --- 1. LOGIN SERVICE LOGIC ---
/**
 * Authenticates user (from either SignupUser or AddUser), verifies password, and returns a JWT token.
 * @throws {Error} for invalid credentials or server errors.
 */
export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  await connectDatabase();

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("Server misconfiguration: JWT_SECRET is missing.");
  }

  // Try both collections
  let user: UserDocument | null = (await SignupUser.findOne({ email }).lean()) as UserDocument | null;
  let source = "SignupUser";

  if (!user) {
    user = (await AddUser.findOne({ email }).lean()) as UserDocument | null;
    source = "AddUser";
  }

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const userIdString = user._id.toString();

  // Generate JWT
  const token = jwt.sign(
    {
      id: userIdString,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: userIdString,
      name: user.name,
      email: user.email,
      role: user.role,
      source,
    },
  };
}

// --- 2. SIGNUP SERVICE LOGIC ---
/**
 * Registers a new user with role = "simple user"
 * @throws {Error} if user exists or required fields are missing.
 */
export async function registerUser(userData: RegisterData): Promise<AuthResult["user"]> {
  await connectDatabase();

  const { name, email, password } = userData;

  if (!name || !email || !password) {
    throw new Error("Missing required fields (name, email, password)");
  }

  const existingUser = await SignupUser.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await SignupUser.create({
    name,
    email,
    password: hashedPassword,
    role: "simple user",
  });

  return {
    id: newUser._id.toString(),
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    source: "SignupUser",
  };
}

// --- 3. ME SERVICE LOGIC ---
/**
 * Returns minimal user profile data (for token verification).
 */
export async function getUserProfile(decodedUser: {
  id: string;
  name: string;
  email: string;
  role: string;
}) {
  const { id, name, email, role } = decodedUser;
  return { id, name, email, role };
}
