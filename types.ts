
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

export interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
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
  reviews?: Review[];
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

export interface FeedPost {
  id: number;
  user: string;
  avatar: string;
  role: 'admin' | 'customer';
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  reaction?: string | null;
  commentsList?: Comment[];
}

export interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
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

export interface PromoIconItem {
  id: number;
  name: string;
  icon: string; // Name of the lucide icon or emoji
  color: string; // Tailwind bg class
  textColor: string; // Tailwind text class
}

export type View = 'home' | 'detail' | 'cart' | 'admin' | 'feed' | 'promo' | 'akun' | 'login' | 'register' | 'live';
export type AdminView = 'dashboard' | 'products' | 'categories' | 'promos' | 'streams' | 'promo-icons';
