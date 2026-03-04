import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { SAMPLE_PRODUCTS, formatPrice } from "../data/products";

export function ProductDetailPage() {
  const { id } = useParams({ from: "/shop-layout/product/$id" });
  const { addItem } = useCart();

  const product = SAMPLE_PRODUCTS.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl text-navy mb-4">
            Product not found
          </h2>
          <Link to="/catalog" className="font-body text-sm text-gold underline">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      image: product.images[0],
    });
    toast.success("Added to cart", {
      description: `${product.name} · Size ${selectedSize} · Qty ${quantity}`,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 font-body text-sm text-charcoal/60 hover:text-navy transition-colors mb-10 tracking-wide uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden bg-cream">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Category tag */}
            <div className="absolute top-4 left-4 bg-navy text-gold text-[10px] font-body tracking-widest uppercase px-3 py-1.5">
              {product.category}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col justify-center"
          >
            <p className="font-body text-gold tracking-[0.3em] uppercase text-xs mb-3">
              {product.category}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-navy leading-tight mb-4">
              {product.name}
            </h1>
            <p className="font-display text-3xl font-semibold text-charcoal mb-8">
              {formatPrice(product.price)}
            </p>

            <div className="w-16 h-px bg-gold/40 mb-8" />

            <p className="font-body text-sm text-charcoal/70 leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="font-body text-xs tracking-widest uppercase text-charcoal font-semibold">
                  Select Size
                </span>
                {selectedSize && (
                  <span className="font-body text-xs text-gold">
                    Selected: {selectedSize}
                  </span>
                )}
              </div>
              <div
                data-ocid="product.size_select"
                className="flex gap-2 flex-wrap"
              >
                {product.sizes.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 font-body text-sm font-medium tracking-wide border transition-all duration-150 ${
                      selectedSize === s
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-charcoal border-border hover:border-navy hover:text-navy"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="font-body text-xs tracking-widest uppercase text-charcoal font-semibold block mb-3">
                Quantity
              </span>
              <div className="flex items-center gap-0 border border-border w-fit">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-cream transition-colors border-r border-border"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span
                  data-ocid="product.quantity_input"
                  className="w-14 h-10 flex items-center justify-center font-body text-sm text-navy font-semibold"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-cream transition-colors border-l border-border"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              data-ocid="product.add_to_cart_button"
              onClick={handleAddToCart}
              className="btn-gold flex items-center justify-center gap-3 w-full py-4 font-body text-sm font-semibold tracking-widest uppercase text-navy transition-all duration-200 hover:shadow-gold"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Cart · {formatPrice(product.price * BigInt(quantity))}
            </button>

            {/* Stock info */}
            <p className="font-body text-xs text-charcoal/40 mt-4 text-center">
              {product.stock.toString()} units available · Free delivery above
              ₹5,000
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
