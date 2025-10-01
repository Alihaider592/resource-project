import connecttodatabase from "../../../../lib/db";
import User from "@/models/User";
import { NextRequest } from "next/server";
export async function POST() {
    try{
        await connecttodatabase()
        const {name,email}=await Request.json()
        const newUser =new User ({name,email})
        await newUser.save()
        return NextRequest.json(newUser,{status:201})
    }catch (err){
        console.log(err)
        
    }
}
