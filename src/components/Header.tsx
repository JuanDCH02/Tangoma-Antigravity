'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Menu, X, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Productos', href: '/productos' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Admin', href: '/admin' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brand-gray-medium shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="h-8 w-8 rounded bg-brand-dark flex items-center justify-center text-white font-bold text-lg">
                T
              </span>
              <span className="text-xl font-bold tracking-tight text-brand-dark">
                Tangoma<span className="text-brand-mint">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-brand-dark font-semibold border-b-2 border-brand-mint pb-1'
                    : 'text-gray-500 hover:text-brand-dark'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Cart & Mobile menu button */}
          <div className="flex items-center gap-4">
            {/* Quote Request Cart */}
            <Link
              href="/cotizacion"
              className="relative p-2 text-gray-500 hover:text-brand-dark transition-colors duration-200 rounded-full hover:bg-gray-100"
              aria-label="Ver solicitud de cotización"
            >
              <ShoppingBag className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-mint text-[10px] font-bold text-brand-dark shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Abrir menú</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brand-gray-medium py-3 space-y-1">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? 'bg-brand-gray-light text-brand-dark border-l-4 border-brand-mint font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
