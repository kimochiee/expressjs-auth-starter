/* eslint-disable no-console */
import nodemailer from 'nodemailer';
import env from '../../config/env.js';

const transport = nodemailer.createTransport(env.email.smtp);
if (env.build_mode == 'dev') {
  transport
    .verify()
    .then(() => console.log('Connected to email server'))
    .catch(() =>
      console.log(
        'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
      )
    );
}

const sendEmail = async (to, subject, html) => {
  await transport.sendMail({
    from: `<${env.email.from}>`,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (name, email, token, origin) => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `${origin}/user/verify-email?token=${token}&email=${email}`;
  const html = `<h4>Hello ${name}</h4><p>Please confirm your email by clicking on the following link: <a href='${verificationEmailUrl}'>Verify Email</a></p>`;

  await sendEmail(email, subject, html);
};

const sendResetPasswordToken = async (name, email, token, origin) => {
  const subject = 'Reset Password';
  const resetPasswordlUrl = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const html = `<h4>Hello ${name}</h4><p>Please reset your password by clicking on the following link: <a href='${resetPasswordlUrl}'>Reset Password</a></p>`;

  await sendEmail(email, subject, html);
};

export default {
  transport,
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordToken,
};
