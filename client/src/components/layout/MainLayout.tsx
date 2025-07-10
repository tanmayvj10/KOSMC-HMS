
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu,
  Bed,
  Users,
  FileText,
  UserCog,
  Coffee
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  role?: string[];
  currentRole?: string;
}

const NavItem = ({ icon, label, href, isActive, role, currentRole }: NavItemProps) => {
  // Check if current role has access to this item
  if (role && currentRole && !role.includes(currentRole)) {
    return null;
  }
  
  return (
    <Link to={href} className="w-full">
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start gap-3 font-normal",
          isActive ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : ""
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

interface MainLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

const MainLayout = ({ children, onLogout }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const currentPath = location.pathname;
  const { toast } = useToast();
  
  // Get user role from localStorage (default to admin if not set)
  const userRole = localStorage.getItem("userRole") || "admin";
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    
    if (onLogout) {
      onLogout();
    }
    
    navigate("/");
  };
  
  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', href: '/', role: ["admin", "manager", "restaurant"] },
    { icon: <Bed size={20} />, label: 'Rooms', href: '/rooms', role: ["admin", "manager"] },
    { icon: <Calendar size={20} />, label: 'Reservations', href: '/reservations', role: ["admin", "manager"] },
    { icon: <Users size={20} />, label: 'Guests', href: '/guests', role: ["admin", "manager"] },
    { icon: <Coffee size={20} />, label: 'Services', href: '/services', role: ["admin", "manager", "restaurant"] },
    { icon: <UserCog size={20} />, label: 'Staff', href: '/staff', role: ["admin"] },
    { icon: <FileText size={20} />, label: 'Billing', href: '/billing', role: ["admin", "manager"] },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings', role: ["admin"] },
  ];
  
  const navigation = (
    <div className="flex flex-col space-y-1 p-4">
      <div className="flex items-center justify-center mb-6 flex-col">
        <img 
          src="/lovable-uploads/f5add750-5ed0-4ef9-b6d3-731367a10eae.png" 
          alt="KOSMC Hotel Logo" 
          className="h-16 w-16 mb-2"
        />
        <div className="font-display font-bold text-xl text-primary">KOSMC Hotel</div>
        <div className="text-xs text-muted-foreground">Luxury & Comfort</div>
      </div>
      
      <div className="mb-4 bg-muted p-2 rounded-md text-center">
        <div className="text-sm font-medium">Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
      </div>
      
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          isActive={currentPath === item.href}
          role={item.role}
          currentRole={userRole}
        />
      ))}
      <div className="mt-auto pt-6">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="flex h-screen bg-background">
      {!isMobile && (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r">
          {navigation}
        </div>
      )}
      
      <div className="flex flex-col flex-1 md:pl-64">
        {isMobile && (
          <div className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 border-b">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/f5add750-5ed0-4ef9-b6d3-731367a10eae.png" 
                alt="KOSMC Hotel Logo" 
                className="h-8 w-8"
              />
              <div className="font-display font-bold text-lg text-primary">KOSMC Hotel</div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                {navigation}
              </SheetContent>
            </Sheet>
          </div>
        )}
        
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
