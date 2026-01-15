import { ContactEmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';
import { NextRequest } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ContactFormData;
    const { name, email, company, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Otherwise Contact <onboarding@resend.dev>', // Update this to your verified domain
      to: ['jackson@otherwise.dev'],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      react: ContactEmailTemplate({ name, email, company, message }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
