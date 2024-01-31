import { NextResponse } from "next/server"
import nodemailer from 'nodemailer';
import startDb from "@lib/db";
import UserModel from "@models/userModel";
import { NewUserRequest } from "@/app/types";
import {hash} from 'bcrypt';
import EmailVerificationToken from "@models/emailVerificationToken";
import crypto from 'crypto';

export const POST = async (req: Request) => {
 const body = await req.json() as NewUserRequest

 const hashedPassword = await hash(body.password, 10)
 await startDb();

 const newUser = await UserModel.create ({
    ...body,
 })


 const token = crypto.randomBytes(36).toString('hex')

 await EmailVerificationToken.create({
    user: newUser._id,
    token
 })

 var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d3e8c1b747bead",
      pass: "c37ce03482d1c4"
    }
  });

  const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`
  await transport.sendMail({
    from: 'verification@nexecomm.com',
    to: newUser.email,
    html: `<h1> Please Follow <a href= "${verificationUrl}"> this Link </a> to Verify. </h1>`,
  })

 await newUser.comparePassword('876543210')

    return NextResponse.json(
        {
            message: "Please Check Your email!"
        }
    )
}