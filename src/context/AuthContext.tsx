import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  signUp: (
    email: string, 
    password: string, 
    metadata: { 
      first_name: string; 
      last_name: string; 
      business_name: string 
    }
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthProvider: Inicializando...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Evento de autenticación:', event, session?.user?.id);
        
        // Solo actualizar el estado si no estamos en proceso de cierre de sesión
        if (event !== 'SIGNED_OUT') {
          setSession(session);
          setUser(session?.user ?? null);
        }
        
        // Manejar notificaciones de cambio de estado
        if (event === 'SIGNED_IN' && !session) {
          console.log('AuthProvider: Usuario inició sesión');
          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión correctamente."
          });
        } else if (event === 'SIGNED_OUT') {
          console.log('AuthProvider: Usuario cerró sesión');
          toast({
            title: "¡Hasta pronto!",
            description: "Has cerrado sesión correctamente."
          });
        }
      }
    );

    // Cargar sesión inicial
    const loadSession = async () => {
      console.log('AuthProvider: Cargando sesión inicial...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('AuthProvider: Error al cargar sesión:', error);
          throw error;
        }
        
        console.log('AuthProvider: Sesión cargada:', session?.user?.id);
        if (session) {
          setSession(session);
          setUser(session.user);
        }
      } catch (error) {
        console.error('AuthProvider: Error en loadSession:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
    return () => {
      console.log('AuthProvider: Limpiando suscripción');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    metadata: { 
      first_name: string; 
      last_name: string; 
      business_name: string 
    }
  ) => {
    try {
      console.log('Iniciando registro con:', { email, metadata });
      
      // Paso 1: Crear usuario en autenticación
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: metadata.first_name,
            last_name: metadata.last_name
          }
        }
      });

      if (authError) {
        console.error('Error en autenticación:', authError);
        throw authError;
      }
      
      if (!user) {
        console.error('No se recibió usuario después del registro');
        throw new Error('Error al crear usuario: No se recibió respuesta del servidor');
      }

      console.log('Usuario creado exitosamente:', user.id);

      // Paso 2: Crear registro en tabla pública users
      const { error: userError } = await supabase.from('users').insert({
        id: user.id,
        first_name: metadata.first_name,
        last_name: metadata.last_name,
        accepted_terms: true
      });

      if (userError) {
        console.error('Error al crear perfil de usuario:', userError);
        throw userError;
      }

      console.log('Perfil de usuario creado exitosamente');

      // Paso 3: Crear negocio asociado
      const { error: businessError } = await supabase.from('businesses').insert({
        user_id: user.id,
        name: metadata.business_name,
        primary_color: '#33C3F0' // Color por defecto
      });

      if (businessError) {
        console.error('Error al crear negocio:', businessError);
        throw businessError;
      }

      console.log('Negocio creado exitosamente');

      // Notificación y redirección
      toast({
        title: "¡Cuenta creada con éxito!",
        description: "Bienvenido a tu nuevo negocio virtual"
      });
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Error completo en el registro:', error);
      
      // Mensaje de error más descriptivo
      let errorMessage = 'Error desconocido';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      } else if (error.details) {
        errorMessage = error.details;
      }
      
      toast({
        title: "Error en el registro",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Intentando iniciar sesión con:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('AuthProvider: Error en signIn:', error);
        throw error;
      }

      console.log('AuthProvider: Inicio de sesión exitoso:', data.user?.id);
      
      // Verificar si el usuario tiene negocio creado
      if (data.user) {
        try {
          console.log('AuthProvider: Verificando negocio para usuario:', data.user.id);
          const { data: business, error: businessError } = await supabase
            .from('businesses')
            .select('*')
            .eq('user_id', data.user.id)
            .single();
          
          if (businessError) {
            console.error('AuthProvider: Error al verificar negocio:', businessError);
            throw businessError;
          }
        
          if (!business) {
            console.log('AuthProvider: No se encontró negocio, redirigiendo a crear negocio');
            navigate('/create-business');
          } else {
            console.log('AuthProvider: Negocio encontrado:', business.id);
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('AuthProvider: Error al verificar negocio:', error);
          throw error;
        }
      }
    } catch (error: any) {
      console.error('AuthProvider: Error completo en signIn:', error);
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Limpiar el estado local primero
      setUser(null);
      setSession(null);
      
      // Limpiar el almacenamiento local
      localStorage.clear();
      sessionStorage.clear();
      
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Forzar una recarga limpia de la página
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Error al cerrar sesión",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
    setUser,
    setSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};