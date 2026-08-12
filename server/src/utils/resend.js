import { Resend } from 'resend';

let resendClient = null;

const getResendClient = () => {
  if (!resendClient && process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('placeholder')) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

export const sendOtpEmail = async ({ toEmail, studentName, otpCode }) => {
  const fromEmail = process.env.FROM_EMAIL || 'EMU Platform <onboarding@resend.dev>';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #7A1F1F; padding: 20px; text-align: center; color: #ffffff;">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700;">EMU Platform</h2>
        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Emerson University Multan - BS(CS)</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff; color: #1C1C1E;">
        <h3 style="margin-top: 0; color: #7A1F1F;">Account Verification OTP</h3>
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>Your one-time verification code for activating your EMU student portal account is:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1C5C34; background-color: #F7F7F5; padding: 12px 24px; border-radius: 6px; border: 1px dashed #C9A227;">
            ${otpCode}
          </span>
        </div>
        <p style="font-size: 13px; color: #666;">This code is valid for 15 minutes. If you did not attempt to log in to EMU, please contact your class instructor immediately.</p>
      </div>
      <div style="background-color: #F7F7F5; padding: 12px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eeeeee;">
        Emerson University Multan • BS(CS) Semester 7
      </div>
    </div>
  `;

  const client = getResendClient();

  if (client) {
    try {
      const data = await client.emails.send({
        from: fromEmail,
        to: [toEmail],
        subject: `Your EMU Verification Code: ${otpCode}`,
        html: htmlContent,
      });
      console.log(`✉️ OTP Email sent via Resend to ${toEmail}:`, data);
      return { success: true, method: 'resend', data };
    } catch (err) {
      console.error(`❌ Error sending email via Resend to ${toEmail}:`, err.message);
      // Fallback log for development
      console.log(`🔑 [DEV FALLBACK OTP] Code for ${toEmail}: ${otpCode}`);
      return { success: true, method: 'dev_fallback', code: otpCode };
    }
  } else {
    console.log(`ℹ️ Resend API key not configured. [DEV MODE] OTP Code for ${toEmail}: ${otpCode}`);
    return { success: true, method: 'dev_mode', code: otpCode };
  }
};
