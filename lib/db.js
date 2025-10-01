import mongoose from "mongoose";
 const connecttodatabase=async()=>{
try{
    await mongoose.connect(process.env.mongooUrl)
    console.log("connected")
}catch(err){
    console.log(err)
}
}
export default connecttodatabase;
