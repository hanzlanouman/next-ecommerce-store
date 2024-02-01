import startDb from '@lib/db';
import UserModel from '@models/userModel';
import { ForgetPasswordRequest } from '@/app/types';
import { NextResponse } from 'next/server';
import PasswordResetTokenModel from '@/app/models/passwordResetTokenModel';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { sendEmail } from '@/app/lib/email';

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

    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: 'forget-password',
      linkUrl: resetPasswordLink,
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
