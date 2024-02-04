import nodemailer from 'nodemailer';
import { MailtrapClient } from 'mailtrap';

type Profile = {
  name: string;
  email: string;
};

const TOKEN = process.env.MAILTRAP_TOKEN!;

const client = new MailtrapClient({ token: TOKEN });

const sender = {
  email: 'mailtrap@hanzlanouman.com',
  name: 'Mailtrap Test',
};

interface EmailOptions {
  profile: Profile;
  subject: 'verification' | 'forget-password' | 'password changed';
  linkUrl?: string;
}

const genereateMailTransporter = () => {
  var transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'd3e8c1b747bead',
      pass: 'c37ce03482d1c4',
    },
  });
  return transport;
};
const sendVerificationEmail = async (profile: Profile, linkUrl: string) => {
  const recipients = [
    {
      email: profile.email,
    },
  ];

  client.send({
    from: sender,
    to: recipients,
    subject: 'Verify Your Email',
    text: `<h1> Please Follow <a href= "${linkUrl}"> this Link </a> to verify your account. </h1>`,
    category: 'Email Verification',
  });
};

const sendForgetPasswordEmail = async (profile: Profile, linkUrl: string) => {
  // const transport = genereateMailTransporter();

  // await transport.sendMail({
  //   from: 'verification@nexecomm.com',
  //   to: profile.email,
  //   html: `<h1> Please Follow <a href= "${linkUrl}"> this Link </a> to reset your password. </h1>`,
  // });

  const recipients = [
    {
      email: profile.email,
    },
  ];

  client.send({
    from: sender,
    to: recipients,
    subject: 'Reset Forgotten Password',
    text: `<h1> Please Follow <a href= "${linkUrl}"> this Link </a> to reset your password. </h1>`,
    category: 'Forget Password Link',
  });
};

const sendPasswordChangedEmail = async (profile: Profile) => {
  const recipients = [
    {
      email: profile.email,
    },
  ];

  client.send({
    from: sender,
    to: recipients,
    subject: 'Password Reset Notification',
    text: `<h1> We Changed your password. Visit <a href= "${process.env.SIGN_IN_URL}"> this Link </a> to Sign in. </h1>`,
    category: 'Password Reset',
  });

  // const transport = genereateMailTransporter();
  // await transport.sendMail({
  //   from: 'verification@nexecomm.com',
  //   to: profile.email,
  //   html: `<h1> We Changed your password. Visit <a href= "${process.env.SIGN_IN_URL}"> this Link </a> to Sign in. </h1>`,
  // });
};
export const sendEmail = (options: EmailOptions) => {
  const { profile, subject, linkUrl } = options;

  switch (options.subject) {
    case 'verification':
      return sendVerificationEmail(profile, linkUrl!);
    case 'forget-password':
      return sendForgetPasswordEmail(profile, linkUrl!);
    case 'password changed':
      return sendPasswordChangedEmail(profile);
    default:
      return;
  }
};
