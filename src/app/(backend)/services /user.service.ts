import connectDatabase from "@/app/(backend)/lib/db";
// ✅ Import SignupUser: Self-registered users
import SignupUser from "@/app/(backend)/models/signupuser"; 
// ✅ Import AddUser: Admin-added users
import AddUser from "@/app/(backend)/models/adduser"; 
import { Types, Document, Model } from 'mongoose';

// Local interface definition jo dono models ke common profile fields ko handle karega
interface IProfileDoc extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: string; 
  avatar?: string;
  phonenumber?: string;
  companyname?: string;
}

interface UpdatePayload {
  name: string;
  email: string;
  phonenumber?: string;
  companyname?: string;
  avatarUrl?: string; 
}
interface CleanUserResponse {
  id: string;
  name: string;
  email: string;
  role: string; 
  avatar: string | null;
  phonenumber?: string;
  companyname?: string;
}


/**
 * Updates the user profile in the database by checking both AddUser and SignupUser models.
 * @param userId - The ID of the user to update.
 * @param payload - Clean, validated data ready for database insertion.
 * @returns The updated user object, ya null agar user na mile.
 */
export async function updateUserProfile(userId: string, payload: UpdatePayload): Promise<CleanUserResponse | null> {
    await connectDatabase();

    let objectId: Types.ObjectId;
    try {
        // User ID string ko Mongoose ObjectId mein convert karein.
        objectId = new Types.ObjectId(userId);
    } catch (e) {
        throw new Error("Invalid User ID format provided.");
    }


    const updateObject: Partial<IProfileDoc> = {
        name: payload.name,
        email: payload.email,
    };
    if (payload.phonenumber) updateObject.phonenumber = payload.phonenumber;
    if (payload.companyname) updateObject.companyname = payload.companyname;
    // Avatar ko updateObject mein tabhi shamil karein jab woh payload mein ho.
    if (payload.avatarUrl !== undefined) updateObject.avatar = payload.avatarUrl;

    let updatedUser: IProfileDoc | null = null; 
    
    // 1. Pehle AddUser collection mein dhundhein aur update karein (Admin-added users)
    updatedUser = await AddUser.findByIdAndUpdate(
        objectId, 
        { $set: updateObject },
        { new: true, runValidators: true }
    ).select('-password') as IProfileDoc | null; 

    // 2. Agar AddUser mein nahi mila, toh SignupUser collection mein dhundhein aur update karein
    if (!updatedUser) {
        updatedUser = await SignupUser.findByIdAndUpdate(
            objectId, 
            { $set: updateObject },
            { new: true, runValidators: true }
        ).select('-password') as IProfileDoc | null;
    }

    if (!updatedUser) {
        // Agar dono collections mein user nahi milta, toh null return karein.
        return null;
    }
    
    const responseData: CleanUserResponse = {
        id: updatedUser._id.toString(), 
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role, 
        avatar: updatedUser.avatar ?? null,
        phonenumber: updatedUser.phonenumber,
        companyname: updatedUser.companyname,
    };
    
    return responseData;
}
