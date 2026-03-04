import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Edit,
  LayoutDashboard,
  Loader2,
  LogOut,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type LocalProduct,
  SAMPLE_PRODUCTS,
  formatPrice,
} from "../data/products";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useIsStripeConfigured,
  useSetStripeConfiguration,
} from "../hooks/useQueries";

const ADMIN_PRODUCTS_KEY = "copsang_admin_products";

function loadAdminProducts(): LocalProduct[] {
  try {
    const stored = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    if (!stored) return [...SAMPLE_PRODUCTS];
    const parsed = JSON.parse(stored);
    return parsed.map((p: LocalProduct & { price: string; stock: string }) => ({
      ...p,
      price: BigInt(p.price),
      stock: BigInt(p.stock),
    }));
  } catch {
    return [...SAMPLE_PRODUCTS];
  }
}

function saveAdminProducts(products: LocalProduct[]) {
  const serialized = products.map((p) => ({
    ...p,
    price: p.price.toString(),
    stock: p.stock.toString(),
  }));
  localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(serialized));
}

type AdminTab = "dashboard" | "products" | "orders" | "settings";

interface AddProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  sizes: string[];
}

const DEFAULT_FORM: AddProductForm = {
  name: "",
  description: "",
  price: "",
  category: "Premium Cotton Shirts",
  stock: "",
  sizes: ["M", "L"],
};

