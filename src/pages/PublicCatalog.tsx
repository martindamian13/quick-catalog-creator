
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageSquare } from 'lucide-react';

const PublicCatalog: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  
  // Datos de ejemplo
  const businessInfo = {
    name: "Mi Tienda Online",
    logo: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    description: "Ofrecemos productos de calidad para nuestros clientes. Envíos a toda la ciudad.",
    primaryColor: "#33C3F0",
    contact: {
      phone: "+595 973 229 057",
      email: "martinquintana668@gmail.com",
      whatsapp: "+595 973 229 057"
    }
  };
  
  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'cat1', name: 'Categoría 1' },
    { id: 'cat2', name: 'Categoría 2' },
    { id: 'cat3', name: 'Categoría 3' },
  ];
  
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Producto ${i + 1}`,
    description: `Descripción del producto ${i + 1}. Características y detalles importantes.`,
    price: (Math.random() * 100 + 10).toFixed(2),
    image: `https://images.unsplash.com/photo-1618160702438-9b02ab6515c9`,
    category: `cat${(i % 3) + 1}`
  }));
  
  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(product => product.category === category);

  return (
    <div className="min-h-screen" style={{ 
      "--catalog-primary": businessInfo.primaryColor,
      "--catalog-primary-light": `${businessInfo.primaryColor}10`
    } as React.CSSProperties}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {businessInfo.logo && (
                <img 
                  src={businessInfo.logo} 
                  alt={businessInfo.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <h1 className="text-xl font-bold">{businessInfo.name}</h1>
            </div>
            
            <div className="flex items-center gap-2">
              {businessInfo.contact.whatsapp && (
                <a 
                  href={`https://wa.me/${businessInfo.contact.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: businessInfo.primaryColor }}
                >
                  <MessageSquare size={20} />
                </a>
              )}
              
              {businessInfo.contact.phone && (
                <a 
                  href={`tel:${businessInfo.contact.phone}`}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: businessInfo.primaryColor }}
                >
                  <Phone size={20} />
                </a>
              )}
              
              {businessInfo.contact.email && (
                <a 
                  href={`mailto:${businessInfo.contact.email}`}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: businessInfo.primaryColor }}
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
        style={{ backgroundColor: `${businessInfo.primaryColor}10` }}
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
                  backgroundColor: category === cat.id ? businessInfo.primaryColor : 'transparent',
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
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mt-1 mb-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold" style={{ color: businessInfo.primaryColor }}>
                      ${product.price}
                    </span>
                    
                    {businessInfo.contact.whatsapp && (
                      <a
                        href={`https://wa.me/${businessInfo.contact.whatsapp.replace(/\D/g, '')}?text=Hola, me interesa: ${product.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button 
                          size="sm" 
                          className="px-3 py-1"
                          style={{ 
                            backgroundColor: businessInfo.primaryColor,
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
        style={{ backgroundColor: `${businessInfo.primaryColor}10` }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold mb-4">Contáctanos</h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {businessInfo.contact.phone && (
              <a 
                href={`tel:${businessInfo.contact.phone}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-soft hover:shadow-card transition-all"
              >
                <Phone size={18} style={{ color: businessInfo.primaryColor }} />
                <span>{businessInfo.contact.phone}</span>
              </a>
            )}
            
            {businessInfo.contact.whatsapp && (
              <a 
                href={`https://wa.me/${businessInfo.contact.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-soft hover:shadow-card transition-all"
              >
                <MessageSquare size={18} style={{ color: businessInfo.primaryColor }} />
                <span>WhatsApp</span>
              </a>
            )}
            
            {businessInfo.contact.email && (
              <a 
                href={`mailto:${businessInfo.contact.email}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-soft hover:shadow-card transition-all"
              >
                <Mail size={18} style={{ color: businessInfo.primaryColor }} />
                <span>{businessInfo.contact.email}</span>
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
