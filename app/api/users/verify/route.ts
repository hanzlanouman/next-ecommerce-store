import EmailVerificationToken from '@models/emailVerificationToken';
import UserModel from '@models/userModel';
import { EmailVerifyRequest } from '@/app/types';
import { isValidObjectId } from 'mongoose';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendEmail } from '@/app/lib/email';
import startDb from '@/app/lib/db';

export const POST = async (req: Request) => {
  try {
    const { token, userId } = (await req.json()) as EmailVerifyRequest;

    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        {
          error: 'Invalid User Id',
        },
        {
          status: 401,
        }
      );
    }

    const verifyToken = await EmailVerificationToken.findOne({ user: userId });

    if (!verifyToken) {
      return NextResponse.json(
        {
          error: 'Invalid Token',
        },
        {
          status: 401,
        }
      );
    }

    const isMatched = await verifyToken.compareToken(token);

    if (!isMatched) {
      return NextResponse.json(
        {
          error: 'Invalid Token!',
        },
        {
          status: 401,
        }
      );
    }

    await UserModel.findByIdAndUpdate(userId, { verified: true });
    await EmailVerificationToken.findByIdAndDelete(verifyToken._id);

    return NextResponse.json(
      {
        message: 'Email Verified Successfully',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    NextResponse.json({
      error: 'Couldnt Verify Something Went Wrong',
    });
  }
};

export const GET = async (req: Request) => {
  try {
    const userId = req.url.split('?userId=')[1];
    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        {
          error: 'Invalid User Id: Missing',
        },
        {
          status: 401,
        }
      );
    }

    await startDb();

    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found!',
        },
        {
          status: 404,
        }
      );
    }

    if (user.verified) {
      return NextResponse.json(
        {
          error: 'User already verified!',
        },
        {
          status: 401,
        }
      );
    }

    const token = crypto.randomBytes(36).toString('hex');

    await EmailVerificationToken.findOneAndDelete({ user: userId });
    await EmailVerificationToken.create({
      user: userId,
      token,
    });

    const verificationUrl = `${process.env.EMAIL_VERIFICATION_URL}?token=${token}&userId=${user._id}`;
    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: 'verification',
      linkUrl: verificationUrl,
    });
    return NextResponse.json(
      {
        message: 'Please Check your email',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    NextResponse.json({
      error: 'Couldnt Verify Something Went Wrong',
    });
  }
};
