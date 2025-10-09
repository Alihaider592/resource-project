import connectDatabase from "@/app/(backend)/lib/db";
import SignupUser from "@/app/(backend)/models/signupuser"; 
import AddUser from "@/app/(backend)/models/adduser"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types, Document } from "mongoose";
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

// --- 1. LOGIN SERVICE LOGIC ---

/**
 * Authenticates user, verifies password (checking two models), and generates JWT.
 * @throws {Error} for invalid credentials or server errors.
 */
export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  await connectDatabase();

  if (!process.env.JWT_SECRET) {
    throw new Error("Server misconfiguration: JWT_SECRET is missing.");
  }
  let user: UserDocument | null = (await SignupUser.findOne({ email }).lean() as unknown) as UserDocument;
  let source = "SignupUser";

  if (!user) {
    user = (await AddUser.findOne({ email }).lean() as unknown) as UserDocument;
    source = "AddUser";
  }

  if (!user) {
    throw new Error("Invalid email or password"); 
  }

  // 2. Password Verification
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }
  const userIdString = user._id.toString();

  const token = jwt.sign(
    { id: userIdString, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  
  return {
    token,
    user: {
      id: userIdString,
      name: user.name,
      email: user.email,
      role: user.role,
      source: source,
    },
  };
}


// --- 2. SIGNUP SERVICE LOGIC ---

interface RegisterData { name: string; email: string; password: string; }

/**
 * Registers a new user with default role 'simple user' (changed from 'admin' for security).
 * @throws {Error} if user already exists or required fields are missing.
 */
export async function registerUser(userData: RegisterData): Promise<AuthResult['user']> {
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

    const user = await SignupUser.create({
        name,
        email,
        password: hashedPassword,
        role: "simple user", 
    });

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        source: 'SignupUser'
    };
}


// --- 3. ME SERVICE LOGIC ---

export async function getUserProfile(decodedUser: Omit<AuthResult['user'], 'source'|'id'> & { id: string }) {
    const { id, name, email, role } = decodedUser;
    
    return { id, name, email, role };
}
