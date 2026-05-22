import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              Tangoma<span className="text-brand-mint">.</span>
            </span>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Negocio familiar con trayectoria y experiencia abasteciendo a la industria local. 
              Especialistas en correas de transmisión, mangueras industriales, acoples y pisos de goma.
            </p>
          </div>

          {/* Column 2: Hours */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-blue" /> Horarios de Atención
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>Lunes a Viernes: 8:00 a 12:30 y 14:00 a 18:00 hs.</li>
              <li>Sábados: 8:30 a 13:00 hs.</li>
              <li>Domingos y Feriados: Cerrado</li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contacto</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                <span>Av. Presidente Illia 2450, San Martín, Provincia de Buenos Aires</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-brand-blue shrink-0" />
                <a href="tel:+541147559999" className="hover:text-white transition-colors duration-200">
                  (011) 4755-9999
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-brand-blue shrink-0" />
                <a href="mailto:ventas@tangoma.com" className="hover:text-white transition-colors duration-200">
                  ventas@tangoma.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; {currentYear} Tangoma. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 text-xs text-gray-400">
            <Link href="/contacto" className="hover:text-white">
              Soporte
            </Link>
            <Link href="/productos" className="hover:text-white">
              Catálogo
            </Link>
            <Link href="/admin" className="hover:text-white">
              Administración
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
