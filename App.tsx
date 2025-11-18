
import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight, 
  Star, MapPin, Share2, Truck,
  Home, Newspaper, Tag, User, X, Check, Percent,
  Plus, Edit3, Trash2, Video, BarChart3, Grid, Package,
  Copy, CheckCircle, Shirt, Leaf, Droplet, LogIn, Shield, LogOut, KeyRound, Mail, Phone, HomeIcon, Clock, Heart, MoreHorizontal, Send, Image as ImageIcon, FileText,
  Wallet, Coins, CreditCard, Settings, Crown, Ticket, UserCog, HelpCircle, Link as LinkIcon, Smile, Tv, Pen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Product, Category, Promo, Stream, CartItem, CheckoutData, View, AdminView, User as UserType, FeedPost } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<View>('home');
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [checkoutMode, setCheckoutMode] = useState<'single' | 'cart'>('single'); // Added checkout mode
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({ name: '', address: '', whatsapp: '', quantity: 1, promoCode: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  // Admin state
  const [adminView, setAdminView] = useState<AdminView>('dashboard');
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [promoFormData, setPromoFormData] = useState({ code: '', discount: 0, freeShipping: false, active: true });

  // Product Admin State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<Omit<Product, 'id'>>({
    name: '', price: 0, originalPrice: 0, discount: 0, rating: 5.0, sold: 0, location: 'Bandung', freeShipping: false, image: '', description: '', category: 'keripik'
  });

  // Category Admin State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<Omit<Category, 'id'>>({ name: '', icon: '', color: 'bg-emerald-100' });

  // Stream Admin State
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [editingStream, setEditingStream] = useState<Stream | null>(null);
  const [streamFormData, setStreamFormData] = useState<Omit<Stream, 'id'>>({ title: '', url: '', viewers: 0 });

  // Contact Modal State
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactData, setContactData] = useState({ name: '', message: '' });

  // Comment & Review Modal States
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewContent, setReviewContent] = useState('');

  // Auth state
  const [users, setUsers] = useState<UserType[]>([
    { id: 1, username: 'arjune', password: 'masukin474', role: 'admin', name: 'Arjune', email: 'admin@kriuke.com', whatsapp: '081234567890', address: 'Jl. Admin No. 1, Bandung' },
    { id: 2, username: 'pelanggan', password: 'password123', role: 'customer', name: 'Pelanggan Setia', email: 'pelanggan@email.com', whatsapp: '089876543210', address: 'Jl. Pelanggan No. 10, Cimahi' },
  ]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  
  // Form states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [registerData, setRegisterData] = useState({
    name: '',
    username: '',
    email: '',
    whatsapp: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  // Feed Data
  const [newPostContent, setNewPostContent] = useState('');
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: 1,
      user: "Kriuké Official",
      avatar: "https://placehold.co/100x100/10B981/ffffff?text=K",
      role: "admin",
      time: "30 menit yang lalu",
      content: "🔥 FLASH SALE ALERT! 🔥\nJangan lewatkan diskon hingga 25% untuk varian Keripik Pisang Coklat hari ini saja. Stok terbatas ya kak!",
      image: "https://placehold.co/600x400/F0FDF4/047857?text=Flash+Sale+Alert!",
      likes: 124,
      comments: 12,
      isLiked: false
    },
    {
      id: 2,
      user: "Rina S.",
      avatar: "https://placehold.co/100x100/fbbf24/ffffff?text=R",
      role: "customer",
      time: "2 jam yang lalu",
      content: "Baru nyobain Parfum HRM varian Mistique, wanginya mewah banget! Tahan lama juga dipake seharian kerja. Recommended! 😍✨",
      image: "https://placehold.co/600x400/F0FDF4/16A34A?text=Testimoni+Parfum",
      likes: 45,
      comments: 4,
      isLiked: true
    },
    {
      id: 3,
      user: "Kriuké Official",
      avatar: "https://placehold.co/100x100/10B981/ffffff?text=K",
      role: "admin",
      time: "5 jam yang lalu",
      content: "Proses sablon DTF untuk pesanan Kak Budi sudah selesai! Kualitas premium, warna tajam, dan anti luntur. Yuk yang mau custom kaos bisa langsung chat admin.",
      image: "https://placehold.co/600x400/F0FDF4/166534?text=Proses+Produksi+DTF",
      likes: 89,
      comments: 8,
      isLiked: false
    },
    {
      id: 4,
      user: "Dodi Mahendra",
      avatar: "https://placehold.co/100x100/3b82f6/ffffff?text=D",
      role: "customer",
      time: "1 hari yang lalu",
      content: "Keripik Pisang Pedas-nya juara! 🔥 Level pedasnya pas, ga bikin sakit perut tapi nagih banget. Udah order ke-3 kalinya nih.",
      image: "https://placehold.co/600x400/F0FDF4/059669?text=Review+Pedas+Mantap",
      likes: 210,
      comments: 25,
      isLiked: false
    },
    {
      id: 5,
      user: "Kriuké Official",
      avatar: "https://placehold.co/100x100/10B981/ffffff?text=K",
      role: "admin",
      time: "1 hari yang lalu",
      content: "📦 RESTOCK ALERT! 📦\nKeripik Talas Original sudah tersedia lagi ya. Yang kemarin kehabisan, yuk buruan checkout sebelum sold out lagi!",
      image: "https://placehold.co/600x400/F0FDF4/065F46?text=Restock+Keripik+Talas",
      likes: 156,
      comments: 42,
      isLiked: true
    },
    {
      id: 6,
      user: "Siti Nurhaliza",
      avatar: "https://placehold.co/100x100/ec4899/ffffff?text=S",
      role: "customer",
      time: "2 hari yang lalu",
      content: "Suka banget sama packaging-nya yang aman. Keripik sampai di Jakarta tanpa remuk sedikitpun. Makasih Kriuké! 🍌📦",
      image: "https://placehold.co/600x400/F0FDF4/10B981?text=Packaging+Aman",
      likes: 34,
      comments: 2,
      isLiked: false
    },
    {
      id: 7,
      user: "Kriuké Official",
      avatar: "https://placehold.co/100x100/10B981/ffffff?text=K",
      role: "admin",
      time: "2 hari yang lalu",
      content: "Sneak peek varian baru Parfum HRM... 🤔 Ada yang bisa tebak aromanya? Clue: Segar dan manis buah-buahan tropis! 🍍🥭",
      image: "https://placehold.co/600x400/F0FDF4/15803D?text=Coming+Soon+Varian+Baru",
      likes: 278,
      comments: 89,
      isLiked: false
    },
    {
      id: 8,
      user: "Bambang Gentolet",
      avatar: "https://placehold.co/100x100/8b5cf6/ffffff?text=B",
      role: "customer",
      time: "3 hari yang lalu",
      content: "Kaos sablon DTF-nya keren parah! Bahannya adem, sablonnya detail banget. Cocok buat dipake nongkrong. 😎",
      image: "https://placehold.co/600x400/F0FDF4/166534?text=OOTD+Kaos+Kriuke",
      likes: 67,
      comments: 5,
      isLiked: true
    },
    {
      id: 9,
      user: "Kriuké Official",
      avatar: "https://placehold.co/100x100/10B981/ffffff?text=K",
      role: "admin",
      time: "3 hari yang lalu",
      content: "Terima kasih Kak @jessica_milla sudah mampir ke booth kami di Festival Kuliner Bandung! Ditunggu orderan selanjutnya ya 🥰",
      image: "https://placehold.co/600x400/F0FDF4/047857?text=Festival+Kuliner+Bandung",
      likes: 412,
      comments: 15,
      isLiked: false
    },
    {
      id: 10,
      user: "Ani Wulandari",
      avatar: "https://placehold.co/100x100/f43f5e/ffffff?text=A",
      role: "customer",
      time: "4 hari yang lalu",
      content: "Teman nugas terbaik! Keripik Pisang Coklat + Kopi = Perfect Combo ☕🍫. Semangat skripsian!",
      image: "https://placehold.co/600x400/F0FDF4/78350f?text=Teman+Nugas",
      likes: 98,
      comments: 11,
      isLiked: true
    }
  ]);

  // Products
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Keripik Pisang Coklat", price: 15000, originalPrice: 20000, discount: 25, rating: 4.9, sold: 2450, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/047857?text=🍫+Coklat", description: "Keripik pisang premium dilumuri coklat dark berkualitas. Renyah dan bikin nagih!", category: "keripik" },
    { id: 2, name: "Keripik Pisang Pedas", price: 15000, originalPrice: 20000, discount: 25, rating: 4.8, sold: 2180, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/059669?text=🌶️+Pedas", description: "Keripik pisang dengan baluran bumbu pedas level 8/10. Cocok untuk pecinta pedas!", category: "keripik" },
    { id: 3, name: "Kaos DTF Premium - Kriuké", price: 89000, originalPrice: 120000, discount: 25, rating: 4.9, sold: 620, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/166534?text=👕+Kriuké", description: "Kaos premium cotton combed 24s dengan sablon DTF berkualitas tinggi. Desain eksklusif Kriuké!", category: "kaos" },
    { id: 4, name: "Parfum HRM - Mistique", price: 95000, originalPrice: 135000, discount: 30, rating: 4.8, sold: 840, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/16A34A?text=💧+Mistique", description: "Parfum HRM Mistique – aroma woody & musky yang elegan. Tahan 8-12 jam. 50ml.", category: "parfum" },
    { id: 5, name: "Keripik Talas Original", price: 12000, originalPrice: 15000, discount: 20, rating: 4.6, sold: 1450, location: "Bandung", freeShipping: false, image: "https://placehold.co/300x300/F0FDF4/065F46?text=🍠+Talas", description: "Keripik talas lokal khas Jawa Barat. Renyah, gurih, dan rendah lemak.", category: "snack" },
    { id: 6, name: "Parfum HRM - Citrus Bloom", price: 95000, originalPrice: 135000, discount: 30, rating: 4.7, sold: 710, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/15803D?text=🍊+Citrus", description: "Aroma citrus segar dengan sentuhan floral. Ringan & menyegarkan. 50ml.", category: "parfum" }
  ]);
  
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Keripik", icon: "🍌", color: "bg-emerald-100" },
    { id: 2, name: "Snack", icon: "🍿", color: "bg-emerald-50" },
    { id: 3, name: "Kaos DTF", icon: "👕", color: "bg-gray-100" },
    { id: 4, name: "Parfum HRM", icon: "💧", color: "bg-emerald-50" },
    { id: 5, name: "Paket Hemat", icon: "📦", color: "bg-emerald-100" }
  ]);
  
  const [promos, setPromos] = useState<Promo[]>([
    { id: 1, code: "KRIUKE10", discount: 10, active: true },
    { id: 2, code: "GRATISONGKIR", discount: 0, freeShipping: true, active: true },
    { id: 3, code: "DTFHARMONI", discount: 15, active: true }
  ]);
  
  const [streams, setStreams] = useState<Stream[]>([
    { id: 1, title: "Live Demo Sablon DTF", url: "https://youtube.com/live/dtf123", viewers: 320 },
    { id: 2, title: "Cicip Keripik Pisang Baru!", url: "https://youtube.com/live/kriuk456", viewers: 512 }
  ]);

  const salesData = [
    { name: 'Senin', sales: 1200 }, { name: 'Selasa', sales: 950 }, { name: 'Rabu', sales: 1420 },
    { name: 'Kamis', sales: 1680 }, { name: 'Jumat', sales: 2150 }, { name: 'Sabtu', sales: 2840 }, { name: 'Minggu', sales: 3210 }
  ];
  const categoryData = [
    { name: 'Keripik', value: 45 }, { name: 'Snack', value: 25 },
    { name: 'Kaos DTF', value: 15 }, { name: 'Parfum HRM', value: 15 }
  ];
  const COLORS = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];

  // ===== COUNTDOWN TIMER =====
  const [timeLeft, setTimeLeft] = useState(11 * 3600 + 21 * 60 + 52); // Example time
  
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  };
  const { h, m, s } = formatTime(timeLeft);

  // ===== FEED FUNCTIONS =====
  const handleLikePost = (postId: number) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: FeedPost = {
      id: Date.now(),
      user: currentUser ? (currentUser.name || currentUser.username) : "Pengunjung",
      avatar: "https://placehold.co/100x100/ccc/ffffff?text=U",
      role: currentUser?.role || 'customer',
      time: "Baru saja",
      content: newPostContent,
      likes: 0,
      comments: 0,
      isLiked: false
    };

    setFeedPosts([newPost, ...feedPosts]);
    setNewPostContent('');
  };

  const handleOpenComment = (postId: number) => {
    setActivePostId(postId);
    setShowCommentModal(true);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || activePostId === null) return;
    
    setFeedPosts(prev => prev.map(post => 
      post.id === activePostId ? { ...post, comments: post.comments + 1 } : post
    ));
    
    setCommentText('');
    setShowCommentModal(false);
    alert('Komentar berhasil dikirim!');
  };

  const handleSharePost = (post: FeedPost) => {
    const text = `Cek postingan dari ${post.user} di Kriuké:\n\n"${post.content.substring(0, 50)}..."\n\nDownload aplikasinya sekarang!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // ===== PRODUCT TO FEED FUNCTIONS =====
  const openReviewModal = () => {
    if (!selectedProduct) return;
    if (!isAuthenticated) {
        alert("Silakan login untuk menulis ulasan.");
        setCurrentView('login');
        return;
    }
    setShowReviewModal(true);
  };

  const handleProductToFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !reviewContent.trim()) return;

    const newPost: FeedPost = {
        id: Date.now(),
        user: currentUser ? (currentUser.name || currentUser.username) : "Pengunjung",
        avatar: "https://placehold.co/100x100/ccc/ffffff?text=U",
        role: currentUser?.role || 'customer',
        time: "Baru saja",
        content: `Mengulas: ${selectedProduct.name}\n\n${reviewContent}`,
        image: selectedProduct.image,
        likes: 0,
        comments: 0,
        isLiked: false
    };

    setFeedPosts([newPost, ...feedPosts]);
    setReviewContent('');
    setShowReviewModal(false);
    setSelectedProduct(null);
    setCurrentView('feed');
    setActiveTab('feed');
    alert('Ulasan berhasil dibagikan ke Feed!');
  };

  // ===== AUTH FUNCTIONS =====
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const user = users.find(u => u.username === loginUsername && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setCurrentView('home');
      setActiveTab('home');
      setLoginUsername('');
      setLoginPassword('');
    } else {
      setAuthError('Username atau password salah.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (registerData.password !== registerData.confirmPassword) {
      setAuthError('Konfirmasi password tidak cocok.');
      return;
    }
    if (users.some(u => u.username === registerData.username)) {
      setAuthError('Username sudah digunakan.');
      return;
    }
    const newUser: UserType = {
      id: users.length + 1,
      username: registerData.username,
      password: registerData.password,
      role: 'customer',
      name: registerData.name,
      email: registerData.email,
      whatsapp: registerData.whatsapp,
      address: registerData.address,
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setCurrentView('home');
    setActiveTab('home');
    setRegisterData({ name: '', username: '', email: '', whatsapp: '', address: '', password: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('home');
    setActiveTab('home');
  };

  // ===== CONTACT FUNCTIONS =====
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = "6283854488111";
    const text = `Halo Admin Kriuké, saya ${contactData.name || 'Pelanggan'}.\n\n${contactData.message}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    setShowContactModal(false);
    setContactData({ name: '', message: '' });
  };

  // ===== CART FUNCTIONS =====
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ===== SHARE & CHECKOUT =====
  const shareToWhatsApp = () => {
    if (!selectedProduct) return;
    const message = `Hai! Cek produk ini di *Kriuké*:\n\n${selectedProduct.name}\nRp${selectedProduct.price.toLocaleString()}\nStok terbatas!\n\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    setShowShare(false);
  };
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    setTimeout(() => setShowShare(false), 500);
  };

  const handleCartCheckout = () => {
    if (!isAuthenticated || !currentUser) {
      alert('Anda harus login untuk melanjutkan checkout.');
      setCurrentView('login');
      return;
    }
    // Instead of direct WA, open the Modal in 'cart' mode
    setCheckoutMode('cart');
    setCheckoutData({
      name: currentUser.name || '',
      address: currentUser.address || '',
      whatsapp: currentUser.whatsapp || '',
      quantity: 1, // Not used in cart mode logic but needed for type
      promoCode: '',
      notes: ''
    });
    setShowCheckout(true);
  };
  
  const handleBuyNow = () => {
    setCheckoutMode('single');
    if (currentUser) {
      setCheckoutData(prev => ({
        ...prev,
        name: currentUser.name || '',
        address: currentUser.address || '',
        whatsapp: currentUser.whatsapp || ''
      }));
    }
    setShowCheckout(true);
  }

  const validPromoCodes = promos.reduce((acc, promo) => {
    if (promo.active) acc[promo.code] = { discount: promo.discount, freeShipping: promo.freeShipping || false };
    return acc;
  }, {} as Record<string, { discount: number; freeShipping: boolean }>);

  // --- Checkout Calculations ---
  const isCartCheckout = checkoutMode === 'cart';
  
  // Base price & subtotal logic
  const basePrice = isCartCheckout ? 0 : (selectedProduct?.price || 0);
  const currentQuantity = isCartCheckout ? 1 : (checkoutData.quantity || 1);
  const currentSubtotal = isCartCheckout ? cartTotal : (basePrice * currentQuantity);
  
  // Promo Logic
  let promoDiscount = 0;
  let isFreeShipping = false;
  
  if (isCartCheckout) {
      // For cart, verify if ALL items are free shipping OR if promo applies
      // For simplicity, we assume shipping applies unless promo overrides it
      isFreeShipping = false; 
  } else {
      isFreeShipping = selectedProduct?.freeShipping || false;
  }

  if (checkoutData.promoCode && validPromoCodes[checkoutData.promoCode.toUpperCase()]) {
    const promo = validPromoCodes[checkoutData.promoCode.toUpperCase()];
    promoDiscount = (currentSubtotal * promo.discount) / 100;
    isFreeShipping = isFreeShipping || promo.freeShipping;
  }

  const totalAfterPromo = Math.max(0, currentSubtotal - promoDiscount);
  const shippingCost = isFreeShipping ? 0 : 10000;
  const finalTotal = totalAfterPromo + shippingCost;
  // -----------------------------

  // ===== ADMIN FUNCTIONS =====
  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      price: 0,
      originalPrice: 0,
      discount: 0,
      rating: 0,
      sold: 0,
      location: 'Bandung',
      freeShipping: false,
      image: 'https://placehold.co/300x300/F0FDF4/047857?text=Produk',
      description: '',
      category: 'keripik'
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({ ...product });
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productFormData, id: editingProduct.id } as Product : p));
    } else {
      const newProduct: Product = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        ...productFormData
      } as Product;
      setProducts([...products, newProduct]);
    }
    setShowProductModal(false);
  };

  const deleteProduct = (id: number) => { 
    if (window.confirm('Hapus produk ini?')) { 
      setProducts(products.filter(p => p.id !== id)); 
    } 
  };

  // ===== PROMO ADMIN FUNCTIONS =====
  const handleAddPromo = () => {
    setEditingPromo(null);
    setPromoFormData({ code: '', discount: 0, freeShipping: false, active: true });
    setShowPromoModal(true);
  };

  const handleEditPromo = (promo: Promo) => {
    setEditingPromo(promo);
    setPromoFormData({ code: promo.code, discount: promo.discount, freeShipping: promo.freeShipping || false, active: promo.active });
    setShowPromoModal(true);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromo) {
      setPromos(promos.map(p => p.id === editingPromo.id ? { ...p, ...promoFormData } : p));
    } else {
      const newPromo: Promo = {
        id: promos.length > 0 ? Math.max(...promos.map(p => p.id)) + 1 : 1,
        ...promoFormData
      };
      setPromos([...promos, newPromo]);
    }
    setShowPromoModal(false);
  };

  const togglePromoStatus = (id: number) => {
    setPromos(promos.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };
  
  const deletePromo = (id: number) => {
      if (window.confirm('Hapus kode promo ini?')) {
          setPromos(promos.filter(p => p.id !== id));
      }
  }

  // ===== CATEGORY ADMIN FUNCTIONS =====
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({ name: '', icon: '', color: 'bg-emerald-100' });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({ name: category.name, icon: category.icon, color: category.color });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...categoryFormData } as Category : c));
    } else {
      const newCategory: Category = {
        id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
        ...categoryFormData
      } as Category;
      setCategories([...categories, newCategory]);
    }
    setShowCategoryModal(false);
  };

  const deleteCategory = (id: number) => {
    if (window.confirm('Hapus kategori ini?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  // ===== STREAM ADMIN FUNCTIONS =====
  const handleAddStream = () => {
    setEditingStream(null);
    setStreamFormData({ title: '', url: '', viewers: 0 });
    setShowStreamModal(true);
  };

  const handleEditStream = (stream: Stream) => {
    setEditingStream(stream);
    setStreamFormData({ title: stream.title, url: stream.url, viewers: stream.viewers });
    setShowStreamModal(true);
  };

  const handleSaveStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStream) {
      setStreams(streams.map(s => s.id === editingStream.id ? { ...s, ...streamFormData } as Stream : s));
    } else {
      const newStream: Stream = {
        id: streams.length > 0 ? Math.max(...streams.map(s => s.id)) + 1 : 1,
        ...streamFormData
      } as Stream;
      setStreams([...streams, newStream]);
    }
    setShowStreamModal(false);
  };

  const deleteStream = (id: number) => {
    if (window.confirm('Hapus stream ini?')) {
      setStreams(streams.filter(s => s.id !== id));
    }
  };

  // ===== RENDER LOGIC =====
  const getCategoryColor = (category: Product['category']) => (category === 'kaos' ? 'text-gray-700' : 'text-emerald-600');
  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
    setCheckoutData({ name: '', address: '', whatsapp: '', quantity: 1, promoCode: '', notes: '' });
  };
  const goBack = () => { if (currentView === 'detail') { setSelectedProduct(null); setCurrentView(activeTab); }};

  // ===== VIEWS =====
  const renderHome = () => {
    const flashSaleProducts = products.slice(0, 3);

    return (
      <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto pb-20">
        
        {/* New User Promo Banner */}
        <div className="p-4 pb-2">
          <button onClick={() => { setCurrentView('promo'); setActiveTab('promo'); }} className="w-full bg-red-500 text-white p-3 rounded-lg flex justify-between items-center text-left">
            <h3 className="font-bold">Nikmatin diskon pengguna baru</h3>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Category Icons - Moved ABOVE Flash Sale */}
        <div className="py-3 bg-white">
          <div className="flex space-x-4 px-4 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <div key={cat.id} className="flex flex-col items-center space-y-1 flex-shrink-0 w-16">
                <div className={`w-12 h-12 ${cat.color} rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg`}>{cat.icon}</div>
                <span className="text-xs text-gray-700 text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Flash Sale Section */}
        <div className="px-4 py-4">
          <div className="bg-red-100 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-red-600 font-bold">Diskon sd 20%</h3>
                <p className="text-xs text-red-500">Hemat hingga 10k</p>
              </div>
              <div className="flex items-center space-x-1 text-white">
                 <span className="bg-red-500 p-1 rounded-md text-sm font-mono">{h}</span>
                 <span className="text-gray-500 text-sm">:</span>
                 <span className="bg-red-500 p-1 rounded-md text-sm font-mono">{m}</span>
                 <span className="text-gray-500 text-sm">:</span>
                 <span className="bg-red-500 p-1 rounded-md text-sm font-mono">{s}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {flashSaleProducts.map(product => (
                <div key={product.id} className="bg-white rounded overflow-hidden cursor-pointer" onClick={() => openProductDetail(product)}>
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-24 object-cover" />
                    <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      -{product.discount}%
                    </span>
                  </div>
                  <div className="p-1.5">
                    <p className="text-red-600 font-bold text-sm">Rp{product.price.toLocaleString()}</p>
                    <p className="text-gray-500 line-through text-[10px]">Rp{product.originalPrice.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Product Sections */}
        {[{title: "Keripik Pisang Kriuké", icon: Leaf, cat: "keripik"}, {title: "Parfum HRM (Haroemin)", icon: Droplet, cat: "parfum"}, {title: "Kaos Sablon DTF", icon: Shirt, cat: "kaos"}].map(section => {
          const SectionIcon = section.icon;
          return (<div key={section.title}><div className="px-4 py-3"><h2 className="font-bold text-lg text-gray-800 flex items-center"><SectionIcon className="mr-2 text-emerald-600" size={20} />{section.title}</h2></div><div className="px-4 pb-3"><div className="grid grid-cols-2 gap-3">{products.filter(p => p.category === section.cat).map(product => (<div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer" onClick={() => openProductDetail(product)}><div className="relative"><img src={product.image} alt={product.name} className="w-full h-28 object-cover"/>
          </div><div className="p-2"><h3 className="text-xs font-medium text-gray-800 line-clamp-2">{product.name}</h3><div className="mt-1 flex items-center space-x-2"><span className="text-emerald-600 font-bold text-sm">Rp{product.price.toLocaleString()}</span></div><div className="mt-1 flex items-center text-xs text-gray-500"><Star size={14} className="text-amber-400 fill-current mr-1" /><span>{product.rating}</span><span className="mx-1.5">|</span><span>{product.sold.toLocaleString()} terjual</span><button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="ml-auto bg-emerald-100 text-emerald-700 p-1 rounded hover:bg-emerald-200"><Plus size={14} /></button></div></div></div>))}</div></div></div>);
        })}
      </motion.div>
    );
  };
  const renderDetail = () => (selectedProduct && <motion.div key="detail" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} transition={{ type: "spring", damping: 25 }} className="flex-1 overflow-y-auto pb-24 bg-white"><div className="bg-white sticky top-0 z-10 shadow-sm"><div className="flex items-center justify-between p-4"><button onClick={goBack} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={20} className="text-emerald-600" /></button><h1 className="font-bold text-lg text-gray-800">Detail Produk</h1><div className="flex"><button onClick={openReviewModal} className="p-2 rounded-full hover:bg-gray-100 mr-1" title="Tulis Ulasan di Feed"><Pen size={20} className="text-emerald-600" /></button><button onClick={() => setShowShare(true)} className="p-2 rounded-full hover:bg-gray-100"><Share2 size={20} className="text-emerald-600" /></button></div></div></div><div className="relative h-64 bg-gray-100"><img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-contain p-4"/>{selectedProduct.discount && (<span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">-{selectedProduct.discount}%</span>)}</div><div className="p-4"><h1 className="text-xl font-bold text-gray-800">{selectedProduct.name}</h1><div className="flex items-center mt-1 text-gray-600"><Star size={16} className="text-amber-400 fill-current mr-1" /><span>{selectedProduct.rating}</span><span className="mx-2 text-gray-400">•</span><span>{selectedProduct.sold.toLocaleString()} terjual</span></div><div className="mt-3 flex items-baseline"><span className={`text-2xl font-bold text-emerald-600`}>Rp{selectedProduct.price.toLocaleString()}</span>{selectedProduct.originalPrice && (<span className="text-gray-500 line-through text-lg ml-2">Rp{selectedProduct.originalPrice.toLocaleString()}</span>)}</div><div className="mt-3 flex items-center text-sm text-gray-600"><MapPin size={16} className="mr-1 text-emerald-600" /><span>Dibuat di {selectedProduct.location}</span></div>{selectedProduct.freeShipping && (<div className="mt-3 flex items-center bg-emerald-50 p-3 rounded-lg"><Truck size={20} className="text-emerald-600 mr-2" /><div><p className="font-medium text-emerald-700">Gratis Ongkos Kirim</p><p className="text-xs text-emerald-600">Minimal belanja Rp50.000</p></div></div>)}</div><div className="px-4 py-3 bg-emerald-50 border-l-4 border-emerald-500"><p className="text-emerald-800 font-medium">🌟 Produk Kriuké: Renyah, Enak, dan Berkualitas Premium!</p></div><div className="p-4"><h3 className="font-bold text-gray-800 mb-2">Deskripsi</h3><p className="text-gray-700 mb-4">{selectedProduct.description}</p></div><div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t p-4 flex space-x-3"><button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium flex items-center justify-center" onClick={() => addToCart(selectedProduct)}><ShoppingCart size={18} className="mr-2" />Keranjang</button><button className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold" onClick={handleBuyNow}>Beli Sekarang</button></div></motion.div>);
  const renderCart = () => (<motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto pb-24"><div className="bg-white sticky top-0 z-10 shadow-sm p-4"><div className="flex items-center"><button onClick={() => setCurrentView('home')} className="p-2 rounded-full hover:bg-gray-100 mr-2"><ChevronLeft size={20} className="text-emerald-600" /></button><h1 className="font-bold text-lg text-gray-800">Keranjang Kriuké</h1><span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span></div></div>{cart.length === 0 ? (<div className="p-4 text-center mt-12"><div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><Leaf size={32} className="text-emerald-600" /></div><h3 className="text-lg font-medium text-gray-800 mb-2">Keranjang Kosong</h3><p className="text-gray-600 mb-4">Yuk, isi keranjang dengan produk favoritmu!</p><button onClick={() => setCurrentView('home')} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium">Belanja Sekarang</button></div>) : (<div className="p-4"><div className="space-y-4 mb-6">{cart.map(item => (<div key={item.id} className="bg-white rounded-xl p-4 shadow-sm"><div className="flex"><img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-3"/><div className="flex-1"><h3 className="font-medium text-gray-800 line-clamp-2">{item.name}</h3><p className="text-emerald-600 font-bold">Rp{item.price.toLocaleString()}</p><div className="mt-2 flex items-center"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded">-</button><span className="mx-2 w-8 text-center">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded">+</button><button onClick={() => removeFromCart(item.id)} className="ml-auto p-1 text-red-500"><Trash2 size={16} /></button></div></div></div></div>))}</div><div className="bg-white rounded-xl p-4 shadow-sm"><div className="flex justify-between mb-2"><span className="text-gray-600">Total ({cartCount} produk)</span><span className="font-bold text-lg text-emerald-600">Rp{cartTotal.toLocaleString()}</span></div><button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold mt-4" onClick={handleCartCheckout}>Checkout via WhatsApp</button></div></div>)}</motion.div>);
  
  const renderAdminProducts = () => (<div className="p-4"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-800">Kelola Produk</h2><button onClick={handleAddProduct} className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg"><Plus size={18} className="mr-1" /> Tambah</button></div><div className="bg-white rounded-xl shadow-sm overflow-hidden"><table className="w-full"> <thead className="bg-gray-50"><tr><th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Produk</th><th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Harga</th><th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Kategori</th><th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Aksi</th></tr></thead><tbody className="divide-y divide-gray-200">{products.map(product => (<tr key={product.id} onClick={() => handleEditProduct(product)} className="hover:bg-gray-50 cursor-pointer"><td className="py-4 px-4"><div className="flex items-center"><img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded mr-3"/><span className="font-medium text-gray-800">{product.name}</span></div></td><td className="py-4 px-4"><span className={`font-bold ${getCategoryColor(product.category)}`}>Rp{product.price.toLocaleString()}</span>{product.discount > 0 && (<span className="ml-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">-{product.discount}%</span>)}</td><td className="py-4 px-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span></td><td className="py-4 px-4"><div className="flex space-x-2"><button onClick={(e) => { e.stopPropagation(); handleEditProduct(product); }} className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg"><Edit3 size={14} /></button><button onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }} className="p-1.5 bg-red-100 text-red-700 rounded-lg"><Trash2 size={14} /></button></div></td></tr>))}</tbody></table></div></div>);
  
  const renderAdminCategories = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Kategori Produk</h2>
        <button onClick={handleAddCategory} className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg">
          <Plus size={18} className="mr-1" /> Tambah
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map(category => (
          <div key={category.id} className="bg-white rounded-xl p-4 shadow-sm text-center relative group">
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleEditCategory(category)} 
                className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
              >
                <Edit3 size={12} />
              </button>
              <button 
                onClick={() => deleteCategory(category.id)} 
                className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
              <span className="text-lg">{category.icon}</span>
            </div>
            <h3 className="font-medium text-gray-800">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderAdminPromos = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Kelola Kode Promo</h2>
        <button onClick={handleAddPromo} className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg">
          <Plus size={18} className="mr-1" /> Tambah
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Kode</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Diskon</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {promos.map(promo => (
              <tr key={promo.id} className="hover:bg-gray-50">
                <td className="py-4 px-4 font-mono font-medium text-emerald-700">{promo.code}</td>
                <td className="py-4 px-4">
                  {promo.discount > 0 ? (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">-{promo.discount}%</span>
                  ) : promo.freeShipping ? (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm">Gratis Ongkir</span>
                  ) : (
                    <span className="text-gray-500 text-sm">-</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <button 
                    onClick={() => togglePromoStatus(promo.id)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                      promo.active 
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {promo.active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditPromo(promo)}
                      className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => deletePromo(promo.id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAdminStreams = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Live Streaming</h2>
        <button onClick={handleAddStream} className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg">
          <Plus size={18} className="mr-1" /> Tambah
        </button>
      </div>
      <div className="space-y-4">
        {streams.map(stream => (
          <div key={stream.id} className="bg-white rounded-xl p-4 shadow-sm relative">
            <div className="absolute top-4 right-4 flex space-x-2">
              <button onClick={() => handleEditStream(stream)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                <Edit3 size={16} />
              </button>
              <button onClick={() => deleteStream(stream.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex items-start">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                <Video size={24} className="text-emerald-600" />
              </div>
              <div className="flex-1 pr-16">
                <h3 className="font-bold text-gray-800">{stream.title}</h3>
                <p className="text-sm text-gray-600 mt-1 truncate">{stream.url}</p>
                <div className="mt-2 flex items-center text-sm text-red-500">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  Live • {stream.viewers.toLocaleString()} penonton
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderLive = () => (
    <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto pb-20 bg-gray-900">
      <div className="bg-gray-800 sticky top-0 z-10 shadow-sm p-4 flex items-center">
         <button onClick={() => setCurrentView('home')} className="p-2 rounded-full hover:bg-gray-700 mr-2">
            <ChevronLeft size={20} className="text-white" />
         </button>
         <h1 className="font-bold text-lg text-white">Kriuké Live</h1>
      </div>
      <div className="p-4 space-y-4">
        {streams.length === 0 ? (
           <div className="text-center text-gray-400 mt-10">
              <Tv size={48} className="mx-auto mb-4 opacity-50" />
              <p>Belum ada live streaming saat ini.</p>
           </div>
        ) : (
          streams.map(stream => (
            <div key={stream.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
              <div className="relative aspect-video bg-black flex items-center justify-center">
                 <Video size={48} className="text-gray-600" />
                 <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center font-bold">
                    <span className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse"></span> LIVE
                 </div>
                 <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center">
                    <User size={12} className="mr-1" /> {stream.viewers}
                 </div>
              </div>
              <div className="p-4">
                 <h3 className="font-bold text-white text-lg mb-1">{stream.title}</h3>
                 <p className="text-emerald-400 text-sm mb-3">Kriuké Official</p>
                 <button onClick={() => window.open(stream.url, '_blank')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium">
                    Tonton Sekarang
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );

  const renderAccount = () => {
      // Helper icons for the menu that might not be in main imports
      const LockIcon = KeyRound;
      const BellIcon = Video; // Placeholder for Bell

      if (currentView === 'akun' && isAuthenticated && currentUser) {
        // Mock data for UI similarity
        const coins = 36488;
        const points = 40697;
        const saldo = 10065;
        
        return (
          <motion.div key="akun" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto pb-24 bg-gray-50">
            {/* Profile Header */}
            <div className="bg-white p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                        <User size={28} className="text-gray-400" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-gray-800 leading-tight">{currentUser.name || currentUser.username}</h2>
                        <div className="flex items-center text-gray-500 text-sm">
                            <span>{currentUser.whatsapp ? `${currentUser.whatsapp.substring(0, 4)}****${currentUser.whatsapp.substring(currentUser.whatsapp.length - 4)}` : '0812****890'}</span>
                            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center ml-2">
                                <Check size={10} className="text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full border">
                    <Edit3 size={18} />
                </button>
            </div>

            {/* Plus Banner */}
            <div className="bg-white m-4 mt-4 border rounded-lg flex items-center justify-between p-3 shadow-sm cursor-pointer">
                <div className="flex items-center">
                    <span className="font-black text-emerald-600 italic mr-2 text-lg">PLUS</span>
                    <div className="text-xs text-gray-600">
                        <span className="font-bold text-gray-800 block">Nikmatin Bebas Ongkir tanpa batas!</span>
                        <span>Langganan PLUS diskon 25%</span>
                    </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
            </div>

            {/* Saldo & Points */}
            <div className="m-4">
                <div className="flex justify-between items-center mb-2 px-1">
                    <h3 className="font-bold text-gray-800 text-lg">Saldo & Points</h3>
                    <span className="text-green-600 font-bold text-xs cursor-pointer">Lihat Semua</span>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm grid grid-cols-3 divide-x divide-gray-100">
                    <div className="flex flex-col items-center text-center px-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1 text-blue-600">
                           <Wallet size={18} />
                        </div>
                        <span className="font-bold text-sm text-gray-800">Rp0</span>
                        <span className="text-[10px] text-gray-500">{coins.toLocaleString()} Coins</span>
                    </div>
                    <div className="flex flex-col items-center text-center px-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-1 text-purple-600">
                           <Coins size={18} />
                        </div>
                        <span className="font-bold text-sm text-gray-800">Rp{points.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-500">12.574 points</span>
                    </div>
                     <div className="flex flex-col items-center text-center px-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mb-1 text-emerald-600">
                           <CreditCard size={18} />
                        </div>
                        <span className="font-bold text-sm text-gray-800">Rp{saldo.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-500">Saldo Toko</span>
                    </div>
                </div>
            </div>

            {/* Member Status */}
            <div className="m-4">
                <div className="flex justify-between items-center mb-2 px-1">
                     <div className="flex items-center">
                        <div className="bg-amber-100 p-1 rounded-full mr-2">
                            <Crown size={16} className="text-amber-500 fill-amber-500" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Member Gold</h3>
                     </div>
                     <ChevronRight size={16} className="text-gray-400" />
                </div>
                 <div className="bg-white rounded-xl p-4 shadow-sm grid grid-cols-3 gap-2 text-center">
                     <div className="flex flex-col items-center">
                         <div className="bg-green-50 p-2 rounded-lg mb-1 text-green-600"><UserCog size={20}/></div>
                         <span className="text-[10px] font-bold text-gray-700">Tokomember</span>
                         <span className="text-[10px] text-gray-500">1 Toko</span>
                     </div>
                      <div className="flex flex-col items-center">
                         <div className="bg-blue-50 p-2 rounded-lg mb-1 text-blue-600"><CheckCircle size={20}/></div>
                         <span className="text-[10px] font-bold text-gray-700">Misi Seru</span>
                         <span className="text-[10px] text-gray-500">5 Tantangan</span>
                     </div>
                      <div className="flex flex-col items-center">
                         <div className="bg-green-50 p-2 rounded-lg mb-1 text-green-600"><Ticket size={20}/></div>
                         <span className="text-[10px] font-bold text-gray-700">Kupon Saya</span>
                         <span className="text-[10px] text-gray-500">48 Kupon</span>
                     </div>
                 </div>
            </div>

            {/* Account Settings Menu */}
            <div className="m-4 mt-6">
                <h3 className="font-bold text-gray-800 mb-3 text-lg">Pengaturan Akun</h3>
                <div className="space-y-1">
                    {/* Admin Access Button - Only if Admin */}
                    {currentUser.role === 'admin' && (
                         <button onClick={() => { setActiveTab('admin'); setCurrentView('admin'); }} className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border-l-4 border-emerald-500 mb-3">
                            <div className="flex items-center">
                                <Shield size={20} className="text-emerald-600 mr-3" />
                                <span className="font-medium text-gray-800">Panel Admin Dashboard</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                        </button>
                    )}

                    {[
                        { icon: HomeIcon, label: "Daftar Alamat", sub: "Atur alamat pengiriman belanjaan" },
                        { icon: CreditCard, label: "Rekening Bank", sub: "Tarik Saldo ke rekening tujuan" },
                        { icon: Wallet, label: "Metode Pembayaran", sub: "Atur metode pembayaran" },
                        { icon: LockIcon, label: "Keamanan Akun", sub: "Kata sandi, PIN, & verifikasi data" },
                        { icon: BellIcon, label: "Notifikasi", sub: "Atur segala jenis notifikasi" },
                        { icon: HelpCircle, label: "Bantuan Kriuké Care", sub: "Pusat Bantuan & Layanan Pelanggan" },
                    ].map((item, idx) => {
                         const Icon = item.icon;
                         return (
                            <div key={idx} className="flex items-start p-4 bg-white hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 first:rounded-t-lg last:rounded-b-lg">
                                <Icon size={22} className="text-gray-600 mr-4 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 text-sm">{item.label}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                                </div>
                                <ChevronRight size={16} className="text-gray-400 mt-1" />
                            </div>
                         )
                    })}
                </div>
                 
                <button onClick={handleLogout} className="w-full mt-6 mb-4 flex items-center justify-center bg-white border border-red-200 text-red-500 p-3 rounded-lg font-bold hover:bg-red-50 transition-colors">
                    <LogOut size={18} className="mr-2" />
                    Keluar
                </button>
            </div>

            <div className="text-center text-gray-400 text-xs pb-4">
                Version 2.4.0 (150)
            </div>
          </motion.div>
        );
      }

      // Default placeholder if needed
      return (<div className="flex-1 overflow-y-auto pb-20 p-4"><div className="flex items-center mb-6"><Home className="text-emerald-600 mr-2" size={28} /><h1 className="text-2xl font-bold text-emerald-700">Halaman</h1></div><div className="bg-white p-6 rounded-xl text-center"><p className="text-gray-600">Halaman tidak ditemukan.</p><button onClick={() => setCurrentView('home')} className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium">Kembali ke Toko</button></div></div>);
  };
  const renderLogin = () => (<motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col"><div className="bg-white sticky top-0 z-10 shadow-sm"><div className="flex items-center p-4"><button onClick={() => setCurrentView('home')} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={20} className="text-emerald-600" /></button><h1 className="font-bold text-lg text-gray-800 mx-auto">Login</h1><div className="w-10"></div></div></div><div className="flex-1 overflow-y-auto p-4 flex flex-col pb-40"><div className="w-full max-w-sm mx-auto"><form onSubmit={handleLogin} className="bg-white p-6 rounded-xl shadow-lg space-y-4"><div className="text-center"><h2 className="text-2xl font-bold text-emerald-700">Login Kriuké</h2><p className="text-gray-500">Masuk untuk melanjutkan belanja.</p></div>{authError && <p className="text-red-500 text-sm text-center">{authError}</p>}<div><label className="block text-sm font-medium text-gray-700 mb-1">Username</label><div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/><input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder="Contoh: pelanggan" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><div className="relative"><KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/><input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="password123" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div></div><div className="text-right text-sm"><button type="button" onClick={() => alert('Fitur Lupa Password sedang dalam pengembangan.')} className="font-medium text-emerald-600 hover:underline">Lupa Password?</button></div><button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold">Login</button><div className="relative my-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">atau login dengan</span></div></div><div className="flex space-x-3">{['Google', 'Facebook', 'TikTok'].map(provider => (<button key={provider} type="button" onClick={() => alert(`Login dengan ${provider} belum tersedia.`)} className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">{provider}</button>))}</div><p className="text-center text-sm">Belum punya akun? <button type="button" onClick={() => setCurrentView('register')} className="font-medium text-emerald-600 hover:underline">Daftar</button></p></form></div></div></motion.div>);
  const renderRegister = () => {
      const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setRegisterData({ ...registerData, [e.target.name]: e.target.value });
      };
      return (<motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col"><div className="bg-white sticky top-0 z-10 shadow-sm"><div className="flex items-center p-4"><button onClick={() => setCurrentView('home')} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={20} className="text-emerald-600" /></button><h1 className="font-bold text-lg text-gray-800 mx-auto">Daftar Akun</h1><div className="w-10"></div></div></div><div className="flex-1 overflow-y-auto p-4 pb-40"><div className="w-full max-w-sm mx-auto"><form onSubmit={handleRegister} className="bg-white p-6 rounded-xl shadow-lg space-y-3"><div className="text-center mb-2"><h2 className="text-2xl font-bold text-emerald-700">Buat Akun Baru</h2></div>{authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
      {[{name: "name", label: "Nama Lengkap", icon: User, placeholder: "Budi Santoso"}, {name: "username", label: "Username", icon: User, placeholder: "budisantoso"}, {name: "email", label: "Email", icon: Mail, placeholder: "budi@email.com"}, {name: "whatsapp", label: "No. WhatsApp", icon: Phone, placeholder: "081234567890"}, {name: "address", label: "Alamat", icon: HomeIcon, placeholder: "Jl. Mangga No. 12"}].map(field => { const Icon = field.icon; return (<div key={field.name}><label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label><div className="relative"><Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/><input type="text" name={field.name} value={(registerData as any)[field.name]} onChange={handleRegisterChange} placeholder={field.placeholder} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div></div>)})}
      {[{name: "password", label: "Password"}, {name: "confirmPassword", label: "Konfirmasi Password"}].map(field => (<div key={field.name}><label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label><div className="relative"><KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/><input type="password" name={field.name} value={(registerData as any)[field.name]} onChange={handleRegisterChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div></div>))}
      <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold mt-2">Daftar</button><p className="text-center text-sm">Sudah punya akun? <button type="button" onClick={() => setCurrentView('login')} className="font-medium text-emerald-600 hover:underline">Login</button></p></form></div></div></motion.div>)
  };

  const renderFeed = () => (
    <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto pb-20 bg-gray-50">
      <div className="bg-white sticky top-0 z-10 shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => setCurrentView('home')} className="p-2 rounded-full hover:bg-gray-100 mr-2">
             <ChevronLeft size={20} className="text-emerald-600" />
          </button>
          <h1 className="font-bold text-lg text-gray-800">Kriuké Feed</h1>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100"><MessageCircle size={20} className="text-emerald-600" /></button>
      </div>
      
      {/* Create Post Section */}
      <div className="bg-white p-4 mb-2 border-b border-gray-100">
        <form onSubmit={handleCreatePost}>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
               <User size={24} className="m-auto mt-2 text-gray-400" />
            </div>
            <div className="flex-1">
               <textarea 
                 value={newPostContent}
                 onChange={(e) => setNewPostContent(e.target.value)}
                 placeholder={`Apa cerita barumu, ${currentUser ? currentUser.name : 'Pelanggan'}?`}
                 className="w-full p-2 bg-gray-50 border-none rounded-lg focus:ring-0 text-sm resize-none"
                 rows={2}
               />
               <div className="flex justify-between items-center mt-2">
                 <button type="button" className="text-emerald-600 p-1 hover:bg-emerald-50 rounded">
                   <ImageIcon size={18} />
                 </button>
                 <button type="submit" disabled={!newPostContent.trim()} className={`px-4 py-1.5 rounded-full text-sm font-bold text-white ${newPostContent.trim() ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-300'}`}>
                   Kirim
                 </button>
               </div>
            </div>
          </div>
        </form>
      </div>

      <div className="divide-y divide-gray-100">
        {feedPosts.map(post => (
          <div key={post.id} className="bg-white p-4 mb-2">
            <div className="flex items-center mb-3">
              <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full mr-3 object-cover" />
              <div>
                <div className="flex items-center">
                  <h3 className="font-bold text-sm text-gray-900 mr-1">{post.user}</h3>
                  {post.role === 'admin' && <CheckCircle size={14} className="text-emerald-500 fill-emerald-500" />}
                </div>
                <p className="text-xs text-gray-500">{post.time}</p>
              </div>
              <button className="ml-auto text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
            </div>
            <p className="text-sm text-gray-800 mb-3 whitespace-pre-line">{post.content}</p>
            {post.image && (
              <div className="rounded-xl overflow-hidden mb-3 border border-gray-100">
                <img src={post.image} alt="Post content" className="w-full h-auto" />
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <div className="flex space-x-6">
                <button onClick={() => handleLikePost(post.id)} className={`flex items-center space-x-1.5 ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}>
                  <Heart size={20} className={post.isLiked ? 'fill-current' : ''} />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button onClick={() => handleOpenComment(post.id)} className="flex items-center space-x-1.5 text-gray-500">
                  <MessageCircle size={20} />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button onClick={() => handleSharePost(post)} className="flex items-center space-x-1.5 text-gray-500">
                  <Send size={20} />
                </button>
              </div>
              <button onClick={() => handleSharePost(post)} className="text-gray-400"><Share2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderPromoPage = () => (
    <motion.div key="promo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto pb-20 bg-gray-50">
      <div className="bg-white sticky top-0 z-10 shadow-sm p-4">
        <h1 className="font-bold text-lg text-gray-800">Voucher & Promo</h1>
      </div>
      <div className="p-4 space-y-4">
        {/* Flash Sale in Promo Page */}
        <div className="bg-red-100 p-3 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-red-600 font-bold">⚡ Flash Sale</h3>
                <p className="text-xs text-red-500">Berakhir dalam</p>
              </div>
              <div className="flex items-center space-x-1 text-white">
                 <span className="bg-red-500 p-1 rounded-md text-sm font-mono">{h}</span>
                 <span className="text-gray-500 text-sm">:</span>
                 <span className="bg-red-500 p-1 rounded-md text-sm font-mono">{m}</span>
                 <span className="text-gray-500 text-sm">:</span>
                 <span className="bg-red-500 p-1 rounded-md text-sm font-mono">{s}</span>
              </div>
            </div>
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
               {products.slice(0, 3).map(product => (
                 <div key={product.id} className="flex-shrink-0 w-32 bg-white rounded-lg overflow-hidden" onClick={() => openProductDetail(product)}>
                    <img src={product.image} className="w-full h-24 object-cover" />
                    <div className="p-2">
                        <p className="text-red-600 font-bold text-xs">Rp{product.price.toLocaleString()}</p>
                        <p className="text-gray-400 line-through text-[10px]">Rp{product.originalPrice.toLocaleString()}</p>
                    </div>
                 </div>
               ))}
            </div>
        </div>

        <div className="flex space-x-2">
            <input type="text" placeholder="Masukkan kode promo" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium">Pakai</button>
        </div>
        
        {promos.filter(p => p.active).map(promo => (
          <div key={promo.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="bg-emerald-500 w-2 h-full absolute left-0 top-0"></div>
            <div className="p-4 pl-6 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">{promo.code}</h3>
                    <p className="text-sm text-gray-600">
                        {promo.freeShipping ? 'Gratis Ongkir ke seluruh Indonesia' : `Diskon ${promo.discount}% untuk semua produk`}
                    </p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Clock size={12} className="mr-1" /> Berlaku hingga 31 Des 2024
                    </div>
                </div>
                <button onClick={() => {
                     navigator.clipboard.writeText(promo.code);
                     alert('Kode promo disalin!');
                }} className="text-emerald-600 font-medium text-sm bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100">
                    Salin
                </button>
            </div>
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderAdminDashboard = () => (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Penjualan</p>
          <h3 className="text-2xl font-bold text-gray-800">Rp15.2jt</h3>
          <span className="text-xs text-green-500 flex items-center mt-1"><Plus size={10} /> 12% bulan ini</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Order</p>
          <h3 className="text-2xl font-bold text-gray-800">1,245</h3>
          <span className="text-xs text-green-500 flex items-center mt-1"><Plus size={10} /> 8% bulan ini</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Statistik Penjualan</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
              <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Kategori Terlaris</h3>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {categoryData.map((entry, index) => (
            <div key={index} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
              <span className="text-xs text-gray-600">{entry.name} ({entry.value}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden font-sans">
      {(currentView === 'home' || currentView === 'admin') && (<header className="bg-white shadow-sm pt-2 px-4 pb-1 sticky top-0 z-10"><div className="flex items-center justify-between mb-2"><div className="flex items-center space-x-3"><img src="https://png.pngtree.com/png-clipart/20230917/original/pngtree-verified-check-icon-social-media-verified-badge-png-image_12291764.png" alt="Kriuké Logo" className="w-10 h-10 object-contain" /><h1 className="text-xl font-bold text-emerald-700">Kriuké</h1><span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">Official</span></div><div className="flex items-center space-x-2"><button onClick={() => setCurrentView('live')} className="p-2 rounded-full hover:bg-gray-100"><Video size={20} className="text-red-500" /></button><button onClick={() => setCurrentView('cart')} className="p-2 rounded-full hover:bg-gray-100 relative"><ShoppingCart size={20} className="text-emerald-600" />{cartCount > 0 && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>)}</button><button onClick={() => setShowContactModal(true)} className="p-2 rounded-full hover:bg-gray-100"><MessageCircle size={20} className="text-green-600" /></button></div></div>{currentView === 'home' && (<div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} /><input type="text" placeholder="Cari keripik, parfum, atau kaos..." className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300"/></div>)}</header>)}
      <AnimatePresence mode="wait">
        {currentView === 'home' ? renderHome() :
         currentView === 'detail' ? renderDetail() :
         currentView === 'cart' ? renderCart() :
         currentView === 'feed' ? renderFeed() : 
         currentView === 'login' ? renderLogin() :
         currentView === 'register' ? renderRegister() :
         currentView === 'promo' ? renderPromoPage() :
         currentView === 'live' ? renderLive() :
         currentView === 'admin' ? (isAuthenticated && currentUser?.role === 'admin' ? (<motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex overflow-hidden"><div className="w-16 bg-emerald-700 text-white flex flex-col items-center py-4 space-y-6"><button onClick={() => setAdminView('dashboard')} className={`p-3 rounded-lg ${adminView === 'dashboard' ? 'bg-emerald-600' : ''}`} title="Dashboard"><BarChart3 size={20} /></button><button onClick={() => setAdminView('products')} className={`p-3 rounded-lg ${adminView === 'products' ? 'bg-emerald-600' : ''}`} title="Produk"><Grid size={20} /></button><button onClick={() => setAdminView('categories')} className={`p-3 rounded-lg ${adminView === 'categories' ? 'bg-emerald-600' : ''}`} title="Kategori"><Package size={20} /></button><button onClick={() => setAdminView('promos')} className={`p-3 rounded-lg ${adminView === 'promos' ? 'bg-emerald-600' : ''}`} title="Promo"><Percent size={20} /></button><button onClick={() => setAdminView('streams')} className={`p-3 rounded-lg ${adminView === 'streams' ? 'bg-emerald-600' : ''}`} title="Live"><Video size={20} /></button></div><div className="flex-1 overflow-y-auto pb-20">{adminView === 'dashboard' ? renderAdminDashboard() : adminView === 'products' ? renderAdminProducts() : adminView === 'categories' ? renderAdminCategories() : adminView === 'promos' ? renderAdminPromos() : renderAdminStreams()}</div></motion.div>) : renderHome()) :
         renderAccount()}
      </AnimatePresence>
      {!['detail', 'login', 'register', 'live'].includes(currentView) && (
        <nav className="bg-white border-t fixed bottom-0 left-0 right-0 max-w-md mx-auto z-20">
          <div className="grid grid-cols-5">
            {[ { id: 'home', label: 'Home', icon: Home }, { id: 'feed', label: 'Feed', icon: Newspaper }, { id: 'promo', label: 'Promo', icon: Tag }, { id: 'cart', label: 'Keranjang', icon: ShoppingCart, custom: true }, isAuthenticated ? { id: 'akun', label: 'Akun', icon: User } : { id: 'login', label: 'Login', icon: LogIn } ].map(item => {
              const isActive = activeTab === item.id || (item.id === 'cart' && currentView === 'cart');
              const Icon = item.icon;
              return (<button key={item.id} onClick={() => { if (item.id === 'cart') { setCurrentView('cart'); } else { setActiveTab(item.id as View); setCurrentView(item.id as View); }}} className={`py-3 flex flex-col items-center relative ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}><Icon size={20} />{item.id === 'cart' && cartCount > 0 && (<span className="absolute top-1 right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>)}<span className="text-xs mt-1">{item.label}</span></button>);
            })}
          </div>
        </nav>
      )}
      {/* ... (Modals remain the same: ShowShare, ShowCheckout) ... */}
      <AnimatePresence>{showShare && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowShare(false)}><motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full rounded-t-2xl p-4" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-800">Bagikan Kriuké</h3><button onClick={() => setShowShare(false)}><X size={20} /></button></div><div className="grid grid-cols-2 gap-3 mb-4"><button onClick={shareToWhatsApp} className="flex flex-col items-center p-3 bg-emerald-50 rounded-lg"><div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-2"><MessageCircle size={20} className="text-white" /></div><span className="text-sm font-medium">WhatsApp</span></button><button onClick={copyLink} className="flex flex-col items-center p-3 bg-emerald-50 rounded-lg"><div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-2"><Copy size={20} className="text-white" /></div><span className="text-sm font-medium">Salin Link</span></button></div>{isCopied && (<div className="flex items-center bg-emerald-50 text-emerald-700 p-3 rounded-lg"><CheckCircle size={16} className="mr-2" /><span>Link Kriuké disalin!</span></div>)}</motion.div></motion.div>)}</AnimatePresence>
      <AnimatePresence>{showCheckout && (selectedProduct || checkoutMode === 'cart') && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowCheckout(false)}><motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full rounded-t-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}><div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10"><h2 className="text-xl font-bold text-gray-800">{checkoutMode === 'cart' ? 'Checkout Keranjang' : 'Checkout Produk'}</h2><button onClick={() => setShowCheckout(false)} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button></div>
      <form onSubmit={(e) => { 
        e.preventDefault(); 
        if (!checkoutData.name || !checkoutData.whatsapp) { 
            alert('❌ Mohon lengkapi Nama dan No WhatsApp'); 
            return; 
        } 
        setIsSubmitting(true); 
        setTimeout(() => { 
            const productDetails = checkoutMode === 'cart' 
                ? cart.map(item => `- ${item.name} (${item.quantity}x) @ Rp${item.price.toLocaleString()}`).join('\n')
                : `Produk: ${selectedProduct?.name}\nHarga: Rp${selectedProduct?.price.toLocaleString()}\nJumlah: ${checkoutData.quantity}`;
            
            const message = `*PESANAN DARI KRIUKÉ APP (${checkoutMode === 'cart' ? 'Keranjang' : 'Beli Langsung'})*\n\n${productDetails}\n\nSubtotal: Rp${currentSubtotal.toLocaleString()}\nKode Promo: ${checkoutData.promoCode || '-'}\nDiskon: Rp${promoDiscount.toLocaleString()}\nOngkir: ${isFreeShipping ? 'GRATIS' : `Rp${shippingCost.toLocaleString()}`}\nTotal: *Rp${finalTotal.toLocaleString()}*\n\nData Pelanggan:\nNama: ${checkoutData.name}\nAlamat: ${checkoutData.address}\nWA: ${checkoutData.whatsapp}\nCatatan: ${checkoutData.notes || '-'}\n\nTerima kasih telah memilih _Kriuké_! 🍌\nTim kami akan segera menghubungi Anda.`.trim(); 
            window.open(`https://wa.me/6283854488111?text=${encodeURIComponent(message)}`, '_blank'); 
            setIsSubmitting(false); 
            setShowCheckout(false); 
            if (checkoutMode === 'cart') {
                setCart([]);
                setCurrentView('home');
                setActiveTab('home');
            } else if (selectedProduct) {
                addToCart(selectedProduct, checkoutData.quantity);
            }
        }, 1000); 
      }} className="p-4 space-y-4">
          <div className="bg-emerald-50 p-3 rounded-lg">
              {checkoutMode === 'cart' ? (
                  <div className="space-y-2">
                      <p className="font-medium text-emerald-800 mb-2">Ringkasan Pesanan ({cartCount} Item)</p>
                      <div className="max-h-32 overflow-y-auto text-sm space-y-1">
                          {cart.map(item => (
                              <div key={item.id} className="flex justify-between">
                                  <span className="text-gray-700 truncate w-2/3">{item.name} x{item.quantity}</span>
                                  <span className="font-medium text-gray-900">Rp{(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              ) : (
                  <div className="flex">
                      <img src={selectedProduct?.image} alt={selectedProduct?.name} className="w-16 h-16 object-cover rounded"/>
                      <div className="ml-3 flex-1">
                          <h3 className="font-medium text-gray-800 line-clamp-2">{selectedProduct?.name}</h3>
                          <p className="text-xl font-bold text-emerald-600">Rp{selectedProduct?.price.toLocaleString()}</p>
                      </div>
                  </div>
              )}
          </div>
          <div className="space-y-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label><input type="text" value={checkoutData.name} onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: Budi Santoso" required/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label><textarea value={checkoutData.address} onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Jl. Mangga No. 12, Bandung"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">No WhatsApp</label><div className="relative"><span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">+62</span><input type="tel" value={checkoutData.whatsapp} onChange={(e) => setCheckoutData({...checkoutData, whatsapp: e.target.value})} className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="81234567890" required/></div></div>
              {checkoutMode === 'single' && (
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label><div className="flex items-center border border-gray-300 rounded-lg"><button type="button" onClick={() => setCheckoutData({...checkoutData, quantity: Math.max(1, checkoutData.quantity - 1)})} className="w-10 h-10 flex items-center justify-center text-emerald-600">-</button><input type="number" value={checkoutData.quantity} onChange={(e) => setCheckoutData({...checkoutData, quantity: parseInt(e.target.value) || 1})} min="1" className="flex-1 text-center py-2 border-x border-gray-300 focus:outline-none"/><button type="button" onClick={() => setCheckoutData({...checkoutData, quantity: checkoutData.quantity + 1})} className="w-10 h-10 flex items-center justify-center text-emerald-600">+</button></div></div>
              )}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Kode Promo</label><div className="flex"><input type="text" value={checkoutData.promoCode} onChange={(e) => setCheckoutData({...checkoutData, promoCode: e.target.value})} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: KRIUKE10"/><button type="button" onClick={() => { const code = checkoutData.promoCode.toUpperCase(); if (validPromoCodes[code]) { alert(`✅ Kode ${code} valid!`); } else if (code) { alert('❌ Kode promo tidak valid'); } }} className="bg-emerald-600 text-white px-4 rounded-r-lg flex items-center"><Check size={16} /></button></div><p className="text-xs text-emerald-600 mt-1">Aktif: KRIUKE10, GRATISONGKIR, DTFHARMONI</p></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label><input type="text" value={checkoutData.notes} onChange={(e) => setCheckoutData({...checkoutData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Warna kaos, varian rasa, dll"/></div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg"><h3 className="font-bold text-gray-800 mb-2">Rincian Harga</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span className="font-medium">Rp{currentSubtotal.toLocaleString()}</span></div>{promoDiscount > 0 && (<div className="flex justify-between text-emerald-600"><span>Diskon Promo</span><span>-Rp{promoDiscount.toLocaleString()}</span></div>)}<div className="flex justify-between"><span>Ongkos Kirim</span><span>{isFreeShipping ? 'GRATIS' : `Rp${shippingCost.toLocaleString()}`}</span></div><div className="flex justify-between pt-2 border-t font-bold text-lg"><span>Total Bayar</span><span className="text-emerald-600">Rp{finalTotal.toLocaleString()}</span></div></div></div>
          <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-4 rounded-xl font-bold text-white ${isSubmitting ? 'bg-emerald-400' : 'bg-emerald-600'} flex items-center justify-center`}>{isSubmitting ? (<><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Mengirim...</>) : ('Kirim Pesanan ke WhatsApp')}</button><p className="text-xs text-gray-500 text-center">📲 Tim Kriuké akan balas maks. 1 jam.</p></form></motion.div></motion.div>)}</AnimatePresence>
      
      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowContactModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">Tanya Admin via WhatsApp</h3>
                <button onClick={() => setShowContactModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Anda</label>
                  <input 
                    type="text" 
                    value={contactData.name} 
                    onChange={(e) => setContactData({...contactData, name: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pesan / Pertanyaan</label>
                  <textarea 
                    value={contactData.message} 
                    onChange={(e) => setContactData({...contactData, message: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                    rows={3}
                    placeholder="Tanya stok, detail produk, dll..."
                    required 
                  />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center">
                  <MessageCircle size={18} className="mr-2" />
                  Kirim ke WhatsApp
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Modal */}
      <AnimatePresence>
        {showCommentModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowCommentModal(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full rounded-t-2xl p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">Komentar</h3>
                <button onClick={() => setShowCommentModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handlePostComment} className="flex items-end space-x-2">
                 <textarea 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 resize-none"
                    placeholder="Tulis komentar..."
                    rows={3}
                    autoFocus
                  />
                  <button type="submit" disabled={!commentText.trim()} className={`p-3 rounded-full ${commentText.trim() ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <Send size={20} />
                  </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Product Modal */}
      <AnimatePresence>
        {showReviewModal && selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowReviewModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">Ulas Produk ke Feed</h3>
                <button onClick={() => setShowReviewModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex items-center mb-4 bg-gray-50 p-2 rounded-lg">
                 <img src={selectedProduct.image} className="w-12 h-12 object-cover rounded mr-3" />
                 <div>
                    <p className="font-bold text-sm text-gray-800 line-clamp-1">{selectedProduct.name}</p>
                    <p className="text-emerald-600 text-xs font-bold">Rp{selectedProduct.price.toLocaleString()}</p>
                 </div>
              </div>
              <form onSubmit={handleProductToFeed}>
                 <textarea 
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 mb-4"
                    placeholder="Bagaimana pendapatmu tentang produk ini?"
                    rows={4}
                  />
                  <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700">
                    Bagikan ke Feed
                  </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ... (Other Modals: Promo, Product, Category, Stream - kept as is) ... */}
      {/* Promo Modal */}
      <AnimatePresence>
        {showPromoModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPromoModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">{editingPromo ? 'Edit Promo' : 'Tambah Promo'}</h3>
                <button onClick={() => setShowPromoModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleSavePromo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Promo</label>
                  <input 
                    type="text" 
                    value={promoFormData.code} 
                    onChange={(e) => setPromoFormData({...promoFormData, code: e.target.value.toUpperCase()})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                    placeholder="CONTOH10"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diskon (%)</label>
                  <input 
                    type="number" 
                    value={promoFormData.discount} 
                    onChange={(e) => setPromoFormData({...promoFormData, discount: Number(e.target.value), freeShipping: false})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                    min="0" max="100"
                    disabled={promoFormData.freeShipping}
                  />
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="freeShipping"
                    checked={promoFormData.freeShipping} 
                    onChange={(e) => setPromoFormData({...promoFormData, freeShipping: e.target.checked, discount: e.target.checked ? 0 : promoFormData.discount})} 
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="freeShipping" className="ml-2 text-sm text-gray-700">Gratis Ongkir</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="activeStatus"
                    checked={promoFormData.active} 
                    onChange={(e) => setPromoFormData({...promoFormData, active: e.target.checked})} 
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="activeStatus" className="ml-2 text-sm text-gray-700">Status Aktif</label>
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700 mt-2">
                  Simpan
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowProductModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
                <h3 className="font-bold text-lg text-gray-800">{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h3>
                <button onClick={() => setShowProductModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={productFormData.name} 
                      onChange={(e) => setProductFormData({...productFormData, name: e.target.value})} 
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                      placeholder="Nama Produk"
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                    <input 
                      type="number" 
                      value={productFormData.price} 
                      onChange={(e) => setProductFormData({...productFormData, price: Number(e.target.value)})} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                      min="0"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga Asli (Coret)</label>
                    <input 
                      type="number" 
                      value={productFormData.originalPrice} 
                      onChange={(e) => setProductFormData({...productFormData, originalPrice: Number(e.target.value)})} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diskon (%)</label>
                    <input 
                      type="number" 
                      value={productFormData.discount} 
                      onChange={(e) => setProductFormData({...productFormData, discount: Number(e.target.value)})} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                      min="0" max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select 
                      value={productFormData.category} 
                      onChange={(e) => setProductFormData({...productFormData, category: e.target.value as any})} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="keripik">Keripik</option>
                      <option value="snack">Snack</option>
                      <option value="kaos">Kaos</option>
                      <option value="parfum">Parfum</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
                  <div className="relative">
                    <ImageIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={productFormData.image} 
                      onChange={(e) => setProductFormData({...productFormData, image: e.target.value})} 
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                      placeholder="https://..."
                      required 
                    />
                  </div>
                  {productFormData.image && (
                    <div className="mt-2 w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={productFormData.image} alt="Preview" className="w-full h-full object-contain" onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=Invalid+Image'} />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea 
                    value={productFormData.description} 
                    onChange={(e) => setProductFormData({...productFormData, description: e.target.value})} 
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Deskripsi produk..."
                  />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                    <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            value={productFormData.location} 
                            onChange={(e) => setProductFormData({...productFormData, location: e.target.value})} 
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                            placeholder="Kota Asal"
                        />
                    </div>
                </div>

                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="productFreeShipping"
                    checked={productFormData.freeShipping} 
                    onChange={(e) => setProductFormData({...productFormData, freeShipping: e.target.checked})} 
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="productFreeShipping" className="ml-2 text-sm text-gray-700">Gratis Ongkir</label>
                </div>

                <div className="pt-2 border-t mt-4">
                    <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700">
                    Simpan Produk
                    </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCategoryModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
                <button onClick={() => setShowCategoryModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                  <input 
                    type="text" 
                    value={categoryFormData.name} 
                    onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Contoh: Keripik"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ikon (Emoji)</label>
                  <div className="relative">
                    <Smile size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={categoryFormData.icon} 
                      onChange={(e) => setCategoryFormData({...categoryFormData, icon: e.target.value})} 
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                      placeholder="Contoh: 🍌"
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warna Background</label>
                  <select 
                    value={categoryFormData.color} 
                    onChange={(e) => setCategoryFormData({...categoryFormData, color: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="bg-emerald-100">Hijau (Default)</option>
                    <option value="bg-blue-100">Biru</option>
                    <option value="bg-red-100">Merah</option>
                    <option value="bg-amber-100">Kuning</option>
                    <option value="bg-purple-100">Ungu</option>
                    <option value="bg-gray-100">Abu-abu</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700 mt-2">
                  Simpan
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stream Modal */}
      <AnimatePresence>
        {showStreamModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowStreamModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">{editingStream ? 'Edit Live Stream' : 'Tambah Live Stream'}</h3>
                <button onClick={() => setShowStreamModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveStream} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Live</label>
                  <input 
                    type="text" 
                    value={streamFormData.title} 
                    onChange={(e) => setStreamFormData({...streamFormData, title: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Judul Live Streaming"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Stream</label>
                  <div className="relative">
                    <LinkIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={streamFormData.url} 
                      onChange={(e) => setStreamFormData({...streamFormData, url: e.target.value})} 
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                      placeholder="https://youtube.com/..."
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Penonton (Simulasi)</label>
                  <input 
                    type="number" 
                    value={streamFormData.viewers} 
                    onChange={(e) => setStreamFormData({...streamFormData, viewers: parseInt(e.target.value) || 0})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                    min="0"
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700 mt-2">
                  Simpan
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
