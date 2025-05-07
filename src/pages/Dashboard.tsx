import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Package, BarChart, Eye, Users, Settings } from 'lucide-react';

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

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: "Total Productos",
      value: "24",
      icon: <Package size={20} />,
      change: "3 nuevos",
      positive: true
    },
    {
      title: "Visitas este mes",
      value: "450",
      icon: <Eye size={20} />,
      change: "+12%",
      positive: true
    },
    {
      title: "Productos más vistos",
      value: "6",
      icon: <BarChart size={20} />
    },
    {
      title: "Contactos recibidos",
      value: "18",
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Bienvenido a tu Dashboard</h1>
            <p className="text-gray-600">
              Gestiona tu catálogo y visualiza las estadísticas de tu negocio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard 
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                change={stat.change}
                positive={stat.positive}
              />
            ))}
          </div>

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
                  title={action.title}
                  description={action.description}
                  buttonText={action.buttonText}
                  to={action.to}
                  icon={action.icon}
                />
              ))}
            </div>
          </div>

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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visitas
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <tr key={item}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={`https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop`} 
                                alt="" 
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">Producto {item}</div>
                              <div className="text-sm text-gray-500">SKU-{1000 + item}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${(item * 10).toFixed(2)}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Categoría {item}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item * 15}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/dashboard/productos/${item}`} className="text-primary hover:text-primary/80 mr-4">
                            Editar
                          </Link>
                          <button className="text-red-600 hover:text-red-900">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
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
