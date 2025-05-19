import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { ImagePlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Business {
  id: string;
  user_id: string;
  name: string;
  description: string;
  contact_phone: string;
  contact_email: string;
  contact_whatsapp: string;
  logo_url: string;
  primary_color: string;
  created_at: string;
  address?: string;
  website?: string;
  instagram?: string;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estado inicial basado en la estructura de la base de datos
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    website: '',
    logo_url: '',
    primary_color: '#33C3F0',
    contact_whatsapp: '',
    instagram: ''
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Colores predefinidos
  const colorOptions = [
    { value: '#33C3F0', label: 'Azul' },
    { value: '#F97316', label: 'Naranja' },
    { value: '#10B981', label: 'Verde' },
    { value: '#8B5CF6', label: 'Púrpura' },
    { value: '#EF4444', label: 'Rojo' },
    { value: '#6366F1', label: 'Índigo' },
  ];

  // Cargar datos iniciales del negocio
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Negocio no encontrado');

        const businessData = data as Business;

        // Actualizar estados con datos de la base de datos
        setFormData({
          name: businessData.name || '',
          description: businessData.description || '',
          contact_phone: businessData.contact_phone || '',
          contact_email: businessData.contact_email || '',
          address: businessData.address || '',
          website: businessData.website || '',
          logo_url: businessData.logo_url || '',
          primary_color: businessData.primary_color || '#33C3F0',
          contact_whatsapp: businessData.contact_whatsapp || '',
          instagram: businessData.instagram || ''
        });

        if (businessData.logo_url) setLogoPreview(businessData.logo_url);
        
      } catch (error) {
        toast({
          title: "Error al cargar datos",
          description: error instanceof Error ? error.message : 'Error desconocido',
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [user]);

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar subida de logo
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Previsualización
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) setLogoPreview(e.target.result as string);
    };
    reader.readAsDataURL(file);
    setLogoFile(file);
  };

  // Subir logo a Supabase Storage
  const uploadLogo = async () => {
    if (!logoFile || !user) return;

    const filePath = `logos/${user.id}/${Date.now()}_${logoFile.name}`;
    
    const { data, error } = await supabase.storage
      .from('business-assets')
      .upload(filePath, logoFile);

    if (error) throw error;

    return supabase.storage
      .from('business-assets')
      .getPublicUrl(data.path).data.publicUrl;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let logoUrl = formData.logo_url;
      
      // Subir nuevo logo si existe
      if (logoFile) {
        logoUrl = await uploadLogo();
      }

      // Actualizar datos en Supabase
      const { error } = await supabase
        .from('businesses')
        .update({
          ...formData,
          logo_url: logoUrl,
          primary_color: formData.primary_color
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "¡Configuración guardada!",
        description: "Los cambios se han aplicado correctamente"
      });
      
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      </div>
    );
  }

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
            <form className="p-6" onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Sección Información de la Empresa */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium border-b pb-2">Información de la empresa</h2>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la empresa*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
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
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="input-field"
                      placeholder="Describe tu negocio en pocas palabras..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono de contacto*
                      </label>
                      <input
                        type="tel"
                        id="contact_phone"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="+1 234 567 890"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
                        Correo electrónico*
                      </label>
                      <input
                        type="email"
                        id="contact_email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="contacto@mitienda.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Calle, número, ciudad, país"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Sitio web
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="https://mitienda.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Sección Personalización */}
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
                            ${formData.primary_color === color.value ? 'ring-2 ring-offset-2 ring-gray-900' : 'hover:scale-105'}
                          `}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setFormData(prev => ({ ...prev, primary_color: color.value }))}
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
                        value={formData.primary_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                        className="h-8 w-8 rounded cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={formData.primary_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                        className="input-field w-28"
                      />
                    </div>
                  </div>
                </div>

                {/* Sección Redes Sociales */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium border-b pb-2">Redes sociales</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact_whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        id="contact_whatsapp"
                        name="contact_whatsapp"
                        value={formData.contact_whatsapp}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">@</span>
                        </div>
                        <input
                          type="text"
                          id="instagram"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleInputChange}
                          className="input-field pl-7"
                          placeholder="usuario"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex justify-end space-x-4">
                <Button 
                  type="submit" 
                  className="bg-action hover:bg-action/90"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar configuración"
                  )}
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