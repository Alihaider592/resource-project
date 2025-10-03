import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phonenumber: { type: String, required: true },
  companyname: { type: String, required: true },
  comment: { type: String }
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
