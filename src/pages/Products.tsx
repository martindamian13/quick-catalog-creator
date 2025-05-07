
import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';

const Products: React.FC = () => {
  const products = Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    name: `Producto ${index + 1}`,
    description: `Descripción breve del producto ${index + 1}`,
    price: (Math.random() * 100 + 10).toFixed(2),
    category: `Categoría ${Math.floor(Math.random() * 5) + 1}`,
    stock: Math.floor(Math.random() * 100),
    image: `https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop`
  }));

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">Productos</h1>
              <p className="text-gray-600">Administra los productos de tu catálogo</p>
            </div>
            <Button className="flex items-center gap-2 bg-action hover:bg-action/90" asChild>
              <Link to="/dashboard/productos/nuevo">
                <Plus size={18} />
                <span>Agregar producto</span>
              </Link>
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <div className="p-6 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Buscar productos por nombre, SKU o descripción..."
                    className="input-field pl-10"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <select className="input-field appearance-none">
                      <option value="">Todas las categorías</option>
                      <option value="1">Categoría 1</option>
                      <option value="2">Categoría 2</option>
                      <option value="3">Categoría 3</option>
                      <option value="4">Categoría 4</option>
                      <option value="5">Categoría 5</option>
                    </select>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter size={18} />
                    <span>Filtrar</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      Precio <span className="inline-flex flex-col"><ArrowUp size={10} /><ArrowDown size={10} /></span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-14 w-14 flex-shrink-0">
                            <img 
                              className="h-14 w-14 rounded-md object-cover" 
                              src={product.image} 
                              alt={product.name} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${product.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{product.stock} unidades</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> - <span className="font-medium">15</span> de <span className="font-medium">50</span> productos
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm">
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
