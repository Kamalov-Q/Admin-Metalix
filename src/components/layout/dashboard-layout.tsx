import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Newspaper,
    MessageSquare,
    Star,
    Briefcase,
    LogOut,
    Menu,
    X,
    FolderKanban,
    Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Categories', href: '/categories', icon: FolderTree },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'News', href: '/news', icon: Newspaper },
    { name: 'Requests', href: '/requests', icon: MessageSquare },
    { name: 'Reviews', href: '/reviews', icon: Star },
    { name: 'Careers', href: '/careers', icon: FolderKanban },
    { name: 'Portfolios', href: '/portfolios', icon: Briefcase },
    { name: 'Projects', href: '/projects', icon: Rocket },
];

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { sidebarOpen, toggleSidebar } = useUIStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background">
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center justify-between px-6 border-b">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-lg font-bold text-primary-foreground">M</span>
                            </div>
                            <span className="text-xl font-bold">Metalix</span>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t p-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                    {user?.fullName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.fullName}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            <div className={cn('transition-all duration-300', sidebarOpen ? 'lg:pl-64' : '')}>
                <header className="sticky top-0 z-40 h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className={cn(!sidebarOpen && 'lg:block')}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </header>

                <main className="p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
}