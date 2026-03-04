# Copsang

## Current State
- Full e-commerce app with Home, Catalog, Product Detail, Cart, Checkout (Stripe), and Admin pages
- Checkout page collects cart items, calculates GST (12%) and delivery fee, then redirects to Stripe hosted checkout
- No shipping address is collected before payment
- CheckoutSuccessPage shows a generic order confirmed message
- No Razorpay integration (Stripe only via platform component)
- Email is disabled (paid feature)

## Requested Changes (Diff)

### Add
- Shipping address form on the CheckoutPage (Step 1 of 2 before payment) with fields: full name, phone, address line 1, address line 2 (optional), city, state, PIN code
- Form validation before allowing payment to proceed
- Shipping address stored in localStorage and passed as Stripe `customer_email` and `shipping_address_collection` enablement
- Order summary panel on CheckoutSuccessPage showing the saved shipping address

### Modify
- CheckoutPage: split into two visual sections -- "Shipping Details" (new form) and "Payment" (existing Stripe button). Payment button disabled until address form is valid.
- CheckoutSuccessPage: display saved shipping address from localStorage alongside existing confirmation UI
- Cart page note: update "Secure checkout powered by Stripe" to be accurate

### Remove
- Nothing removed

## Implementation Plan
1. Add a `ShippingAddress` interface and localStorage helper (`getShippingAddress`, `saveShippingAddress`) to a new `utils/shipping.ts` file
2. Update `CheckoutPage.tsx`:
   - Add a controlled shipping address form with validation
   - Pay button is disabled if form fields are invalid
   - On pay: save address to localStorage, pass `customerEmail` and `shippingAddress` fields to `createCheckoutSession` (Stripe already supports `shipping_address_collection` via the backend; pass address as metadata in the items or via existing API)
   - Since the backend `createCheckoutSession` only takes `items`, `successUrl`, `cancelUrl`, we add the shipping address as a special metadata line or store it purely in localStorage for the success page
3. Update `CheckoutSuccessPage.tsx`: read shipping address from localStorage and display it in the confirmation card
