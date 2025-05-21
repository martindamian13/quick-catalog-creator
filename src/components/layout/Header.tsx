import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const MobileMenu = () => (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          aria-label="Menu"
        >
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <nav className="flex flex-col gap-6 mt-8">
          <a 
            href="#beneficios" 
            onClick={() => setIsMenuOpen(false)} 
            className="text-gray-600 hover:text-primary transition-colors py-2"
          >
            Beneficios
          </a>
          <a 
            href="#testimonios" 
            onClick={() => setIsMenuOpen(false)} 
            className="text-gray-600 hover:text-primary transition-colors py-2"
          >
            Testimonios
          </a>
          <a 
            href="#precios" 
            onClick={() => setIsMenuOpen(false)} 
            className="text-gray-600 hover:text-primary transition-colors py-2"
          >
            Precios
          </a>
        </nav>
        
        <div className="flex flex-col gap-4 mt-8">
          {user ? (
            <>
              <span className="text-gray-700 font-medium">
                Hola, {user.user_metadata?.first_name || 'Usuario'}
              </span>
              <Link 
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="outline" className="font-medium w-full">Dashboard</Button>
              </Link>
              <Button 
                onClick={async () => {
                  try {
                    await signOut();
                    setIsMenuOpen(false);
                  } catch (error) {
                    console.error('Error al cerrar sesión:', error);
                    toast({
                      title: "Error al cerrar sesión",
                      description: "No se pudo cerrar la sesión. Por favor, intenta nuevamente.",
                      variant: "destructive"
                    });
                  }
                }} 
                variant="ghost" 
                className="text-gray-600 hover:text-primary w-full"
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full"
              >
                <Button variant="outline" className="font-medium w-full">Iniciar sesión</Button>
              </Link>
              <Link 
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="w-full"
              >
                <Button className="bg-action hover:bg-action/90 text-white font-medium w-full">
                  Crear catálogo
                </Button>
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

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
        
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700 font-medium">
                Hola, {user.user_metadata?.first_name || 'Usuario'}
              </span>
              <Link to="/dashboard">
                <Button variant="outline" className="font-medium">Dashboard</Button>
              </Link>
              <Button 
                onClick={async () => {
                  try {
                    await signOut();
                  } catch (error) {
                    console.error('Error al cerrar sesión:', error);
                    toast({
                      title: "Error al cerrar sesión",
                      description: "No se pudo cerrar la sesión. Por favor, intenta nuevamente.",
                      variant: "destructive"
                    });
                  }
                }} 
                variant="ghost" 
                className="text-gray-600 hover:text-primary"
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="font-medium">Iniciar sesión</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-action hover:bg-action/90 text-white font-medium">Crear catálogo</Button>
              </Link>
            </>
          )}
        </div>
        
        {isMobile && <MobileMenu />}
      </div>
    </header>
  );
};

export default Header;
