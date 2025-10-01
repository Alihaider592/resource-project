import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";
const userScheema=new mongoose.Schema({
    name:{type : String},
    email:{type:String, require:true,unique:true},
    phonenumber:{type:String,require},
    companyname:{type:String,require},
    Comment:{type:String}
})
const User = mongoose.models.User || mongoose.model("User", userScheema);
export default User;
