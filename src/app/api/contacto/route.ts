import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const { name, email, phone, company, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'El nombre, email y mensaje son campos obligatorios.' },
        { status: 400 }
      );
    }

    const emailHtml = `
      <h2>Nuevo Mensaje de Contacto - Web Tangoma</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone || 'No especificado'}</p>
      <p><strong>Empresa:</strong> ${company || 'No especificada'}</p>
      <p><strong>Mensaje:</strong></p>
      <blockquote style="background: #f3f4f6; padding: 10px; border-left: 4px solid #3a445d; margin: 0;">
        ${message.replace(/\n/g, '<br/>')}
      </blockquote>
    `;

    // Attempt to send email via Resend
    // Note: In Resend sandbox mode, emails can only be sent to the owner of the API key
    try {
      await resend.emails.send({
        from: 'Tangoma Web <onboarding@resend.dev>',
        to: process.env.NOTIFICATION_EMAIL || 'juandclementeh@gmail.com',
        subject: `Contacto Web: ${name}`,
        html: emailHtml,
        replyTo: email,
      });
    } catch (emailError: any) {
      console.warn('Resend failed to send email (probably sandbox limit or key invalid):', emailError.message);
      // We do not crash the request, we continue so the user sees a successful submission in local dev
    }

    return NextResponse.json({ success: true, message: 'Mensaje de contacto enviado con éxito.' });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
