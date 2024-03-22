'use server';

import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendEmail({
  to,
  subject,
  text,
  html,
  name,
}: EmailMessage): Promise<void> {
  const msg = {
    to,
    from: {
      email: 'recipes@howcan.io',
      name: name,
    },
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
