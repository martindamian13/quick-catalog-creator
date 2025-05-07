
import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, ImagePlus } from 'lucide-react';

const ProductForm: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Link to="/dashboard/productos" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold">Agregar producto</h1>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <form className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium">Información del producto</h2>
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del producto*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input-field"
                        placeholder="Ej: Camiseta de algodón"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción*
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="input-field"
                        placeholder="Describe tu producto..."
                        required
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                          Precio*
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            className="input-field pl-7"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                          Existencias
                        </label>
                        <input
                          type="number"
                          id="stock"
                          name="stock"
                          className="input-field"
                          placeholder="Cantidad disponible"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría*
                      </label>
                      <select
                        id="category"
                        name="category"
                        className="input-field"
                        required
                      >
                        <option value="">Selecciona una categoría</option>
                        <option value="1">Categoría 1</option>
                        <option value="2">Categoría 2</option>
                        <option value="3">Categoría 3</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                        SKU/Código (Opcional)
                      </label>
                      <input
                        type="text"
                        id="sku"
                        name="sku"
                        className="input-field"
                        placeholder="Ej: CAM-001"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Imagen del producto</h2>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Vista previa" 
                          className="mx-auto h-48 w-full object-contain rounded-md" 
                        />
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="absolute top-2 right-2 bg-white text-gray-700 rounded-full h-6 w-6 flex items-center justify-center hover:bg-gray-100"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="py-8">
                        <div className="flex flex-col items-center">
                          <ImagePlus size={36} className="text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-4">
                            Arrastra y suelta una imagen o
                          </p>
                          <label 
                            htmlFor="image-upload" 
                            className="cursor-pointer bg-primary/10 text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/20 transition-colors"
                          >
                            Seleccionar archivo
                          </label>
                          <input
                            id="image-upload"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <p className="text-xs text-gray-500 mt-2">PNG, JPG o GIF (Máx. 2MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  asChild
                >
                  <Link to="/dashboard/productos">Cancelar</Link>
                </Button>
                <Button type="submit" className="bg-action hover:bg-action/90">
                  Guardar producto
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
