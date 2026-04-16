import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, DollarSign, Smartphone, X, CheckCircle, Search, Tag } from 'lucide-react';

const posProducts = [
  { id: 'p1', name: 'Wireless Headphones', price: 129.99, category: 'Electronics', emoji: '🎧' },
  { id: 'p2', name: 'USB-C Cable 2M', price: 14.99, category: 'Electronics', emoji: '🔌' },
  { id: 'p3', name: 'Ceramic Mug', price: 24.99, category: 'Home', emoji: '☕' },
  { id: 'p4', name: 'Ergonomic Chair', price: 249.99, category: 'Furniture', emoji: '🪑' },
  { id: 'p5', name: 'Mechanical Keyboard', price: 89.99, category: 'Electronics', emoji: '⌨️' },
  { id: 'p6', name: 'Desk Lamp', price: 39.99, category: 'Home', emoji: '💡' },
  { id: 'p7', name: 'Notebook Set', price: 12.99, category: 'Stationery', emoji: '📓' },
  { id: 'p8', name: 'Water Bottle', price: 19.99, category: 'Lifestyle', emoji: '🍶' },
  { id: 'p9', name: 'Mouse Pad XL', price: 29.99, category: 'Electronics', emoji: '🖱️' },
  { id: 'p10', name: 'Phone Stand', price: 17.99, category: 'Electronics', emoji: '📱' },
  { id: 'p11', name: 'Cable Organizer', price: 9.99, category: 'Home', emoji: '🗂️' },
  { id: 'p12', name: 'LED Strip Lights', price: 34.99, category: 'Home', emoji: '💜' },
];

const CATEGORIES = ['All', 'Electronics', 'Home', 'Furniture', 'Stationery', 'Lifestyle'];

export default function POS() {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [isSuccess, setIsSuccess] = useState(false);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmount = subtotal * (discount / 100);
  const tax = (subtotal - discountAmount) * 0.09;
  const total = subtotal - discountAmount + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsSuccess(true);
    setTimeout(() => { setIsSuccess(false); setCart([]); setDiscount(0); }, 2500);
  };

  const filteredProducts = posProducts.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-100">

      {/* Product Grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-900 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />Point of Sale
            </h1>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search products..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
          {/* Category Pills */}
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => {
              const cartItem = cart.find(i => i.id === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all group relative"
                >
                  {cartItem && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex items-center justify-center">{cartItem.qty}</div>
                  )}
                  <div className="text-3xl mb-3">{product.emoji}</div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">{product.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{product.category}</p>
                  <p className="text-base font-extrabold text-slate-900 mt-2">${product.price.toFixed(2)}</p>
                  <div className="absolute inset-0 rounded-xl bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cart / Receipt Panel */}
      <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800 flex items-center justify-between">
            Current Order
            {cart.length > 0 && <button onClick={() => setCart([])} className="text-xs text-red-400 hover:text-red-600 font-medium">Clear all</button>}
          </h2>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-10 h-10 text-slate-200 mb-3" />
              <p className="text-sm text-slate-400 font-medium">Cart is empty</p>
              <p className="text-xs text-slate-300 mt-1">Tap a product to add it</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex items-center space-x-3 bg-slate-50 rounded-xl p-3 group">
              <span className="text-xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                <p className="text-xs text-slate-500">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full bg-slate-200 hover:bg-blue-100 flex items-center justify-center transition-colors"><Minus className="w-3 h-3" /></button>
                <span className="w-5 text-center text-sm font-bold">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full bg-slate-200 hover:bg-blue-100 flex items-center justify-center transition-colors"><Plus className="w-3 h-3" /></button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>

        {/* Totals + Payment */}
        <div className="border-t border-slate-200 p-5 space-y-3">
          {/* Discount */}
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600 font-medium flex-1">Discount</span>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              {[0, 5, 10, 15].map(d => (
                <button key={d} onClick={() => setDiscount(d)} className={`px-2.5 py-1 text-xs font-bold transition-colors ${discount === d ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{d}%</button>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount ({discount}%)</span><span>-${discountAmount.toFixed(2)}</span></div>}
            <div className="flex justify-between text-slate-500"><span>Tax (9%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-extrabold text-slate-900 text-base pt-2 border-t border-slate-100"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>

          {/* Payment Method */}
          <div className="grid grid-cols-3 gap-2">
            {[{id:'Card', icon: CreditCard}, {id:'Cash', icon: DollarSign}, {id:'QR', icon: Smartphone}].map(m => (
              <button key={m.id} onClick={() => setPaymentMethod(m.id)} className={`flex flex-col items-center py-2.5 rounded-xl border text-xs font-semibold transition-all ${paymentMethod === m.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-500 hover:border-blue-200'}`}>
                <m.icon className="w-4 h-4 mb-1" />{m.id}
              </button>
            ))}
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 ${cart.length === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/30 active:scale-[0.98]'}`}
          >
            {isSuccess ? <><CheckCircle className="w-4 h-4" /><span>Payment Successful!</span></> : <><CreditCard className="w-4 h-4" /><span>Charge ${total.toFixed(2)}</span></>}
          </button>
        </div>
      </div>
    </div>
  );
}