export function AdminDashboard() {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [products, setProducts] = useState<LocalProduct[]>(loadAdminProducts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<LocalProduct | null>(null);
  const [form, setForm] = useState<AddProductForm>(DEFAULT_FORM);

  // Stripe
  const { data: stripeConfigured, refetch: refetchStripe } =
    useIsStripeConfigured();
  const setStripeConfig = useSetStripeConfiguration();
  const [stripeKey, setStripeKey] = useState("");
  const [stripeCountries, setStripeCountries] = useState("IN,US,GB");

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleSaveProduct = () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }

    const priceInPaise = BigInt(
      Math.round(Number.parseFloat(form.price) * 100),
    );
    const stockNum = BigInt(Number.parseInt(form.stock) || 0);

    if (editProduct) {
      const updated = products.map((p) =>
        p.id === editProduct.id
          ? {
              ...p,
              name: form.name,
              description: form.description,
              price: priceInPaise,
              category: form.category,
              stock: stockNum,
              sizes: form.sizes,
            }
          : p,
      );
      setProducts(updated);
      saveAdminProducts(updated);
      toast.success("Product updated");
    } else {
      const newProduct: LocalProduct = {
        id: Date.now().toString(),
        name: form.name,
        description: form.description,
        price: priceInPaise,
        category: form.category,
        stock: stockNum,
        sizes: form.sizes,
        images: ["/assets/generated/shirt-white-cotton.dim_800x900.jpg"],
        featured: false,
      };
      const updated = [...products, newProduct];
      setProducts(updated);
      saveAdminProducts(updated);
      toast.success("Product added");
    }

    setShowAddModal(false);
    setEditProduct(null);
    setForm(DEFAULT_FORM);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveAdminProducts(updated);
    toast.success("Product deleted");
  };

  const handleEditProduct = (product: LocalProduct) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: (Number(product.price) / 100).toString(),
      category: product.category,
      stock: product.stock.toString(),
      sizes: product.sizes,
    });
    setShowAddModal(true);
  };

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSaveStripe = async () => {
    if (!stripeKey.trim()) {
      toast.error("Please enter a Stripe secret key");
      return;
    }
    const countries = stripeCountries
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    try {
      await setStripeConfig.mutateAsync({
        secretKey: stripeKey,
        allowedCountries: countries,
      });
      toast.success("Stripe configured successfully");
      setStripeKey("");
      refetchStripe();
    } catch {
      toast.error("Failed to configure Stripe");
    }
  };

  const principal = identity?.getPrincipal().toString();

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <span className="font-display text-xl font-bold tracking-[0.15em] text-white uppercase">
            Copsang
          </span>
          <p className="font-body text-xs text-white/40 mt-1">Admin Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {(
            [
              { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { id: "products", icon: Package, label: "Products" },
              { id: "orders", icon: ShoppingBag, label: "Orders" },
              { id: "settings", icon: Settings, label: "Settings" },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              type="button"
              key={id}
              data-ocid={
                id === "products"
                  ? "admin.products_tab"
                  : id === "orders"
                    ? "admin.orders_tab"
                    : undefined
              }
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 font-body text-sm tracking-wide transition-colors ${
                activeTab === id
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          {principal && (
            <p className="font-body text-xs text-white/30 mb-3 truncate">
              {principal.slice(0, 16)}...
            </p>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 font-body text-sm text-white/50 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden bg-navy text-white px-4 py-4 flex items-center justify-between">
          <span className="font-display text-lg font-bold tracking-[0.15em] uppercase">
            Copsang Admin
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="text-white/60 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex overflow-x-auto bg-white border-b border-border">
          {(
            [
              { id: "dashboard", label: "Dashboard" },
              { id: "products", label: "Products" },
              { id: "orders", label: "Orders" },
              { id: "settings", label: "Settings" },
            ] as const
          ).map(({ id, label }) => (
            <button
              type="button"
              key={id}
              onClick={() => setActiveTab(id)}
              data-ocid={
                id === "products"
                  ? "admin.products_tab"
                  : id === "orders"
                    ? "admin.orders_tab"
                    : undefined
              }
              className={`px-5 py-3 font-body text-xs tracking-widest uppercase whitespace-nowrap flex-shrink-0 border-b-2 transition-colors ${
                activeTab === id
                  ? "border-navy text-navy"
                  : "border-transparent text-charcoal/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 lg:p-10 max-w-6xl">
          {/* ─── Dashboard Tab ─── */}
          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-display text-3xl font-bold text-navy mb-8">
                Dashboard
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    label: "Total Products",
                    value: products.length,
                    icon: Package,
                  },
                  { label: "Orders", value: "—", icon: ShoppingBag },
                  {
                    label: "Stripe",
                    value: stripeConfigured ? "Active" : "Not Set",
                    icon: Settings,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white border border-border p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-body text-xs text-charcoal/50 tracking-widest uppercase">
                        {stat.label}
                      </span>
                      <stat.icon className="w-5 h-5 text-gold" />
                    </div>
                    <span className="font-display text-3xl font-bold text-navy">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── Products Tab ─── */}
          {activeTab === "products" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl font-bold text-navy">
                  Products
                </h1>
                <button
                  type="button"
                  data-ocid="admin.add_product_button"
                  onClick={() => {
                    setEditProduct(null);
                    setForm(DEFAULT_FORM);
                    setShowAddModal(true);
                  }}
                  className="btn-gold flex items-center gap-2 px-5 py-3 font-body text-xs font-semibold tracking-widest uppercase text-navy"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              <div className="space-y-4">
                {products.map((product, i) => (
                  <div
                    key={product.id}
                    data-ocid={`admin.product.item.${i + 1}`}
                    className="bg-white border border-border p-4 flex items-center gap-4"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-18 object-cover flex-shrink-0 bg-cream"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base font-semibold text-navy truncate">
                        {product.name}
                      </h3>
                      <p className="font-body text-xs text-charcoal/50">
                        {product.category} · {formatPrice(product.price)} ·
                        Stock: {product.stock.toString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-charcoal/40 hover:text-navy transition-colors"
                        aria-label="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-charcoal/40 hover:text-destructive transition-colors"
                        aria-label="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── Orders Tab ─── */}
          {activeTab === "orders" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-display text-3xl font-bold text-navy mb-8">
                Orders
              </h1>
              <div className="bg-white border border-border p-12 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-border" />
                <h3 className="font-display text-xl font-semibold text-navy mb-2">
                  No orders yet
                </h3>
                <p className="font-body text-sm text-charcoal/60 max-w-sm mx-auto">
                  Once Stripe is configured and customers start purchasing,
                  orders will appear here. Configure Stripe in the Settings tab.
                </p>
              </div>
            </motion.div>
          )}

          {/* ─── Settings Tab ─── */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-xl"
            >
              <h1 className="font-display text-3xl font-bold text-navy mb-8">
                Settings
              </h1>

              <div className="bg-white border border-border p-8">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="font-display text-xl font-semibold text-navy">
                    Stripe Configuration
                  </h2>
                  {stripeConfigured ? (
                    <span className="flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs font-body px-2 py-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-body px-2 py-1">
                      <AlertTriangle className="w-3 h-3" />
                      Not Configured
                    </span>
                  )}
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="stripe-secret-key"
                      className="font-body text-xs tracking-widest uppercase text-charcoal font-semibold block mb-2"
                    >
                      Stripe Secret Key
                    </label>
                    <input
                      id="stripe-secret-key"
                      data-ocid="admin.stripe_config_input"
                      type="password"
                      value={stripeKey}
                      onChange={(e) => setStripeKey(e.target.value)}
                      placeholder="sk_test_..."
                      className="w-full border border-border px-4 py-3 font-body text-sm text-navy focus:outline-none focus:border-gold transition-colors bg-cream placeholder:text-charcoal/30"
                    />
                    <p className="font-body text-xs text-charcoal/40 mt-1.5">
                      Use <code className="bg-cream px-1 py-0.5">sk_test_</code>{" "}
                      prefix for test mode
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="stripe-countries"
                      className="font-body text-xs tracking-widest uppercase text-charcoal font-semibold block mb-2"
                    >
                      Allowed Countries (comma-separated)
                    </label>
                    <input
                      id="stripe-countries"
                      type="text"
                      value={stripeCountries}
                      onChange={(e) => setStripeCountries(e.target.value)}
                      placeholder="IN,US,GB"
                      className="w-full border border-border px-4 py-3 font-body text-sm text-navy focus:outline-none focus:border-gold transition-colors bg-cream placeholder:text-charcoal/30"
                    />
                  </div>

                  <button
                    type="button"
                    data-ocid="admin.stripe_save_button"
                    onClick={handleSaveStripe}
                    disabled={setStripeConfig.isPending}
                    className="btn-gold flex items-center gap-2 px-6 py-3 font-body text-xs font-semibold tracking-widest uppercase text-navy disabled:opacity-60"
                  >
                    {setStripeConfig.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    Save Configuration
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* ─── Add/Edit Product Modal ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-xl font-bold text-navy">
                {editProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditProduct(null);
                }}
                className="p-1 text-charcoal/40 hover:text-navy transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="product-name"
                  className="font-body text-xs tracking-widest uppercase text-charcoal font-semibold block mb-2"
                >
                  Name *
                </label>
                <input
                  id="product-name"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full border border-border px-4 py-3 font-body text-sm text-navy focus:outline-none focus:border-gold transition-colors bg-cream"
                  placeholder="Classic White Shirt"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="product-description"
                  className="font-body text-xs tracking-widest uppercase text-charcoal font-semibold block mb-2"
                >
                  Description
                </label>
                <textarea
                  id="product-description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full border border-border px-4 py-3 font-body text-sm text-navy focus:outline-none focus:border-gold transition-colors bg-cream resize-none"
                  placeholder="Describe the shirt..."
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="product-price"
                  className="font-body text-xs tracking-widest uppercase text-charcoal font-semibold block mb-2"
                >
                  Price (₹) *
                </label>
                <input
                  id="product-price"
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  className="w-full border border-border px-4 py-3 font-body text-sm text-navy focus:outline-none focus:border-gold transition-colors bg-cream"
                  placeholder="2999"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="product-category"
                  className="font-body text-xs tracking-widest uppercase text-charcoal font-semibold block mb-2"
                >
                  Category
                </label>
                <input
                  id="product-category"
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="w-full border border-border px-4 py-3 font-body text-sm text-navy focus:outline-none focus:border-gold transition-colors bg-cream"
                  placeholder="Premium Cotton Shirts"
                />
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="product-stock"
                  className="font-body text-xs tracking-widest uppercase text-charcoal font-semibold block mb-2"
                >
                  Stock
                </label>
                <input
                  id="product-stock"
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stock: e.target.value }))
                  }
                  className="w-full border border-border px-4 py-3 font-body text-sm text-navy focus:outline-none focus:border-gold transition-colors bg-cream"
                  placeholder="50"
                />
              </div>

              {/* Sizes */}
              <div>
                <span className="font-body text-xs tracking-widest uppercase text-charcoal font-semibold block mb-2">
                  Available Sizes
                </span>
                <div className="flex gap-2 flex-wrap">
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-12 h-10 font-body text-sm border transition-colors ${
                        form.sizes.includes(size)
                          ? "bg-navy text-white border-navy"
                          : "bg-white text-charcoal border-border hover:border-navy"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditProduct(null);
                }}
                className="px-5 py-3 font-body text-xs tracking-widest uppercase border border-border text-charcoal hover:border-navy hover:text-navy transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid={
                  editProduct
                    ? "admin.product.save_button"
                    : "admin.add_product_button"
                }
                onClick={handleSaveProduct}
                className="btn-gold px-5 py-3 font-body text-xs font-semibold tracking-widest uppercase text-navy"
              >
                {editProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
