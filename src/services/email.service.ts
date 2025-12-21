import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../app/config/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: `"Tennis App" <${EMAIL_USER}>`,
    to: email,
    subject: "Your Email Verification OTP",
    html: `
  <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 24px;">
    <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; padding: 24px; border-radius: 8px;">
      
      <h2 style="color: #333333; text-align: center; margin-bottom: 16px;">
        Email Verification
      </h2>

      <p style="color: #555555; font-size: 14px;">
        Hi,
      </p>

      <p style="color: #555555; font-size: 14px;">
        Thank you for using Tennis app. Please use the following One-Time Password (OTP) to verify your email address.
      </p>

      <div style="text-align: center; margin: 24px 0;">
        <span style="
          display: inline-block;
          padding: 12px 24px;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 4px;
          color: #1a73e8;
          background-color: #f1f5ff;
          border-radius: 6px;
        ">
          ${otp}
        </span>
      </div>

      <p style="color: #555555; font-size: 14px;">
        This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
      </p>

      <p style="color: #555555; font-size: 14px;">
        If you did not request this verification, you can safely ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />

      <p style="color: #999999; font-size: 12px; text-align: center;">
        © ${new Date().getFullYear()} Tennis App. All rights reserved.
      </p>
    </div>
  </div>
`,
  });
};
