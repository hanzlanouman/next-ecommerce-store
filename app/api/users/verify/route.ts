import EmailVerificationToken from "@models/emailVerificationToken";
import UserModel from "@models/userModel";
import { EmailVerifyRequest } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const {token, userId} = await req.json() as EmailVerifyRequest;

    if(!isValidObjectId(userId)) {
        return NextResponse.json({
            error: 'Invalid User Id'
        }, {
            status: 401
        })
    }

   const verifyToken = await EmailVerificationToken.findOne({user: userId})

    if(!verifyToken) {
     return NextResponse.json({
          error: 'Invalid Token'
     }, {
          status: 401
     })
    }

  const isMatched =  await verifyToken.compareToken(token)

    if(!isMatched) {
        return NextResponse.json({
            error: 'Invalid Token!'
     }, {
            status: 401
     })
    }

    await UserModel.findByIdAndUpdate(userId, {verified: true})
    await EmailVerificationToken.findByIdAndDelete(verifyToken._id)


    return NextResponse.json({
        message: "Email Verified Successfully"
    }, {
        status:200
    })
  } catch (error) {
    NextResponse.json({
        error: "Couldnt Verify Something Went Wrong"
    })
  }
  
    
}