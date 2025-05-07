
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-soft">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <Logo size="lg" className="mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Crear una cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  required
                  className="input-field mt-1"
                  placeholder="Juan"
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  required
                  className="input-field mt-1"
                  placeholder="Pérez"
                />
              </div>
            </div>
            <div>
              <label htmlFor="business-name" className="block text-sm font-medium text-gray-700">
                Nombre de tu negocio
              </label>
              <input
                id="business-name"
                name="business-name"
                type="text"
                required
                className="input-field mt-1"
                placeholder="Mi Negocio"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field mt-1"
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="input-field mt-1"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              Acepto los <Link to="/terms" className="text-primary hover:underline">términos de servicio</Link> y la <Link to="/privacy" className="text-primary hover:underline">política de privacidad</Link>
            </label>
          </div>

          <div>
            <Button type="submit" className="w-full bg-action hover:bg-action/90">
              Crear cuenta
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
