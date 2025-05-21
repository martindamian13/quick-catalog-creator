import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBusinessId();
    }
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [user, id]);

  const fetchBusinessId = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setBusinessId(data.id);
    } catch (err) {
      console.error('Error al obtener el ID del negocio:', err);
      setError('Error al obtener el ID del negocio');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError('Error al cargar las categorías');
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setFormData({
          name: data.name,
          description: data.description || '',
          price: data.price.toString(),
          stock: data.stock?.toString() || '',
          category_id: data.category_id,
        });
        if (data.image_url) {
          setImagePreview(data.image_url);
        }
      }
    } catch (err) {
      console.error('Error al cargar el producto:', err);
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) {
      setError('No se pudo obtener el ID del negocio');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: formData.stock ? parseInt(formData.stock) : null,
        category_id: formData.category_id,
        business_id: businessId,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;
      }

      navigate('/dashboard/productos');
    } catch (err) {
      console.error('Error al guardar el producto:', err);
      setError('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || !businessId) return;

    setIsCreatingCategory(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([
          { 
            name: newCategoryName.trim(),
            business_id: businessId
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, data]);
      setFormData(prev => ({ ...prev, category_id: data.id }));
      setNewCategoryName('');
      setIsCategoryModalOpen(false);
    } catch (err) {
      console.error('Error al crear la categoría:', err);
      setError('Error al crear la categoría');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
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
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Link to="/dashboard/productos" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold">
                {isEditing ? 'Editar producto' : 'Agregar producto'}
              </h1>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <form className="p-6" onSubmit={handleSubmit}>
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
                        value={formData.name}
                        onChange={handleInputChange}
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
                        value={formData.description}
                        onChange={handleInputChange}
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
                            <span className="text-gray-500 sm:text-sm">Gs.</span>
                          </div>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            className="input-field pl-9"
                            placeholder="0"
                            step="100"
                            min="0"
                            value={formData.price}
                            onChange={handleInputChange}
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
                          value={formData.stock}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría*
                      </label>
                      <div className="flex gap-2">
                        <select
                          id="category_id"
                          name="category_id"
                          className="input-field flex-1"
                          value={formData.category_id}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecciona una categoría</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setIsCategoryModalOpen(true)}
                          className="flex-shrink-0"
                        >
                          <Plus size={18} />
                        </Button>
                      </div>
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
                <Button 
                  type="submit" 
                  className="bg-action hover:bg-action/90"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : isEditing ? 'Actualizar producto' : 'Guardar producto'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nueva categoría</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              className="input-field w-full"
              placeholder="Nombre de la categoría"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim() || isCreatingCategory}
              className="bg-action hover:bg-action/90"
            >
              {isCreatingCategory ? 'Creando...' : 'Crear categoría'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductForm;


