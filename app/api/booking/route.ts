import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getContactSection } from '@/lib/siteSettings';

interface BookingPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: NextRequest) {
  let payload: Partial<BookingPayload>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  const name = (payload.name || '').trim();
  const email = (payload.email || '').trim();
  const phone = (payload.phone || '').trim();
  const service = (payload.service || '').trim();
  const date = (payload.date || '').trim();

  if (!name || !email) {
    return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured — booking email not sent.');
    return NextResponse.json({ message: 'Email service is not configured' }, { status: 500 });
  }

  const contact = await getContactSection();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone || 'Not provided'],
    ['Service Required', service || 'Not specified'],
    ['Preferred Date', date || 'Not specified'],
  ];

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #8E001B;">New Appointment Request</h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; width: 40%;">${label}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(value)}</td>
          </tr>`
          )
          .join('')}
      </table>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">
        Sent from the Royal Opticals website booking form.
      </p>
    </div>
  `;

  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');

  try {
    const { error } = await resend.emails.send({
      from: 'Royal Opticals Website <onboarding@resend.dev>',
      to: contact.email,
      replyTo: email,
      subject: `Appointment Request — ${name}`,
      html,
      text,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ message: 'Failed to send email' }, { status: 502 });
    }
  } catch (err) {
    console.error('Booking email send failed:', err);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
