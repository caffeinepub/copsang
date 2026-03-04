export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
}

const SHIPPING_KEY = "copsang_shipping_address";

export function saveShippingAddress(addr: ShippingAddress): void {
  localStorage.setItem(SHIPPING_KEY, JSON.stringify(addr));
}

export function getShippingAddress(): ShippingAddress | null {
  try {
    const stored = localStorage.getItem(SHIPPING_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ShippingAddress;
  } catch {
    return null;
  }
}

export function isShippingAddressValid(addr: ShippingAddress): boolean {
  return !!(
    addr.fullName.trim() &&
    addr.phone.trim().length >= 10 &&
    addr.addressLine1.trim() &&
    addr.city.trim() &&
    addr.state.trim() &&
    addr.pinCode.trim().length === 6
  );
}
