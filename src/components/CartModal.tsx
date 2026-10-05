import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  Tag,
  Truck,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onProceedToCheckout }) => {
  const { items, removeItem, updateQuantity, clearCart, totalAmount, hasPhysicalItems } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  // Shipping calculation
  const isEligibleForFreeShipping = !hasPhysicalItems || totalAmount >= 499;
  const shippingCharge = hasPhysicalItems ? (totalAmount >= 499 ? 0 : 49) : 0;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, totalAmount - discount + shippingCharge);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (code === 'GURU20') {
      const disc = Math.round(totalAmount * 0.2);
      setAppliedCoupon({ code, discount: disc });
      setCouponError('');
    } else if (code === 'FIRST10' || code === 'JAI10') {
      const disc = Math.round(totalAmount * 0.1);
      setAppliedCoupon({ code, discount: disc });
      setCouponError('');
    } else if (code === 'GURUCRAFT100' && totalAmount >= 499) {
      setAppliedCoupon({ code, discount: 100 });
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code or minimum order not met.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-lg bg-[#FFFFFF] dark:bg-[#0B1114] border-l border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-between bg-[#FFFFFF] dark:bg-[#182429]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-center text-[#0799A6] dark:text-[#25B4BD] shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#102A36] dark:text-[#F4F8F8] flex items-center gap-2">
                Shopping Cart
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0799A6]/15 dark:bg-[#25B4BD]/20 text-[#087581] dark:text-[#25B4BD] font-bold">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </h3>
              <p className="text-[11px] text-[#52636A] dark:text-[#B7C6C8]">Design Services &amp; Physical Studio Products</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#182429] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="text-center py-20 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F8FAFA] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] flex items-center justify-center mx-auto text-[#52636A] dark:text-[#B7C6C8]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#102A36] dark:text-[#F4F8F8]">Your cart is currently empty</p>
                <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] mt-1 max-w-xs mx-auto leading-relaxed">
                  Explore our design services, Quick Fixes from ₹49, Photoshop workflows, and divine spiritual collection.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl btn-primary-cta text-xs font-bold shadow-md"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            items.map((item, index) => {
              const uniqueKey = item.itemId || `cart_item_${index}`;
              const isDigital = item.isDigital;

              return (
                <div
                  key={uniqueKey}
                  className="p-3.5 rounded-2xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] flex gap-3.5 hover:border-[#0799A6] dark:hover:border-[#25B4BD] transition-all shadow-xs"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] shrink-0 relative">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#0799A6] dark:text-[#25B4BD]">
                        <ShoppingBag className="w-6 h-6 opacity-40" />
                      </div>
                    )}
                    <span
                      className={`absolute bottom-1 right-1 text-[8px] font-bold px-1 rounded ${
                        isDigital
                          ? 'bg-[#0799A6]/20 text-[#087581] dark:text-[#25B4BD]'
                          : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                      }`}
                    >
                      {isDigital ? 'DIGITAL' : 'COURIER'}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] truncate">{item.name}</h4>
                        <span className="text-[10px] text-[#52636A] dark:text-[#B7C6C8] block mt-0.5 capitalize">
                          {item.itemType || 'Service'}
                        </span>
                      </div>
                      <button
                        onClick={() => removeItem(item.itemId)}
                        className="text-[#52636A] hover:text-rose-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-1.5 bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.itemId, (item.quantity || 1) - 1)}
                          className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#FFFFFF] dark:hover:bg-[#182429] text-[#52636A] dark:text-[#B7C6C8] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center text-[#102A36] dark:text-[#F4F8F8]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.itemId, (item.quantity || 1) + 1)}
                          className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#FFFFFF] dark:hover:bg-[#182429] text-[#52636A] dark:text-[#B7C6C8] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-[#0799A6] dark:text-[#25B4BD]">
                          ₹{(item.price || 0) * (item.quantity || 1)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-[#52636A] dark:text-[#B7C6C8] block">
                            (₹{item.price} each)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Free Shipping Progress for physical items */}
          {hasPhysicalItems && items.length > 0 && (
            <div className="p-3 rounded-2xl bg-[#0799A6]/10 dark:bg-[#25B4BD]/10 border border-[#DCE7E7] dark:border-[#2A3C40] text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" />
                {isEligibleForFreeShipping ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    You've unlocked FREE Shipping!
                  </span>
                ) : (
                  <span className="text-[#52636A] dark:text-[#B7C6C8]">
                    Add <strong className="text-[#0799A6] dark:text-[#25B4BD] font-bold">₹{499 - totalAmount}</strong> more for FREE Shipping!
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 bg-[#DCE7E7] dark:border-[#2A3C40] rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-[#0799A6] dark:bg-[#25B4BD] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalAmount / 499) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer & Checkout Breakdown */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#DCE7E7] dark:border-[#2A3C40] bg-[#FFFFFF] dark:bg-[#182429] space-y-3">
            {/* Coupon Section */}
            <div className="space-y-1.5">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      Coupon <strong className="font-mono">{appliedCoupon.code}</strong> applied (-₹{appliedCoupon.discount})
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-rose-500 hover:text-rose-600 font-bold text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#52636A] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Coupon: GURU20, JAI10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] text-xs outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD] uppercase"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#182429] text-[#102A36] dark:text-[#F4F8F8] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-[10px] text-rose-500 pl-1">{couponError}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#52636A] dark:text-[#B7C6C8] pt-1 border-t border-[#DCE7E7] dark:border-[#2A3C40]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#102A36] dark:text-[#F4F8F8] font-semibold">₹{totalAmount}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery &amp; Courier Processing</span>
                <span className={shippingCharge === 0 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-[#102A36] dark:text-[#F4F8F8]'}>
                  {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-extrabold text-[#102A36] dark:text-[#F4F8F8] pt-2 border-t border-[#DCE7E7] dark:border-[#2A3C40]">
                <span>Total Amount</span>
                <span className="text-[#0799A6] dark:text-[#25B4BD] text-lg">₹{finalTotal}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-2 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] border border-[#DCE7E7] dark:border-[#2A3C40] font-bold text-xs hover:bg-[#DDF3F4]/50 dark:hover:bg-[#182429] transition-colors text-center"
              >
                Keep Shopping
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="col-span-2 py-3 px-4 rounded-xl btn-primary-cta text-xs font-bold flex items-center justify-center space-x-2 shadow-md active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#52636A] dark:text-[#B7C6C8] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD]" />
              <span>100% Studio Quality • Safe Courier Delivery • 256-Bit SSL Razorpay</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
