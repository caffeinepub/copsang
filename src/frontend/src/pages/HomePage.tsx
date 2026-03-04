import { Link } from "@tanstack/react-router";
import { ArrowRight, Gem, Scissors, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { SAMPLE_PRODUCTS, formatPrice } from "../data/products";

const FEATURED = SAMPLE_PRODUCTS.filter((p) => p.featured);

const BRAND_VALUES = [
  {
    icon: Gem,
    title: "Premium Fabrics",
    desc: "We source only the finest Egyptian cotton, premium linen, and Oxford cloth from certified mills.",
  },
  {
    icon: Scissors,
    title: "Precision Tailoring",
    desc: "Every stitch placed with care. Our master tailors ensure a fit that moves with you, not against you.",
  },
  {
    icon: Sparkles,
    title: "Contemporary Design",
    desc: "Timeless silhouettes reimagined for today's gentleman. Classic at heart, modern in execution.",
  },
];

export function HomePage() {
  const { addItem } = useCart();

  const handleQuickAdd = (product: (typeof SAMPLE_PRODUCTS)[0]) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: "M",
      quantity: 1,
      image: product.images[0],
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen">
      {/* ─── Hero ─── */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden grain-overlay">
        <img
          src="/assets/generated/hero-banner.dim_1600x800.jpg"
          alt="Copsang Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-transparent" />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-body text-gold tracking-[0.3em] uppercase text-xs mb-6"
              >
                New Collection 2026
              </motion.p>

              {/* Brand heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-[-0.02em] mb-6"
              >
                Crafted
                <br />
                <span className="text-gold">for the</span>
                <br />
                Modern
                <br />
                Gentleman
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="font-body text-white/70 text-lg mb-10 leading-relaxed"
              >
                Premium men's top wear and shirts,
                <br />
                manufactured with precision and passion.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/catalog"
                  data-ocid="hero.shop_now_button"
                  className="btn-gold inline-flex items-center gap-2 px-8 py-4 font-body text-sm font-semibold tracking-widest uppercase text-navy transition-all duration-200 hover:shadow-gold"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ─── Featured Category: Premium Cotton Shirts ─── */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4"
          >
            <div>
              <p className="font-body text-gold tracking-[0.3em] uppercase text-xs mb-3">
                Featured
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-navy leading-tight">
                Premium Cotton
                <br />
                Shirts
              </h2>
            </div>
            <Link
              to="/catalog"
              className="font-body text-sm text-charcoal hover:text-navy flex items-center gap-2 tracking-wide uppercase transition-colors border-b border-charcoal/30 hover:border-navy pb-0.5"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group bg-white product-card-hover overflow-hidden"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors duration-300" />
                  {/* Quick add overlay */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      className="w-full bg-navy text-white font-body text-xs tracking-widest uppercase py-4 hover:bg-charcoal transition-colors"
                    >
                      Quick Add — M
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="font-body text-xs text-gold tracking-widest uppercase mb-1">
                    {product.category}
                  </p>
                  <Link to="/product/$id" params={{ id: product.id }}>
                    <h3 className="font-display text-lg font-semibold text-navy mb-2 hover:text-charcoal transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="font-body text-base font-semibold text-charcoal">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Brand Values ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="font-body text-gold tracking-[0.3em] uppercase text-xs mb-3">
              Our Promise
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-navy">
              The Copsang Standard
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {BRAND_VALUES.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 border border-gold/30 flex items-center justify-center mb-6">
                  <val.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-navy mb-3">
                  {val.title}
                </h3>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Banner CTA ─── */}
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              Dress with Distinction
            </h2>
            <p className="font-body text-white/60 mb-10 max-w-md mx-auto">
              Explore our full collection of premium shirts crafted for the
              discerning gentleman.
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-gold text-navy px-8 py-4 font-body text-sm font-semibold tracking-widest uppercase hover:bg-gold/90 transition-colors"
            >
              Explore Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
