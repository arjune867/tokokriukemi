export interface User {
  id: number;
  username: string;
  password: string; // In a real app, this should be a hash
  role: 'admin' | 'customer';
  name?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  sold: number;
  location: string;
  freeShipping: boolean;
  image: string;
  description: string;
  category: 'keripik' | 'snack' | 'kaos' | 'parfum';
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface Promo {
  id: number;
  code: string;
  discount: number;
  freeShipping?: boolean;
  active: boolean;
}

export interface Stream {
  id: number;
  title: string;
  url: string;
  viewers: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CheckoutData {
  name: string;
  address: string;
  whatsapp: string;
  quantity: number;
  promoCode: string;
  notes: string;
}

export type View = 'home' | 'detail' | 'cart' | 'admin' | 'feed' | 'promo' | 'akun' | 'login' | 'register';
export type AdminView = 'dashboard' | 'products' | 'categories' | 'promos' | 'streams';