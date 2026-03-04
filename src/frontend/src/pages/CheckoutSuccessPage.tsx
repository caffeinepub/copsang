import { Link, useSearch } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Home,
  Loader2,
  MapPin,
} from "lucide-react";
import { motion } from "motion/react";
import { useGetStripeSessionStatus } from "../hooks/useQueries";
import { getShippingAddress } from "../utils/shipping";

export function CheckoutSuccessPage() {
  const search = useSearch({ from: "/shop-layout/checkout/success" });
  const sessionId = (search as Record<string, string>)?.session_id ?? null;

  const { data: status, isLoading } = useGetStripeSessionStatus(sessionId);
  const shippingAddress = getShippingAddress();

  if (isLoading || !status) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          data-ocid="checkout.loading_state"
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-10 h-10 text-gold animate-spin" />
          <p className="font-body text-sm text-charcoal/60">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (status.__kind__ === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          data-ocid="checkout.error_state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold text-navy mb-3">
            Payment Failed
          </h2>
          <p className="font-body text-sm text-charcoal/60 mb-8">
            {status.failed.error || "Something went wrong with your payment."}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/cart"
              className="font-body text-xs tracking-widest uppercase border border-navy text-navy px-6 py-3 hover:bg-navy hover:text-white transition-colors"
            >
              Back to Cart
            </Link>
            <Link
              to="/"
              className="btn-gold font-body text-xs tracking-widest uppercase px-6 py-3 text-navy"
            >
              Go Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg w-full"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="font-body text-gold tracking-[0.3em] uppercase text-xs mb-3">
            Order Confirmed
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-navy mb-4">
            Thank You!
          </h1>
          <p className="font-body text-charcoal/60 mb-3 leading-relaxed">
            Your order has been placed successfully. We'll ship it to the
            address below as soon as it's ready.
          </p>
          {sessionId && (
            <p className="font-body text-xs text-charcoal/40 mb-8 font-mono">
              Order ref: {sessionId.slice(0, 20)}...
            </p>
          )}

          {/* Shipping Address Card */}
          {shippingAddress && (
            <motion.div
              data-ocid="checkout.shipping_address_card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="bg-cream border border-border p-5 text-left mb-8"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <p className="font-body text-xs text-gold uppercase tracking-widest font-semibold">
                  Shipping To
                </p>
              </div>
              <div className="font-body text-sm text-charcoal space-y-0.5">
                <p className="font-semibold text-navy">
                  {shippingAddress.fullName}
                </p>
                <p className="text-charcoal/70">{shippingAddress.phone}</p>
                <p>{shippingAddress.addressLine1}</p>
                {shippingAddress.addressLine2 && (
                  <p>{shippingAddress.addressLine2}</p>
                )}
                <p>
                  {shippingAddress.city}, {shippingAddress.state} —{" "}
                  {shippingAddress.pinCode}
                </p>
              </div>
            </motion.div>
          )}

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/"
              data-ocid="checkout.success_state"
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 font-body text-xs font-semibold tracking-widest uppercase text-navy hover:shadow-gold transition-all"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-8 py-4 font-body text-xs font-semibold tracking-widest uppercase border border-navy text-navy hover:bg-navy hover:text-white transition-colors"
            >
              Shop More
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
