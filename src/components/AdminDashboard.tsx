'use client';

import { useState } from 'react';
import { Plus, Trash2, Calendar, FileText, ShoppingBag, PlusCircle, CheckCircle, Clock, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string | null;
  price: number;
  description: string | null;
  imageUrl: string | null;
}

interface QuoteItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    category: string | null;
  };
}

interface QuoteRequest {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  status: string;
  createdAt: string;
  items: QuoteItem[];
}

interface AdminDashboardProps {
  initialProducts: Product[];
  initialQuotes: QuoteRequest[];
}

export default function AdminDashboard({ initialProducts, initialQuotes }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'quotes'>('products');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [quotes, setQuotes] = useState<QuoteRequest[]>(initialQuotes);

  // Expanded quotes state
  const [expandedQuotes, setExpandedQuotes] = useState<Record<string, boolean>>({});

  // Product form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Correas',
    price: '',
    description: '',
    imageUrl: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedQuotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      category: product.category || 'Correas',
      price: product.price.toString(),
      description: product.description || '',
      imageUrl: product.imageUrl || '',
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingProductId(null);
    setFormData({ name: '', category: 'Correas', price: '', description: '', imageUrl: '' });
    setFormError('');
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const url = editingProductId ? `/api/productos/${editingProductId}` : '/api/productos';
      const method = editingProductId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (editingProductId) {
          setProducts((prev) => prev.map(p => p.id === editingProductId ? data.product : p));
        } else {
          setProducts((prev) => [data.product, ...prev]);
        }
        handleCancelForm();
      } else {
        throw new Error(data.error || 'No se pudo guardar el producto.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error de conexión.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto? Las cotizaciones que lo contengan perderán la referencia de integridad.')) return;

    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || 'Error al eliminar el producto.');
      }
    } catch (err) {
      alert('Error de conexión al eliminar.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="border-l-4 border-brand-dark pl-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">Panel de Administración</h1>
          <p className="text-sm text-gray-500 mt-1">Gestioná los productos de la web y revisá los pedidos de cotización recibidos</p>
        </div>
        
        {activeTab === 'products' && (
          <button
            onClick={() => {
              if (showAddForm && !editingProductId) {
                handleCancelForm();
              } else {
                handleCancelForm();
                setShowAddForm(true);
              }
            }}
            className="sm:self-center inline-flex items-center justify-center gap-1.5 rounded bg-brand-mint text-brand-dark px-4 py-2.5 text-xs font-semibold hover:bg-opacity-95 shadow active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-brand-gray-medium">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('products')}
            className={`border-b-2 py-4 px-1 text-sm font-semibold cursor-pointer ${
              activeTab === 'products'
                ? 'border-brand-dark text-brand-dark'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Productos ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`border-b-2 py-4 px-1 text-sm font-semibold cursor-pointer ${
              activeTab === 'quotes'
                ? 'border-brand-dark text-brand-dark'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Solicitudes de Cotización ({quotes.length})
          </button>
        </nav>
      </div>

      {/* Show Add Product Form */}
      {showAddForm && activeTab === 'products' && (
        <div className="bg-white p-6 rounded-lg border border-brand-gray-medium shadow-sm space-y-4 max-w-xl">
          <div className="border-l-4 border-brand-dark pl-3">
            <h2 className="text-lg font-bold text-brand-dark">{editingProductId ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{editingProductId ? 'Modificá la información del producto' : 'Completá la información del catálogo'}</p>
          </div>

          {formError && (
            <div className="p-3 text-xs bg-rose-50 text-rose-800 border border-rose-200 rounded">
              {formError}
            </div>
          )}

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-xs"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                  Categoría *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-xs bg-white"
                >
                  <option value="Correas">Correas</option>
                  <option value="Mangueras">Mangueras</option>
                  <option value="Acoples">Acoples</option>
                  <option value="Pisos de Goma">Pisos de Goma</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                  Precio Unitario ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="price"
                  name="price"
                  required
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-xs"
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                  URL de Imagen (Unsplash u otro)
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://example.com/imagen.jpg"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-xs"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-xs resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleCancelForm}
                className="rounded bg-brand-gray-light border border-brand-gray-medium text-brand-dark px-4 py-2 text-xs font-semibold hover:bg-gray-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="rounded bg-brand-dark text-white px-4 py-2 text-xs font-semibold hover:bg-opacity-95 shadow cursor-pointer disabled:opacity-50"
              >
                {formLoading ? 'Guardando...' : (editingProductId ? 'Actualizar Producto' : 'Guardar Producto')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-lg border border-brand-gray-medium overflow-hidden shadow-sm">
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-gray-medium text-left">
                <thead className="bg-brand-gray-light">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-brand-dark uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-xs font-bold text-brand-dark uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-xs font-bold text-brand-dark uppercase tracking-wider text-right">Precio</th>
                    <th className="px-6 py-3 text-xs font-bold text-brand-dark uppercase tracking-wider text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gray-medium bg-white">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-brand-dark">{product.name}</div>
                        {product.description && (
                          <div className="text-xs text-gray-400 line-clamp-1 mt-0.5">{product.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                        {product.category || 'Otros'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-brand-dark text-right">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-gray-400 hover:text-brand-blue transition-colors p-1.5 rounded-full hover:bg-gray-50 cursor-pointer inline-flex mr-1"
                          title="Editar producto"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-gray-400 hover:text-rose-600 transition-colors p-1.5 rounded-full hover:bg-gray-50 cursor-pointer inline-flex"
                          title="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-gray-400 text-sm">
              No hay productos registrados en el catálogo.
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: QUOTES */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          {quotes.length > 0 ? (
            quotes.map((quote) => {
              const isExpanded = expandedQuotes[quote.id];
              const dateObj = new Date(quote.createdAt);
              const formattedDate = dateObj.toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const quoteTotal = quote.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );

              return (
                <div
                  key={quote.id}
                  className="bg-white rounded-lg border border-brand-gray-medium overflow-hidden shadow-sm"
                >
                  {/* Summary row */}
                  <div
                    onClick={() => handleToggleExpand(quote.id)}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-brand-dark">
                          #{quote.id}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20">
                          <Clock className="h-3 w-3 shrink-0" />
                          Pendiente
                        </span>
                      </div>
                      <div className="text-sm font-bold text-brand-dark">
                        {quote.name || 'Cliente sin nombre'}{' '}
                        {quote.company && (
                          <span className="text-xs text-gray-400 font-normal">
                            ({quote.company})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {formattedDate}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-gray-400 block">Total Estimado</span>
                        <span className="text-base font-bold text-brand-dark">
                          {formatPrice(quoteTotal)}
                        </span>
                      </div>
                      <div className="text-gray-400">
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-4 border-t border-brand-gray-medium bg-brand-gray-light/30 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1 bg-white p-3 rounded border border-brand-gray-medium">
                          <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                            Email de Contacto
                          </span>
                          <a
                            href={`mailto:${quote.email}`}
                            className="text-brand-dark font-bold hover:underline"
                          >
                            {quote.email}
                          </a>
                        </div>
                        <div className="space-y-1 bg-white p-3 rounded border border-brand-gray-medium">
                          <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                            Teléfono
                          </span>
                          <span className="text-brand-dark font-bold">
                            {quote.phone || 'No especificado'}
                          </span>
                        </div>
                        <div className="space-y-1 bg-white p-3 rounded border border-brand-gray-medium">
                          <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                            Empresa
                          </span>
                          <span className="text-brand-dark font-bold">
                            {quote.company || 'No especificada'}
                          </span>
                        </div>
                      </div>

                      {quote.message && (
                        <div className="bg-white p-3 rounded border border-brand-gray-medium text-xs space-y-1.5">
                          <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                            Mensaje o Notas del Cliente
                          </span>
                          <p className="text-gray-700 italic leading-relaxed whitespace-pre-line">
                            {quote.message}
                          </p>
                        </div>
                      )}

                      {/* Products List */}
                      <div className="space-y-2">
                        <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                          Detalle de Productos
                        </span>
                        <div className="bg-white rounded border border-brand-gray-medium overflow-hidden">
                          <table className="min-w-full divide-y divide-brand-gray-medium text-left">
                            <thead className="bg-brand-gray-light">
                              <tr>
                                <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase">Producto</th>
                                <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase text-center">Cant.</th>
                                <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase text-right">Precio Unit.</th>
                                <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase text-right">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-gray-medium bg-white text-xs">
                              {quote.items.map((item) => (
                                <tr key={item.id}>
                                  <td className="px-4 py-2.5">
                                    <span className="font-bold text-brand-dark">{item.product.name}</span>
                                    <span className="text-[10px] text-gray-400 block mt-0.5">{item.product.category}</span>
                                  </td>
                                  <td className="px-4 py-2.5 text-center font-semibold text-brand-dark">
                                    {item.quantity}
                                  </td>
                                  <td className="px-4 py-2.5 text-right font-medium text-gray-500">
                                    {formatPrice(item.price)}
                                  </td>
                                  <td className="px-4 py-2.5 text-right font-bold text-brand-dark">
                                    {formatPrice(item.price * item.quantity)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg border border-brand-gray-medium py-16 text-center text-gray-400 text-sm">
              No hay solicitudes de cotización registradas por el momento.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
