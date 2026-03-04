import { Link } from "@tanstack/react-router";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = window.location.hostname;

  return (
    <footer className="bg-navy text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <span className="font-display text-2xl font-bold tracking-[0.15em] text-white uppercase">
              Copsang
            </span>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              Crafted for the Modern Gentleman. Premium men's top wear
              manufactured with precision and passion.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold tracking-widest uppercase text-gold">
              Navigate
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="/catalog"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Shop All
              </Link>
              <Link
                to="/cart"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Cart
              </Link>
            </nav>
          </div>

          {/* Collections */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold tracking-widest uppercase text-gold">
              Collections
            </h4>
            <div className="flex flex-col gap-2">
              {[
                "Premium Cotton Shirts",
                "Oxford Collection",
                "Formal Collection",
                "Casual Collection",
                "Linen Collection",
              ].map((col) => (
                <Link
                  key={col}
                  to="/catalog"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {col}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {year} Copsang. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/70 hover:text-gold transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
