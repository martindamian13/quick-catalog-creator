
import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { ImagePlus } from 'lucide-react';

const Settings: React.FC = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#33C3F0');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const colorOptions = [
    { value: '#33C3F0', label: 'Azul' },
    { value: '#F97316', label: 'Naranja' },
    { value: '#10B981', label: 'Verde' },
    { value: '#8B5CF6', label: 'Púrpura' },
    { value: '#EF4444', label: 'Rojo' },
    { value: '#6366F1', label: 'Índigo' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Configuración del catálogo</h1>
            <p className="text-gray-600">Personaliza la apariencia y datos de tu catálogo</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-soft">
            <form className="p-6">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium border-b pb-2">Información de la empresa</h2>
                  
                  <div>
                    <label htmlFor="business-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la empresa o tienda*
                    </label>
                    <input
                      type="text"
                      id="business-name"
                      name="business-name"
                      className="input-field"
                      placeholder="Ej: Mi Tienda Online"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción corta
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="input-field"
                      placeholder="Describe tu negocio en pocas palabras..."
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono de contacto
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="input-field"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Correo electrónico de contacto
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="input-field"
                        placeholder="contacto@mitienda.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección (opcional)
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className="input-field"
                        placeholder="Calle, número, ciudad, país"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Sitio web (opcional)
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        className="input-field"
                        placeholder="https://mitienda.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-lg font-medium border-b pb-2">Personalización</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Logo de la empresa
                    </label>
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                        {logoPreview ? (
                          <img 
                            src={logoPreview} 
                            alt="Logo de la empresa" 
                            className="max-w-full max-h-full object-contain" 
                          />
                        ) : (
                          <span className="text-gray-400 text-xs text-center p-2">Sin logo</span>
                        )}
                      </div>
                      <div>
                        <label 
                          htmlFor="logo-upload" 
                          className="cursor-pointer inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/20 transition-colors"
                        >
                          <ImagePlus size={18} />
                          <span>Subir logo</span>
                        </label>
                        <input
                          id="logo-upload"
                          name="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG o SVG. Recomendado: 200x200px</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Color principal
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          className={`
                            h-12 rounded-lg transition-all flex flex-col items-center justify-center
                            ${primaryColor === color.value ? 'ring-2 ring-offset-2 ring-gray-900' : 'hover:scale-105'}
                          `}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setPrimaryColor(color.value)}
                        >
                          <span className="sr-only">{color.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <label htmlFor="custom-color" className="text-sm text-gray-700">
                        Personalizado:
                      </label>
                      <input
                        type="color"
                        id="custom-color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="input-field w-28"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Vista previa
                    </label>
                    <div 
                      className="border rounded-lg p-6 bg-gray-50"
                      style={{ '--example-color': primaryColor } as React.CSSProperties}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {logoPreview ? (
                          <img 
                            src={logoPreview} 
                            alt="Logo" 
                            className="w-12 h-12 object-contain" 
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">Logo</div>
                        )}
                        <h3 className="font-medium text-lg">Mi Tienda Online</h3>
                      </div>
                      <div className="flex space-x-4">
                        <div 
                          className="rounded-lg p-3 text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Botón principal
                        </div>
                        <div 
                          className="rounded-lg p-3 border-2 transition-colors"
                          style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                          Botón secundario
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-lg font-medium border-b pb-2">Redes sociales</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                        WhatsApp para contacto
                      </label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        className="input-field"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram (opcional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">@</span>
                        </div>
                        <input
                          type="text"
                          id="instagram"
                          name="instagram"
                          className="input-field pl-7"
                          placeholder="usuario"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex justify-end space-x-4">
                <Button variant="outline">Cancelar cambios</Button>
                <Button type="submit" className="bg-action hover:bg-action/90">
                  Guardar configuración
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
