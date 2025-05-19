import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Package, BarChart, Eye, Users, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  positive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, positive }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 font-medium">{title}</span>
        <span className="text-primary p-2 bg-primary/10 rounded-lg">{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {change && (
          <span className={`text-sm ${positive ? 'text-green-500' : 'text-red-500'}`}>
            {positive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
    </div>
  );
};

interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  to: string;
  icon: React.ReactNode;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, buttonText, to, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-soft">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-primary p-3 bg-primary/10 rounded-lg">{icon}</span>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button asChild>
        <Link to={to}>{buttonText}</Link>
      </Button>
    </div>
  );
};

interface Product {
  id: string;
  name: string;
  price: number;
  category_id: string;
  stock: number;
  image_url: string;
  category?: {
    name: string;
  };
}

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [business, setBusiness] = useState<any>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statsData, setStatsData] = useState({
      totalProducts: 0,
      monthlyVisits: 0,
      topProducts: 0,
      contacts: 0
    });
  
    useEffect(() => {
      let isMounted = true; // Para prevenir estado en componente desmontado
      
      const fetchBusinessData = async () => {
        if (!user) {
          if (isMounted) setLoading(false);
          return;
        }
  
        try {
          // 1. Obtener información del negocio
          const { data: businessData, error: businessError } = await supabase
            .from('businesses')
            .select('*')
            .eq('user_id', user.id)
            .single();
  
          if (businessError || !businessData) {
            throw new Error(businessError?.message || 'Negocio no encontrado');
          }
  
          if (!isMounted) return;
  
          setBusiness(businessData);
  
          // 2. Obtener productos del negocio
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*, category:categories(name)')
            .eq('business_id', businessData.id)
            .order('created_at', { ascending: false })
            .limit(5);
  
          if (productsError) throw productsError;
          if (isMounted) setProducts(productsData || []);
  
          // 3. Obtener estadísticas
          const { count: totalProducts } = await supabase
            .from('products')
            .select('*', { count: 'exact' })
            .eq('business_id', businessData.id);
  
          if (isMounted) {
            setStatsData(prev => ({
              ...prev,
              totalProducts: totalProducts || 0
            }));
          }
  
        } catch (error) {
          if (isMounted) {
            console.error('Error fetching data:', error);
            setError(error instanceof Error ? error.message : 'Error desconocido');
            
            // Redirigir solo si es error de negocio no encontrado
            if (error instanceof Error && error.message.includes('Negocio no encontrado')) {
              window.location.href = '/create-business';
            }
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      };
  
      setLoading(true);
      fetchBusinessData();
  
      return () => {
        isMounted = false; // Limpiar al desmontar
      };
    }, [user]);
    
  const stats = [
    {
      title: "Total Productos",
      value: statsData.totalProducts.toString(),
      icon: <Package size={20} />,
      change: "+3 nuevos",
      positive: true
    },
    {
      title: "Visitas este mes",
      value: statsData.monthlyVisits.toString(),
      icon: <Eye size={20} />,
      change: "+12%",
      positive: true
    },
    {
      title: "Productos más vistos",
      value: statsData.topProducts.toString(),
      icon: <BarChart size={20} />
    },
    {
      title: "Contactos recibidos",
      value: statsData.contacts.toString(),
      icon: <Users size={20} />,
      change: "+5",
      positive: true
    }
  ];

  const actions = [
    {
      title: "Agregar nuevos productos",
      description: "Añade productos a tu catálogo de forma rápida y sencilla.",
      buttonText: "Añadir productos",
      to: "/dashboard/productos/nuevo",
      icon: <Package size={24} />
    },
    {
      title: "Personalizar catálogo",
      description: "Cambia colores, logo y estilos para adaptarlo a tu marca.",
      buttonText: "Personalizar",
      to: "/dashboard/configuracion",
      icon: <Settings size={24} />
    }
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8">
          <div className="animate-pulse space-y-4">
            {/* Esqueleto de carga */}
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              Bienvenido a {business?.name || 'tu Dashboard'}
            </h1>
            <p className="text-gray-600">
              {business?.description || 'Gestiona tu catálogo y visualiza las estadísticas'}
            </p>
          </div>
          
          {/* Sección de Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard 
                key={index}
                {...stat}
              />
            ))}
          </div>

          {/* Acciones Rápidas */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Acciones Rápidas</h2>
              <Link to="/dashboard/productos" className="text-primary hover:underline">
                Ver todos los productos
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {actions.map((action, index) => (
                <ActionCard 
                  key={index}
                  {...action}
                />
              ))}
            </div>
          </div>

          {/* Productos Recientes */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Productos recientes</h2>
              <Link to="/dashboard/productos" className="text-primary hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      {['Producto', 'Precio', 'Categoría', 'Stock', 'Acciones'].map((header) => (
                        <th 
                          key={header}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={product.image_url || 'https://via.placeholder.com/500'} 
                                alt={product.name} 
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${product.price.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {product.category?.name || 'Sin categoría'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.stock}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            to={`/dashboard/productos/${product.id}`} 
                            className="text-primary hover:text-primary/80 mr-4"
                          >
                            Editar
                          </Link>
                          <button className="text-red-600 hover:text-red-900">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500">
                          No hay productos registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;