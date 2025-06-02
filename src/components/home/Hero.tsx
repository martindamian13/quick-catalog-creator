import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-white -z-10"></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-bold mb-6 leading-tight">
              <span className="text-gray-800">Crea tu catálogo online</span>
              <br />
              <span className="text-primary">en minutos</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-lg">
              La forma más sencilla de crear un catálogo digital para tu negocio o emprendimiento y compartirlo con un simple enlace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/register">
                <Button size="lg" className="bg-action hover:bg-action/90 text-white font-medium">
                  Empezar ahora
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg">
                  Ver demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <img 
                src="/images/web-catalog.png" 
                alt="Catálogo en laptop y móvil" 
                className="rounded-lg shadow-2xl w-full h-auto object-contain"
              />
              <div className="absolute -bottom-4 -right-8 md:bottom-[-25%] md:right-[-5%] w-[45%]">
                <img 
                  src="/images/movil-catalog.png" 
                  alt="Vista móvil del catálogo" 
                  className="rounded-lg shadow-xl w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
