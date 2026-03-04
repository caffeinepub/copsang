import { Toaster } from "@/components/ui/sonner";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AdminGuard } from "./components/admin/AdminGuard";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { CartProvider } from "./contexts/CartContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { HomePage } from "./pages/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";

// ─── Shop Layout (with nav + footer) ──────────────────────────
function ShopLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// ─── Admin layout (login or dashboard) ────────────────────────
function AdminLoginRoute() {
  const { identity } = useInternetIdentity();
  if (identity) return <Navigate to="/admin/dashboard" />;
  return <AdminLoginPage />;
}

// ─── Routes ───────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <CartProvider>
      <Outlet />
      <Toaster />
    </CartProvider>
  ),
});

const shopLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "shop-layout",
  component: ShopLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => shopLayoutRoute,
  path: "/",
  component: HomePage,
});

const catalogRoute = createRoute({
  getParentRoute: () => shopLayoutRoute,
  path: "/catalog",
  component: CatalogPage,
});

const productRoute = createRoute({
  getParentRoute: () => shopLayoutRoute,
  path: "/product/$id",
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => shopLayoutRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => shopLayoutRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const checkoutSuccessRoute = createRoute({
  getParentRoute: () => shopLayoutRoute,
  path: "/checkout/success",
  component: CheckoutSuccessPage,
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: search.session_id as string | undefined,
  }),
});

// Admin routes (no shop nav)
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLoginRoute,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: () => (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  shopLayoutRoute.addChildren([
    homeRoute,
    catalogRoute,
    productRoute,
    cartRoute,
    checkoutRoute,
    checkoutSuccessRoute,
  ]),
  adminRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
