import UserModel from '@models/userModel';
import { UpdatePassowrdRequest } from '@/app/types';
import { isValidObjectId } from 'mongoose';
import { NextResponse } from 'next/server';
import startDb from '@lib/db';
import PasswordResetTokenModel from '@models/passwordResetTokenModel';
import nodemailer from 'nodemailer';
import { sendEmail } from '@/app/lib/email';

export const POST = async (req: Request) => {
  try {
    const { password, token, userId } =
      (await req.json()) as UpdatePassowrdRequest;

    if (!password || !token || !isValidObjectId(userId)) {
      return NextResponse.json(
        {
          error: 'Invalid Request',
        },
        {
          status: 401,
        }
      );
    }

    await startDb();
    const resetToken = await PasswordResetTokenModel.findOne({
      user: userId,
    });

    if (!resetToken)
      return NextResponse.json({ error: 'Token Not Found' }, { status: 401 });

    const isMatched = await resetToken.compareToken(token);

    if (!isMatched)
      return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });

    const user = await UserModel.findById(userId);

    if (!user)
      return NextResponse.json({ error: 'User Not Found' }, { status: 404 });

    const isUsingOldPassword = await user.comparePassword(password);

    if (isUsingOldPassword) {
      return NextResponse.json(
        {
          error: 'You are using old password! Please use a new password',
        },
        {
          status: 401,
        }
      );
    }
    user.password = password;

    await user.save();

    await PasswordResetTokenModel.findByIdAndDelete(resetToken._id);

    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: 'password-changed',
    });

    return NextResponse.json(
      {
        message: 'Password Updated Successfully',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    NextResponse.json(
      {
        error: 'Couldnt Update Password Something Went Wrong',
      },
      {
        status: 500,
      }
    );
  }
};
