import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/query-client';
import { useAuthStore } from './stores/auth-store';
import { useEffect, useState } from 'react';
import LoginPage from './pages/Login';
import DashboardLayout from './components/layout/dashboard-layout';
import DashboardPage from './pages/Dashboard';
import CategoriesPage from './pages/Category';
import ProductsPage from './pages/Product';
import NewsPage from './pages/News';
import RequestsPage from './pages/Request';
import ReviewsPage from './pages/Review';
import CareersPage from './pages/Career';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    useAuthStore.getState().initialize();
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="careers" element={<CareersPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;