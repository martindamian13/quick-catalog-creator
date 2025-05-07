
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo className="mb-4" />
            <p className="text-gray-500 mb-4">
              Crea y comparte catálogos de productos online en minutos.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-primary transition-colors">Inicio</a></li>
              <li><a href="#beneficios" className="text-gray-500 hover:text-primary transition-colors">Beneficios</a></li>
              <li><a href="#testimonios" className="text-gray-500 hover:text-primary transition-colors">Testimonios</a></li>
              <li><a href="#precios" className="text-gray-500 hover:text-primary transition-colors">Precios</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-500 hover:text-primary transition-colors">Términos de servicio</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-primary transition-colors">Política de privacidad</Link></li>
              <li><Link to="/cookies" className="text-gray-500 hover:text-primary transition-colors">Política de cookies</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Contacto</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-500 hover:text-primary transition-colors">Contacto</Link></li>
              <li><Link to="/faq" className="text-gray-500 hover:text-primary transition-colors">FAQ</Link></li>
              <li><a href="mailto:info@catalogo.app" className="text-gray-500 hover:text-primary transition-colors">info@catalogo.app</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} CataloGo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
