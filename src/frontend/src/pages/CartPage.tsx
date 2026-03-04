import { Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "../contexts/CartContext";
import { GST_LABEL, calculateGST, formatPrice } from "../data/products";

const FREE_DELIVERY_THRESHOLD = 500000n; // ₹5,000 in paise

export function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0n : 15000n; // ₹150
  const gst = calculateGST(subtotal);
  const total = subtotal + deliveryFee + gst;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          data-ocid="cart.empty_state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 max-w-sm mx-auto px-4"
        >
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-border" />
          <h2 className="font-display text-3xl font-bold text-navy mb-3">
            Your cart is empty
          </h2>
          <p className="font-body text-sm text-charcoal/60 mb-8">
            Discover our premium collection and add your favourites.
          </p>
          <Link
            to="/catalog"
            className="btn-gold inline-flex items-center gap-2 px-6 py-3.5 font-body text-xs font-semibold tracking-widest uppercase text-navy"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-cream border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-body text-gold tracking-[0.3em] uppercase text-xs mb-2">
              Your Cart
            </p>
            <h1 className="font-display text-4xl font-bold text-navy">
              {items.length} {items.length === 1 ? "item" : "items"}
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, i) => (
              <motion.div
                key={`${item.productId}-${item.size}`}
                data-ocid={`cart.item.${i + 1}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 sm:gap-6 py-6 border-b border-border last:border-0"
              >
                {/* Image */}
                <Link
                  to="/product/$id"
                  params={{ id: item.productId }}
                  className="flex-shrink-0 w-24 h-28 sm:w-28 sm:h-32 overflow-hidden bg-cream"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-navy leading-tight mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="font-body text-xs text-charcoal/50 uppercase tracking-widest">
                      Size: {item.size}
                    </p>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
                    {/* Quantity control */}
                    <div className="flex items-center border border-border">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity - 1,
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-cream transition-colors border-r border-border"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center font-body text-sm text-navy font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity + 1,
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-cream transition-colors border-l border-border"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-body text-sm font-semibold text-navy">
                        {formatPrice(item.price * BigInt(item.quantity))}
                      </span>
                      <button
                        type="button"
                        data-ocid={`cart.remove_button.${i + 1}`}
                        onClick={() => removeItem(item.productId, item.size)}
                        className="p-1.5 text-charcoal/40 hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Link
                to="/catalog"
                className="font-body text-xs text-charcoal/50 hover:text-navy uppercase tracking-widest flex items-center gap-2 transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-cream p-8 border border-border">
              <h2 className="font-display text-xl font-bold text-navy mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 font-body text-sm">
                <div className="flex justify-between text-charcoal/70">
                  <span>Subtotal (excl. GST)</span>
                  <span className="font-medium text-navy">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>{GST_LABEL}</span>
                  <span className="font-medium text-navy">
                    {formatPrice(gst)}
                  </span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>Delivery</span>
                  <span
                    className={
                      deliveryFee === 0n
                        ? "font-medium text-green-600"
                        : "font-medium text-navy"
                    }
                  >
                    {deliveryFee === 0n ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
                {subtotal < FREE_DELIVERY_THRESHOLD && (
                  <p className="text-xs text-charcoal/50">
                    Add {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} more
                    for free delivery
                  </p>
                )}
                <div className="border-t border-border pt-3 flex justify-between font-semibold text-navy text-base">
                  <span>Total (incl. GST)</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                data-ocid="cart.checkout_button"
                className="btn-gold flex items-center justify-center gap-2 w-full py-4 font-body text-xs font-semibold tracking-widest uppercase text-navy hover:shadow-gold transition-all"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-center font-body text-xs text-charcoal/40 mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
