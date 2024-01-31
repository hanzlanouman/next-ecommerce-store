import startDb from '@lib/db';
import UserModel from '@models/userModel';
import { SignInCredentials } from '@/app/types';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  const { email, password } = (await req.json()) as SignInCredentials;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Please provide email and password' },
      { status: 400 }
    );
  }

  await startDb();

  const user = await UserModel.findOne({ email: email });
  if (!user)
    return NextResponse.json(
      { error: 'User with Email doesnot Exist' },
      { status: 400 }
    );

  const passwordMatch = await user.comparePassword(password);

  if (!passwordMatch)
    return NextResponse.json({ error: 'Invalid Password' }, { status: 400 });

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar?.url,
      role: user.role,
    },
  });
};
