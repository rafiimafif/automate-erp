import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, DollarSign, Smartphone, X, CheckCircle, Search, Tag, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../api/endpoints';

const CATEGORIES = ['All', 'Electronics', 'Office', 'Furniture', 'Software'];

export default function POS() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prods, custs] = await Promise.all([
        api.products.list(),
        api.customers.list()
      ]);
      setProducts(prods);
      setCustomers(custs);
    } catch (err) {
      setError('Failed to load POS data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const subtotal = cart.reduce((s, i) => s + i.unit_price * i.qty, 0);
  const discountAmount = subtotal * (discount / 100);
  const tax = (subtotal - discountAmount) * 0.09;
  const total = subtotal - discountAmount + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      // Pick first customer for POS (usually a 'Walk-in' customer)
      const customerId = customers[0]?.id;
      if (!customerId) {
        alert('Please add at least one customer first to process sales.');
        return;
      }

      const orderPayload = {
        customer: customerId,
        total_amount: total,
        status: 'completed',
        payment_method: paymentMethod,
        items: cart.map(item => ({
          product: item.id,
          quantity: item.qty,
          price_at_purchase: item.unit_price
        }))
      };

      await api.orders.create(orderPayload);
      setIsSuccess(true);
      setTimeout(() => { 
        setIsSuccess(false); 
        setCart([]); 
        setDiscount(0); 
      }, 2500);
    } catch (err) {
      alert('Checkout failed. Please try again.');
    }
  };

  const filteredProducts = products.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Opening Terminal...</p>
        </div>
      </div>
    );
  }

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
            {['All', ...new Set(products.map(p => p.category))].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap capitalize transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl m-6 flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-3" />
            <p className="font-medium">{error}</p>
            <button onClick={fetchData} className="ml-auto underline font-bold">Retry</button>
          </div>
        )}

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
                  <div className="w-10 h-10 bg-slate-50 text-blue-600 rounded-lg flex items-center justify-center mb-3 font-bold">{product.name.charAt(0)}</div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">{product.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 capitalize">{product.category}</p>
                  <p className="text-base font-extrabold text-slate-900 mt-2">${Number(product.unit_price).toFixed(2)}</p>
                  <div className="absolute inset-0 rounded-xl bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </button>
              );
            })}
            {products.length === 0 && !isLoading && (
              <div className="col-span-full py-20 text-center space-y-3">
                <Tag className="w-12 h-12 text-slate-200 mx-auto" />
                <p className="text-slate-400 font-medium">No products available. Please add items to Inventory first.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart / Receipt Panel */}
      <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-800 flex items-center justify-between">
            Current Order
            {cart.length > 0 && <button onClick={() => setCart([])} className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">Clear all</button>}
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
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">{item.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                <p className="text-xs text-slate-500">${Number(item.unit_price).toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full bg-slate-200 hover:bg-blue-100 flex items-center justify-center transition-colors"><Minus className="w-3 h-3 text-slate-600" /></button>
                <span className="w-5 text-center text-sm font-bold">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full bg-slate-200 hover:bg-blue-100 flex items-center justify-center transition-colors"><Plus className="w-3 h-3 text-slate-600" /></button>
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
            {[{id:'card', icon: CreditCard}, {id:'cash', icon: DollarSign}, {id:'qr', icon: Smartphone}].map(m => (
              <button key={m.id} onClick={() => setPaymentMethod(m.id)} className={`flex flex-col items-center py-2.5 rounded-xl border text-xs font-semibold transition-all capitalize ${paymentMethod === m.id ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm' : 'border-slate-200 text-slate-500 hover:border-blue-200'}`}>
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
