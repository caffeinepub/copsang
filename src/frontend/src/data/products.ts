export interface LocalProduct {
  id: string;
  name: string;
  description: string;
  price: bigint; // price in paise
  stock: bigint;
  images: string[];
  category: string;
  sizes: string[];
  featured: boolean;
}

export const SAMPLE_PRODUCTS: LocalProduct[] = [
  {
    id: "1",
    name: "Classic White Cotton Shirt",
    description:
      "Crafted from 100% premium Pima cotton, this timeless white shirt features a tailored slim fit, mother-of-pearl buttons, and a spread collar. Perfect for formal and smart-casual occasions.",
    price: 299900n, // ₹2,999
    stock: 50n,
    images: ["/assets/generated/shirt-white-cotton.dim_800x900.jpg"],
    category: "Premium Cotton Shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    featured: true,
  },
  {
    id: "2",
    name: "Navy Oxford Button-Down",
    description:
      "A wardrobe essential in rich navy blue Oxford cloth. Features a button-down collar, chest pocket, and a comfortable regular fit that transitions effortlessly from office to weekend.",
    price: 349900n, // ₹3,499
    stock: 45n,
    images: ["/assets/generated/shirt-navy-oxford.dim_800x900.jpg"],
    category: "Oxford Collection",
    sizes: ["S", "M", "L", "XL", "XXL"],
    featured: true,
  },
  {
    id: "3",
    name: "Charcoal Linen Casual",
    description:
      "Lightweight charcoal linen shirt perfect for warm weather. Features a relaxed fit, two chest pockets, and coconut shell buttons. A refined take on casual dressing.",
    price: 279900n, // ₹2,799
    stock: 30n,
    images: ["/assets/generated/shirt-charcoal-linen.dim_800x900.jpg"],
    category: "Linen Collection",
    sizes: ["S", "M", "L", "XL", "XXL"],
    featured: false,
  },
  {
    id: "4",
    name: "White Formal Slim Fit",
    description:
      "The ultimate formal shirt in crisp white with a subtle dobby texture. French placket, single-button cuffs, and a sharp point collar make this a boardroom staple.",
    price: 399900n, // ₹3,999
    stock: 40n,
    images: ["/assets/generated/shirt-white-formal.dim_800x900.jpg"],
    category: "Formal Collection",
    sizes: ["S", "M", "L", "XL", "XXL"],
    featured: true,
  },
  {
    id: "5",
    name: "Blue Chambray Weekend",
    description:
      "Easy-going light blue chambray shirt that embodies relaxed sophistication. Garment-washed for softness, with a slightly relaxed fit and roll-up sleeve tabs.",
    price: 259900n, // ₹2,599
    stock: 35n,
    images: ["/assets/generated/shirt-blue-chambray.dim_800x900.jpg"],
    category: "Casual Collection",
    sizes: ["S", "M", "L", "XL", "XXL"],
    featured: false,
  },
];

export function formatPrice(paise: bigint): string {
  const rupees = Number(paise) / 100;
  return `₹${rupees.toLocaleString("en-IN")}`;
}

// GST rate for apparel above ₹1,000 is 12%; for ₹1,000 and below it is 5%.
// For simplicity, Copsang products are all above ₹1,000, so we use 12%.
export const GST_RATE = 0.12;
export const GST_LABEL = "GST (12%)";

/** Calculate GST amount (in paise) on a subtotal (in paise) */
export function calculateGST(subtotalPaise: bigint): bigint {
  return BigInt(Math.round(Number(subtotalPaise) * GST_RATE));
}
