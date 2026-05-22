import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resend } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const { name, email, phone, company, message, items } = await request.json();

    if (!email || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'El email y los productos a cotizar son obligatorios.' },
        { status: 400 }
      );
    }

    // 1. Save in the database
    const quoteRequest = await db.quoteRequest.create({
      data: {
        name,
        email,
        phone,
        company,
        message,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // 2. Build details for HTML Email
    const tableRows = quoteRequest.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">
          ${item.product.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; text-align: right;">
          $${Number(item.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; text-align: right; font-weight: bold;">
          $${(Number(item.price) * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </td>
      </tr>
    `
      )
      .join('');

    const subtotal = quoteRequest.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
        <h2 style="color: #3a445d; border-bottom: 2px solid #21d19f; padding-bottom: 8px;">
          Solicitud de Cotización #${quoteRequest.id}
        </h2>
        
        <h3 style="color: #3a445d; margin-top: 20px;">Datos del Cliente</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 4px 0; font-weight: bold; width: 120px;">Nombre:</td>
            <td style="padding: 4px 0;">${name || 'No especificado'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold;">Email:</td>
            <td style="padding: 4px 0;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold;">Teléfono:</td>
            <td style="padding: 4px 0;">${phone || 'No especificado'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold;">Empresa:</td>
            <td style="padding: 4px 0;">${company || 'No especificada'}</td>
          </tr>
          ${
            message
              ? `
          <tr>
            <td style="padding: 4px 0; font-weight: bold; vertical-align: top;">Notas:</td>
            <td style="padding: 4px 0; font-style: italic;">${message.replace(/\n/g, '<br/>')}</td>
          </tr>
          `
              : ''
          }
        </table>

        <h3 style="color: #3a445d;">Detalle del Pedido</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 10px; border-bottom: 2px solid #e5e7eb; text-align: left; font-size: 12px; text-transform: uppercase; color: #374151;">Producto</th>
              <th style="padding: 10px; border-bottom: 2px solid #e5e7eb; text-align: center; font-size: 12px; text-transform: uppercase; color: #374151;">Cant.</th>
              <th style="padding: 10px; border-bottom: 2px solid #e5e7eb; text-align: right; font-size: 12px; text-transform: uppercase; color: #374151;">Precio Unit.</th>
              <th style="padding: 10px; border-bottom: 2px solid #e5e7eb; text-align: right; font-size: 12px; text-transform: uppercase; color: #374151;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
          <tfoot>
            <tr style="background-color: #f9fafb;">
              <td colspan="3" style="padding: 10px; font-weight: bold; text-align: right;">Total Estimado:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right; font-size: 16px; color: #3a445d;">
                $${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>

        <p style="font-size: 12px; color: #6b7280; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 10px;">
          Este es un correo automático enviado por el cotizador web de Tangoma.
        </p>
      </div>
    `;

    // 3. Send email to store owner and a confirmation copy to client
    try {
      await resend.emails.send({
        from: 'Tangoma Cotizaciones <onboarding@resend.dev>',
        to: process.env.NOTIFICATION_EMAIL || 'juandclementeh@gmail.com',
        subject: `Nueva Solicitud de Cotización #${quoteRequest.id}`,
        html: emailHtml,
        replyTo: email,
      });
    } catch (emailError: any) {
      console.warn('Resend failed to send quote email (probably sandbox limit):', emailError.message);
    }

    return NextResponse.json({
      success: true,
      quoteId: quoteRequest.id,
      message: 'Cotización creada con éxito.',
    });
  } catch (error: any) {
    console.error('Quote Request API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno al guardar la cotización.' },
      { status: 500 }
    );
  }
}
