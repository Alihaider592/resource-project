import { getAllUsersService,getSingleUserService,createNewUserService,deleteUserService,updateUserService } from "../services /admin.service";
import { UserRole } from "../models/adduser";
/* -------------------------------------------------------------------------- */
/* TYPES AND INTERFACES                                                       */
/* -------------------------------------------------------------------------- */

interface NewUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  avatar?: string;
  phonenumber?: string;
  companyname?: string;
}

interface IUser {
  _id: string | { toString(): string };
  name: string;
  email: string;
  role: string;
  password?: string;
  avatar?: string | null;
  picture?: string | null;
  phonenumber?: string | null;
  companyname?: string | null;
  createdAt?: Date;
  toObject?: () => Omit<IUser, "toObject" | "_id"> & { _id: string };
}

/* -------------------------------------------------------------------------- */
/* 1. CREATE NEW USER                                                         */
/* -------------------------------------------------------------------------- */

export async function handleNewUserRequest(data: NewUserRequest) {
  if (!data.name || !data.email || !data.password || !data.role) {
    throw new Error("Missing required fields: name, email, password, and role.");
  }

  const validRoles: UserRole[] = [
    "simple user",
    "admin",
    "HR",
    "Team Lead",
    "CEO",
    "CTO",
  ];
  if (!validRoles.includes(data.role as UserRole)) {
    throw new Error("Invalid role specified.");
  }

  const newUser = await createNewUserService(data);

  return {
    id: newUser._id.toString(),
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    avatar: newUser.avatar || null,
  };
}

/* -------------------------------------------------------------------------- */
/* 2. GET SINGLE USER (For View Profile)                                      */
/* -------------------------------------------------------------------------- */

export async function handleGetSingleUser(id: string) {
  if (!id) {
    throw new Error("Missing user ID.");
  }

  const user = await getSingleUserService(id);

  if (!user) {
    return {
      success: false,
      message: "User not found.",
      user: null,
    };
  }

  return {
    success: true,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || user.picture || null,
      phonenumber: user.phonenumber || null,
      companyname: user.companyname || null,
      createdAt: user.createdAt,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* 3. UPDATE USER                                                             */
/* -------------------------------------------------------------------------- */

export async function handleUpdateUserRequest(
  userId: string,
  updateData: UpdateUserRequest
) {
  if (!userId) {
    throw new Error("Missing user ID for update operation.");
  }

  if (updateData.role) {
    const validRoles: UserRole[] = [
      "simple user",
      "admin",
      "HR",
      "Team Lead",
      "CEO",
      "CTO",
    ];
    if (!validRoles.includes(updateData.role as UserRole)) {
      throw new Error("Invalid role specified for update.");
    }
  }

  const updatedUser = await updateUserService(userId, updateData);

  return {
    id: updatedUser._id.toString(),
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    avatar: updatedUser.avatar || updatedUser.picture || null,
    phonenumber: updatedUser.phonenumber || null,
    companyname: updatedUser.companyname || null,
    createdAt: updatedUser.createdAt,
  };
}

/* -------------------------------------------------------------------------- */
/* 4. DELETE USER                                                             */
/* -------------------------------------------------------------------------- */

export async function handleDeleteUserRequest(userId: string) {
  try {
    await deleteUserService(userId);
    return {
      message: `✅ User with ID ${userId} successfully deleted.`,
      success: true,
    };
  } catch (error: unknown) {
    console.error("❌ Controller Error (Delete User):", error);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* 5. GET ALL USERS                                                           */
/* -------------------------------------------------------------------------- */

export async function handleGetAllUsers() {
  try {
    const allUsers = await getAllUsersService();

    if (!Array.isArray(allUsers)) {
      console.warn("⚠️ getAllUsersService() did not return an array:", allUsers);
      return [];
    }

    return allUsers.map((user: IUser) => ({
      id: typeof user._id === "string" ? user._id : user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || user.picture || null,
      phonenumber: user.phonenumber || null,
      companyname: user.companyname || null,
      createdAt: user.createdAt,
    }));
  } catch (error) {
    console.error("❌ Controller Error (Get Users):", error);
    return [];
  }
}
