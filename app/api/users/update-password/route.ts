import UserModel from '@models/userModel';
import { UpdatePassowrdRequest } from '@/app/types';
import { isValidObjectId } from 'mongoose';
import { NextResponse } from 'next/server';
import startDb from '@lib/db';
import PasswordResetTokenModel from '@models/passwordResetTokenModel';
import nodemailer from 'nodemailer';

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
      html: `<h1> Your Password Has been Reset ! </h1>`,
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
