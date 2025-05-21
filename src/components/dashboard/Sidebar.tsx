import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Users,
  BarChart,
  Eye
} from 'lucide-react';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to, active }) => {
  return (
    <Link 
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors",
        active && "bg-primary/10 text-primary font-medium"
      )}
    >
      <span className="text-current">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const { signOut } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Inicio", to: "/dashboard" },
    { icon: <Package size={20} />, label: "Productos", to: "/dashboard/productos" },
    { icon: <Users size={20} />, label: "Clientes", to: "/dashboard/clientes" },
    { icon: <BarChart size={20} />, label: "Estadísticas", to: "/dashboard/estadisticas" },
    { icon: <Settings size={20} />, label: "Configuración", to: "/dashboard/configuracion" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast({
        title: "Error al cerrar sesión",
        description: "No se pudo cerrar la sesión. Por favor, intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <aside className="w-64 hidden md:flex flex-col h-screen border-r bg-white">
      <div className="p-5 flex items-center border-b">
        <Logo />
      </div>

      <div className="px-3 py-6 flex-1">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={path === item.to}
            />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <Link to="/dashboard/preview" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors mb-4">
          <Eye size={18} />
          <span>Ver catálogo público</span>
        </Link>
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 justify-center"
          onClick={handleSignOut}
        >
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
