'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: '¡Mensaje enviado con éxito! Nos comunicaremos a la brevedad.',
        });
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      } else {
        throw new Error(data.error || 'Ocurrió un error al enviar el mensaje.');
      }
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.message || 'No se pudo establecer conexión con el servidor.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Contact Information Card */}
      <div className="bg-brand-dark text-white p-8 rounded-lg shadow-sm flex flex-col justify-between space-y-8">
        <div className="space-y-6">
          <div className="border-l-4 border-brand-mint pl-3">
            <h2 className="text-xl font-bold text-white">Nuestra Oficina</h2>
            <p className="text-xs text-gray-300 mt-1">Vení a conocernos o retirás tu pedido</p>
          </div>

          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
              <span>Av. Presidente Illia 2450, San Martín, Provincia de Buenos Aires</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-brand-blue shrink-0" />
              <a href="tel:+541147559999" className="hover:underline">
                (011) 4755-9999
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-brand-blue shrink-0" />
              <a href="mailto:ventas@tangoma.com" className="hover:underline">
                ventas@tangoma.com
              </a>
            </li>
          </ul>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-xs text-gray-400">
            Atención telefónica y presencial en horarios comerciales.
          </p>
        </div>
      </div>

      {/* Contact Form Card */}
      <div className="lg:col-span-2 bg-white p-8 rounded-lg border border-brand-gray-medium shadow-sm">
        <div className="border-l-4 border-brand-dark pl-3 mb-6">
          <h2 className="text-xl font-bold text-brand-dark">Enviar Mensaje</h2>
          <p className="text-xs text-gray-500 mt-1">Escribinos y te responderemos por correo electrónico</p>
        </div>

        {status.type && (
          <div
            className={`p-4 rounded mb-6 flex items-start gap-3 text-sm ${
              status.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-sm"
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                Empresa
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
              Consulta o Comentario *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-brand-dark text-white px-6 py-3 text-sm font-semibold hover:bg-opacity-95 shadow active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="h-4 w-4" />
            {loading ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </form>
      </div>
    </div>
  );
}
