import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { SAMPLE_PRODUCTS, formatPrice } from "../data/products";

export function CatalogPage() {
  const { addItem } = useCart();

  const handleAddToCart = (product: (typeof SAMPLE_PRODUCTS)[0]) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: "M",
      quantity: 1,
      image: product.images[0],
    });
    toast.success(`${product.name} added to cart`, {
      description: "Size M • You can change size on the product page",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-cream border-b border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-body text-gold tracking-[0.3em] uppercase text-xs mb-3">
              All Products
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-navy">
              The Collection
            </h1>
            <p className="font-body text-charcoal/60 mt-3 text-sm">
              {SAMPLE_PRODUCTS.length} styles available
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {SAMPLE_PRODUCTS.length === 0 ? (
          <div
            data-ocid="catalog.empty_state"
            className="text-center py-24 text-charcoal/50"
          >
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-display text-lg">No products yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SAMPLE_PRODUCTS.map((product, i) => (
              <motion.article
                key={product.id}
                data-ocid={`catalog.product_card.${i + 1}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group bg-white product-card-hover overflow-hidden border border-border hover:border-navy/20"
              >
                {/* Image */}
                <Link
                  to="/product/$id"
                  params={{ id: product.id }}
                  className="block relative overflow-hidden aspect-[4/5]"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/5 transition-colors duration-300" />
                </Link>

                {/* Body */}
                <div className="p-5 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="block font-body text-xs text-gold tracking-widest uppercase mb-1">
                        {product.category}
                      </span>
                      <Link to="/product/$id" params={{ id: product.id }}>
                        <h2 className="font-display text-lg font-semibold text-navy leading-snug hover:text-charcoal transition-colors truncate">
                          {product.name}
                        </h2>
                      </Link>
                    </div>
                    <span className="font-body text-base font-semibold text-charcoal whitespace-nowrap">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  {/* Sizes row */}
                  <div className="flex gap-1.5 flex-wrap">
                    {product.sizes.map((s) => (
                      <span
                        key={s}
                        className="font-body text-[10px] text-charcoal/50 tracking-wide border border-border px-1.5 py-0.5"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="mt-2 w-full bg-navy text-white font-body text-xs tracking-widest uppercase py-3.5 hover:bg-charcoal transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
