
import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight, 
  Star, MapPin, Share2, Truck,
  Home, Newspaper, Tag, User, X, Check, Percent,
  Plus, Edit3, Trash2, Video, BarChart3, Grid, Package,
  Copy, CheckCircle, Shirt, Leaf, Droplet, LogIn, Shield, LogOut, KeyRound, Mail, Phone, HomeIcon, Clock, Heart, MoreHorizontal, Send, Image as ImageIcon, FileText,
  Wallet, Coins, CreditCard, Settings, Crown, Ticket, UserCog, HelpCircle, Link as LinkIcon, Smile, Tv, Pen,
  Utensils, Smartphone, Zap, Gamepad2, Plane, Monitor, Gift, LayoutGrid, ShoppingBag, TrendingUp, ClipboardList,
  Lock, Unlock, Award, BadgeCheck, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Product, Category, Promo, Stream, CartItem, CheckoutData, View, AdminView, User as UserType, FeedPost, PromoIconItem, Comment, Review, Transaction } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<View>('home');
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [checkoutMode, setCheckoutMode] = useState<'single' | 'cart'>('single');
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

  // Promo Icons Admin State
  const [showPromoIconModal, setShowPromoIconModal] = useState(false);
  const [editingPromoIcon, setEditingPromoIcon] = useState<PromoIconItem | null>(null);
  const [promoIconFormData, setPromoIconFormData] = useState<Omit<PromoIconItem, 'id'>>({ name: '', icon: 'Utensils', color: 'bg-orange-100', textColor: 'text-orange-600' });

  // User Management Admin State
  const [showPointModal, setShowPointModal] = useState(false);
  const [editingUserPoints, setEditingUserPoints] = useState<UserType | null>(null);
  const [pointAmount, setPointAmount] = useState(0);

  // Contact Modal State
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactData, setContactData] = useState({ name: '', message: '' });

  // Comment & Review Modal States
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  
  // Review Product State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [shareToFeed, setShareToFeed] = useState(true);

  // Auth state - Updated with Points, Verification, Blocked status
  const [users, setUsers] = useState<UserType[]>([
    { id: 1, username: 'arjune', password: 'masukin474', role: 'admin', name: 'Arjune', email: 'admin@kriuke.com', whatsapp: '081234567890', address: 'Jl. Admin No. 1, Bandung', points: 9999, isVerified: true, isBlocked: false },
    { id: 2, username: 'pelanggan', password: 'password123', role: 'customer', name: 'Pelanggan Setia', email: 'pelanggan@email.com', whatsapp: '089876543210', address: 'Jl. Pelanggan No. 10, Cimahi', points: 50, isVerified: false, isBlocked: false },
    { id: 3, username: 'budi', password: '123', role: 'customer', name: 'Budi Santoso', email: 'budi@email.com', whatsapp: '085678901234', address: 'Jakarta Selatan', points: 120, isVerified: true, isBlocked: false },
    { id: 4, username: 'siti', password: '123', role: 'customer', name: 'Siti Aminah', email: 'siti@email.com', whatsapp: '081345678901', address: 'Surabaya', points: 0, isVerified: false, isBlocked: true },
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

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
        id: 'TRX-1715432001',
        date: '12 Mei 2025, 14:30',
        items: [
            { id: 1, name: "Keripik Pisang Coklat", price: 15000, quantity: 2, originalPrice: 20000, discount: 25, rating: 4.9, sold: 2450, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/047857?text=🍫+Coklat", description: "", category: "keripik" }
        ],
        total: 30000,
        status: 'pending',
        statusLabel: 'Belum Diproses',
        paymentMethod: 'WhatsApp'
    }
  ]);

  // Feed Data
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostVideoUrl, setNewPostVideoUrl] = useState('');
  const [showVideoInput, setShowVideoInput] = useState(false);

  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: 1,
      user: "Kriuké Official",
      avatar: "https://placehold.co/100x100/10B981/ffffff?text=K",
      role: "admin",
      time: "30 menit yang lalu",
      content: "🔥 FLASH SALE ALERT! 🔥\nJangan lewatkan diskon hingga 25% untuk varian Keripik Pisang Coklat hari ini saja. Stok terbatas ya kak!",
      videoUrl: "https://www.youtube.com/watch?v=S5i3Jqj7C6s", // Dummy YouTube link
      likes: 124,
      comments: 2,
      isLiked: false,
      reaction: null,
      commentsList: [
        { id: 101, user: "Budi Santoso", avatar: "https://placehold.co/100x100/3b82f6/ffffff?text=B", text: "Wah mantap nih, borong ah!", time: "10 menit lalu" },
        { id: 102, user: "Siti Aminah", avatar: "https://placehold.co/100x100/ec4899/ffffff?text=S", text: "Kak, varian pedas ikut diskon ga?", time: "5 menit lalu" }
      ]
    },
    {
      id: 2,
      user: "Rina S.",
      avatar: "https://placehold.co/100x100/fbbf24/ffffff?text=R",
      role: "customer",
      time: "2 jam yang lalu",
      content: "Unboxing paket dari Kriuké! Packing aman banget, bubble wrap tebel. Suka banget sama parfumnya 😍",
      videoUrl: "https://www.tiktok.com/@tiktok/video/7106892042372500782", // Dummy TikTok Link
      likes: 45,
      comments: 1,
      isLiked: true,
      reaction: '❤️',
      commentsList: [
        { id: 201, user: "Kriuké Official", avatar: "https://placehold.co/100x100/10B981/ffffff?text=K", text: "Terima kasih kak Rina! Ditunggu orderan selanjutnya 🥰", time: "1 jam lalu" }
      ]
    },
    {
      id: 3,
      user: "Dimas Anggara",
      avatar: "https://placehold.co/100x100/purple/ffffff?text=D",
      role: "customer",
      time: "5 jam yang lalu",
      content: "Nyobain keripik talasnya, renyah banget ga keras. Cocok buat temen nonton drakor 🍿",
      image: "https://placehold.co/600x400/F0FDF4/065F46?text=Keripik+Talas",
      likes: 23,
      comments: 0,
      isLiked: false,
      reaction: null,
      commentsList: []
    },
    {
      id: 4,
      user: "Kriuké Official",
      avatar: "https://placehold.co/100x100/10B981/ffffff?text=K",
      role: "admin",
      time: "1 hari yang lalu",
      content: "📦 Info Pengiriman:\nPesanan yang masuk sebelum jam 15.00 WIB akan dikirim di hari yang sama ya. Yuk checkout sekarang sebelum kehabisan stok!",
      likes: 89,
      comments: 3,
      isLiked: false,
      reaction: '👍',
      commentsList: [
         { id: 401, user: "User 123", avatar: "https://placehold.co/100x100/gray/ffffff?text=U", text: "Siap min, udah CO ya", time: "20 jam lalu" }
      ]
    }
  ]);

  // Products with Dummy Reviews
  const [products, setProducts] = useState<Product[]>([
    { 
      id: 1, name: "Keripik Pisang Coklat", price: 15000, originalPrice: 20000, discount: 25, rating: 4.9, sold: 2450, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/047857?text=🍫+Coklat", description: "Keripik pisang premium dilumuri coklat dark berkualitas. Renyah dan bikin nagih!", category: "keripik",
      reviews: [
        { id: 1, userName: "Andi Pratama", userAvatar: "https://placehold.co/100x100/blue/ffffff?text=A", rating: 5, comment: "Enak banget, coklatnya tebal!", date: "2 hari lalu" },
        { id: 2, userName: "Siti Nurhaliza", userAvatar: "https://placehold.co/100x100/pink/ffffff?text=S", rating: 4, comment: "Pengiriman cepat, rasa mantap.", date: "5 hari lalu" }
      ]
    },
    { 
      id: 2, name: "Keripik Pisang Pedas", price: 15000, originalPrice: 20000, discount: 25, rating: 4.8, sold: 2180, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/059669?text=🌶️+Pedas", description: "Keripik pisang dengan baluran bumbu pedas level 8/10. Cocok untuk pecinta pedas!", category: "keripik",
      reviews: [
        { id: 3, userName: "Budi Santoso", userAvatar: "https://placehold.co/100x100/orange/ffffff?text=B", rating: 5, comment: "Pedasnya nampolll!", date: "1 minggu lalu" }
      ]
    },
    { id: 3, name: "Kaos DTF - Anomali", price: 89000, originalPrice: 120000, discount: 25, rating: 4.9, sold: 120, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/1f2937/ffffff?text=Anomali", description: "Kaos hitam premium dengan desain 'Anomali' yang artistik dan unik. Sablon DTF awet.", category: "kaos", reviews: [] },
    { id: 13, name: "Kaos DTF - Tung Tung Sahur", price: 85000, originalPrice: 115000, discount: 26, rating: 4.8, sold: 85, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/f59e0b/ffffff?text=Sahur", description: "Kaos edisi spesial Ramadhan dengan desain 'Tung Tung Sahur' yang jenaka. Bahan adem.", category: "kaos", reviews: [] },
    { id: 14, name: "Kaos DTF - Custom Kata", price: 95000, originalPrice: 130000, discount: 27, rating: 5.0, sold: 210, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/ffffff/000000?text=Custom", description: "Bebas ekspresikan dirimu! Request kata-kata atau quote favoritmu untuk disablon.", category: "kaos", reviews: [] },
    { id: 15, name: "Kaos DTF - Logo Kriuké", price: 75000, originalPrice: 100000, discount: 25, rating: 4.7, sold: 340, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/10b981/ffffff?text=Kriuké", description: "Kaos merchandise official Kriuké dengan logo minimalis di dada kiri. Simpel dan keren.", category: "kaos", reviews: [] },
    
    { id: 4, name: "Parfum HRM - Mistique", price: 95000, originalPrice: 135000, discount: 30, rating: 4.8, sold: 840, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/16A34A?text=💧+Mistique", description: "Parfum HRM Mistique – aroma woody & musky yang elegan. Tahan 8-12 jam. 50ml.", category: "parfum", reviews: [] },
    { id: 5, name: "Keripik Talas Original", price: 12000, originalPrice: 15000, discount: 20, rating: 4.6, sold: 1450, location: "Bandung", freeShipping: false, image: "https://placehold.co/300x300/F0FDF4/065F46?text=🍠+Talas", description: "Keripik talas lokal khas Jawa Barat. Renyah, gurih, dan rendah lemak.", category: "snack", reviews: [] },
    { id: 6, name: "Parfum HRM - Citrus Bloom", price: 95000, originalPrice: 135000, discount: 30, rating: 4.7, sold: 710, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/15803D?text=🍊+Citrus", description: "Aroma citrus segar dengan sentuhan floral. Ringan & menyegarkan. 50ml.", category: "parfum", reviews: [] },
    { id: 7, name: "Parfum HRM - Ocean Blue", price: 85000, originalPrice: 120000, discount: 29, rating: 4.8, sold: 450, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/0ea5e9?text=🌊+Ocean", description: "Aroma laut yang segar dan maskulin. Cocok untuk aktivitas outdoor.", category: "parfum", reviews: [] },
    { id: 8, name: "Parfum HRM - Sweet Vanilla", price: 90000, originalPrice: 125000, discount: 28, rating: 4.9, sold: 890, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/f59e0b?text=🍦+Vanilla", description: "Wangi manis vanilla yang lembut dan menenangkan. Tahan lama hingga 10 jam.", category: "parfum", reviews: [] },
    { id: 9, name: "Parfum HRM - Royal Oud", price: 150000, originalPrice: 200000, discount: 25, rating: 5.0, sold: 210, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/78350f?text=🪵+Oud", description: "Parfum mewah dengan aroma kayu gaharu (oud) yang eksotis dan elegan.", category: "parfum", reviews: [] },
    { id: 10, name: "Parfum HRM - Sakura Blossom", price: 88000, originalPrice: 110000, discount: 20, rating: 4.7, sold: 630, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/ec4899?text=🌸+Sakura", description: "Wangi bunga sakura yang feminim dan segar. Cocok untuk penggunaan sehari-hari.", category: "parfum", reviews: [] },
    { id: 11, name: "Parfum HRM - Black Musk", price: 110000, originalPrice: 145000, discount: 24, rating: 4.8, sold: 340, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/1f2937?text=🌑+Musk", description: "Aroma musk yang kuat dan misterius. Memberikan kesan berani dan percaya diri.", category: "parfum", reviews: [] },
    { id: 12, name: "Parfum HRM - Fresh Sport", price: 80000, originalPrice: 100000, discount: 20, rating: 4.6, sold: 520, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/22c55e?text=🏃+Sport", description: "Wangi segar dan energik untuk pria aktif. Menjaga kesegaran setelah olahraga.", category: "parfum", reviews: [] }
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

  // Promo Icons State
  const [promoIcons, setPromoIcons] = useState<PromoIconItem[]>([
    { id: 1, name: "Makanan", icon: "Utensils", color: "bg-orange-100", textColor: "text-orange-600" },
    { id: 2, name: "Pulsa", icon: "Smartphone", color: "bg-blue-100", textColor: "text-blue-600" },
    { id: 3, name: "Listrik", icon: "Zap", color: "bg-yellow-100", textColor: "text-yellow-600" },
    { id: 4, name: "Game", icon: "Gamepad2", color: "bg-purple-100", textColor: "text-purple-600" },
    { id: 5, name: "Travel", icon: "Plane", color: "bg-sky-100", textColor: "text-sky-600" },
    { id: 6, name: "Official", icon: "CheckCircle", color: "bg-emerald-100", textColor: "text-emerald-600" },
    { id: 7, name: "Kesehatan", icon: "Heart", color: "bg-red-100", textColor: "text-red-600" },
    { id: 8, name: "Keuangan", icon: "Wallet", color: "bg-green-100", textColor: "text-green-600" },
    { id: 9, name: "Komputer", icon: "Monitor", color: "bg-indigo-100", textColor: "text-indigo-600" },
  ]);

  const iconMap: { [key: string]: React.ElementType } = {
    Utensils, Smartphone, Zap, Gamepad2, Plane, CheckCircle, Heart, Wallet, Monitor, Gift, LayoutGrid, 
    Shirt, Leaf, Droplet, Star, Video, ShoppingCart
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const salesData = [
    { name: 'Senin', sales: 1200 }, { name: 'Selasa', sales: 950 }, { name: 'Rabu', sales: 1420 },
    { name: 'Kamis', sales: 1680 }, { name: 'Jumat', sales: 2150 }, { name: 'Sabtu', sales: 2840 }, { name: 'Minggu', sales: 3210 }
  ];
  const categoryData = [
    { name: 'Keripik', value: 45 }, { name: 'Snack', value: 25 },
    { name: 'Kaos DTF', value: 15 }, { name: 'Parfum HRM', value: 15 }
  ];
  const COLORS = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];

  // ... (Timer logic)
  const [timeLeft, setTimeLeft] = useState(11 * 3600 + 21 * 60 + 52);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => { setTimeLeft(timeLeft - 1); }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  };
  const { h, m, s } = formatTime(timeLeft);

  // Helper: Get Video Embed URL
  const getVideoEmbedUrl = (url: string) => {
    if (!url) return null;

    // YouTube
    const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/)([^#&?]*))/);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // TikTok (Simple iframe attempt using generic embed format)
    const tiktokMatch = url.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/);
    if (tiktokMatch && tiktokMatch[1]) {
      return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}?lang=id-ID`;
    }
    
    return null;
  };

  // ... (Feed functions)
  const handleLikePost = (postId: number) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 };
      }
      return post;
    }));
  };
  
  const handleReaction = (postId: number, emoji: string) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isSame = post.reaction === emoji;
        const newReaction = isSame ? null : emoji;
        let newLikes = post.likes;
        if (post.reaction === null && newReaction !== null) newLikes++;
        if (post.reaction !== null && newReaction === null) newLikes--;
        return { ...post, reaction: newReaction, likes: newLikes };
      }
      return post;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !newPostVideoUrl.trim()) return;
    const newPost: FeedPost = {
      id: Date.now(),
      user: currentUser ? (currentUser.name || currentUser.username) : "Pengunjung",
      avatar: "https://placehold.co/100x100/ccc/ffffff?text=U",
      role: currentUser?.role || 'customer',
      time: "Baru saja",
      content: newPostContent,
      videoUrl: newPostVideoUrl || undefined,
      likes: 0,
      comments: 0,
      isLiked: false,
      reaction: null,
      commentsList: []
    };
    setFeedPosts([newPost, ...feedPosts]);
    setNewPostContent('');
    setNewPostVideoUrl('');
    setShowVideoInput(false);
  };
  const handleOpenComment = (postId: number) => { setActivePostId(postId); setShowCommentModal(true); };
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || activePostId === null) return;
    
    const newComment: Comment = {
      id: Date.now(),
      user: currentUser ? (currentUser.name || currentUser.username) : "Pengunjung",
      avatar: "https://placehold.co/100x100/ccc/ffffff?text=U",
      text: commentText,
      time: "Baru saja"
    };

    setFeedPosts(prev => prev.map(post => {
        if (post.id === activePostId) {
            return { 
                ...post, 
                comments: post.comments + 1,
                commentsList: [...(post.commentsList || []), newComment]
            };
        }
        return post;
    }));
    setCommentText('');
  };
  
  const handleSharePost = (post: FeedPost) => {
    const text = `Cek postingan dari ${post.user} di Kriuké:\n\n"${post.content.substring(0, 50)}..."\n\nDownload aplikasinya sekarang!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // ... (Product Review & Feed functions)
  const openReviewModal = () => {
    if (!selectedProduct) return;
    if (!isAuthenticated) { alert("Silakan login untuk menulis ulasan."); setCurrentView('login'); return; }
    setReviewRating(5);
    setReviewContent('');
    setShareToFeed(true);
    setShowReviewModal(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !reviewContent.trim()) return;
    
    const userName = currentUser ? (currentUser.name || currentUser.username) : "Pengunjung";
    const userAvatar = "https://placehold.co/100x100/ccc/ffffff?text=" + userName.charAt(0);
    const timeString = "Baru saja";

    const newReview: Review = {
        id: Date.now(),
        userName: userName,
        userAvatar: userAvatar,
        rating: reviewRating,
        comment: reviewContent,
        date: timeString
    };

    setProducts(prev => prev.map(p => {
        if (p.id === selectedProduct.id) {
            const updatedReviews = [newReview, ...(p.reviews || [])];
            return { ...p, reviews: updatedReviews };
        }
        return p;
    }));

    if (shareToFeed) {
        const newPost: FeedPost = {
            id: Date.now(),
            user: userName,
            avatar: userAvatar,
            role: currentUser?.role || 'customer',
            time: timeString,
            content: `Memberikan rating ${reviewRating}⭐ untuk ${selectedProduct.name}:\n\n"${reviewContent}"`,
            image: selectedProduct.image,
            likes: 0,
            comments: 0,
            isLiked: false,
            reaction: null,
            commentsList: []
        };
        setFeedPosts([newPost, ...feedPosts]);
    }

    setReviewContent('');
    setShowReviewModal(false);
    setSelectedProduct(prev => prev ? { ...prev, reviews: [newReview, ...(prev.reviews || [])] } : null);
    alert('Ulasan berhasil dikirim!');
  };

  // ... (Auth functions)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); setAuthError('');
    const user = users.find(u => u.username === loginUsername && u.password === loginPassword);
    if (user) { 
        if (user.isBlocked) {
            setAuthError('Akun Anda telah diblokir. Silakan hubungi Admin.');
            return;
        }
        setCurrentUser(user); setIsAuthenticated(true); setCurrentView('home'); setActiveTab('home'); setLoginUsername(''); setLoginPassword(''); 
    } else { setAuthError('Username atau password salah.'); }
  };
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault(); setAuthError('');
    if (registerData.password !== registerData.confirmPassword) { setAuthError('Konfirmasi password tidak cocok.'); return; }
    if (users.some(u => u.username === registerData.username)) { setAuthError('Username sudah digunakan.'); return; }
    const newUser: UserType = { id: users.length + 1, username: registerData.username, password: registerData.password, role: 'customer', name: registerData.name, email: registerData.email, whatsapp: registerData.whatsapp, address: registerData.address, points: 0, isVerified: false, isBlocked: false };
    setUsers([...users, newUser]); setCurrentUser(newUser); setIsAuthenticated(true); setCurrentView('home'); setActiveTab('home'); setRegisterData({ name: '', username: '', email: '', whatsapp: '', address: '', password: '', confirmPassword: '' });
  };
  const handleLogout = () => { setCurrentUser(null); setIsAuthenticated(false); setCurrentView('home'); setActiveTab('home'); };

  // User Management Handlers
  const handleToggleBlock = (userId: number) => {
    if (window.confirm('Apakah Anda yakin ingin mengubah status blokir user ini?')) {
      setUsers(users.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
    }
  };

  const handleToggleVerify = (userId: number) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
  };

  const handleUpdatePoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserPoints) {
        setUsers(users.map(u => u.id === editingUserPoints.id ? { ...u, points: pointAmount } : u));
        setShowPointModal(false);
        setEditingUserPoints(null);
    }
  };

  const openPointModal = (user: UserType) => {
      setEditingUserPoints(user);
      setPointAmount(user.points || 0);
      setShowPointModal(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => { e.preventDefault(); const phone = "6283854488111"; const text = `Halo Admin Kriuké, saya ${contactData.name || 'Pelanggan'}.\n\n${contactData.message}`; window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank'); setShowContactModal(false); setContactData({ name: '', message: '' }); };

  const addToCart = (product: Product, quantity: number = 1) => { setCart(prev => { const existing = prev.find(item => item.id === product.id); if (existing) { return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item); } return [...prev, { ...product, quantity }]; }); };
  const removeFromCart = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
  const updateQuantity = (id: number, quantity: number) => { if (quantity < 1) return; setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item)); };
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const shareToWhatsApp = () => { if (!selectedProduct) return; const message = `Hai! Cek produk ini di *Kriuké*:\n\n${selectedProduct.name}\nRp${selectedProduct.price.toLocaleString()}\nStok terbatas!\n\n${window.location.href}`; window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank'); setShowShare(false); };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); setTimeout(() => setShowShare(false), 500); };
  const handleCartCheckout = () => { if (!isAuthenticated || !currentUser) { alert('Anda harus login untuk melanjutkan checkout.'); setCurrentView('login'); return; } setCheckoutMode('cart'); setCheckoutData({ name: currentUser.name || '', address: currentUser.address || '', whatsapp: currentUser.whatsapp || '', quantity: 1, promoCode: '', notes: '' }); setShowCheckout(true); };
  const handleBuyNow = () => { setCheckoutMode('single'); if (currentUser) { setCheckoutData(prev => ({ ...prev, name: currentUser.name || '', address: currentUser.address || '', whatsapp: currentUser.whatsapp || '' })); } setShowCheckout(true); }

  const validPromoCodes = promos.reduce((acc, promo) => { if (promo.active) acc[promo.code] = { discount: promo.discount, freeShipping: promo.freeShipping || false }; return acc; }, {} as Record<string, { discount: number; freeShipping: boolean }>);

  const isCartCheckout = checkoutMode === 'cart';
  const basePrice = isCartCheckout ? 0 : (selectedProduct?.price || 0);
  const currentQuantity = isCartCheckout ? 1 : (checkoutData.quantity || 1);
  const currentSubtotal = isCartCheckout ? cartTotal : (basePrice * currentQuantity);
  
  let promoDiscount = 0;
  let isFreeShipping = false;
  if (isCartCheckout) { isFreeShipping = false; } else { isFreeShipping = selectedProduct?.freeShipping || false; }
  if (checkoutData.promoCode && validPromoCodes[checkoutData.promoCode.toUpperCase()]) { const promo = validPromoCodes[checkoutData.promoCode.toUpperCase()]; promoDiscount = (currentSubtotal * promo.discount) / 100; isFreeShipping = isFreeShipping || promo.freeShipping; }
  const totalAfterPromo = Math.max(0, currentSubtotal - promoDiscount);
  const shippingCost = isFreeShipping ? 0 : 10000;
  const finalTotal = totalAfterPromo + shippingCost;

  // Include all Admin Handlers here for full file correctness
  const handleAddPromoIcon = () => { setEditingPromoIcon(null); setPromoIconFormData({ name: '', icon: 'Utensils', color: 'bg-orange-100', textColor: 'text-orange-600' }); setShowPromoIconModal(true); };
  const handleEditPromoIcon = (icon: PromoIconItem) => { setEditingPromoIcon(icon); setPromoIconFormData({ name: icon.name, icon: icon.icon, color: icon.color, textColor: icon.textColor }); setShowPromoIconModal(true); };
  const handleSavePromoIcon = (e: React.FormEvent) => { e.preventDefault(); if (editingPromoIcon) { setPromoIcons(promoIcons.map(i => i.id === editingPromoIcon.id ? { ...i, ...promoIconFormData } as PromoIconItem : i)); } else { const newIcon: PromoIconItem = { id: promoIcons.length > 0 ? Math.max(...promoIcons.map(i => i.id)) + 1 : 1, ...promoIconFormData } as PromoIconItem; setPromoIcons([...promoIcons, newIcon]); } setShowPromoIconModal(false); };
  const deletePromoIcon = (id: number) => { if (window.confirm('Hapus ikon ini?')) { setPromoIcons(promoIcons.filter(i => i.id !== id)); } };
  const handleAddProduct = () => { setEditingProduct(null); setProductFormData({ name: '', price: 0, originalPrice: 0, discount: 0, rating: 0, sold: 0, location: 'Bandung', freeShipping: false, image: 'https://placehold.co/300x300/F0FDF4/047857?text=Produk', description: '', category: 'keripik' }); setShowProductModal(true); };
  const handleEditProduct = (product: Product) => { setEditingProduct(product); setProductFormData({ ...product }); setShowProductModal(true); };
  const handleSaveProduct = (e: React.FormEvent) => { e.preventDefault(); if (editingProduct) { setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productFormData, id: editingProduct.id } as Product : p)); } else { const newProduct: Product = { id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1, ...productFormData } as Product; setProducts([...products, newProduct]); } setShowProductModal(false); };
  const deleteProduct = (id: number) => { if (window.confirm('Hapus produk ini?')) { setProducts(products.filter(p => p.id !== id)); } };
  const handleAddPromo = () => { setEditingPromo(null); setPromoFormData({ code: '', discount: 0, freeShipping: false, active: true }); setShowPromoModal(true); };
  const handleEditPromo = (promo: Promo) => { setEditingPromo(promo); setPromoFormData({ code: promo.code, discount: promo.discount, freeShipping: promo.freeShipping || false, active: promo.active }); setShowPromoModal(true); };
  const handleSavePromo = (e: React.FormEvent) => { e.preventDefault(); if (editingPromo) { setPromos(promos.map(p => p.id === editingPromo.id ? { ...p, ...promoFormData } : p)); } else { const newPromo: Promo = { id: promos.length > 0 ? Math.max(...promos.map(p => p.id)) + 1 : 1, ...promoFormData }; setPromos([...promos, newPromo]); } setShowPromoModal(false); };
  const togglePromoStatus = (id: number) => { setPromos(promos.map(p => p.id === id ? { ...p, active: !p.active } : p)); };
  const deletePromo = (id: number) => { if (window.confirm('Hapus kode promo ini?')) { setPromos(promos.filter(p => p.id !== id)); } }
  const handleAddCategory = () => { setEditingCategory(null); setCategoryFormData({ name: '', icon: '', color: 'bg-emerald-100' }); setShowCategoryModal(true); };
  const handleEditCategory = (category: Category) => { setEditingCategory(category); setCategoryFormData({ name: category.name, icon: category.icon, color: category.color }); setShowCategoryModal(true); };
  const handleSaveCategory = (e: React.FormEvent) => { e.preventDefault(); if (editingCategory) { setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...categoryFormData } as Category : c)); } else { const newCategory: Category = { id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1, ...categoryFormData } as Category; setCategories([...categories, newCategory]); } setShowCategoryModal(false); };
  const deleteCategory = (id: number) => { if (window.confirm('Hapus kategori ini?')) { setCategories(categories.filter(c => c.id !== id)); } };
  const handleAddStream = () => { setEditingStream(null); setStreamFormData({ title: '', url: '', viewers: 0 }); setShowStreamModal(true); };
  const handleEditStream = (stream: Stream) => { setEditingStream(stream); setStreamFormData({ title: stream.title, url: stream.url, viewers: stream.viewers }); setShowStreamModal(true); };
  const handleSaveStream = (e: React.FormEvent) => { e.preventDefault(); if (editingStream) { setStreams(streams.map(s => s.id === editingStream.id ? { ...s, ...streamFormData } as Stream : s)); } else { const newStream: Stream = { id: streams.length > 0 ? Math.max(...streams.map(s => s.id)) + 1 : 1, ...streamFormData } as Stream; setStreams([...streams, newStream]); } setShowStreamModal(false); };
  const deleteStream = (id: number) => { if (window.confirm('Hapus stream ini?')) { setStreams(streams.filter(s => s.id !== id)); } };

  const getCategoryKey = (catName: string) => { if (catName.toLowerCase().includes('keripik')) return 'keripik'; if (catName.toLowerCase().includes('parfum')) return 'parfum'; if (catName.toLowerCase().includes('kaos')) return 'kaos'; if (catName.toLowerCase().includes('snack')) return 'snack'; return null; };
  const handleCategoryClick = (catName: string) => { const key = getCategoryKey(catName); if (key) setSelectedCategory(prev => prev === key ? null : key); else setSelectedCategory(null); };
  const getCategoryColor = (category: Product['category']) => (category === 'kaos' ? 'text-gray-700' : 'text-emerald-600');
  const openProductDetail = (product: Product) => { setSelectedProduct(product); setCurrentView('detail'); setCheckoutData({ name: '', address: '', whatsapp: '', quantity: 1, promoCode: '', notes: '' }); };
  const goBack = () => { if (currentView === 'detail') { setSelectedProduct(null); setCurrentView(activeTab); }};

  // [RENDER FUNCTIONS START]
  const renderStars = (rating: number, size: number = 14) => (<div className="flex items-center">{[...Array(5)].map((_, i) => (<Star key={i} size={size} className={`${i < Math.floor(rating) ? "text-amber-400 fill-current" : "text-gray-300"}`} />))}<span className="ml-1 text-xs text-gray-600 font-medium">{rating}</span></div>);
  
  const renderHome = () => {
    const flashSaleProducts = products.slice(0, 3);
    const filteredProducts = selectedCategory ? products.filter(p => p.category === selectedCategory) : products;
    return ( <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto pb-20"><div className="py-3 bg-white"><div className="flex space-x-4 px-4 overflow-x-auto scrollbar-hide">{categories.map(cat => (<div key={cat.id} className="flex flex-col items-center space-y-1 flex-shrink-0 w-16 cursor-pointer" onClick={() => handleCategoryClick(cat.name)}><div className={`w-12 h-12 ${cat.color} rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg ${selectedCategory === getCategoryKey(cat.name) ? 'ring-2 ring-emerald-500' : ''}`}>{cat.icon}</div><span className={`text-xs text-center ${selectedCategory === getCategoryKey(cat.name) ? 'text-emerald-700 font-bold' : 'text-gray-700'}`}>{cat.name}</span></div>))}</div></div><div className="px-4 py-2"><div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">{promoIcons.map(item => { const IconComponent = iconMap[item.icon] || Smile; return (<motion.div key={item.id} className="flex flex-col items-center space-y-1 flex-shrink-0 w-14" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}><div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center shadow-sm`}><IconComponent size={20} className={item.textColor} /></div><span className="text-[10px] text-gray-600 text-center font-medium leading-tight">{item.name}</span></motion.div>); })}<div className="flex flex-col items-center space-y-1 flex-shrink-0 w-14 cursor-pointer" onClick={() => setCurrentView('promo')}><div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm"><LayoutGrid size={20} className="text-gray-600" /></div><span className="text-[10px] text-gray-600 text-center font-medium leading-tight">Lihat Semua</span></div></div></div><div className="p-4 pt-0 pb-2"><button onClick={() => { setCurrentView('promo'); setActiveTab('promo'); }} className="w-full bg-red-500 text-white p-3 rounded-lg flex justify-between items-center text-left"><h3 className="font-bold">Nikmatin diskon pengguna baru</h3><ChevronRight size={20} /></button></div>{selectedCategory ? (<div className="px-4 pb-3"><div className="flex justify-between items-center mb-3"><h2 className="font-bold text-lg text-gray-800">Kategori: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h2><button onClick={() => setSelectedCategory(null)} className="text-sm text-emerald-600">Reset</button></div><div className={`grid ${selectedCategory === 'parfum' ? 'grid-cols-3 gap-2' : 'grid-cols-2 gap-3'}`}>{filteredProducts.length > 0 ? (filteredProducts.map(product => (<div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer" onClick={() => openProductDetail(product)}><div className="relative"><img src={product.image} alt={product.name} className={`w-full object-cover ${selectedCategory === 'parfum' ? 'h-24' : 'h-28'}`} />{product.discount > 0 && <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{product.discount}%</span>}</div><div className="p-2"><h3 className={`font-medium text-gray-800 line-clamp-2 ${selectedCategory === 'parfum' ? 'text-[10px]' : 'text-xs'}`}>{product.name}</h3><div className="mt-1 flex items-center space-x-2"><span className="text-emerald-600 font-bold text-sm">Rp{product.price.toLocaleString()}</span></div><div className="mt-1 flex items-center text-xs text-gray-500"><Star size={12} className="text-amber-400 fill-current mr-1" /><span>{product.rating}</span>{selectedCategory !== 'parfum' && <><span className="mx-1.5">|</span><span>{product.sold.toLocaleString()} terjual</span></>}<button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="ml-auto bg-emerald-100 text-emerald-700 p-1 rounded hover:bg-emerald-200"><Plus size={14} /></button></div></div></div>))) : (<p className="col-span-3 text-center text-gray-500 py-8">Tidak ada produk di kategori ini.</p>)}</div></div>) : (<><div className="px-4 py-4"><div className="bg-red-100 p-3 rounded-lg"><div className="flex justify-between items-center mb-3"><div><h3 className="text-red-600 font-bold">Diskon sd 20%</h3><p className="text-xs text-red-500">Hemat hingga 10k</p></div><div className="flex items-center space-x-1 text-white"><span className="bg-red-500 p-1 rounded-md text-sm font-mono">{h}</span><span className="text-gray-500 text-sm">:</span><span className="bg-red-500 p-1 rounded-md text-sm font-mono">{m}</span><span className="text-gray-500 text-sm">:</span><span className="bg-red-500 p-1 rounded-md text-sm font-mono">{s}</span></div></div><div className="grid grid-cols-3 gap-2">{flashSaleProducts.map(product => (<div key={product.id} className="bg-white rounded overflow-hidden cursor-pointer" onClick={() => openProductDetail(product)}><div className="relative"><img src={product.image} alt={product.name} className="w-full h-24 object-cover" /><span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{product.discount}%</span></div><div className="p-1.5"><p className="text-red-600 font-bold text-sm">Rp{product.price.toLocaleString()}</p><p className="text-gray-500 line-through text-[10px]">Rp{product.originalPrice.toLocaleString()}</p></div></div>))}</div></div></div>{[{title: "Keripik Pisang Kriuké", icon: Leaf, cat: "keripik"}, {title: "Parfum HRM (Haroemin)", icon: Droplet, cat: "parfum"}, {title: "Kaos Sablon DTF", icon: Shirt, cat: "kaos"}].map(section => { const SectionIcon = section.icon; const isParfum = section.cat === 'parfum'; return (<div key={section.title}><div className="px-4 py-3"><h2 className="font-bold text-lg text-gray-800 flex items-center"><SectionIcon className="mr-2 text-emerald-600" size={20} />{section.title}</h2></div><div className="px-4 pb-3"><div className={`grid ${isParfum ? 'grid-cols-3 gap-2' : 'grid-cols-2 gap-3'}`}>{products.filter(p => p.category === section.cat).map(product => (<div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer" onClick={() => openProductDetail(product)}><div className="relative"><img src={product.image} alt={product.name} className={`w-full object-cover ${isParfum ? 'h-24' : 'h-28'}`}/>{product.discount > 0 && <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{product.discount}%</span>}</div><div className="p-2"><h3 className={`font-medium text-gray-800 line-clamp-2 ${isParfum ? 'text-[10px]' : 'text-xs'}`}>{product.name}</h3><div className="mt-1 flex items-center space-x-2"><span className="text-emerald-600 font-bold text-sm">Rp{product.price.toLocaleString()}</span></div><div className="mt-1 flex items-center text-xs text-gray-500"><Star size={12} className="text-amber-400 fill-current mr-1" /><span>{product.rating}</span>{!isParfum && <><span className="mx-1.5">|</span><span>{product.sold.toLocaleString()} terjual</span></>}<button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="ml-auto bg-emerald-100 text-emerald-700 p-1 rounded hover:bg-emerald-200"><Plus size={14} /></button></div></div></div>))}</div></div></div>); })}</>)}</motion.div>);
  };
  const renderDetail = () => { if (!selectedProduct) return null; const recommendedProducts = products.filter(p => p.id !== selectedProduct.id).sort(() => 0.5 - Math.random()).slice(0, 5); const reviews = selectedProduct.reviews || []; return (<motion.div key="detail" initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} className="flex-1 overflow-y-auto bg-white pb-24"><div className="relative"><img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-80 object-cover" /><button onClick={goBack} className="absolute top-4 left-4 bg-white/80 p-2 rounded-full hover:bg-white text-gray-800 shadow-sm"><ChevronLeft size={24} /></button><button onClick={() => setShowShare(true)} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-gray-800 shadow-sm"><Share2 size={24} /></button></div><div className="p-4"><div className="mb-3"><h1 className="text-2xl font-bold text-gray-800 mb-1">{selectedProduct.name}</h1><div className="flex items-center space-x-2"><span className="text-emerald-600 font-bold text-2xl">Rp{selectedProduct.price.toLocaleString()}</p></div></div><div className="flex items-center space-x-4 text-sm text-gray-500 mb-4 border-y py-3"><div className="flex items-center"><Star className="text-amber-400 fill-current mr-1" size={18} /><span className="font-bold text-gray-800 mr-1">{selectedProduct.rating}</span><span className="text-gray-400">({reviews.length})</span></div><div className="w-px h-4 bg-gray-300"></div><div>{selectedProduct.sold.toLocaleString()} Terjual</div><div className="w-px h-4 bg-gray-300"></div><div className="flex items-center text-emerald-600"><Truck size={16} className="mr-1" />{selectedProduct.freeShipping ? 'Bebas Ongkir' : 'Reguler'}</div></div><div className="mb-6"><h3 className="font-bold text-gray-800 mb-2">Deskripsi Produk</h3><p className="text-gray-600 leading-relaxed text-sm">{selectedProduct.description}</p></div><div className="flex items-center p-3 bg-gray-50 rounded-lg mb-6 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setShowContactModal(true)}><div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm mr-3 border border-gray-100"><MessageCircle size={20} /></div><div className="flex-1"><p className="font-bold text-sm text-gray-800">Chat Admin</p><p className="text-xs text-gray-500">Tanya stok atau detail produk</p></div><ChevronRight size={16} className="text-gray-400" /></div><div className="mb-8"><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-800 text-lg">Ulasan Pembeli</h3><button onClick={openReviewModal} className="text-emerald-600 text-sm font-bold">Tulis Ulasan</button></div><div className="flex items-center bg-gray-50 p-4 rounded-xl mb-4"><div className="text-center mr-6"><span className="text-4xl font-bold text-gray-800 block">{selectedProduct.rating}</span><div className="flex justify-center my-1">{[...Array(5)].map((_, i) => (<Star key={i} size={12} className={`${i < Math.floor(selectedProduct.rating) ? "text-amber-400 fill-current" : "text-gray-300"}`} />))}</div><span className="text-xs text-gray-500">{reviews.length} ulasan</span></div><div className="flex-1 space-y-1">{[5, 4, 3, 2, 1].map(star => (<div key={star} className="flex items-center text-xs"><Star size={10} className="text-gray-400 mr-2" /><span className="w-2 mr-2">{star}</span><div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: reviews.length > 0 ? `${(reviews.filter(r => r.rating === star).length / reviews.length) * 100}%` : '0%' }}></div></div></div>))}</div></div><div className="space-y-4">{reviews.length > 0 ? (reviews.map((review) => (<div key={review.id} className="border-b border-gray-100 pb-4 last:border-0"><div className="flex items-center mb-2"><img src={review.userAvatar} alt={review.userName} className="w-8 h-8 rounded-full mr-3" /><div><p className="text-sm font-bold text-gray-800">{review.userName}</p><div className="flex items-center"><div className="flex mr-2">{[...Array(5)].map((_, i) => (<Star key={i} size={10} className={`${i < review.rating ? "text-amber-400 fill-current" : "text-gray-300"}`} />))}</div><span className="text-[10px] text-gray-400">{review.date}</span></div></div></div><p className="text-sm text-gray-600 leading-snug">{review.comment}</p></div>))) : (<p className="text-center text-gray-500 text-sm py-4">Belum ada ulasan untuk produk ini.</p>)}</div></div><div><h3 className="font-bold text-gray-800 mb-3">Rekomendasi Lainnya</h3><div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-4">{recommendedProducts.map(product => (<div key={product.id} className="min-w-[140px] w-[140px] bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm cursor-pointer" onClick={() => openProductDetail(product)}><div className="h-32 relative"><img src={product.image} className="w-full h-full object-cover" />{product.discount > 0 && <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] px-1 rounded">-{product.discount}%</span>}</div><div className="p-2"><h4 className="text-xs font-medium text-gray-800 line-clamp-2 h-8">{product.name}</h4><p className="text-emerald-600 font-bold text-xs mt-1">Rp{product.price.toLocaleString()}</p></div></div>))}</div></div></div><div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center space-x-3 max-w-md mx-auto z-10"><button onClick={() => addToCart(selectedProduct)} className="flex-1 border border-emerald-600 text-emerald-600 py-3 rounded-xl font-bold hover:bg-emerald-50 flex justify-center items-center"><Plus size={18} className="mr-1" /> Keranjang</button><button onClick={handleBuyNow} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">Beli Sekarang</button></div></motion.div>); };
  const renderCart = () => ( <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto bg-gray-50 pb-24 p-4"><h2 className="text-2xl font-bold text-gray-800 mb-4">Keranjang</h2>{cart.length === 0 ? (<div className="text-center py-20"><ShoppingCart size={64} className="text-gray-300 mx-auto mb-4" /><p className="text-gray-500 mb-4">Keranjang belanja masih kosong.</p><button onClick={() => {setCurrentView('home'); setActiveTab('home');}} className="bg-emerald-600 text-white px-6 py-2 rounded-full font-medium">Belanja Sekarang</button></div>) : (<div className="space-y-4">{cart.map(item => (<div key={item.id} className="bg-white p-3 rounded-xl shadow-sm flex"><img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" /><div className="ml-3 flex-1 flex flex-col justify-between"><div><div className="flex justify-between"><h3 className="font-medium text-gray-800 line-clamp-1">{item.name}</h3><button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button></div><p className="text-emerald-600 font-bold">Rp{item.price.toLocaleString()}</p></div><div className="flex justify-between items-center"><div className="flex items-center border rounded-lg"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-emerald-600">-</button><span className="px-2 text-sm font-medium">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-emerald-600">+</button></div></div></div></div>))}<div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4 max-w-md mx-auto"><div className="flex justify-between mb-2"><span className="text-gray-600">Total ({cartCount} barang)</span><span className="font-bold text-lg text-emerald-600">Rp{cartTotal.toLocaleString()}</span></div><button onClick={handleCartCheckout} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">Checkout</button></div></div>)}</motion.div>);
  const renderPromoPage = () => ( <motion.div key="promo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto bg-gray-50 pb-20"><div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 text-white shadow-sm pb-8"><h2 className="text-2xl font-bold mb-1">Pusat Promo</h2><p className="opacity-90 text-sm">Klaim voucher & nikmati diskon spesial!</p></div><div className="px-4 -mt-6 space-y-3 mb-6">{promos.filter(p => p.active).map(promo => (<div key={promo.id} className="bg-white rounded-xl shadow-md overflow-hidden flex border-l-4 border-yellow-400 relative z-10"><div className="p-3 flex-1"><div className="flex items-center mb-1"><Ticket size={16} className="text-yellow-500 mr-2 fill-current" /><h3 className="font-bold text-gray-800 text-md tracking-wide">{promo.code}</h3></div><p className="text-gray-600 text-xs leading-tight">{promo.freeShipping ? 'Gratis Ongkir Min. Belanja Rp50rb' : `Diskon ${promo.discount}% All Item`}</p></div><div className="bg-yellow-50 w-20 flex items-center justify-center border-l border-dashed border-yellow-200 relative"><div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-50 rounded-full"></div><div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gray-50 rounded-full"></div><button onClick={() => {navigator.clipboard.writeText(promo.code); alert('Kode promo disalin!');}} className="text-yellow-700 font-bold text-xs bg-yellow-100 px-3 py-1.5 rounded-lg hover:bg-yellow-200 transition-colors">Salin</button></div></div>))}</div><div className="px-4 mb-6"><div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-4 shadow-lg text-white"><div className="flex justify-between items-center mb-4"><div className="flex items-center"><Zap size={20} className="text-yellow-300 mr-2 fill-current animate-pulse" /><div><h3 className="font-bold text-lg leading-none italic">FLASH SALE</h3><p className="text-[10px] opacity-90">Berakhir dalam</p></div></div><div className="flex space-x-1"><span className="bg-white text-red-600 font-bold text-xs px-1.5 py-1 rounded shadow-sm">{h}</span><span className="text-white font-bold flex items-center pb-1">:</span><span className="bg-white text-red-600 font-bold text-xs px-1.5 py-1 rounded shadow-sm">{m}</span><span className="text-white font-bold flex items-center pb-1">:</span><span className="bg-white text-red-600 font-bold text-xs px-1.5 py-1 rounded shadow-sm">{s}</span></div></div><div className="grid grid-cols-3 gap-2">{products.slice(0, 3).map(product => (<div key={product.id} className="bg-white rounded-xl p-2 text-gray-800 cursor-pointer shadow-sm transform transition hover:scale-105" onClick={() => openProductDetail(product)}><div className="relative mb-2"><img src={product.image} className="w-full h-20 object-cover rounded-lg" /><span className="absolute top-0 right-0 bg-yellow-400 text-red-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg">-{product.discount}%</span></div><p className="font-bold text-xs truncate mb-0.5">{product.name}</p><p className="text-red-600 font-bold text-sm">Rp{product.price.toLocaleString()}</p><div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 relative overflow-hidden"><div className="bg-red-500 h-1.5 rounded-full absolute top-0 left-0" style={{width: '85%'}}></div></div><p className="text-[9px] text-gray-500 mt-1 text-right">Segera Habis</p></div>))}</div></div></div><div className="px-4"><h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center"><Percent size={20} className="mr-2 text-emerald-600 bg-emerald-100 p-0.5 rounded-md" /> Promo Spesial Lainnya</h3><div className="grid grid-cols-2 gap-3">{products.filter(p => p.discount > 0 && !products.slice(0, 3).find(fp => fp.id === p.id)).length > 0 ? (products.filter(p => p.discount > 0 && !products.slice(0, 3).find(fp => fp.id === p.id)).map(product => (<div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer border border-gray-100" onClick={() => openProductDetail(product)}><div className="relative"><img src={product.image} className="w-full h-32 object-cover" /><span className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Hemat Rp{(product.originalPrice - product.price).toLocaleString()}</span></div><div className="p-3"><h4 className="font-medium text-gray-800 text-sm line-clamp-2 mb-2 h-10">{product.name}</h4><div className="flex items-center space-x-2 mb-2"><span className="bg-red-50 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded">-{product.discount}%</span><span className="text-gray-400 text-xs line-through">Rp{product.originalPrice.toLocaleString()}</span></div><div className="flex justify-between items-center"><span className="text-emerald-600 font-bold text-base">Rp{product.price.toLocaleString()}</span><button onClick={(e) => {e.stopPropagation(); addToCart(product);}} className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors shadow-sm"><Plus size={18} /></button></div></div></div>))) : (<div className="col-span-2 text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300"><Tag size={32} className="mx-auto mb-2 opacity-30" /><p>Belum ada promo tambahan saat ini.</p></div>)}</div></div></motion.div>);
  const renderLive = () => ( <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto bg-gray-900 text-white pb-20"><div className="p-4 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10"><h2 className="text-xl font-bold flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>Live Streaming</h2><button onClick={() => setCurrentView('home')} className="text-gray-400 hover:text-white"><X size={24} /></button></div><div className="p-4 space-y-6">{streams.map(stream => (<div key={stream.id} className="bg-gray-800 rounded-xl overflow-hidden"><div className="relative aspect-video bg-black"><iframe src={`https://www.youtube.com/embed/${stream.url.split('/').pop()}`} title={stream.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe><div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center">LIVE</div><div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center"><User size={12} className="mr-1" />{stream.viewers}</div></div><div className="p-3"><h3 className="font-bold text-lg">{stream.title}</h3><p className="text-gray-400 text-sm">Kriuké Official Store</p></div></div>))}{streams.length === 0 && (<div className="text-center py-20 text-gray-500"><Video size={48} className="mx-auto mb-4 opacity-50" /><p>Belum ada live streaming saat ini.</p></div>)}</div></motion.div>);
  const renderAccount = () => ( <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto bg-gray-50 pb-20">{currentUser ? (<><div className="bg-white p-6 mb-2"><div className="flex items-center justify-between mb-6"><div className="flex items-center space-x-4"><div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-2xl">{currentUser.name?.charAt(0)}</div><div><h2 className="text-xl font-bold text-gray-800 flex items-center">{currentUser.name} {currentUser.isVerified && <BadgeCheck size={18} className="text-blue-500 ml-1 fill-current" />}</h2><p className="text-gray-500">{currentUser.email}</p>{currentUser.role === 'admin' && <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded font-bold mt-1 inline-block">Administrator</span>}</div></div><div className="p-2 bg-gray-50 rounded-full"><Edit3 size={20} className="text-gray-400" /></div></div><div className="grid grid-cols-3 gap-3 bg-white rounded-xl border border-gray-100 p-4 shadow-sm"><div className="text-center"><div className="flex items-center justify-center space-x-1 mb-1"><Coins size={16} className="text-yellow-500" /><span className="text-xs text-gray-500">Poin</span></div><span className="block font-bold text-lg text-gray-800">{currentUser.points || 0}</span></div><div className="text-center border-x border-gray-100"><div className="flex items-center justify-center space-x-1 mb-1"><Wallet size={16} className="text-blue-500" /><span className="text-xs text-gray-500">Saldo</span></div><span className="block font-bold text-lg text-gray-800">Rp0</span></div><div className="text-center"><div className="flex items-center justify-center space-x-1 mb-1"><Ticket size={16} className="text-emerald-500" /><span className="text-xs text-gray-500">Voucher</span></div><span className="block font-bold text-lg text-gray-800">5</span></div></div></div><div className="bg-white p-4 mb-2 space-y-1">{currentUser.role === 'admin' && (<button onClick={() => setCurrentView('admin')} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg text-left"><div className="flex items-center text-gray-700"><BarChart3 size={20} className="mr-3 text-blue-500" />Dashboard Admin</div><ChevronRight size={16} className="text-gray-300" /></button>)}<button onClick={() => {setCurrentView('transaksi'); setActiveTab('transaksi');}} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg text-left"><div className="flex items-center text-gray-700"><Package size={20} className="mr-3 text-emerald-500" />Riwayat Pesanan</div><ChevronRight size={16} className="text-gray-300" /></button><button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg text-left"><div className="flex items-center text-gray-700"><MapPin size={20} className="mr-3 text-orange-500" />Alamat Tersimpan</div><ChevronRight size={16} className="text-gray-300" /></button></div><div className="bg-white p-4"><button onClick={handleLogout} className="w-full flex items-center justify-center p-3 text-red-600 font-bold hover:bg-red-50 rounded-lg border border-red-100"><LogOut size={20} className="mr-2" /> Keluar</button></div></>) : (<div className="flex flex-col items-center justify-center h-full p-6 text-center"><User size={64} className="text-gray-300 mb-4" /><h2 className="text-xl font-bold text-gray-800 mb-2">Belum Login</h2><p className="text-gray-500 mb-6">Login untuk akses profil dan riwayat pesanan.</p><button onClick={() => setCurrentView('login')} className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-emerald-200">Login / Daftar</button></div>)}</motion.div>);
  const renderTransactions = () => { const pendingTransactions = transactions.filter(t => t.status === 'pending'); const historyTransactions = transactions.filter(t => t.status !== 'pending'); return ( <motion.div key="transaksi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto bg-gray-50 pb-20"><div className="bg-white p-4 mb-2 shadow-sm"><h2 className="text-xl font-bold text-gray-800">Transaksi</h2></div><div className="p-4 pt-0 space-y-4"><div className="mb-6"><h3 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">Belum Diproses ({pendingTransactions.length})</h3>{pendingTransactions.length > 0 ? (pendingTransactions.map(trx => (<div key={trx.id} className="bg-white rounded-xl shadow-sm border-l-4 border-amber-500 overflow-hidden mb-3"><div className="p-3 border-b border-gray-100 flex justify-between items-center"><span className="text-xs font-bold text-gray-500">{trx.id}</span><span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{trx.statusLabel}</span></div><div className="p-3">{trx.items.map((item, idx) => (<div key={idx} className="flex mb-2 last:mb-0"><img src={item.image} className="w-12 h-12 rounded bg-gray-100 object-cover mr-3" /><div className="flex-1"><p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p><p className="text-xs text-gray-500">{item.quantity} x Rp{item.price.toLocaleString()}</p></div></div>))}</div><div className="p-3 bg-gray-50 flex justify-between items-center"><span className="text-xs text-gray-500">{trx.date}</span><div className="text-right"><p className="text-[10px] text-gray-500">Total Belanja</p><p className="text-emerald-600 font-bold text-sm">Rp{trx.total.toLocaleString()}</p></div></div></div>))) : (<div className="text-center py-6 bg-white rounded-lg border border-dashed border-gray-300"><p className="text-sm text-gray-400">Tidak ada transaksi pending.</p></div>)}</div><div><h3 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">Riwayat Pesanan</h3><div className="text-center py-6 bg-white rounded-lg border border-dashed border-gray-300"><p className="text-sm text-gray-400">Belum ada riwayat selesai.</p></div></div></div></motion.div>); };
  
  // ADMIN DASHBOARD
  const renderAdminDashboard = () => (
    <div className="p-6 pb-20 bg-gray-50/50 min-h-full">
       <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Admin</h2>
            <p className="text-gray-500 text-sm mt-1">Halo, {currentUser?.name || 'Admin'}! Semangat jualan hari ini.</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
            <Crown size={24} className="text-yellow-500" />
          </div>
       </div>
       <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5"><Wallet size={64} className="text-emerald-600" /></div>
             <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-3"><Wallet size={20} /></div>
             <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Pendapatan</p><h3 className="text-2xl font-bold text-gray-800 mt-1">Rp12.5jt</h3><p className="text-xs text-emerald-600 mt-2 font-medium flex items-center"><TrendingUp size={14} className="mr-1" /> +15% mingguan</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5"><ShoppingBag size={64} className="text-blue-600" /></div>
             <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3"><ShoppingBag size={20} /></div>
             <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Pesanan</p><h3 className="text-2xl font-bold text-gray-800 mt-1">87</h3><p className="text-xs text-blue-600 mt-2 font-medium flex items-center"><Clock size={14} className="mr-1" /> 12 perlu diproses</p>
          </div>
       </div>
       <h3 className="font-bold text-gray-800 mb-4 text-lg">Menu Kelola</h3>
       <div className="grid grid-cols-3 gap-4 mb-8">
           {[{ id: 'products', label: 'Produk', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' }, { id: 'categories', label: 'Kategori', icon: Grid, color: 'text-indigo-600', bg: 'bg-indigo-50' }, { id: 'promos', label: 'Voucher', icon: Ticket, color: 'text-orange-600', bg: 'bg-orange-50' }, { id: 'promo-icons', label: 'Menu Ikon', icon: LayoutGrid, color: 'text-pink-600', bg: 'bg-pink-50' }, { id: 'streams', label: 'Live', icon: Video, color: 'text-red-600', bg: 'bg-red-50' }, { id: 'settings', label: 'Pengaturan', icon: Settings, color: 'text-gray-600', bg: 'bg-gray-100' }].map((item, idx) => (
             <button key={idx} onClick={() => setAdminView(item.id as AdminView)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center aspect-square hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                 <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-3 ${item.color}`}><item.icon size={24} strokeWidth={2.5} /></div><span className="text-xs font-bold text-gray-700">{item.label}</span>
             </button>
           ))}
       </div>
       <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6"><div><h3 className="font-bold text-gray-800">Statistik Penjualan</h3><p className="text-xs text-gray-500">Ringkasan 7 hari terakhir</p></div><span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg border border-gray-200">Mingguan</span></div>
          <div className="h-56 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={salesData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" /><XAxis dataKey="name" tick={{fontSize: 10, fill: '#9ca3af'}} axisLine={false} tickLine={false} dy={10} /><YAxis hide /><Tooltip cursor={{fill: '#f0fdf4'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} /><Bar dataKey="sales" fill="#10B981" radius={[6, 6, 0, 0]} barSize={24} /></BarChart></ResponsiveContainer></div>
       </div>
    </div>
  );

  // NEW: Render Admin Settings for User Management
  const renderAdminSettings = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Pengaturan Admin</h2>
        <button onClick={() => setAdminView('dashboard')} className="text-sm text-emerald-600 font-bold">Kembali</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">Manajemen Pengguna</h3>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{users.length} User</span>
          </div>
          <div className="divide-y divide-gray-100">
              {users.map(user => (
                  <div key={user.id} className="p-4 flex flex-col space-y-3">
                      <div className="flex justify-between items-start">
                          <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 ${user.role === 'admin' ? 'bg-emerald-600' : 'bg-gray-400'}`}>
                                  {user.name?.charAt(0) || user.username.charAt(0)}
                              </div>
                              <div>
                                  <div className="flex items-center">
                                    <h4 className="font-bold text-gray-800 text-sm">{user.name || user.username}</h4>
                                    {user.isVerified && <BadgeCheck size={14} className="text-blue-500 ml-1 fill-current" />}
                                    {user.role === 'admin' && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">ADMIN</span>}
                                  </div>
                                  <p className="text-xs text-gray-500">{user.email} • {user.whatsapp}</p>
                              </div>
                          </div>
                          {user.isBlocked && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold flex items-center"><Lock size={10} className="mr-1" /> BLOKIR</span>}
                      </div>
                      
                      <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                          <div className="flex items-center text-sm text-gray-600">
                              <Coins size={16} className="text-yellow-500 mr-2" />
                              <span className="font-bold mr-1">{user.points || 0}</span> Poin
                          </div>
                          <button onClick={() => openPointModal(user)} className="text-xs text-blue-600 font-bold hover:underline">Edit Poin</button>
                      </div>

                      <div className="flex space-x-2 pt-1">
                          {user.role !== 'admin' && (
                              <>
                                <button 
                                    onClick={() => handleToggleVerify(user.id)} 
                                    className={`flex-1 py-1.5 text-xs rounded-lg border flex items-center justify-center ${user.isVerified ? 'border-gray-200 text-gray-500' : 'border-blue-200 text-blue-600 bg-blue-50'}`}
                                >
                                    {user.isVerified ? 'Hapus Verifikasi' : 'Verifikasi'}
                                </button>
                                <button 
                                    onClick={() => handleToggleBlock(user.id)}
                                    className={`flex-1 py-1.5 text-xs rounded-lg border flex items-center justify-center ${user.isBlocked ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 'border-red-200 text-red-600 bg-red-50'}`}
                                >
                                    {user.isBlocked ? <><Unlock size={12} className="mr-1"/> Buka Blokir</> : <><Lock size={12} className="mr-1"/> Blokir User</>}
                                </button>
                              </>
                          )}
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );

  // Missing Render Functions Definitions
  const renderFeed = () => (
    <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto bg-gray-50 pb-20">
      {isAuthenticated && (
        <div className="bg-white p-4 mb-2 shadow-sm">
           <div className="flex space-x-3">
             <img src={currentUser ? `https://placehold.co/100x100/emerald/ffffff?text=${currentUser.name?.charAt(0)}` : "https://placehold.co/100x100/ccc/ffffff?text=U"} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
             <form onSubmit={handleCreatePost} className="flex-1">
               <textarea 
                 value={newPostContent} 
                 onChange={(e) => setNewPostContent(e.target.value)} 
                 placeholder={`Apa yang sedang terjadi, ${currentUser?.name}?`} 
                 className="w-full border-none focus:ring-0 text-gray-800 placeholder-gray-400 resize-none bg-transparent"
                 rows={2}
               />
               {showVideoInput && (
                 <div className="mb-2 flex items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
                   <LinkIcon size={16} className="text-gray-400 mr-2" />
                   <input 
                     type="text" 
                     value={newPostVideoUrl} 
                     onChange={(e) => setNewPostVideoUrl(e.target.value)} 
                     placeholder="Link YouTube / TikTok..." 
                     className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
                   />
                 </div>
               )}
               <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                 <div className="flex space-x-2">
                    <button type="button" className="text-emerald-600 p-1 hover:bg-emerald-50 rounded"><ImageIcon size={20} /></button>
                    <button type="button" onClick={() => setShowVideoInput(!showVideoInput)} className={`text-emerald-600 p-1 hover:bg-emerald-50 rounded ${showVideoInput ? 'bg-emerald-50' : ''}`}><Video size={20} /></button>
                 </div>
                 <button type="submit" disabled={!newPostContent.trim()} className={`px-4 py-1.5 rounded-full font-bold text-sm ${newPostContent.trim() ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'}`}>Posting</button>
               </div>
             </form>
           </div>
        </div>
      )}
      <div className="space-y-2">
        {feedPosts.map(post => {
            const embedUrl = post.videoUrl ? getVideoEmbedUrl(post.videoUrl) : null;
            return (
            <div key={post.id} className="bg-white p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex space-x-3">
                        <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                        <div>
                            <div className="flex items-center">
                                <h3 className="font-bold text-gray-900 text-sm mr-1">{post.user}</h3>
                                {post.role === 'admin' && <CheckCircle size={12} className="text-blue-500 fill-current" />}
                            </div>
                            <p className="text-xs text-gray-500">{post.time}</p>
                        </div>
                    </div>
                    <button className="text-gray-400"><MoreHorizontal size={20} /></button>
                </div>
                <p className="text-gray-800 text-sm mb-3 whitespace-pre-line leading-relaxed">{post.content}</p>
                {post.image && (<div className="mb-3 rounded-xl overflow-hidden border border-gray-100"><img src={post.image} alt="Post content" className="w-full h-auto" /></div>)}
                {embedUrl && (<div className="mb-3 rounded-xl overflow-hidden border border-gray-100 aspect-video relative bg-black"><iframe src={embedUrl} className="w-full h-full absolute inset-0" allowFullScreen title="Embedded video"></iframe></div>)}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex space-x-6">
                        <button onClick={() => handleLikePost(post.id)} className={`flex items-center space-x-1.5 text-sm ${post.isLiked ? 'text-pink-600' : 'text-gray-500'}`}><Heart size={20} className={post.isLiked ? 'fill-current' : ''} /><span>{post.likes}</span></button>
                        <button onClick={() => handleOpenComment(post.id)} className="flex items-center space-x-1.5 text-sm text-gray-500"><MessageCircle size={20} /><span>{post.comments}</span></button>
                        <button onClick={() => handleSharePost(post)} className="flex items-center space-x-1.5 text-sm text-gray-500"><Share2 size={20} /></button>
                    </div>
                    {post.reaction && <span className="text-lg animate-bounce">{post.reaction}</span>}
                </div>
            </div>
        )})}
      </div>
    </motion.div>
  );

  const renderLogin = () => (
    <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col bg-white p-6">
       <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-8">
             <img src="https://i.ibb.co.com/60TdZLxD/Logo-Toko-Aneka-Cemilan-Snack-Ceria-Oranye-Kuning-20251105-010226-0000.png" alt="Kriuké" className="w-20 h-20 mx-auto mb-4" />
             <h2 className="text-2xl font-bold text-emerald-700">Selamat Datang</h2>
             <p className="text-gray-500">Silakan login untuk melanjutkan</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
             {authError && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">{authError}</div>}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /><input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Username Anda" required /></div>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative"><KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /><input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Password Anda" required /></div>
             </div>
             <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-transform transform active:scale-95">Masuk Sekarang</button>
          </form>
          <div className="mt-6 text-center"><p className="text-gray-500 text-sm">Belum punya akun? <button onClick={() => setCurrentView('register')} className="text-emerald-600 font-bold hover:underline">Daftar disini</button></p></div>
       </div>
    </motion.div>
  );

  const renderRegister = () => (
    <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col bg-white p-6 overflow-y-auto pb-20">
       <div className="text-center mb-6 mt-4"><h2 className="text-2xl font-bold text-emerald-700">Buat Akun Baru</h2><p className="text-gray-500 text-sm">Gabung komunitas Kriuké sekarang!</p></div>
       <form onSubmit={handleRegister} className="space-y-3">
          {authError && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">{authError}</div>}
          <div><label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap</label><input type="text" value={registerData.name} onChange={(e) => setRegisterData({...registerData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500" required /></div>
          <div><label className="block text-xs font-bold text-gray-700 mb-1">Username</label><input type="text" value={registerData.username} onChange={(e) => setRegisterData({...registerData, username: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500" required /></div>
          <div><label className="block text-xs font-bold text-gray-700 mb-1">Email</label><input type="email" value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500" required /></div>
          <div><label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp</label><input type="tel" value={registerData.whatsapp} onChange={(e) => setRegisterData({...registerData, whatsapp: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500" required /></div>
          <div><label className="block text-xs font-bold text-gray-700 mb-1">Alamat</label><input type="text" value={registerData.address} onChange={(e) => setRegisterData({...registerData, address: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500" required /></div>
          <div><label className="block text-xs font-bold text-gray-700 mb-1">Password</label><input type="password" value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500" required /></div>
          <div><label className="block text-xs font-bold text-gray-700 mb-1">Konfirmasi Password</label><input type="password" value={registerData.confirmPassword} onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500" required /></div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg mt-4">Daftar</button>
       </form>
       <div className="mt-6 text-center mb-4"><p className="text-gray-500 text-sm">Sudah punya akun? <button onClick={() => setCurrentView('login')} className="text-emerald-600 font-bold hover:underline">Login</button></p></div>
    </motion.div>
  );

  const renderAdminProducts = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">Kelola Produk</h2><button onClick={handleAddProduct} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center"><Plus size={16} className="mr-1" /> Tambah</button></div>
      <div className="space-y-3">{products.map(product => (<div key={product.id} className="bg-white p-3 rounded-xl shadow-sm flex items-center"><img src={product.image} className="w-16 h-16 rounded-lg object-cover bg-gray-100" /><div className="ml-3 flex-1"><h3 className="font-bold text-gray-800 text-sm line-clamp-1">{product.name}</h3><p className="text-emerald-600 font-bold text-xs">Rp{product.price.toLocaleString()}</p><div className="flex items-center text-[10px] text-gray-500 mt-1"><span className="mr-2 flex items-center"><Star size={10} className="text-amber-400 mr-1" />{product.rating}</span><span>{product.sold} terjual</span></div></div><div className="flex flex-col space-y-2 ml-2"><button onClick={() => handleEditProduct(product)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Edit3 size={16} /></button><button onClick={() => deleteProduct(product.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button></div></div>))}</div>
    </div>
  );

  const renderAdminCategories = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">Kelola Kategori</h2><button onClick={handleAddCategory} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center"><Plus size={16} className="mr-1" /> Tambah</button></div>
      <div className="grid grid-cols-2 gap-3">{categories.map(category => (<div key={category.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center relative"><div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center text-2xl mb-2`}>{category.icon}</div><span className="font-bold text-gray-700 text-sm">{category.name}</span><div className="absolute top-2 right-2 flex space-x-1"><button onClick={() => handleEditCategory(category)} className="p-1 bg-blue-50 text-blue-600 rounded text-[10px]"><Edit3 size={12} /></button><button onClick={() => deleteCategory(category.id)} className="p-1 bg-red-50 text-red-600 rounded text-[10px]"><Trash2 size={12} /></button></div></div>))}</div>
    </div>
  );

  const renderAdminPromos = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">Kelola Promo</h2><button onClick={handleAddPromo} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center"><Plus size={16} className="mr-1" /> Tambah</button></div>
      <div className="space-y-3">{promos.map(promo => (<div key={promo.id} className={`bg-white p-3 rounded-xl shadow-sm border-l-4 ${promo.active ? 'border-emerald-500' : 'border-gray-300'} relative`}><div className="flex justify-between items-start"><div><h3 className="font-bold text-gray-800">{promo.code}</h3><p className="text-xs text-gray-500">{promo.freeShipping ? 'Gratis Ongkir' : `Diskon ${promo.discount}%`}</p></div><div className="flex space-x-2"><button onClick={() => togglePromoStatus(promo.id)} className={`px-2 py-1 rounded text-[10px] font-bold ${promo.active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>{promo.active ? 'AKTIF' : 'NONAKTIF'}</button><button onClick={() => handleEditPromo(promo)} className="p-1.5 bg-blue-50 text-blue-600 rounded"><Edit3 size={14} /></button><button onClick={() => deletePromo(promo.id)} className="p-1.5 bg-red-50 text-red-600 rounded"><Trash2 size={14} /></button></div></div></div>))}</div>
    </div>
  );

  const renderAdminPromoIcons = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">Kelola Ikon Menu</h2><button onClick={handleAddPromoIcon} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center"><Plus size={16} className="mr-1" /> Tambah</button></div>
      <div className="grid grid-cols-3 gap-3">{promoIcons.map(item => { const IconComponent = iconMap[item.icon] || Smile; return (<div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center relative"><div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mb-2`}><IconComponent size={20} className={item.textColor} /></div><span className="text-xs text-gray-700 font-medium text-center leading-tight">{item.name}</span><div className="absolute top-1 right-1 flex flex-col space-y-1"><button onClick={() => handleEditPromoIcon(item)} className="p-1 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded"><Edit3 size={10} /></button><button onClick={() => deletePromoIcon(item.id)} className="p-1 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded"><Trash2 size={10} /></button></div></div>); })}</div>
    </div>
  );

  const renderAdminStreams = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">Kelola Live</h2><button onClick={handleAddStream} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center"><Plus size={16} className="mr-1" /> Tambah</button></div>
      <div className="space-y-3">{streams.map(stream => (<div key={stream.id} className="bg-white p-3 rounded-xl shadow-sm flex items-center"><div className="w-16 h-12 bg-gray-800 rounded flex items-center justify-center flex-shrink-0"><Video size={20} className="text-white" /></div><div className="ml-3 flex-1 min-w-0"><h3 className="font-bold text-gray-800 text-sm truncate">{stream.title}</h3><p className="text-xs text-gray-500 truncate">{stream.url}</p><div className="flex items-center text-[10px] text-red-500 mt-0.5"><User size={10} className="mr-1" /> {stream.viewers} menonton</div></div><div className="flex space-x-2 ml-2"><button onClick={() => handleEditStream(stream)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Edit3 size={16} /></button><button onClick={() => deleteStream(stream.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button></div></div>))}</div>
    </div>
  );

  const activePost = activePostId ? feedPosts.find(p => p.id === activePostId) : null;

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden font-sans">
      {(currentView === 'home' || currentView === 'admin' || currentView === 'detail' || currentView === 'cart' || currentView === 'feed' || currentView === 'promo' || currentView === 'live' || currentView === 'akun' || currentView === 'login' || currentView === 'register' || currentView === 'transaksi') && (<header className="bg-white shadow-sm pt-2 px-4 pb-1 sticky top-0 z-10"><div className="flex items-center justify-between mb-2"><div className="flex items-center space-x-3"><img src="https://i.ibb.co.com/60TdZLxD/Logo-Toko-Aneka-Cemilan-Snack-Ceria-Oranye-Kuning-20251105-010226-0000.png" alt="Kriuké Logo" className="w-10 h-10 object-contain" /><h1 className="text-xl font-bold text-emerald-700">Kriuké</h1><span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">Official</span></div><div className="flex items-center space-x-2"><button onClick={() => setCurrentView('live')} className="p-2 rounded-full hover:bg-gray-100"><Video size={20} className="text-red-500" /></button><button onClick={() => setCurrentView('cart')} className="p-2 rounded-full hover:bg-gray-100 relative"><ShoppingCart size={20} className="text-emerald-600" />{cartCount > 0 && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>)}</button><button onClick={() => setShowContactModal(true)} className="p-2 rounded-full hover:bg-gray-100"><MessageCircle size={20} className="text-green-600" /></button></div></div>{currentView === 'home' && (<div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} /><input type="text" placeholder="Cari keripik, parfum, atau kaos..." className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300"/></div>)}</header>)}
      <AnimatePresence mode="wait">
        {currentView === 'home' ? renderHome() :
         currentView === 'detail' ? renderDetail() :
         currentView === 'cart' ? renderCart() :
         currentView === 'feed' ? renderFeed() : 
         currentView === 'login' ? renderLogin() :
         currentView === 'register' ? renderRegister() :
         currentView === 'promo' ? renderPromoPage() :
         currentView === 'live' ? renderLive() :
         currentView === 'transaksi' ? renderTransactions() :
         currentView === 'admin' ? (isAuthenticated && currentUser?.role === 'admin' ? (<motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex overflow-hidden"><div className="w-16 bg-emerald-700 text-white flex flex-col items-center py-4 space-y-6"><button onClick={() => setAdminView('dashboard')} className={`p-3 rounded-lg ${adminView === 'dashboard' ? 'bg-emerald-600' : ''}`} title="Dashboard"><BarChart3 size={20} /></button><button onClick={() => setAdminView('products')} className={`p-3 rounded-lg ${adminView === 'products' ? 'bg-emerald-600' : ''}`} title="Produk"><Grid size={20} /></button><button onClick={() => setAdminView('categories')} className={`p-3 rounded-lg ${adminView === 'categories' ? 'bg-emerald-600' : ''}`} title="Kategori"><Package size={20} /></button><button onClick={() => setAdminView('promos')} className={`p-3 rounded-lg ${adminView === 'promos' ? 'bg-emerald-600' : ''}`} title="Promo"><Percent size={20} /></button><button onClick={() => setAdminView('promo-icons')} className={`p-3 rounded-lg ${adminView === 'promo-icons' ? 'bg-emerald-600' : ''}`} title="Menu Ikon"><LayoutGrid size={20} /></button><button onClick={() => setAdminView('streams')} className={`p-3 rounded-lg ${adminView === 'streams' ? 'bg-emerald-600' : ''}`} title="Live"><Video size={20} /></button></div><div className="flex-1 overflow-y-auto pb-20">{adminView === 'dashboard' ? renderAdminDashboard() : adminView === 'products' ? renderAdminProducts() : adminView === 'categories' ? renderAdminCategories() : adminView === 'promos' ? renderAdminPromos() : adminView === 'promo-icons' ? renderAdminPromoIcons() : adminView === 'settings' ? renderAdminSettings() : renderAdminStreams()}</div></motion.div>) : renderHome()) :
         renderAccount()}
      </AnimatePresence>
      {!['detail', 'login', 'register', 'live'].includes(currentView) && (
        <nav className="bg-white border-t fixed bottom-0 left-0 right-0 max-w-md mx-auto z-20">
          <div className="grid grid-cols-5">
            {[ 
                { id: 'home', label: 'Home', icon: Home }, 
                { id: 'feed', label: 'Feed', icon: Newspaper }, 
                { id: 'promo', label: 'Promo', icon: Tag }, 
                { id: 'transaksi', label: 'Transaksi', icon: ClipboardList }, 
                isAuthenticated ? { id: 'akun', label: 'Akun', icon: User } : { id: 'login', label: 'Login', icon: LogIn } 
            ].map(item => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => { 
                    if (item.id === 'home') setSelectedCategory(null); 
                    setActiveTab(item.id as View); 
                    setCurrentView(item.id as View); 
                }} className={`py-3 flex flex-col items-center relative ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}>
                    <Icon size={20} />
                    {item.id === 'transaksi' && transactions.filter(t => t.status === 'pending').length > 0 && (
                        <span className="absolute top-1 right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{transactions.filter(t => t.status === 'pending').length}</span>
                    )}
                    <span className="text-xs mt-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
      
      {/* Modals */}
      <AnimatePresence>{showShare && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowShare(false)}><motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full rounded-t-2xl p-4" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-800">Bagikan Kriuké</h3><button onClick={() => setShowShare(false)}><X size={20} /></button></div><div className="grid grid-cols-2 gap-3 mb-4"><button onClick={shareToWhatsApp} className="flex flex-col items-center p-3 bg-emerald-50 rounded-lg"><div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-2"><MessageCircle size={20} className="text-white" /></div><span className="text-sm font-medium">WhatsApp</span></button><button onClick={copyLink} className="flex flex-col items-center p-3 bg-emerald-50 rounded-lg"><div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-2"><Copy size={20} className="text-white" /></div><span className="text-sm font-medium">Salin Link</span></button></div>{isCopied && (<div className="flex items-center bg-emerald-50 text-emerald-700 p-3 rounded-lg"><CheckCircle size={16} className="mr-2" /><span>Link Kriuké disalin!</span></div>)}</motion.div></motion.div>)}</AnimatePresence>
      
      {/* POINT MODAL */}
      <AnimatePresence>
        {showPointModal && editingUserPoints && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPointModal(false)}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-xs rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
                    <div className="text-center mb-4">
                        <h3 className="font-bold text-lg text-gray-800">Edit Poin User</h3>
                        <p className="text-xs text-gray-500">{editingUserPoints.name}</p>
                    </div>
                    <form onSubmit={handleUpdatePoints}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Poin</label>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <div className="bg-gray-100 p-2 border-r border-gray-300"><Coins size={20} className="text-yellow-500"/></div>
                                <input 
                                    type="number" 
                                    value={pointAmount} 
                                    onChange={(e) => setPointAmount(Math.max(0, parseInt(e.target.value) || 0))} 
                                    className="w-full p-2 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button type="button" onClick={() => setShowPointModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-bold">Batal</button>
                            <button type="submit" className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold">Simpan</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* ... (Other modals: showCheckout, showContactModal, showCommentModal, showReviewModal, showPromoModal, showProductModal, showCategoryModal, showStreamModal, showPromoIconModal) ... */}
      <AnimatePresence>{showCheckout && (selectedProduct || checkoutMode === 'cart') && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowCheckout(false)}><motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full rounded-t-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}><div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10"><h2 className="text-xl font-bold text-gray-800">{checkoutMode === 'cart' ? 'Checkout Keranjang' : 'Checkout Produk'}</h2><button onClick={() => setShowCheckout(false)} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button></div>
      <form onSubmit={(e) => { 
          e.preventDefault(); 
          if (!checkoutData.name || !checkoutData.whatsapp) { alert('❌ Mohon lengkapi Nama dan No WhatsApp'); return; } 
          setIsSubmitting(true); 
          setTimeout(() => { 
              const newTransaction: Transaction = {
                  id: `TRX-${Date.now()}`,
                  date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'}),
                  items: checkoutMode === 'cart' ? [...cart] : selectedProduct ? [{ ...selectedProduct, quantity: checkoutData.quantity }] : [],
                  total: finalTotal,
                  status: 'pending',
                  statusLabel: 'Belum Diproses',
                  paymentMethod: 'WhatsApp'
              };
              setTransactions([newTransaction, ...transactions]);
              const productDetails = checkoutMode === 'cart' ? cart.map(item => `- ${item.name} (${item.quantity}x) @ Rp${item.price.toLocaleString()}`).join('\n') : `Produk: ${selectedProduct?.name}\nHarga: Rp${selectedProduct?.price.toLocaleString()}\nJumlah: ${checkoutData.quantity}`; 
              const message = `*PESANAN DARI KRIUKÉ APP (${checkoutMode === 'cart' ? 'Keranjang' : 'Beli Langsung'})*\n\nNo. Pesanan: ${newTransaction.id}\n\n${productDetails}\n\nSubtotal: Rp${currentSubtotal.toLocaleString()}\nKode Promo: ${checkoutData.promoCode || '-'}\nDiskon: Rp${promoDiscount.toLocaleString()}\nOngkir: ${isFreeShipping ? 'GRATIS' : `Rp${shippingCost.toLocaleString()}`}\nTotal: *Rp${finalTotal.toLocaleString()}*\n\nData Pelanggan:\nNama: ${checkoutData.name}\nAlamat: ${checkoutData.address}\nWA: ${checkoutData.whatsapp}\nCatatan: ${checkoutData.notes || '-'}\n\nTerima kasih telah memilih _Kriuké_! 🍌\nTim kami akan segera menghubungi Anda.`.trim(); 
              window.open(`https://wa.me/6283854488111?text=${encodeURIComponent(message)}`, '_blank'); 
              setIsSubmitting(false); 
              setShowCheckout(false); 
              if (checkoutMode === 'cart') { setCart([]); } 
              setCurrentView('transaksi'); setActiveTab('transaksi');
          }, 1000); 
      }} className="p-4 space-y-4">
          <div className="bg-emerald-50 p-3 rounded-lg">
              {checkoutMode === 'cart' ? (<div className="space-y-2"><p className="font-medium text-emerald-800 mb-2">Ringkasan Pesanan ({cartCount} Item)</p><div className="max-h-32 overflow-y-auto text-sm space-y-1">{cart.map(item => (<div key={item.id} className="flex justify-between"><span className="text-gray-700 truncate w-2/3">{item.name} x{item.quantity}</span><span className="font-medium text-gray-900">Rp{(item.price * item.quantity).toLocaleString()}</span></div>))}</div></div>) : (<div className="flex"><img src={selectedProduct?.image} alt={selectedProduct?.name} className="w-16 h-16 object-cover rounded"/><div className="ml-3 flex-1"><h3 className="font-medium text-gray-800 line-clamp-2">{selectedProduct?.name}</h3><p className="text-xl font-bold text-emerald-600">Rp{selectedProduct?.price.toLocaleString()}</p></div></div>)}
          </div>
          <div className="space-y-3"><div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label><input type="text" value={checkoutData.name} onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: Budi Santoso" required/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label><textarea value={checkoutData.address} onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Jl. Mangga No. 12, Bandung"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">No WhatsApp</label><div className="relative"><span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">+62</span><input type="tel" value={checkoutData.whatsapp} onChange={(e) => setCheckoutData({...checkoutData, whatsapp: e.target.value})} className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="81234567890" required/></div></div>{checkoutMode === 'single' && (<div><label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label><div className="flex items-center border border-gray-300 rounded-lg"><button type="button" onClick={() => setCheckoutData({...checkoutData, quantity: Math.max(1, checkoutData.quantity - 1)})} className="w-10 h-10 flex items-center justify-center text-emerald-600">-</button><input type="number" value={checkoutData.quantity} onChange={(e) => setCheckoutData({...checkoutData, quantity: parseInt(e.target.value) || 1})} min="1" className="flex-1 text-center py-2 border-x border-gray-300 focus:outline-none"/><button type="button" onClick={() => setCheckoutData({...checkoutData, quantity: checkoutData.quantity + 1})} className="w-10 h-10 flex items-center justify-center text-emerald-600">+</button></div></div>)}<div><label className="block text-sm font-medium text-gray-700 mb-1">Kode Promo</label><div className="flex"><input type="text" value={checkoutData.promoCode} onChange={(e) => setCheckoutData({...checkoutData, promoCode: e.target.value})} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: KRIUKE10"/><button type="button" onClick={() => { const code = checkoutData.promoCode.toUpperCase(); if (validPromoCodes[code]) { alert(`✅ Kode ${code} valid!`); } else if (code) { alert('❌ Kode promo tidak valid'); } }} className="bg-emerald-600 text-white px-4 rounded-r-lg flex items-center"><Check size={16} /></button></div><p className="text-xs text-emerald-600 mt-1">Aktif: KRIUKE10, GRATISONGKIR, DTFHARMONI</p></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label><input type="text" value={checkoutData.notes} onChange={(e) => setCheckoutData({...checkoutData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Warna kaos, varian rasa, dll"/></div></div><div className="bg-gray-50 p-4 rounded-lg"><h3 className="font-bold text-gray-800 mb-2">Rincian Harga</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span className="font-medium">Rp{currentSubtotal.toLocaleString()}</span></div>{promoDiscount > 0 && (<div className="flex justify-between text-emerald-600"><span>Diskon Promo</span><span>-Rp{promoDiscount.toLocaleString()}</span></div>)}<div className="flex justify-between"><span>Ongkos Kirim</span><span>{isFreeShipping ? 'GRATIS' : `Rp${shippingCost.toLocaleString()}`}</span></div><div className="flex justify-between pt-2 border-t font-bold text-lg"><span>Total Bayar</span><span className="text-emerald-600">Rp{finalTotal.toLocaleString()}</span></div></div></div><button type="submit" disabled={isSubmitting} className={`w-full py-3 px-4 rounded-xl font-bold text-white ${isSubmitting ? 'bg-emerald-400' : 'bg-emerald-600'} flex items-center justify-center`}>{isSubmitting ? (<><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Mengirim...</>) : ('Kirim Pesanan ke WhatsApp')}</button><p className="text-xs text-gray-500 text-center">📲 Tim Kriuké akan balas maks. 1 jam.</p></form></motion.div></motion.div>)}</AnimatePresence>
      <AnimatePresence>{showContactModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowContactModal(false)}><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-xl p-6" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-gray-800">Tanya Admin via WhatsApp</h3><button onClick={() => setShowContactModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button></div><form onSubmit={handleContactSubmit} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Anda</label><input type="text" value={contactData.name} onChange={(e) => setContactData({...contactData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Nama Anda"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Pesan / Pertanyaan</label><textarea value={contactData.message} onChange={(e) => setContactData({...contactData, message: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" rows={3} placeholder="Tanya stok, detail produk, dll..." required /></div><button type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center"><MessageCircle size={18} className="mr-2" />Kirim ke WhatsApp</button></form></motion.div></motion.div>)}</AnimatePresence>
      <AnimatePresence>
        {showCommentModal && activePost && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowCommentModal(false)}>
                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full rounded-t-2xl h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <div className="p-4 border-b flex justify-between items-center bg-white rounded-t-2xl">
                        <h3 className="font-bold text-lg text-gray-800">Komentar ({activePost.commentsList?.length || activePost.comments})</h3>
                        <button onClick={() => setShowCommentModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {(!activePost.commentsList || activePost.commentsList.length === 0) ? (
                            <div className="text-center py-8 text-gray-400 flex flex-col items-center h-full justify-center">
                                <MessageCircle size={48} className="mb-2 opacity-20" />
                                <p>Belum ada komentar.</p>
                                <p className="text-xs">Jadilah yang pertama berkomentar!</p>
                            </div>
                        ) : (
                            activePost.commentsList.map(comment => (
                                <div key={comment.id} className="flex space-x-3">
                                    <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full bg-gray-200 object-cover flex-shrink-0" />
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                                        <div className="flex items-baseline space-x-2 mb-1">
                                            <span className="font-bold text-xs text-gray-900">{comment.user}</span>
                                            <span className="text-[10px] text-gray-500">{comment.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-snug">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-3 border-t bg-white safe-area-bottom">
                        <form onSubmit={handlePostComment} className="flex items-end space-x-2">
                            <img src={currentUser ? `https://placehold.co/100x100/emerald/ffffff?text=${currentUser.name?.charAt(0)}` : "https://placehold.co/100x100/ccc/ffffff?text=U"} className="w-8 h-8 rounded-full bg-gray-200 mb-1 object-cover" />
                            <div className="flex-1 bg-gray-100 rounded-xl flex items-center px-3 py-2">
                                <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm max-h-20" placeholder={`Balas sebagai ${currentUser ? currentUser.name : 'Pengunjung'}...`} autoFocus />
                            </div>
                            <button type="submit" disabled={!commentText.trim()} className={`p-2 rounded-full mb-0.5 ${commentText.trim() ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}><Send size={18} className={commentText.trim() ? 'ml-0.5' : ''} /></button>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>{showReviewModal && selectedProduct && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowReviewModal(false)}><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-xl p-6" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-gray-800">Ulas Produk</h3><button onClick={() => setShowReviewModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button></div><div className="flex items-center mb-4 bg-gray-50 p-2 rounded-lg"><img src={selectedProduct.image} className="w-12 h-12 object-cover rounded mr-3" /><div><p className="font-bold text-sm text-gray-800 line-clamp-1">{selectedProduct.name}</p><p className="text-emerald-600 text-xs font-bold">Rp{selectedProduct.price.toLocaleString()}</p></div></div><form onSubmit={handleSubmitReview}><div className="mb-4 text-center"><label className="block text-sm font-medium text-gray-700 mb-2">Berikan Rating</label><div className="flex justify-center space-x-2">{[1, 2, 3, 4, 5].map((star) => (<button type="button" key={star} onClick={() => setReviewRating(star)} className="focus:outline-none"><Star size={32} className={`${star <= reviewRating ? "text-amber-400 fill-current" : "text-gray-300"}`} /></button>))}</div></div><div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">Ulasan Anda</label><textarea value={reviewContent} onChange={(e) => setReviewContent(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Bagaimana pendapatmu tentang produk ini?" rows={4} required /></div><div className="flex items-center mb-6"><input type="checkbox" id="shareToFeed" checked={shareToFeed} onChange={(e) => setShareToFeed(e.target.checked)} className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" /><label htmlFor="shareToFeed" className="ml-2 text-sm text-gray-700">Bagikan ke Feed</label></div><button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700">Kirim Ulasan</button></form></motion.div></motion.div>)}</AnimatePresence>
      <AnimatePresence>{showPromoModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPromoModal(false)}><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-xl p-6" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-gray-800">{editingPromo ? 'Edit Promo' : 'Tambah Promo'}</h3><button onClick={() => setShowPromoModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button></div><form onSubmit={handleSavePromo} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Kode Promo</label><input type="text" value={promoFormData.code} onChange={(e) => setPromoFormData({...promoFormData, code: e.target.value.toUpperCase()})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="CONTOH10" required /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Diskon (%)</label><input type="number" value={promoFormData.discount} onChange={(e) => setPromoFormData({...promoFormData, discount: Number(e.target.value), freeShipping: false})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" min="0" max="100" disabled={promoFormData.freeShipping}/></div><div className="flex items-center"><input type="checkbox" id="freeShipping" checked={promoFormData.freeShipping} onChange={(e) => setPromoFormData({...promoFormData, freeShipping: e.target.checked, discount: e.target.checked ? 0 : promoFormData.discount})} className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"/><label htmlFor="freeShipping" className="ml-2 text-sm text-gray-700">Gratis Ongkir</label></div><div className="flex items-center"><input type="checkbox" id="activeStatus" checked={promoFormData.active} onChange={(e) => setPromoFormData({...promoFormData, active: e.target.checked})} className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"/><label htmlFor="activeStatus" className="ml-2 text-sm text-gray-700">Status Aktif</label></div><button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700 mt-2">Simpan</button></form></motion.div></motion.div>)}</AnimatePresence>
      <AnimatePresence>{showProductModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowProductModal(false)}><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b"><h3 className="font-bold text-lg text-gray-800">{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h3><button onClick={() => setShowProductModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button></div><form onSubmit={handleSaveProduct} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label><div className="relative"><FileText size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" value={productFormData.name} onChange={(e) => setProductFormData({...productFormData, name: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Nama Produk" required /></div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label><input type="number" value={productFormData.price} onChange={(e) => setProductFormData({...productFormData, price: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" min="0" required /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Harga Asli (Coret)</label><input type="number" value={productFormData.originalPrice} onChange={(e) => setProductFormData({...productFormData, originalPrice: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" min="0"/></div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Diskon (%)</label><input type="number" value={productFormData.discount} onChange={(e) => setProductFormData({...productFormData, discount: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" min="0" max="100"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label><select value={productFormData.category} onChange={(e) => setProductFormData({...productFormData, category: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"><option value="keripik">Keripik</option><option value="snack">Snack</option><option value="kaos">Kaos</option><option value="parfum">Parfum</option></select></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label><div className="relative"><ImageIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" value={productFormData.image} onChange={(e) => setProductFormData({...productFormData, image: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="https://..." required /></div>{productFormData.image && (<div className="mt-2 w-full h-32 bg-gray-100 rounded-lg overflow-hidden"><img src={productFormData.image} alt="Preview" className="w-full h-full object-contain" onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=Invalid+Image'} /></div>)}</div><div><label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label><textarea value={productFormData.description} onChange={(e) => setProductFormData({...productFormData, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Deskripsi produk..." /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label><div className="relative"><MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" value={productFormData.location} onChange={(e) => setProductFormData({...productFormData, location: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Kota Asal"/></div></div><div className="flex items-center"><input type="checkbox" id="productFreeShipping" checked={productFormData.freeShipping} onChange={(e) => setProductFormData({...productFormData, freeShipping: e.target.checked})} className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"/><label htmlFor="productFreeShipping" className="ml-2 text-sm text-gray-700">Gratis Ongkir</label></div><div className="pt-2 border-t mt-4"><button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700">Simpan Produk</button></div></form></motion.div></motion.div>)}</AnimatePresence>
      <AnimatePresence>{showCategoryModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCategoryModal(false)}><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-xl p-6" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-gray-800">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h3><button onClick={() => setShowCategoryModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button></div><form onSubmit={handleSaveCategory} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label><input type="text" value={categoryFormData.name} onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: Keripik" required /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Ikon (Emoji)</label><div className="relative"><Smile size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" value={categoryFormData.icon} onChange={(e) => setCategoryFormData({...categoryFormData, icon: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: 🍌" required /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Warna Background</label><select value={categoryFormData.color} onChange={(e) => setCategoryFormData({...categoryFormData, color: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"><option value="bg-emerald-100">Hijau (Default)</option><option value="bg-blue-100">Biru</option><option value="bg-red-100">Merah</option><option value="bg-amber-100">Kuning</option><option value="bg-purple-100">Ungu</option><option value="bg-gray-100">Abu-abu</option></select></div><button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700 mt-2">Simpan</button></form></motion.div></motion.div>)}</AnimatePresence>
      <AnimatePresence>{showStreamModal && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowStreamModal(false)}><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-xl p-6" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-gray-800">{editingStream ? 'Edit Live Stream' : 'Tambah Live Stream'}</h3><button onClick={() => setShowStreamModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button></div><form onSubmit={handleSaveStream} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Judul Live</label><input type="text" value={streamFormData.title} onChange={(e) => setStreamFormData({...streamFormData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Judul Live Streaming" required /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">URL Stream</label><div className="relative"><LinkIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" value={streamFormData.url} onChange={(e) => setStreamFormData({...streamFormData, url: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="https://youtube.com/..." required /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Penonton (Simulasi)</label><input type="number" value={streamFormData.viewers} onChange={(e) => setStreamFormData({...streamFormData, viewers: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" min="0"/></div><button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700 mt-2">Simpan</button></form></motion.div></motion.div>)}</AnimatePresence>
      <AnimatePresence>
        {showPromoIconModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPromoIconModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">{editingPromoIcon ? 'Edit Ikon Menu' : 'Tambah Ikon Menu'}</h3>
                <button onClick={() => setShowPromoIconModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleSavePromoIcon} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Label</label>
                  <input 
                    type="text" 
                    value={promoIconFormData.name} 
                    onChange={(e) => setPromoIconFormData({...promoIconFormData, name: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Contoh: Makanan"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Ikon</label>
                  <select 
                    value={promoIconFormData.icon} 
                    onChange={(e) => setPromoIconFormData({...promoIconFormData, icon: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    {Object.keys(iconMap).map(iconName => (
                        <option key={iconName} value={iconName}>{iconName}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warna Bg</label>
                    <select 
                        value={promoIconFormData.color} 
                        onChange={(e) => setPromoIconFormData({...promoIconFormData, color: e.target.value})} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs"
                    >
                        <option value="bg-orange-100">Orange</option>
                        <option value="bg-blue-100">Biru</option>
                        <option value="bg-yellow-100">Kuning</option>
                        <option value="bg-purple-100">Ungu</option>
                        <option value="bg-sky-100">Langit</option>
                        <option value="bg-emerald-100">Hijau</option>
                        <option value="bg-red-100">Merah</option>
                        <option value="bg-indigo-100">Indigo</option>
                    </select>
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warna Teks</label>
                    <select 
                        value={promoIconFormData.textColor} 
                        onChange={(e) => setPromoIconFormData({...promoIconFormData, textColor: e.target.value})} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs"
                    >
                        <option value="text-orange-600">Orange</option>
                        <option value="text-blue-600">Biru</option>
                        <option value="text-yellow-600">Kuning</option>
                        <option value="text-purple-600">Ungu</option>
                        <option value="text-sky-600">Langit</option>
                        <option value="text-emerald-600">Hijau</option>
                        <option value="text-red-600">Merah</option>
                        <option value="text-indigo-600">Indigo</option>
                    </select>
                    </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg flex justify-center">
                    <div className="flex flex-col items-center space-y-1 w-14">
                        <div className={`w-10 h-10 ${promoIconFormData.color} rounded-lg flex items-center justify-center shadow-sm`}>
                            {React.createElement(iconMap[promoIconFormData.icon] || Smile, { size: 20, className: promoIconFormData.textColor })}
                        </div>
                        <span className="text-[10px] text-gray-600 text-center font-medium">{promoIconFormData.name || 'Preview'}</span>
                    </div>
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
