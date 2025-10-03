// import mongoose, { Schema, Document } from "mongoose";

// export interface ISAddUser extends Document {
//   name: string;
//   email: string;
//   password: string;
// }

// const AddUserSchema: Schema<ISAddUser> = new Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const AddUser =
//   mongoose.models.adduser ||
// mongoose.models.AddUser || mongoose.model<ISAddUser>("AddUser", AddUserSchema);

// export default AddUser;
import mongoose, { Schema, Document } from "mongoose";

export interface ISAddUser extends Document {
  name: string;
  email: string;
  password: string;
}

const AddUserSchema: Schema<ISAddUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const AddUser = mongoose.models.AddUser || mongoose.model<ISAddUser>("AddUser", AddUserSchema);

export default AddUser;
