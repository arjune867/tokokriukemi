import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight, 
  Star, MapPin, Share2, Truck,
  Home, Newspaper, Tag, User, X, Check, Percent,
  Plus, Edit3, Trash2, Video, BarChart3, Grid, Package,
  Copy, CheckCircle, Shirt, Leaf, Droplet, LogIn, Shield, LogOut, KeyRound, Mail, Phone, HomeIcon, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Product, Category, Promo, Stream, CartItem, CheckoutData, View, AdminView, User as UserType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<View>('home');
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({ name: '', address: '', whatsapp: '', quantity: 1, promoCode: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  // Admin state
  const [adminView, setAdminView] = useState<AdminView>('dashboard');
  
  // Auth state
  const [users, setUsers] = useState<UserType[]>([
    { id: 1, username: 'arjune', password: 'masukin474', role: 'admin', name: 'Arjune' },
    { id: 2, username: 'pelanggan', password: 'password123', role: 'customer', name: 'Pelanggan Setia' },
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

  // Products
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Keripik Pisang Coklat", price: 15000, originalPrice: 20000, discount: 25, rating: 4.9, sold: 2450, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/047857?text=🍫+Coklat", description: "Keripik pisang premium dilumuri coklat dark berkualitas. Renyah dan bikin nagih!", category: "keripik" },
    { id: 2, name: "Keripik Pisang Pedas", price: 15000, originalPrice: 20000, discount: 25, rating: 4.8, sold: 2180, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/059669?text=🌶️+Pedas", description: "Keripik pisang dengan baluran bumbu pedas level 8/10. Cocok untuk pecinta pedas!", category: "keripik" },
    { id: 3, name: "Kaos DTF Premium - Kriuké", price: 89000, originalPrice: 120000, discount: 25, rating: 4.9, sold: 620, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/166534?text=👕+Kriuké", description: "Kaos premium cotton combed 24s dengan sablon DTF berkualitas tinggi. Desain eksklusif Kriuké!", category: "kaos" },
    { id: 4, name: "Parfum HRM - Mistique", price: 95000, originalPrice: 135000, discount: 30, rating: 4.8, sold: 840, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/16A34A?text=💧+Mistique", description: "Parfum HRM Mistique – aroma woody & musky yang elegan. Tahan 8-12 jam. 50ml.", category: "parfum" },
    { id: 5, name: "Keripik Talas Original", price: 12000, originalPrice: 15000, discount: 20, rating: 4.6, sold: 1450, location: "Bandung", freeShipping: false, image: "https://placehold.co/300x300/F0FDF4/065F46?text=🍠+Talas", description: "Keripik talas lokal khas Jawa Barat. Renyah, gurih, dan rendah lemak.", category: "snack" },
    { id: 6, name: "Parfum HRM - Citrus Bloom", price: 95000, originalPrice: 135000, discount: 30, rating: 4.7, sold: 710, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/15803D?text=🍊+Citrus", description: "Aroma citrus segar dengan sentuhan floral. Ringan & menyegarkan. 50ml.", category: "parfum" }
  ]);
  
  const [categories] = useState<Category[]>([
    { id: 1, name: "Keripik", icon: "🍌", color: "bg-emerald-100" },
    { id: 2, name: "Snack", icon: "🍿", color: "bg-emerald-50" },
    { id: 3, name: "Kaos DTF", icon: "👕", color: "bg-gray-100" },
    { id: 4, name: "Parfum HRM", icon: "💧", color: "bg-emerald-50" },
    { id: 5, name: "Paket Hemat", icon: "📦", color: "bg-emerald-100" }
  ]);
  
  const [promos] = useState<Promo[]>([
    { id: 1, code: "KRIUKE10", discount: 10, active: true },
    { id: 2, code: "GRATISONGKIR", discount: 0, freeShipping: true, active: true },
    { id: 3, code: "DTFHARMONI", discount: 15, active: true }
  ]);
  
  const [streams] = useState<Stream[]>([
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

  const validPromoCodes = promos.reduce((acc, promo) => {
    if (promo.active) acc[promo.code] = { discount: promo.discount, freeShipping: promo.freeShipping || false };
    return acc;
  }, {} as Record<string, { discount: number; freeShipping: boolean }>);

  const basePrice = selectedProduct?.price || 0;
  const quantity = checkoutData.quantity || 1;
  const subtotal = basePrice * quantity;
  let promoDiscount = 0;
  let freeShipping = selectedProduct?.freeShipping || false;
  if (checkoutData.promoCode && validPromoCodes[checkoutData.promoCode.toUpperCase()]) {
    const promo = validPromoCodes[checkoutData.promoCode.toUpperCase()];
    promoDiscount = (subtotal * promo.discount) / 100;
    freeShipping = freeShipping || promo.freeShipping;
  }
  const totalAfterPromo = Math.max(0, subtotal - promoDiscount);
  const shippingCost = freeShipping ? 0 : 10000;
  const total = totalAfterPromo + shippingCost;

  // ===== ADMIN FUNCTIONS =====
  const addProduct = () => {
    const newProduct: Product = { id: products.length + 1, name: `Produk Baru Kriuké`, price: 20000, originalPrice: 25000, discount: 20, rating: 4.5, sold: 0, location: "Bandung", freeShipping: true, image: "https://placehold.co/300x300/F0FDF4/047857?text=NEW", description: "Deskripsi produk baru", category: "keripik" };
    setProducts([...products, newProduct]);
    setAdminView('products');
  };
  const editProduct = (id: number) => alert(`✏️ Edit produk ID: ${id}`);
  const deleteProduct = (id: number) => { if (window.confirm('Hapus produk ini?')) { setProducts(products.filter(p => p.id !== id)); } };

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
        <div className="p-4">
          <div className="bg-red-500 text-white p-3 rounded-lg flex justify-between items-center">
            <h3 className="font-bold">Nikmatin diskon pengguna baru</h3>
            <ChevronRight size={20} />
          </div>
        </div>

        {/* Flash Sale Section */}
        <div className="px-4 pb-4">
          <div className="bg-red-100 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-red-600 font-bold">Diskon sd 20%</h3>
                <p className="text-xs text-red-500">Hemat hingga 10k</p>
              </div>
              <div className="flex items-center space-x-1 text-white">
                 <span className="bg-red-500 p-1 rounded-md text-sm font-mono">{h}</span>
                 <span>:</span>
                 <span className="bg-red-500 p-1 rounded-md text-sm font-mono">{m}</span>
                 <span>:</span>
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

        {/* Category Icons */}
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
        
        {/* Product Sections */}
        {[{title: "Keripik Pisang Kriuké", icon: Leaf, cat: "keripik"}, {title: "Parfum HRM (Haroemin)", icon: Droplet, cat: "parfum"}, {title: "Kaos Sablon DTF", icon: Shirt, cat: "kaos"}].map(section => {
          const SectionIcon = section.icon;
          return (<div key={section.title}><div className="px-4 py-3"><h2 className="font-bold text-lg text-gray-800 flex items-center"><SectionIcon className="mr-2 text-emerald-600" size={20} />{section.title}</h2></div><div className="px-4 pb-3"><div className="grid grid-cols-2 gap-3">{products.filter(p => p.category === section.cat).map(product => (<div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer" onClick={() => openProductDetail(product)}><div className="relative"><img src={product.image} alt={product.name} className="w-full h-28 object-cover"/>
          <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="absolute bottom-2 right-2 bg-emerald-600/80 text-white rounded-full w-7 h-7 flex items-center justify-center z-10 hover:bg-emerald-600 transition-all transform hover:scale-110" aria-label={`Tambah ${product.name} ke keranjang`}><Plus size={16} /></button>
          </div><div className="p-2"><h3 className="text-xs font-medium text-gray-800 line-clamp-2">{product.name}</h3><div className="mt-1"><span className="text-emerald-600 font-bold text-sm">Rp{product.price.toLocaleString()}</span></div><div className="mt-1 flex items-center text-xs text-gray-500"><Star size={14} className="text-amber-400 fill-current mr-1" /><span>{product.rating}</span><span className="mx-1.5">|</span><span>{product.sold.toLocaleString()} terjual</span></div></div></div>))}</div></div></div>);
        })}
      </motion.div>
    );
  };
  const renderDetail = () => (selectedProduct && <motion.div key="detail" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} transition={{ type: "spring", damping: 25 }} className="flex-1 overflow-y-auto pb-24 bg-white"><div className="bg-white sticky top-0 z-10 shadow-sm"><div className="flex items-center justify-between p-4"><button onClick={goBack} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={20} className="text-emerald-600" /></button><h1 className="font-bold text-lg text-gray-800">Detail Produk</h1><button onClick={() => setShowShare(true)} className="p-2 rounded-full hover:bg-gray-100"><Share2 size={20} className="text-emerald-600" /></button></div></div><div className="relative h-64 bg-gray-100"><img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-contain p-4"/>{selectedProduct.discount && (<span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">-{selectedProduct.discount}%</span>)}</div><div className="p-4"><h1 className="text-xl font-bold text-gray-800">{selectedProduct.name}</h1><div className="flex items-center mt-1 text-gray-600"><Star size={16} className="text-amber-400 fill-current mr-1" /><span>{selectedProduct.rating}</span><span className="mx-2 text-gray-400">•</span><span>{selectedProduct.sold.toLocaleString()} terjual</span></div><div className="mt-3 flex items-baseline"><span className={`text-2xl font-bold text-emerald-600`}>Rp{selectedProduct.price.toLocaleString()}</span>{selectedProduct.originalPrice && (<span className="text-gray-500 line-through text-lg ml-2">Rp{selectedProduct.originalPrice.toLocaleString()}</span>)}</div><div className="mt-3 flex items-center text-sm text-gray-600"><MapPin size={16} className="mr-1 text-emerald-600" /><span>Dibuat di {selectedProduct.location}</span></div>{selectedProduct.freeShipping && (<div className="mt-3 flex items-center bg-emerald-50 p-3 rounded-lg"><Truck size={20} className="text-emerald-600 mr-2" /><div><p className="font-medium text-emerald-700">Gratis Ongkos Kirim</p><p className="text-xs text-emerald-600">Minimal belanja Rp50.000</p></div></div>)}</div><div className="px-4 py-3 bg-emerald-50 border-l-4 border-emerald-500"><p className="text-emerald-800 font-medium">🌟 Produk Kriuké: Renyah, Enak, dan Berkualitas Premium!</p></div><div className="p-4"><h3 className="font-bold text-gray-800 mb-2">Deskripsi</h3><p className="text-gray-700 mb-4">{selectedProduct.description}</p></div><div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t p-4 flex space-x-3"><button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium flex items-center justify-center" onClick={() => addToCart(selectedProduct)}><ShoppingCart size={18} className="mr-2" />Keranjang</button><button className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold" onClick={() => setShowCheckout(true)}>Beli Sekarang</button></div></motion.div>);
  const renderCart = () => (<motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto pb-24"><div className="bg-white sticky top-0 z-10 shadow-sm p-4"><div className="flex items-center"><button onClick={() => setCurrentView('home')} className="p-2 rounded-full hover:bg-gray-100 mr-2"><ChevronLeft size={20} className="text-emerald-600" /></button><h1 className="font-bold text-lg text-gray-800">Keranjang Kriuké</h1><span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span></div></div>{cart.length === 0 ? (<div className="p-4 text-center mt-12"><div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><Leaf size={32} className="text-emerald-600" /></div><h3 className="text-lg font-medium text-gray-800 mb-2">Keranjang Kosong</h3><p className="text-gray-600 mb-4">Yuk, isi keranjang dengan produk favoritmu!</p><button onClick={() => setCurrentView('home')} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium">Belanja Sekarang</button></div>) : (<div className="p-4"><div className="space-y-4 mb-6">{cart.map(item => (<div key={item.id} className="bg-white rounded-xl p-4 shadow-sm"><div className="flex"><img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-3"/><div className="flex-1"><h3 className="font-medium text-gray-800 line-clamp-2">{item.name}</h3><p className="text-emerald-600 font-bold">Rp{item.price.toLocaleString()}</p><div className="mt-2 flex items-center"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded">-</button><span className="mx-2 w-8 text-center">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded">+</button><button onClick={() => removeFromCart(item.id)} className="ml-auto p-1 text-red-500"><Trash2 size={16} /></button></div></div></div></div>))}</div><div className="bg-white rounded-xl p-4 shadow-sm"><div className="flex justify-between mb-2"><span className="text-gray-600">Total ({cartCount} produk)</span><span className="font-bold text-lg text-emerald-600">Rp{cartTotal.toLocaleString()}</span></div><button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold mt-4" onClick={() => { alert('✅ Pesanan Anda telah dikirim ke WhatsApp!'); setCart([]); setCurrentView('home'); }}>Checkout via WhatsApp</button></div></div>)}</motion.div>);
  const renderAdminDashboard = () => (<div className="p-4 space-y-6"><div className="grid grid-cols-2 gap-4"><div className="bg-white p-4 rounded-xl shadow-sm"><div className="flex items-center"><div className="p-2 bg-emerald-100 rounded-lg mr-3"><Leaf size={20} className="text-emerald-600" /></div><div><p className="text-sm text-gray-600">Penjualan Hari Ini</p><p className="text-xl font-bold">Rp2.45jt</p></div></div></div><div className="bg-white p-4 rounded-xl shadow-sm"><div className="flex items-center"><div className="p-2 bg-emerald-100 rounded-lg mr-3"><Package size={20} className="text-emerald-600" /></div><div><p className="text-sm text-gray-600">Pesanan</p><p className="text-xl font-bold">87</p></div></div></div><div className="bg-white p-4 rounded-xl shadow-sm"><div className="flex items-center"><div className="p-2 bg-emerald-100 rounded-lg mr-3"><ShoppingCart size={20} className="text-emerald-600" /></div><div><p className="text-sm text-gray-600">Produk Terjual</p><p className="text-xl font-bold">1.240</p></div></div></div><div className="bg-white p-4 rounded-xl shadow-sm"><div className="flex items-center"><div className="p-2 bg-emerald-100 rounded-lg mr-3"><Shirt size={20} className="text-emerald-600" /></div><div><p className="text-sm text-gray-600">Kaos DTF</p><p className="text-xl font-bold">215</p></div></div></div></div><div className="bg-white p-4 rounded-xl shadow-sm"><h3 className="font-bold text-gray-800 mb-4">Penjualan Minggu Ini</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={salesData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" /><XAxis dataKey="name" stroke="#6b7280" /><YAxis stroke="#6b7280" /><Tooltip formatter={(value: number) => [`Rp${(value * 1000).toLocaleString()}`, 'Penjualan']} labelFormatter={(label) => `Hari ${label}`}/><Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="bg-white p-4 rounded-xl shadow-sm"><h3 className="font-bold text-gray-800 mb-4">Distribusi Kategori</h3><div className="h-48"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>{categoryData.map((_entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip formatter={(value: number) => [`${value} produk`, 'Jumlah']} /></PieChart></ResponsiveContainer></div></div><div className="bg-white p-4 rounded-xl shadow-sm"><h3 className="font-bold text-gray-800 mb-4">Produk Terlaris</h3><div className="space-y-3">{products.slice(0, 4).map(product => (<div key={product.id} className="flex justify-between items-center"><div className="flex items-center"><div className="w-8 h-8 bg-emerald-100 rounded mr-2 flex items-center justify-center"><span className="text-xs font-bold text-emerald-700">{product.name.charAt(0)}</span></div><span className="text-sm font-medium">{product.name}</span></div><span className="text-emerald-600 font-medium">{product.sold}</span></div>))}</div></div></div></div>);
  const renderAdminProducts = () => (<div className="p-4"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-800">Kelola Produk</h2><button onClick={addProduct} className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg"><Plus size={18} className="mr-1" /> Tambah</button></div><div className="bg-white rounded-xl shadow-sm overflow-hidden"><table className="w-full"> <thead className="bg-gray-50"><tr><th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Produk</th><th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Harga</th><th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Kategori</th><th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Aksi</th></tr></thead><tbody className="divide-y divide-gray-200">{products.map(product => (<tr key={product.id} className="hover:bg-gray-50"><td className="py-4 px-4"><div className="flex items-center"><img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded mr-3"/><span className="font-medium text-gray-800">{product.name}</span></div></td><td className="py-4 px-4"><span className={`font-bold ${getCategoryColor(product.category)}`}>Rp{product.price.toLocaleString()}</span>{product.discount && (<span className="ml-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">-{product.discount}%</span>)}</td><td className="py-4 px-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span></td><td className="py-4 px-4"><div className="flex space-x-2"><button onClick={() => editProduct(product.id)} className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg"><Edit3 size={14} /></button><button onClick={() => deleteProduct(product.id)} className="p-1.5 bg-red-100 text-red-700 rounded-lg"><Trash2 size={14} /></button></div></td></tr>))}</tbody></table></div></div>);
  const renderAdminCategories = () => (<div className="p-4"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-800">Kategori Produk</h2><button onClick={() => alert('Fitur tambah kategori aktif di backend')} className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg"><Plus size={18} className="mr-1" /> Tambah</button></div><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">{categories.map(category => (<div key={category.id} className="bg-white rounded-xl p-4 shadow-sm text-center"><div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2`}><span className="text-lg">{category.icon}</span></div><h3 className="font-medium text-gray-800">{category.name}</h3></div>))}</div></div>);
  const renderAdminPromos = () => (<div className="p-4"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-800">Kode Promo</h2><button onClick={() => alert('Kode promo baru: KRIUKE25')} className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg"><Plus size={18} className="mr-1" /> Tambah</button></div><div className="bg-white rounded-xl shadow-sm overflow-hidden"><table className="w-full"> <thead className="bg-gray-50"><tr><th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Kode</th><th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Diskon</th><th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th></tr></thead><tbody className="divide-y divide-gray-200">{promos.map(promo => (<tr key={promo.id} className="hover:bg-gray-50"><td className="py-4 px-4 font-mono font-medium text-emerald-700">{promo.code}</td><td className="py-4 px-4">{promo.discount > 0 ? (<span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">-{promo.discount}%</span>) : promo.freeShipping ? (<span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm">Gratis Ongkir</span>) : null}</td><td className="py-4 px-4"><span className={`px-2 py-1 rounded-full text-xs ${promo.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>{promo.active ? 'Aktif' : 'Nonaktif'}</span></td></tr>))}</tbody></table></div></div>);
  const renderAdminStreams = () => (<div className="p-4"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-800">Live Streaming</h2><button onClick={() => alert('Live streaming baru: "Custom Sablon DTF"')} className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg"><Plus size={18} className="mr-1" /> Tambah</button></div><div className="space-y-4">{streams.map(stream => (<div key={stream.id} className="bg-white rounded-xl p-4 shadow-sm"><div className="flex items-start"><div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mr-4"><Video size={24} className="text-emerald-600" /></div><div className="flex-1"><h3 className="font-bold text-gray-800">{stream.title}</h3><p className="text-sm text-gray-600 mt-1 truncate">{stream.url}</p><div className="mt-2 flex items-center text-sm text-red-500"><span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>Live • {stream.viewers.toLocaleString()} penonton</div></div></div></div>))}</div></div>);
  const renderOtherPages = () => {
      if (currentView === 'akun' && isAuthenticated && currentUser) {
          return (<div className="flex-1 overflow-y-auto pb-20 p-4"><div className="flex items-center mb-6"><User className="text-emerald-600 mr-2" size={28} /><h1 className="text-2xl font-bold text-emerald-700">Akun Saya</h1></div><div className="bg-white p-6 rounded-xl space-y-4"><div className="text-center"><h2 className="text-xl font-bold text-gray-800 mb-2">Selamat Datang, {currentUser.name || currentUser.username}!</h2><p className="text-gray-600">Anda login sebagai {currentUser.role === 'admin' ? 'Administrator' : 'Pelanggan'}.</p></div>{currentUser.role === 'admin' && (<button onClick={() => { setActiveTab('admin'); setCurrentView('admin'); }} className="w-full flex items-center justify-center bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium"><Shield size={18} className="mr-2" />Akses Panel Admin</button>)}<button onClick={handleLogout} className="w-full flex items-center justify-center bg-red-500 text-white px-6 py-3 rounded-lg font-medium"><LogOut size={18} className="mr-2" />Logout</button></div></div>)
      }
      const pages: Record<string, {title: string; icon: React.ElementType}> = { feed: { title: "Feed", icon: Newspaper }, promo: { title: "Promo", icon: Tag }};
      const { title, icon: Icon } = pages[currentView] || { title: "Halaman", icon: Home };
      return (<div className="flex-1 overflow-y-auto pb-20 p-4"><div className="flex items-center mb-6"><Icon className="text-emerald-600 mr-2" size={28} /><h1 className="text-2xl font-bold text-emerald-700">{title}</h1></div><div className="bg-white p-6 rounded-xl text-center"><div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><Icon className="text-emerald-600" size={32} /></div><p className="text-gray-600">Halaman ini sedang dalam pengembangan.</p><button onClick={() => setCurrentView('home')} className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium">Kembali ke Toko</button></div></div>);
  };
  const renderLogin = () => (<motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col"><div className="bg-white sticky top-0 z-10 shadow-sm"><div className="flex items-center p-4"><button onClick={() => setCurrentView('home')} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={20} className="text-emerald-600" /></button><h1 className="font-bold text-lg text-gray-800 mx-auto">Login</h1><div className="w-10"></div></div></div><div className="flex-1 overflow-y-auto p-4 flex flex-col"><div className="w-full max-w-sm mx-auto my-auto"><form onSubmit={handleLogin} className="bg-white p-6 rounded-xl shadow-lg space-y-4"><div className="text-center"><h2 className="text-2xl font-bold text-emerald-700">Login Kriuké</h2><p className="text-gray-500">Masuk untuk melanjutkan belanja.</p></div>{authError && <p className="text-red-500 text-sm text-center">{authError}</p>}<div><label className="block text-sm font-medium text-gray-700 mb-1">Username</label><div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/><input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder="Contoh: pelanggan" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><div className="relative"><KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/><input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="password123" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div></div><div className="text-right text-sm"><button type="button" onClick={() => alert('Fitur Lupa Password sedang dalam pengembangan.')} className="font-medium text-emerald-600 hover:underline">Lupa Password?</button></div><button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold">Login</button><div className="relative my-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">atau login dengan</span></div></div><div className="flex space-x-3">{['Google', 'Facebook', 'TikTok'].map(provider => (<button key={provider} type="button" onClick={() => alert(`Login dengan ${provider} belum tersedia.`)} className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">{provider}</button>))}</div><p className="text-center text-sm">Belum punya akun? <button type="button" onClick={() => setCurrentView('register')} className="font-medium text-emerald-600 hover:underline">Daftar</button></p></form></div></div></motion.div>);
  const renderRegister = () => {
      const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setRegisterData({ ...registerData, [e.target.name]: e.target.value });
      };
      return (<motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col"><div className="bg-white sticky top-0 z-10 shadow-sm"><div className="flex items-center p-4"><button onClick={() => setCurrentView('home')} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={20} className="text-emerald-600" /></button><h1 className="font-bold text-lg text-gray-800 mx-auto">Daftar Akun</h1><div className="w-10"></div></div></div><div className="flex-1 overflow-y-auto p-4"><div className="w-full max-w-sm mx-auto"><form onSubmit={handleRegister} className="bg-white p-6 rounded-xl shadow-lg space-y-3"><div className="text-center mb-2"><h2 className="text-2xl font-bold text-emerald-700">Buat Akun Baru</h2></div>{authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
      {[{name: "name", label: "Nama Lengkap", icon: User, placeholder: "Budi Santoso"}, {name: "username", label: "Username", icon: User, placeholder: "budisantoso"}, {name: "email", label: "Email", icon: Mail, placeholder: "budi@email.com"}, {name: "whatsapp", label: "No. WhatsApp", icon: Phone, placeholder: "081234567890"}, {name: "address", label: "Alamat", icon: HomeIcon, placeholder: "Jl. Mangga No. 12"}].map(field => { const Icon = field.icon; return (<div key={field.name}><label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label><div className="relative"><Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/><input type="text" name={field.name} value={(registerData as any)[field.name]} onChange={handleRegisterChange} placeholder={field.placeholder} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div></div>)})}
      {[{name: "password", label: "Password"}, {name: "confirmPassword", label: "Konfirmasi Password"}].map(field => (<div key={field.name}><label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label><div className="relative"><KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16}/><input type="password" name={field.name} value={(registerData as any)[field.name]} onChange={handleRegisterChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" /></div></div>))}
      <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold mt-2">Daftar</button><p className="text-center text-sm">Sudah punya akun? <button type="button" onClick={() => setCurrentView('login')} className="font-medium text-emerald-600 hover:underline">Login</button></p></form></div></div></motion.div>)
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden font-sans">
      {(currentView === 'home' || currentView === 'admin') && (<header className="bg-white shadow-sm pt-2 px-4 pb-1 sticky top-0 z-10"><div className="flex items-center justify-between mb-2"><div className="flex items-center space-x-3"><div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center"><Leaf size={20} className="text-white" /></div><h1 className="text-xl font-bold text-emerald-700">Kriuké</h1><span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">Official</span></div><div className="flex items-center space-x-3"><button onClick={() => setCurrentView('cart')} className="p-2 rounded-full hover:bg-gray-100 relative"><ShoppingCart size={20} className="text-emerald-600" />{cartCount > 0 && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>)}</button><button className="p-2 rounded-full hover:bg-gray-100"><MessageCircle size={20} className="text-emerald-600" /></button></div></div>{currentView === 'home' && (<div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} /><input type="text" placeholder="Cari keripik, parfum, atau kaos..." className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300"/></div>)}</header>)}
      <AnimatePresence mode="wait">
        {currentView === 'home' ? renderHome() :
         currentView === 'detail' ? renderDetail() :
         currentView === 'cart' ? renderCart() :
         currentView === 'login' ? renderLogin() :
         currentView === 'register' ? renderRegister() :
         currentView === 'admin' ? (isAuthenticated && currentUser?.role === 'admin' ? (<motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex overflow-hidden"><div className="w-16 bg-emerald-700 text-white flex flex-col items-center py-4 space-y-6"><button onClick={() => setAdminView('dashboard')} className={`p-3 rounded-lg ${adminView === 'dashboard' ? 'bg-emerald-600' : ''}`} title="Dashboard"><BarChart3 size={20} /></button><button onClick={() => setAdminView('products')} className={`p-3 rounded-lg ${adminView === 'products' ? 'bg-emerald-600' : ''}`} title="Produk"><Grid size={20} /></button><button onClick={() => setAdminView('categories')} className={`p-3 rounded-lg ${adminView === 'categories' ? 'bg-emerald-600' : ''}`} title="Kategori"><Package size={20} /></button><button onClick={() => setAdminView('promos')} className={`p-3 rounded-lg ${adminView === 'promos' ? 'bg-emerald-600' : ''}`} title="Promo"><Percent size={20} /></button><button onClick={() => setAdminView('streams')} className={`p-3 rounded-lg ${adminView === 'streams' ? 'bg-emerald-600' : ''}`} title="Live"><Video size={20} /></button></div><div className="flex-1 overflow-y-auto">{adminView === 'dashboard' ? renderAdminDashboard() : adminView === 'products' ? renderAdminProducts() : adminView === 'categories' ? renderAdminCategories() : adminView === 'promos' ? renderAdminPromos() : renderAdminStreams()}</div></motion.div>) : renderHome()) :
         renderOtherPages()}
      </AnimatePresence>
      {!['detail', 'login', 'register'].includes(currentView) && (
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
      <AnimatePresence>{showShare && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowShare(false)}><motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full rounded-t-2xl p-4" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-800">Bagikan Kriuké</h3><button onClick={() => setShowShare(false)}><X size={20} /></button></div><div className="grid grid-cols-2 gap-3 mb-4"><button onClick={shareToWhatsApp} className="flex flex-col items-center p-3 bg-emerald-50 rounded-lg"><div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-2"><MessageCircle size={20} className="text-white" /></div><span className="text-sm font-medium">WhatsApp</span></button><button onClick={copyLink} className="flex flex-col items-center p-3 bg-emerald-50 rounded-lg"><div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-2"><Copy size={20} className="text-white" /></div><span className="text-sm font-medium">Salin Link</span></button></div>{isCopied && (<div className="flex items-center bg-emerald-50 text-emerald-700 p-3 rounded-lg"><CheckCircle size={16} className="mr-2" /><span>Link Kriuké disalin!</span></div>)}</motion.div></motion.div>)}</AnimatePresence>
      <AnimatePresence>{showCheckout && selectedProduct && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowCheckout(false)}><motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full rounded-t-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}><div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10"><h2 className="text-xl font-bold text-gray-800">Checkout</h2><button onClick={() => setShowCheckout(false)} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button></div><form onSubmit={(e) => { e.preventDefault(); if (!checkoutData.name || !checkoutData.whatsapp) { alert('❌ Mohon lengkapi Nama dan No WhatsApp'); return; } setIsSubmitting(true); setTimeout(() => { const message = `*PESANAN DARI KRIUKÉ APP*\n\nProduk: ${selectedProduct.name}\nHarga: Rp${selectedProduct.price.toLocaleString()}\nJumlah: ${checkoutData.quantity}\nSubtotal: Rp${subtotal.toLocaleString()}\n\nKode Promo: ${checkoutData.promoCode || '-'}\nDiskon: Rp${promoDiscount.toLocaleString()}\nOngkir: ${freeShipping ? 'GRATIS' : `Rp${shippingCost.toLocaleString()}`}\nTotal: *Rp${total.toLocaleString()}*\n\nData Pelanggan:\nNama: ${checkoutData.name}\nAlamat: ${checkoutData.address}\nWA: ${checkoutData.whatsapp}\nCatatan: ${checkoutData.notes || '-'}\n\nTerima kasih telah memilih _Kriuké_! 🍌\nTim kami akan segera menghubungi Anda.`.trim(); window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank'); setIsSubmitting(false); setShowCheckout(false); addToCart(selectedProduct, checkoutData.quantity); }, 1000); }} className="p-4 space-y-4"><div className="bg-emerald-50 p-3 rounded-lg"><div className="flex"><img src={selectedProduct.image} alt={selectedProduct.name} className="w-16 h-16 object-cover rounded"/><div className="ml-3 flex-1"><h3 className="font-medium text-gray-800 line-clamp-2">{selectedProduct.name}</h3><p className="text-xl font-bold text-emerald-600">Rp{selectedProduct.price.toLocaleString()}</p></div></div></div><div className="space-y-3"><div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label><input type="text" value={checkoutData.name} onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: Budi Santoso" required/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label><textarea value={checkoutData.address} onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Jl. Mangga No. 12, Bandung"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">No WhatsApp</label><div className="relative"><span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">+62</span><input type="tel" value={checkoutData.whatsapp} onChange={(e) => setCheckoutData({...checkoutData, whatsapp: e.target.value})} className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="81234567890" required/></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label><div className="flex items-center border border-gray-300 rounded-lg"><button type="button" onClick={() => setCheckoutData({...checkoutData, quantity: Math.max(1, checkoutData.quantity - 1)})} className="w-10 h-10 flex items-center justify-center text-emerald-600">-</button><input type="number" value={checkoutData.quantity} onChange={(e) => setCheckoutData({...checkoutData, quantity: parseInt(e.target.value) || 1})} min="1" className="flex-1 text-center py-2 border-x border-gray-300 focus:outline-none"/><button type="button" onClick={() => setCheckoutData({...checkoutData, quantity: checkoutData.quantity + 1})} className="w-10 h-10 flex items-center justify-center text-emerald-600">+</button></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Kode Promo</label><div className="flex"><input type="text" value={checkoutData.promoCode} onChange={(e) => setCheckoutData({...checkoutData, promoCode: e.target.value})} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: KRIUKE10"/><button type="button" onClick={() => { const code = checkoutData.promoCode.toUpperCase(); if (validPromoCodes[code]) { alert(`✅ Kode ${code} valid!`); } else if (code) { alert('❌ Kode promo tidak valid'); } }} className="bg-emerald-600 text-white px-4 rounded-r-lg flex items-center"><Check size={16} /></button></div><p className="text-xs text-emerald-600 mt-1">Aktif: KRIUKE10, GRATISONGKIR, DTFHARMONI</p></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label><input type="text" value={checkoutData.notes} onChange={(e) => setCheckoutData({...checkoutData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Warna kaos, varian rasa, dll"/></div></div><div className="bg-gray-50 p-4 rounded-lg"><h3 className="font-bold text-gray-800 mb-2">Rincian Harga</h3><div className="space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span className="font-medium">Rp{subtotal.toLocaleString()}</span></div>{promoDiscount > 0 && (<div className="flex justify-between text-emerald-600"><span>Diskon Promo</span><span>-Rp{promoDiscount.toLocaleString()}</span></div>)}<div className="flex justify-between"><span>Ongkos Kirim</span><span>{freeShipping ? 'GRATIS' : `Rp${shippingCost.toLocaleString()}`}</span></div><div className="flex justify-between pt-2 border-t font-bold text-lg"><span>Total Bayar</span><span className="text-emerald-600">Rp{total.toLocaleString()}</span></div></div></div><button type="submit" disabled={isSubmitting} className={`w-full py-3 px-4 rounded-xl font-bold text-white ${isSubmitting ? 'bg-emerald-400' : 'bg-emerald-600'} flex items-center justify-center`}>{isSubmitting ? (<><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Mengirim...</>) : ('Kirim Pesanan ke WhatsApp')}</button><p className="text-xs text-gray-500 text-center">📲 Tim Kriuké akan balas maks. 1 jam.</p></form></motion.div></motion.div>)}</AnimatePresence>
    </div>
  );
};

export default App;
