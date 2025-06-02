import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useParams, useLocation } from 'react-router-dom';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Business = Database['public']['Tables']['businesses']['Row'];

const PublicCatalog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [category, setCategory] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [businessInfo, setBusinessInfo] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      console.log('ID from params:', id);
      console.log('Current location:', location.pathname);

      if (!id) {
        setError('ID del negocio no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Cargar información del negocio
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', id)
          .single();

        if (businessError) throw businessError;
        if (!businessData) {
          throw new Error('Negocio no encontrado');
        }
        setBusinessInfo(businessData);

        // Cargar productos
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('business_id', id)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);

        // Cargar categorías
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('business_id', id)
          .order('name');

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

      } catch (err) {
        console.error('Error al cargar los datos:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, location]);

  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(product => product.category_id === category);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !businessInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error || 'No se encontró la información del negocio'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ 
      "--catalog-primary": businessInfo.primary_color || "#55C3F0",
      "--catalog-primary-light": `${businessInfo.primary_color || "#55C3F0"}10`
    } as React.CSSProperties}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {businessInfo.logo_url && (
                <img 
                  src={businessInfo.logo_url} 
                  alt={businessInfo.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <h1 className="text-xl font-bold">{businessInfo.name}</h1>
            </div>
            
            <div className="flex items-center gap-2">
              {businessInfo.contact_whatsapp && (
                <a 
                  href={`https://wa.me/${businessInfo.contact_whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: businessInfo.primary_color || "#55C3F0" }}
                >
                  <MessageSquare size={20} />
                </a>
              )}
              
              {businessInfo.contact_phone && (
                <a 
                  href={`tel:${businessInfo.contact_phone}`}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: businessInfo.primary_color || "#55C3F0" }}
                >
                  <Phone size={20} />
                </a>
              )}
              
              {businessInfo.contact_email && (
                <a 
                  href={`mailto:${businessInfo.contact_email}`}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: businessInfo.primary_color || "#55C3F0" }}
                >
                  <Mail size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section 
        className="py-10 px-4"
        style={{ backgroundColor: `${businessInfo.primary_color || "#55C3F0"}10` }}
      >
        <div className="container mx-auto">
          <p className="text-center text-lg max-w-2xl mx-auto">
            {businessInfo.description}
          </p>
        </div>
      </section>
      
      {/* Category filter */}
      <section className="py-6 border-b sticky top-[72px] bg-white z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
            <button
              key="all"
              onClick={() => setCategory('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                category === 'all'
                  ? 'text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={{ 
                backgroundColor: category === 'all' ? businessInfo.primary_color || "#55C3F0" : 'transparent',
                color: category === 'all' ? 'white' : 'inherit'
              }}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  category === cat.id
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{ 
                  backgroundColor: category === cat.id ? businessInfo.primary_color || "#55C3F0" : 'transparent',
                  color: category === cat.id ? 'white' : 'inherit'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Products grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg overflow-hidden shadow-soft hover:shadow-card transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image_url || 'https://via.placeholder.com/500'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mt-1 mb-2">
                    {product.description}
                  </p>
                  <div className="flex flex-col items-center justify-between">
                    <span className="font-bold" style={{ color: businessInfo.primary_color || "#55C3F0" }}>
                      ${product.price}
                    </span>
                    
                    {businessInfo.contact_whatsapp && (
                      <a
                        href={`https://wa.me/${businessInfo.contact_whatsapp.replace(/\D/g, '')}?text=Hola, me interesa: ${product.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button 
                          size="sm" 
                          className="px-3 py-1"
                          style={{ 
                            backgroundColor: businessInfo.primary_color || "#55C3F0",
                            color: "white"
                          }}
                        >
                          <MessageSquare size={14} className="mr-1" />
                          <span className="text-xs">Consultar</span>
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact footer */}
      <footer 
        className="py-8"
        style={{ backgroundColor: `${businessInfo.primary_color || "#55C3F0"}10` }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold mb-4">Contáctanos</h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {businessInfo.contact_phone && (
              <a 
                href={`tel:${businessInfo.contact_phone}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-soft hover:shadow-card transition-all"
              >
                <Phone size={18} style={{ color: businessInfo.primary_color || "#55C3F0" }} />
                <span>{businessInfo.contact_phone}</span>
              </a>
            )}
            
            {businessInfo.contact_whatsapp && (
              <a 
                href={`https://wa.me/${businessInfo.contact_whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-soft hover:shadow-card transition-all"
              >
                <MessageSquare size={18} style={{ color: businessInfo.primary_color || "#55C3F0" }} />
                <span>WhatsApp</span>
              </a>
            )}
            
            {businessInfo.contact_email && (
              <a 
                href={`mailto:${businessInfo.contact_email}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-soft hover:shadow-card transition-all"
              >
                <Mail size={18} style={{ color: businessInfo.primary_color || "#55C3F0" }} />
                <span>{businessInfo.contact_email}</span>
              </a>
            )}
          </div>
          
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {businessInfo.name}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicCatalog;
