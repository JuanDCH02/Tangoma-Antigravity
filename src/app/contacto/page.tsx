import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contacto - Tangoma',
  description: 'Comunicate con nuestro equipo de ventas y soporte técnico. Consultanos tus dudas o vení a visitarnos en San Martín.',
};

export default function ContactoPage() {
  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="border-l-4 border-brand-dark pl-3">
        <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">
          Contacto y Asesoramiento
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Hacenos tus consultas comerciales o técnicas de manera directa
        </p>
      </div>

      {/* Main form and info */}
      <ContactForm />
    </div>
  );
}
