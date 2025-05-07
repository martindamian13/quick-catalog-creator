
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const Header: React.FC = () => {
  return (
    <header className="border-b py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#beneficios" className="text-gray-600 hover:text-primary transition-colors">Beneficios</a>
          <a href="#testimonios" className="text-gray-600 hover:text-primary transition-colors">Testimonios</a>
          <a href="#precios" className="text-gray-600 hover:text-primary transition-colors">Precios</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="outline" className="font-medium">Iniciar sesión</Button>
          </Link>
          <Link to="/register">
            <Button className="bg-action hover:bg-action/90 text-white font-medium">Crear catálogo</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
