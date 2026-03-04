import { Link } from "@tanstack/react-router";
import { AlertTriangle, CreditCard, Loader2, Lock, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { ShoppingItem } from "../backend";
import { useCart } from "../contexts/CartContext";
import { GST_LABEL, calculateGST, formatPrice } from "../data/products";
import { useCreateCheckoutSession } from "../hooks/useQueries";
import {
  type ShippingAddress,
  getShippingAddress,
  isShippingAddressValid,
  saveShippingAddress,
} from "../utils/shipping";

const FREE_DELIVERY_THRESHOLD = 500000n;

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const emptyAddress: ShippingAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pinCode: "",
};

const inputClass =
  "w-full border border-border px-4 py-3 font-body text-sm text-navy focus:outline-none focus:border-gold transition-colors bg-cream placeholder:text-charcoal/40";

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const createSession = useCreateCheckoutSession();

  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [addressValid, setAddressValid] = useState(false);

  useEffect(() => {
    const saved = getShippingAddress();
    if (saved) {
      setAddress(saved);
      setAddressValid(isShippingAddressValid(saved));
    }
  }, []);

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => {
      const updated = { ...prev, [field]: value };
      setAddressValid(isShippingAddressValid(updated));
      return updated;
    });
  };

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0n : 15000n;
  const gst = calculateGST(subtotal);
  const total = subtotal + deliveryFee + gst;

  const handleCheckout = async () => {
    if (items.length === 0 || !addressValid) return;

    saveShippingAddress(address);

    // Build line items for each product
    const shoppingItems: ShoppingItem[] = items.map(
      (item: (typeof items)[0]) => ({
        productName: `${item.name} (Size: ${item.size})`,
        currency: "inr",
        quantity: BigInt(item.quantity),
        priceInCents: item.price, // already in paise
        productDescription: `${item.name} - Size ${item.size}`,
      }),
    );

    // Add GST as a separate line item so Stripe shows the breakdown
    if (gst > 0n) {
      shoppingItems.push({
        productName: GST_LABEL,
        currency: "inr",
        quantity: 1n,
        priceInCents: gst,
        productDescription: "Goods and Services Tax (12%) on apparel",
      });
    }

    // Add delivery fee as a line item if applicable
    if (deliveryFee > 0n) {
      shoppingItems.push({
        productName: "Delivery Fee",
        currency: "inr",
        quantity: 1n,
        priceInCents: deliveryFee,
        productDescription: "Standard delivery. Free above ₹5,000.",
      });
    }

    try {
      const session = await createSession.mutateAsync(shoppingItems);
      if (!session?.url) throw new Error("Stripe session missing url");
      clearCart();
      window.location.href = session.url;
    } catch {
      // error is handled via mutation state
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl text-navy mb-4">
            Your cart is empty
          </h2>
          <Link to="/catalog" className="font-body text-sm text-gold underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-cream border-b border-border py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-body text-gold tracking-[0.3em] uppercase text-xs mb-2">
              Step 2 of 2
            </p>
            <h1 className="font-display text-4xl font-bold text-navy">
              Checkout
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Shipping Details — full width */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-gold" />
            <h2 className="font-display text-xl font-bold text-navy">
              Shipping Details
            </h2>
          </div>

          <div className="border border-border p-6 sm:p-8 bg-cream/30">
            {/* Row 1: Full Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="shipping-fullname"
                  className="font-body text-xs text-charcoal/60 uppercase tracking-widest block mb-2"
                >
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="shipping-fullname"
                  type="text"
                  data-ocid="checkout.shipping_fullname_input"
                  value={address.fullName}
                  onChange={(e) =>
                    handleAddressChange("fullName", e.target.value)
                  }
                  placeholder="Rahul Sharma"
                  autoComplete="name"
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="shipping-phone"
                  className="font-body text-xs text-charcoal/60 uppercase tracking-widest block mb-2"
                >
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <input
                  id="shipping-phone"
                  type="tel"
                  data-ocid="checkout.shipping_phone_input"
                  value={address.phone}
                  onChange={(e) => handleAddressChange("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 2: Address Line 1 */}
            <div className="mb-4">
              <label
                htmlFor="shipping-address1"
                className="font-body text-xs text-charcoal/60 uppercase tracking-widest block mb-2"
              >
                Address Line 1 <span className="text-destructive">*</span>
              </label>
              <input
                id="shipping-address1"
                type="text"
                data-ocid="checkout.shipping_address1_input"
                value={address.addressLine1}
                onChange={(e) =>
                  handleAddressChange("addressLine1", e.target.value)
                }
                placeholder="House/Flat no., Street name"
                autoComplete="address-line1"
                className={inputClass}
              />
            </div>

            {/* Row 3: Address Line 2 */}
            <div className="mb-4">
              <label
                htmlFor="shipping-address2"
                className="font-body text-xs text-charcoal/60 uppercase tracking-widest block mb-2"
              >
                Apartment, suite, etc.{" "}
                <span className="text-charcoal/40">(optional)</span>
              </label>
              <input
                id="shipping-address2"
                type="text"
                data-ocid="checkout.shipping_address2_input"
                value={address.addressLine2}
                onChange={(e) =>
                  handleAddressChange("addressLine2", e.target.value)
                }
                placeholder="Apartment, suite, landmark..."
                autoComplete="address-line2"
                className={inputClass}
              />
            </div>

            {/* Row 4: City + State + PIN */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="shipping-city"
                  className="font-body text-xs text-charcoal/60 uppercase tracking-widest block mb-2"
                >
                  City <span className="text-destructive">*</span>
                </label>
                <input
                  id="shipping-city"
                  type="text"
                  data-ocid="checkout.shipping_city_input"
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  placeholder="Mumbai"
                  autoComplete="address-level2"
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="shipping-state"
                  className="font-body text-xs text-charcoal/60 uppercase tracking-widest block mb-2"
                >
                  State <span className="text-destructive">*</span>
                </label>
                <select
                  id="shipping-state"
                  data-ocid="checkout.shipping_state_input"
                  value={address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  autoComplete="address-level1"
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="" disabled>
                    Select state
                  </option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="shipping-pin"
                  className="font-body text-xs text-charcoal/60 uppercase tracking-widest block mb-2"
                >
                  PIN Code <span className="text-destructive">*</span>
                </label>
                <input
                  id="shipping-pin"
                  type="text"
                  data-ocid="checkout.shipping_pin_input"
                  value={address.pinCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    handleAddressChange("pinCode", val);
                  }}
                  placeholder="400001"
                  autoComplete="postal-code"
                  maxLength={6}
                  inputMode="numeric"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Validation hint */}
            {!addressValid && (
              <p className="font-body text-xs text-charcoal/50 mt-4 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold" />
                Please fill in all required fields to continue to payment
              </p>
            )}
          </div>
        </motion.div>

        {/* Order Review + Payment — two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Review */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="font-display text-xl font-bold text-navy mb-6">
              Order Review
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item, _i) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-4 py-4 border-b border-border last:border-0"
                >
                  <div className="w-16 h-18 overflow-hidden bg-cream flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-sm font-semibold text-navy truncate">
                      {item.name}
                    </h4>
                    <p className="font-body text-xs text-charcoal/50 mt-0.5">
                      Size: {item.size} · Qty: {item.quantity}
                    </p>
                    <p className="font-body text-sm font-semibold text-charcoal mt-1">
                      {formatPrice(item.price * BigInt(item.quantity))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-cream p-5 space-y-2 font-body text-sm">
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
              <div className="border-t border-border pt-2 flex justify-between font-semibold text-navy text-base">
                <span>Total (incl. GST)</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </motion.div>

          {/* Payment */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-display text-xl font-bold text-navy mb-6">
              Payment
            </h2>

            <div className="border border-border p-8 flex flex-col items-center text-center gap-6">
              <CreditCard className="w-12 h-12 text-charcoal/30" />
              <div>
                <h3 className="font-display text-lg font-semibold text-navy mb-2">
                  Secure Payment via Stripe
                </h3>
                <p className="font-body text-sm text-charcoal/60 max-w-xs">
                  You'll be redirected to Stripe's secure checkout page to
                  complete your payment using credit/debit card or UPI.
                </p>
              </div>

              {/* Error */}
              {createSession.isError && (
                <div
                  data-ocid="checkout.error_state"
                  className="flex items-start gap-3 w-full bg-destructive/5 border border-destructive/20 px-4 py-3 text-left"
                >
                  <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="font-body text-xs text-destructive">
                    {createSession.error instanceof Error
                      ? createSession.error.message
                      : "Payment failed. Please try again."}
                  </p>
                </div>
              )}

              {/* Address incomplete notice */}
              {!addressValid && (
                <div className="flex items-start gap-3 w-full bg-gold/5 border border-gold/30 px-4 py-3 text-left">
                  <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <p className="font-body text-xs text-charcoal/70">
                    Complete your shipping address above to enable payment.
                  </p>
                </div>
              )}

              {/* Pay button */}
              <button
                type="button"
                data-ocid="checkout.pay_button"
                onClick={handleCheckout}
                disabled={createSession.isPending || !addressValid}
                className="btn-gold w-full flex items-center justify-center gap-3 py-4 font-body text-sm font-semibold tracking-widest uppercase text-navy disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:shadow-gold"
              >
                {createSession.isPending ? (
                  <>
                    <Loader2
                      data-ocid="checkout.loading_state"
                      className="w-4 h-4 animate-spin"
                    />
                    Creating Session...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay Securely · {formatPrice(total)}
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-charcoal/40">
                <Lock className="w-3.5 h-3.5" />
                <p className="font-body text-xs">
                  Powered by Stripe | Test Mode
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
