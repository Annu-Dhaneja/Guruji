import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Tag,
  Loader2,
  Lock,
  ArrowRight,
  Receipt,
  Sparkles,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  Truck,
  MapPin,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { OrderRecord } from '../types';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';
import { loadRazorpayCheckout, isRazorpayReady, resetRazorpayLoader } from '../utils/razorpayLoader';

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const POPULAR_COUPONS = [
  { code: 'FIRST10', label: '10% OFF First Order' },
  { code: 'GURU20', label: '20% OFF Above ₹999' },
  { code: 'GURUCRAFT100', label: '₹100 Flat OFF' },
  { code: 'JAI10', label: '10% OFF Storewide' },
];

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '8527837527');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'customer@example.com');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('Delhi NCR');
  const [shippingPincode, setShippingPincode] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    description: string;
    discountAmount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Payment flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifiedOrder, setVerifiedOrder] = useState<OrderRecord | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [isSdkPreloaded, setIsSdkPreloaded] = useState(false);

  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync user details if user logs in or profile changes
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if ((!customerEmail || customerEmail === 'customer@example.com') && user.email) {
        setCustomerEmail(user.email);
      }
      if (user.phone && (!customerPhone || customerPhone === '8527837527')) {
        setCustomerPhone(user.phone);
      }
    }
  }, [user]);

  // Preload Razorpay Checkout SDK when modal is open
  useEffect(() => {
    if (isOpen) {
      loadRazorpayCheckout()
        .then(() => {
          setIsSdkPreloaded(true);
        })
        .catch((err) => {
          console.warn('[Razorpay] Preloading SDK encountered notice:', err.message);
        });
    }

    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Real-time calculations
  const rawSubtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const subtotal = rawSubtotal > 0 ? rawSubtotal : totalAmount;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPayable = Math.max(1, Math.round(subtotal - discountAmount));

  const hasPhysicalItems = items.some(
    (item) => item.isPhysical === true || (!item.isDigital && item.itemType === 'product')
  );

  // Apply / Validate Coupon
  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/payments/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode: code, items }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data.coupon);
        setCouponCode(code);
        setCouponError(null);
      } else {
        setCouponError(data.error || 'Invalid or expired coupon.');
        setAppliedCoupon(null);
      }
    } catch (err: any) {
      setCouponError('Could not validate coupon right now.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  // Launch Razorpay Payment Flow
  const handlePayNow = async () => {
    if (isProcessing) {
      console.warn('[Razorpay] Payment already in progress.');
      return;
    }

    // Input validations
    const trimmedName = customerName.trim();
    const trimmedPhone = customerPhone.trim();
    const trimmedEmail = customerEmail.trim().toLowerCase();

    if (!trimmedName) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!trimmedPhone || trimmedPhone.length < 8) {
      setErrorMessage('Please enter a valid mobile number (at least 8 digits).');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address for receiving your tax invoice.');
      return;
    }
    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Please add items to proceed.');
      return;
    }

    const hasPhysicalItems = items.some(
      (item) => item.isPhysical === true || (!item.isDigital && item.itemType === 'product')
    );

    if (hasPhysicalItems) {
      if (!shippingAddress.trim() || shippingAddress.trim().length < 5) {
        setErrorMessage('Please enter your complete physical shipping address (House/Street/Area).');
        return;
      }
      if (!shippingCity.trim()) {
        setErrorMessage('Please enter your delivery city.');
        return;
      }
      if (!shippingPincode.trim() || shippingPincode.trim().length < 5) {
        setErrorMessage('Please enter a valid postal pincode.');
        return;
      }
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage('Creating secure order with Razorpay...');

    // Set safety watchdog timer (30s timeout to prevent indefinite stuck states)
    if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
    processingTimeoutRef.current = setTimeout(() => {
      setIsProcessing((current) => {
        if (current) {
          console.warn('[Razorpay] Checkout watchdog timer expired.');
          setErrorMessage(
            'The payment checkout process timed out. If the gateway window was blocked by your browser, please enable popups or try again.'
          );
          setStatusMessage('');
          return false;
        }
        return current;
      });
    }, 30000);

    try {
      // 1. Create Order on Server
      console.log('[Razorpay] Calling /api/orders/create for', items.length, 'items...');
      const orderRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: trimmedName,
          customerPhone: trimmedPhone,
          customerEmail: trimmedEmail,
          items,
          couponCode: appliedCoupon?.code,
          userId: user?.id,
          shippingAddress: hasPhysicalItems ? shippingAddress.trim() : undefined,
          shippingCity: hasPhysicalItems ? shippingCity.trim() : undefined,
          shippingState: hasPhysicalItems ? shippingState.trim() : undefined,
          shippingPincode: hasPhysicalItems ? shippingPincode.trim() : undefined,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order || !orderData.razorpayOrder) {
        throw new Error(orderData.error || 'Failed to initialize payment order on server.');
      }

      const createdOrder: OrderRecord = orderData.order;
      const rzpOrderInfo = orderData.razorpayOrder;

      console.log('[Razorpay] Server created order:', createdOrder.id, 'Gateway Order:', rzpOrderInfo.id);

      // If server generated a simulated sandbox order (when live keys are not configured or in sandbox test mode)
      if (rzpOrderInfo.isSimulated || !rzpOrderInfo.key || rzpOrderInfo.key.startsWith('rzp_test_sandbox')) {
        setStatusMessage('Completing Sandbox Test Payment verification...');
        try {
          const verifyRes = await fetch('/api/orders/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: createdOrder.id,
              razorpay_order_id: rzpOrderInfo.id,
              razorpay_payment_id: `pay_sim_${Date.now()}`,
              razorpay_signature: 'simulated_test_signature',
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            console.log('[Razorpay] Simulated payment verification successful for order:', createdOrder.id);
            if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
            setVerifiedOrder(verifyData.order || createdOrder);
            setIsProcessing(false);
            setStatusMessage('');
            clearCart();
            onSuccess();
            return;
          }
        } catch (simErr: any) {
          console.error('[Razorpay] Simulated verification failed:', simErr);
        }
      }

      // 2. Ensure Razorpay Checkout SDK script is loaded for live / test SDK checkout
      setStatusMessage('Loading secure payment gateway...');
      let RazorpayConstructor: any = null;
      try {
        RazorpayConstructor = await loadRazorpayCheckout();
      } catch (loadErr: any) {
        console.warn('[Razorpay] SDK script load failed, falling back to simulated order verification:', loadErr);
        // Fallback gracefully to complete test checkout in preview environment
        setStatusMessage('Verifying test payment with server...');
        const verifyRes = await fetch('/api/orders/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: createdOrder.id,
            razorpay_order_id: rzpOrderInfo.id,
            razorpay_payment_id: `pay_test_${Date.now()}`,
            razorpay_signature: 'simulated_test_signature',
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
          setVerifiedOrder(verifyData.order || createdOrder);
          setIsProcessing(false);
          setStatusMessage('');
          clearCart();
          onSuccess();
          return;
        }
        throw loadErr;
      }

      if (!RazorpayConstructor || typeof RazorpayConstructor !== 'function') {
        throw new Error(
          'Razorpay payment gateway could not be initialized in your browser. Please check your internet connection and ensure ad-blockers are disabled.'
        );
      }

      setStatusMessage('Opening Razorpay Secure Checkout...');

      // 3. Configure Razorpay Standard Checkout Options
      const options: any = {
        key: rzpOrderInfo.key,
        amount: rzpOrderInfo.amount,
        currency: rzpOrderInfo.currency || 'INR',
        name: 'GurucraftPro Studio',
        description: `Order #${createdOrder.id} • ${items.length} Item(s)`,
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=200&q=80',
        order_id: rzpOrderInfo.id,
        prefill: {
          name: trimmedName,
          email: trimmedEmail,
          contact: trimmedPhone,
        },
        notes: {
          internalOrderId: createdOrder.id,
          customerName: trimmedName,
        },
        theme: {
          color: '#7c3aed',
        },
        modal: {
          backdropclose: false,
          escape: false,
          handleback: true,
          confirm_close: true,
          ondismiss: async () => {
            console.log('[Razorpay] Checkout modal dismissed by user.');
            if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
            setIsProcessing(false);
            setStatusMessage('');
            try {
              await fetch(`/api/orders/${createdOrder.id}/fail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: 'Customer dismissed Razorpay Checkout' }),
              });
            } catch (e) {
              // silent
            }
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          console.log('[Razorpay] Payment captured by gateway. Verifying signature on server...');
          if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
          setStatusMessage('Verifying payment signature with server...');

          try {
            // 4. Server-Side Verification
            const verifyRes = await fetch('/api/orders/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: createdOrder.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              console.log('[Razorpay] Verification successful for order:', createdOrder.id);
              setVerifiedOrder(verifyData.order || createdOrder);
              setIsProcessing(false);
              setStatusMessage('');
              clearCart();
              onSuccess();
            } else {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }
          } catch (verifyErr: any) {
            console.error('[Razorpay] Verification failure:', verifyErr);
            setIsProcessing(false);
            setStatusMessage('');
            setErrorMessage(
              verifyErr.message ||
                `Payment verification failed. Please contact support with Payment ID: ${response.razorpay_payment_id}`
            );
          }
        },
      };

      // 4. Instantiate and Open Razorpay Checkout Window
      const rzpInstance = new RazorpayConstructor(options);

      rzpInstance.on('payment.failed', async (response: any) => {
        console.warn('[Razorpay] Payment failed event received:', response.error);
        if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
        setIsProcessing(false);
        setStatusMessage('');
        const failReason =
          response.error?.description || response.error?.reason || 'Payment declined by bank or gateway.';
        setErrorMessage(`Payment declined: ${failReason}`);

        try {
          await fetch(`/api/orders/${createdOrder.id}/fail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: failReason }),
          });
        } catch (e) {
          // silent
        }
      });

      // Open the Razorpay Modal
      console.log('[Razorpay] Opening checkout instance...');
      rzpInstance.open();
    } catch (err: any) {
      console.error('[Razorpay] Checkout initiation error:', err);
      if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
      setIsProcessing(false);
      setStatusMessage('');
      setErrorMessage(err.message || 'An unexpected error occurred during checkout.');
    }
  };

  const handleResetState = () => {
    if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
    setIsProcessing(false);
    setStatusMessage('');
    setErrorMessage(null);
    resetRazorpayLoader();
  };

  return (
    <>
      <div
        id="razorpay-checkout-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      >
        <div
          id="razorpay-checkout-modal-content"
          className="w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] space-y-6 shadow-2xl relative my-8"
        >
          {/* Close button */}
          {!isProcessing && (
            <button
              id="razorpay-checkout-close-btn"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Header */}
          <div className="flex items-center space-x-3.5 border-b border-[#DCE7E7] dark:border-[#2A3C40] pb-4">
            <div className="p-3 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] text-[#0799A6] dark:text-[#25B4BD] border border-[#DCE7E7] dark:border-[#2A3C40]">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#102A36] dark:text-[#F4F8F8] flex items-center gap-2">
                Razorpay Checkout
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  Official Gateway
                </span>
              </h3>
              <p className="text-xs text-[#52636A] dark:text-[#B7C6C8]">
                UPI • Cards • Net Banking • Wallets • 256-bit SSL
              </p>
            </div>
          </div>

          {/* SUCCESS SCREEN */}
          {verifiedOrder ? (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-black text-[#102A36] dark:text-[#F4F8F8]">Payment Confirmed!</h4>
                <p className="text-xs text-[#52636A] dark:text-[#B7C6C8] mt-1">
                  Thank you, <span className="font-bold text-[#102A36] dark:text-[#F4F8F8]">{verifiedOrder.customerName}</span>. Your order has been placed and verified successfully.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#52636A] dark:text-[#B7C6C8]">Order ID:</span>
                  <span className="font-mono font-bold text-[#0799A6] dark:text-[#25B4BD]">{verifiedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#52636A] dark:text-[#B7C6C8]">Razorpay Payment ID:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 truncate max-w-[200px]">
                    {verifiedOrder.razorpayPaymentId || 'pay_verified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#52636A] dark:text-[#B7C6C8]">Amount Paid:</span>
                  <span className="font-bold text-[#102A36] dark:text-[#F4F8F8]">₹{verifiedOrder.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#52636A] dark:text-[#B7C6C8]">Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">Paid &amp; Active</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  id="razorpay-view-invoice-btn"
                  onClick={() => setShowInvoiceModal(true)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] font-bold text-xs flex items-center justify-center gap-2 border border-[#DCE7E7] dark:border-[#2A3C40] transition-all"
                >
                  <Receipt className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD]" /> View Tax Invoice Receipt
                </button>

                <button
                  id="razorpay-continue-browsing-btn"
                  onClick={() => {
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl btn-primary-cta font-black text-xs flex items-center justify-center gap-1 shadow-md transition-all"
                >
                  <span>Continue Browsing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <div className="space-y-4 text-xs">
              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold block">Payment Notice</span>
                    <span className="text-[11px] leading-relaxed">{errorMessage}</span>
                    {errorMessage.includes('incomplete') && (
                      <div className="mt-2 text-[10px] text-rose-500 dark:text-rose-200">
                        Please set your Razorpay Key ID and Key Secret in Admin Dashboard (Payment Settings) or in your environment variables.
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleResetState}
                    title="Dismiss alert"
                    className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Items Summary */}
              <div className="p-4 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] space-y-2.5">
                <div className="flex justify-between items-center text-[#102A36] dark:text-[#F4F8F8] font-bold border-b border-[#DCE7E7] dark:border-[#2A3C40] pb-2">
                  <span>Selected Items ({items.length})</span>
                  <span className="text-[#0799A6] dark:text-[#25B4BD]">Subtotal: ₹{subtotal}</span>
                </div>

                <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1 divide-y divide-[#DCE7E7] dark:divide-[#2A3C40]">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center pt-1 text-[11px]">
                      <span className="text-[#102A36] dark:text-[#F4F8F8] truncate max-w-[240px]">
                        {item.name} <span className="text-[#52636A] dark:text-[#B7C6C8]">×{item.quantity}</span>
                      </span>
                      <span className="text-[#102A36] dark:text-[#F4F8F8] font-semibold">
                        ₹{(Number(item.price) || 0) * (Number(item.quantity) || 1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] space-y-2">
                <label className="font-bold text-[#102A36] dark:text-[#F4F8F8] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD]" /> Apply Coupon Code
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <div>
                        <span className="font-black font-mono">{appliedCoupon.code}</span>
                        <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">{appliedCoupon.description}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-rose-500 hover:text-rose-600 font-bold px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. FIRST10, GURU20"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        className="flex-1 p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] uppercase font-mono tracking-wider outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        className="px-4 py-2.5 rounded-xl bg-[#0799A6] dark:bg-[#25B4BD] text-white dark:text-[#0B1114] font-bold disabled:opacity-40 transition-all shrink-0"
                      >
                        {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                      </button>
                    </div>

                    {/* Quick Coupon Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {POPULAR_COUPONS.map((cp) => (
                        <button
                          key={cp.code}
                          type="button"
                          onClick={() => handleApplyCoupon(cp.code)}
                          className="text-[10px] px-2.5 py-1 rounded-lg bg-[#FFFFFF] dark:bg-[#182429] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#2A3C40] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] border border-[#DCE7E7] dark:border-[#2A3C40] transition-all font-mono"
                        >
                          +{cp.code} ({cp.label})
                        </button>
                      ))}
                    </div>

                    {couponError && <p className="text-[11px] text-rose-500 dark:text-rose-400">{couponError}</p>}
                  </div>
                )}
              </div>

              {/* Price Calculation Box */}
              <div className="p-4 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] space-y-1.5">
                <div className="flex justify-between text-[#52636A] dark:text-[#B7C6C8]">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount ({appliedCoupon.code}):</span>
                    <span>-₹{appliedCoupon.discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#52636A] dark:text-[#B7C6C8]">
                  <span>Taxes / Fees:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹0 (Inclusive)</span>
                </div>

                <div className="flex justify-between items-center text-sm font-black pt-2 border-t border-[#DCE7E7] dark:border-[#2A3C40]">
                  <span className="text-[#102A36] dark:text-[#F4F8F8]">Final Amount Payable:</span>
                  <span className="text-lg text-[#0799A6] dark:text-[#25B4BD]">₹{finalPayable}</span>
                </div>
              </div>

              {/* Customer Details Inputs */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="font-bold text-[#102A36] dark:text-[#F4F8F8] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-[#102A36] dark:text-[#F4F8F8] block mb-1">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#102A36] dark:text-[#F4F8F8] block mb-1">Email (For Invoice) *</label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD]"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Delivery Address Inputs (Shown when cart contains physical artwork/bracelets/frames) */}
              {hasPhysicalItems && (
                <div className="p-4 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DCE7E7] dark:border-[#2A3C40] pb-2">
                    <span className="font-bold text-[#102A36] dark:text-[#F4F8F8] flex items-center gap-1.5 text-xs">
                      <Truck className="w-3.5 h-3.5 text-[#0799A6] dark:text-[#25B4BD]" />
                      Physical Delivery Address (Mandatory)
                    </span>
                    <span className="text-[10px] text-[#52636A] dark:text-[#B7C6C8] font-medium">Safe Insured Courier</span>
                  </div>

                  <div>
                    <label className="font-semibold text-[#102A36] dark:text-[#F4F8F8] block mb-1 text-[11px]">
                      Street / House / Apartment / Landmark *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Flat 302, Royal Enclave, Near Sai Mandir, Sector 8"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD] resize-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="font-semibold text-[#102A36] dark:text-[#F4F8F8] block mb-1 text-[11px]">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rohini / Delhi"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        className="w-full p-2 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD] text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#102A36] dark:text-[#F4F8F8] block mb-1 text-[11px]">State</label>
                      <input
                        type="text"
                        placeholder="Delhi / Haryana / etc."
                        value={shippingState}
                        onChange={(e) => setShippingState(e.target.value)}
                        className="w-full p-2 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD] text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#102A36] dark:text-[#F4F8F8] block mb-1 text-[11px]">Pincode *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="6-digit"
                        value={shippingPincode}
                        onChange={(e) => setShippingPincode(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-2 rounded-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] outline-none focus:border-[#0799A6] dark:focus:border-[#25B4BD] font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Gateway Trust Badge */}
              <div className="p-3 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[11px] text-[#52636A] dark:text-[#B7C6C8] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] shrink-0" />
                  <span>256-Bit Razorpay SSL Checkout</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Zero Convenience Fee</span>
              </div>

              {/* Pay Now Button */}
              <div className="space-y-2">
                <button
                  id="razorpay-pay-now-button"
                  type="button"
                  onClick={handlePayNow}
                  disabled={isProcessing || items.length === 0}
                  className="w-full py-4 rounded-xl btn-primary-cta text-sm shadow-md hover:brightness-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{statusMessage || 'Opening Razorpay Secure Checkout...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Pay ₹{finalPayable} via Razorpay</span>
                    </>
                  )}
                </button>

                {/* Reset / Cancel action if in processing */}
                {isProcessing && (
                  <button
                    type="button"
                    onClick={handleResetState}
                    className="w-full py-2 text-center text-[#52636A] hover:text-[#102A36] dark:hover:text-[#F4F8F8] text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Cancel or Retry</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Receipt Modal */}
      <InvoiceReceiptModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        order={verifiedOrder}
      />
    </>
  );
};
