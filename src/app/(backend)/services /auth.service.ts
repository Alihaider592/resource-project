import connectDatabase from "@/app/(backend)/lib/db";
import SignupUser from "@/app/(backend)/models/signupuser";
import AddUser from "@/app/(backend)/models/adduser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- Types ---
interface UserDocument {
  _id: string;
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
    source: "SignupUser" | "AddUser";
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// --- 1. LOGIN SERVICE ---
export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  await connectDatabase();

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

  // Check SignupUser first
  let user = await SignupUser.findOne({ email }).lean() as UserDocument | null;
  let source: "SignupUser" | "AddUser" = "SignupUser";

  if (!user) {
    user = await AddUser.findOne({ email }).lean() as UserDocument | null;
    source = "AddUser";
  }

  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  // Generate JWT
  const token = jwt.sign(
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      source,
    },
  };
}

// --- 2. SIGNUP SERVICE ---
export async function registerUser(data: RegisterData) {
  await connectDatabase();

  const { name, email, password } = data;

  if (!name || !email || !password) throw new Error("Missing required fields");

  const exists = await SignupUser.findOne({ email });
  if (exists) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await SignupUser.create({
    name,
    email,
    password: hashedPassword,
    role: "User",
  });

  return {
    id: newUser._id.toString(),
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    source: "SignupUser",
  };
}

// --- 3. GET USER PROFILE SERVICE ---
export async function getUserProfile(decodedUser: { id: string; name: string; email: string; role: string; }) {
  return {
    id: decodedUser.id,
    name: decodedUser.name,
    email: decodedUser.email,
    role: decodedUser.role,
  };
}
