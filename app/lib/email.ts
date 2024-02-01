import nodemailer from 'nodemailer';

type Profile = {
  name: string;
  email: string;
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
  const transport = genereateMailTransporter();

  await transport.sendMail({
    from: 'verification@nexecomm.com',
    to: profile.email,
    html: `<h1> Please Follow <a href= "${linkUrl}"> this Link </a> to Verify. </h1>`,
  });
};

const sendForgetPasswordEmail = async (profile: Profile, linkUrl: string) => {
  const transport = genereateMailTransporter();

  await transport.sendMail({
    from: 'verification@nexecomm.com',
    to: profile.email,
    html: `<h1> Please Follow <a href= "${linkUrl}"> this Link </a> to reset your password. </h1>`,
  });
};

const sendPasswordChangedEmail = async (profile: Profile) => {
  const transport = genereateMailTransporter();

  await transport.sendMail({
    from: 'verification@nexecomm.com',
    to: profile.email,
    html: `<h1> We Changed your password. Visit <a href= "${process.env.SIGN_IN_URL}"> this Link </a> to Sign in. </h1>`,
  });
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
