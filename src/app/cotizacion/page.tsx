'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Trash2, Minus, Plus, FileText, Send, CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CotizacionPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<{ id: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [error, setError] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrderComplete({ id: data.quoteId });
        clearCart();
      } else {
        throw new Error(data.error || 'Ocurrió un error al procesar el presupuesto.');
      }
    } catch (err: any) {
      setError(err.message || 'No se pudo enviar la solicitud. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // If order is completed successfully
  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-white border border-brand-gray-medium rounded-lg shadow-sm p-8 space-y-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 mb-2">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight">
            ¡Solicitud Enviada con Éxito!
          </h1>
          <p className="text-sm text-gray-500">
            Tu solicitud de cotización ha sido registrada con el código{' '}
            <span className="font-mono font-semibold text-brand-dark">#{orderComplete.id}</span>
          </p>
        </div>
        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          Recibirás un correo electrónico detallado con tu pedido de presupuesto. Nuestro equipo técnico evaluará tu solicitud y te enviará los costos finales a la brevedad.
        </p>
        <div className="pt-6 border-t border-brand-gray-medium flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/productos"
            className="inline-flex items-center justify-center gap-1.5 rounded bg-brand-dark text-white px-5 py-2.5 text-sm font-semibold hover:bg-opacity-95 shadow active:scale-95 transition-all"
          >
            Seguir Navegando
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded bg-brand-gray-light border border-brand-gray-medium text-brand-dark px-5 py-2.5 text-sm font-semibold hover:bg-gray-100 transition-all"
          >
            Ir a Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-l-4 border-brand-dark pl-3">
        <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">
          Solicitud de Cotización
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Revisá los productos y completá tus datos para recibir un presupuesto
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-lg border border-brand-gray-medium py-16 text-center shadow-sm">
          <div className="max-w-xs mx-auto space-y-4">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-50 border border-gray-100">
              <ShoppingBag className="h-6 w-6 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-brand-dark">Tu lista está vacía</p>
              <p className="text-sm text-gray-400">
                Todavía no agregaste productos para cotizar.
              </p>
            </div>
            <Link
              href="/productos"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded bg-brand-dark text-white px-5 py-2.5 text-sm font-semibold hover:bg-opacity-95 shadow active:scale-95 transition-all"
            >
              Explorar Catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg border border-brand-gray-medium overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-brand-gray-light border-b border-brand-gray-medium flex justify-between items-center">
                <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                  Productos ({totalItems})
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Vaciar Lista
                </button>
              </div>

              <div className="divide-y divide-brand-gray-medium">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-4 flex gap-4 items-center">
                    {/* Image */}
                    <div className="relative h-16 w-16 bg-gray-50 rounded overflow-hidden border border-gray-200 shrink-0">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                          Sin Imagen
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/productos/${item.product.slug}`} className="hover:underline font-bold text-sm text-brand-dark block truncate">
                        {item.product.name}
                      </Link>
                      <span className="text-xs text-gray-400 block mt-0.5">
                        {item.product.category}
                      </span>
                    </div>

                    {/* Quantity selectors */}
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden h-8 bg-white shrink-0">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 h-full hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 h-full hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[80px] shrink-0">
                      <span className="font-bold text-sm text-brand-dark block">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {formatPrice(item.product.price)} c/u
                      </span>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors rounded-full hover:bg-gray-50 cursor-pointer"
                      title="Eliminar de la lista"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Subtotal summary */}
              <div className="p-4 bg-brand-gray-light border-t border-brand-gray-medium flex justify-between items-center font-bold text-brand-dark">
                <span>Total Estimado</span>
                <span className="text-lg">{formatPrice(calculateSubtotal())}</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 italic">
              * Nota: El importe es una referencia estimativa. El presupuesto final podría contemplar descuentos por volumen de compra o costos de logística que le serán informados.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white p-6 rounded-lg border border-brand-gray-medium shadow-sm space-y-4">
            <div className="border-l-4 border-brand-dark pl-3">
              <h2 className="text-lg font-bold text-brand-dark">Tus Datos</h2>
              <p className="text-xs text-gray-500 mt-0.5">Completá para enviar la solicitud</p>
            </div>

            {error && (
              <div className="p-3 text-xs bg-rose-50 text-rose-800 border border-rose-200 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-xs"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-xs"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-xs"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                  Empresa / Taller
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-xs"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                  Notas Adicionales
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ej: Necesito cortes a medida, requerimiento urgente, etc."
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded bg-brand-mint text-brand-dark px-5 py-3 text-sm font-semibold hover:bg-opacity-95 shadow active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                {loading ? 'Enviando Solicitud...' : 'Solicitar Presupuesto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
