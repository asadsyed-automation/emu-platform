import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const testEmail = async () => {
  try {
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'EMU Platform <onboarding@resend.dev>',
      to: ['eum.syed.asad.14@gmail.com'],
      subject: 'EMU Platform — Live Cloud Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #7A1F1F; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #7A1F1F; padding: 18px; text-align: center; color: white;">
            <h2 style="margin: 0;">EMU Platform Live OTP Verification</h2>
            <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Emerson University Multan</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff; color: #333;">
            <p>Assalam-o-Alaikum <strong>Syed Asad Ali Raza Shah</strong>,</p>
            <p>Aapki <strong>Resend API</strong> live cloud server par successfully connect ho chuki hai!</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1C5C34; background-color: #F7F7F5; padding: 10px 24px; border-radius: 6px; border: 1px dashed #C9A227; display: inline-block;">
                941208
              </span>
            </div>
            <p style="font-size: 12px; color: #777;">Yeh OTP code aapke live account activation ke liye valid hai.</p>
          </div>
        </div>
      `,
    });

    console.log('✅ Resend Live Response:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('❌ Resend Test Error:', err);
  }
};

testEmail();
