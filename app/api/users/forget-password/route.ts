import startDb from '@lib/db';
import UserModel from '@models/userModel';
import { ForgetPasswordRequest } from '@/app/types';
import { NextResponse } from 'next/server';
import PasswordResetTokenModel from '@/app/models/passwordResetTokenModel';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const POST = async (req: Request) => {
  const { email } = (await req.json()) as ForgetPasswordRequest;
  try {
    await startDb();
    const user = await UserModel.findOne({ email });

    if (!email) {
      return NextResponse.json(
        { error: 'Please provide email' },
        { status: 401 }
      );
    }

    if (!user)
      return NextResponse.json(
        { error: 'User with Email does not Exist' },
        { status: 404 }
      );

    // generate token and send email to given email address

    await PasswordResetTokenModel.findOneAndDelete({
      user: user._id,
    });

    const token = crypto.randomBytes(36).toString('hex');

    await PasswordResetTokenModel.create({
      user: user._id,
      token,
    });

    // send email with token
    const resetPasswordLink = `${process.env.PASSWORD_RESET_URL}?token=${token}&userId=${user._id}`;

    var transport = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'd3e8c1b747bead',
        pass: 'c37ce03482d1c4',
      },
    });

    await transport.sendMail({
      from: 'verification@nextecomm.com',
      to: user.email,
      html: `<h1> Please Follow <a href= "${resetPasswordLink}"> this Link </a> to Reset Your Password. </h1>`,
    });

    return NextResponse.json(
      {
        message: 'Please Check Your email for Password Recovery!',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error as any }, { status: 500 });
  }
};
