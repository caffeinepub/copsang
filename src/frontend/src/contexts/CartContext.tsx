import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: bigint;
  size: string;
  quantity: number;
  image: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: bigint;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "copsang_cart";

function serializeItems(items: CartItem[]): string {
  return JSON.stringify(
    items.map((item) => ({ ...item, price: item.price.toString() })),
  );
}

function deserializeItems(raw: string): CartItem[] {
  try {
    const parsed = JSON.parse(raw);
    return parsed.map((item: CartItem & { price: string }) => ({
      ...item,
      price: BigInt(item.price),
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? deserializeItems(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, serializeItems(items));
  }, [items]);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === newItem.productId && i.size === newItem.size,
        );
        if (existing) {
          return prev.map((i) =>
            i.productId === newItem.productId && i.size === newItem.size
              ? { ...i, quantity: i.quantity + (newItem.quantity ?? 1) }
              : i,
          );
        }
        return [...prev, { ...newItem, quantity: newItem.quantity ?? 1 }];
      });
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (quantity < 1) return;
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.size === size ? { ...i, quantity } : i,
        ),
      );
    },
    [],
  );

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + i.price * BigInt(i.quantity),
    0n,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
