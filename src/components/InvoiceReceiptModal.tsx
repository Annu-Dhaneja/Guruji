import React from 'react';
import { X, Printer, CheckCircle2, Download, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { OrderRecord } from '../types';

interface InvoiceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRecord | null;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div
        id="print-invoice-area"
        className="w-full max-w-xl bg-[#FFFFFF] dark:bg-[#182429] border border-[#DCE7E7] dark:border-[#2A3C40] rounded-3xl p-6 sm:p-8 text-[#102A36] dark:text-[#F4F8F8] space-y-6 shadow-2xl relative my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#2A3C40] transition-all print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="border-b border-[#DCE7E7] dark:border-[#2A3C40] pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#0799A6] dark:bg-[#25B4BD] text-[#FFFFFF] dark:text-[#0B1114] font-black text-lg shadow-xs">
              GCP
            </div>
            <div>
              <h2 className="text-lg font-black text-[#102A36] dark:text-[#F4F8F8]">GurucraftPro Studio</h2>
              <p className="text-xs text-[#0799A6] dark:text-[#25B4BD] font-medium">Official Tax Invoice & Payment Receipt</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                order.paymentStatus === 'paid'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : order.paymentStatus === 'refunded'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {order.paymentStatus === 'paid' ? 'Payment Verified & Captured' : order.paymentStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Invoice Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs">
          <div>
            <span className="text-[#52636A] dark:text-[#B7C6C8] block text-[10px] uppercase font-bold tracking-wider">Invoice / Order ID</span>
            <span className="font-mono font-bold text-[#0799A6] dark:text-[#25B4BD]">{order.id}</span>
          </div>
          <div>
            <span className="text-[#52636A] dark:text-[#B7C6C8] block text-[10px] uppercase font-bold tracking-wider">Date & Time</span>
            <span className="font-semibold text-[#102A36] dark:text-[#F4F8F8]">{formattedDate}</span>
          </div>
          <div>
            <span className="text-[#52636A] dark:text-[#B7C6C8] block text-[10px] uppercase font-bold tracking-wider">Payment Method</span>
            <span className="font-semibold text-[#102A36] dark:text-[#F4F8F8]">{order.paymentMethod || 'Razorpay Online'}</span>
          </div>
          <div>
            <span className="text-[#52636A] dark:text-[#B7C6C8] block text-[10px] uppercase font-bold tracking-wider">Razorpay Payment ID</span>
            <span className="font-mono text-[#52636A] dark:text-[#B7C6C8] truncate block">{order.razorpayPaymentId || 'N/A'}</span>
          </div>
          <div>
            <span className="text-[#52636A] dark:text-[#B7C6C8] block text-[10px] uppercase font-bold tracking-wider">Razorpay Order ID</span>
            <span className="font-mono text-[#52636A] dark:text-[#B7C6C8] truncate block">{order.razorpayOrderId || 'N/A'}</span>
          </div>
          <div>
            <span className="text-[#52636A] dark:text-[#B7C6C8] block text-[10px] uppercase font-bold tracking-wider">Order Status</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 capitalize">{order.status}</span>
          </div>
        </div>

        {/* Billed To */}
        <div className="p-4 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-xs space-y-1">
          <span className="text-[#52636A] dark:text-[#B7C6C8] block text-[10px] uppercase font-bold tracking-wider">Customer Details</span>
          <div className="font-bold text-[#102A36] dark:text-[#F4F8F8] text-sm">{order.customerName}</div>
          <div className="text-[#52636A] dark:text-[#B7C6C8]">{order.customerEmail} • {order.customerPhone}</div>
        </div>

        {/* Items Table */}
        <div className="space-y-2">
          <span className="text-[#52636A] dark:text-[#B7C6C8] block text-[10px] uppercase font-bold tracking-wider">Ordered Items</span>
          <div className="rounded-2xl border border-[#DCE7E7] dark:border-[#2A3C40] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFA] dark:bg-[#111A1E] text-[#52636A] dark:text-[#B7C6C8] font-semibold border-b border-[#DCE7E7] dark:border-[#2A3C40]">
                <tr>
                  <th className="py-2.5 px-4">Item & Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE7E7] dark:divide-[#2A3C40] bg-[#FFFFFF] dark:bg-[#182429]">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#102A36] dark:text-[#F4F8F8]">{item.name}</div>
                      <span className="text-[10px] text-[#52636A] dark:text-[#B7C6C8] capitalize">{item.itemType}</span>
                    </td>
                    <td className="py-3 px-3 text-center text-[#52636A] dark:text-[#B7C6C8] font-semibold">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-[#52636A] dark:text-[#B7C6C8]">₹{item.price}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#102A36] dark:text-[#F4F8F8]">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="p-4 rounded-2xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] space-y-2 text-xs">
          <div className="flex justify-between text-[#52636A] dark:text-[#B7C6C8]">
            <span>Subtotal</span>
            <span>₹{order.subtotal || order.totalAmount}</span>
          </div>

          {order.discount ? (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>Coupon Discount ({order.couponCode || 'APPLIED'})</span>
              <span>-₹{order.discount}</span>
            </div>
          ) : null}

          {order.tax ? (
            <div className="flex justify-between text-[#52636A] dark:text-[#B7C6C8]">
              <span>Taxes & GST (Included)</span>
              <span>₹{order.tax}</span>
            </div>
          ) : null}

          <div className="flex justify-between items-center text-sm font-black pt-2 border-t border-[#DCE7E7] dark:border-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8]">
            <span>Total Paid (INR)</span>
            <span className="text-xl text-[#0799A6] dark:text-[#25B4BD]">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Security & Studio Note */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] border border-[#DCE7E7] dark:border-[#2A3C40] text-[11px] text-[#52636A] dark:text-[#B7C6C8] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#0799A6] dark:text-[#25B4BD] mt-0.5 shrink-0" />
          <div>
            <span className="font-bold text-[#102A36] dark:text-[#F4F8F8]">256-Bit Razorpay Authenticated Transaction.</span>
            <p className="text-[#52636A] dark:text-[#B7C6C8] text-[10px] mt-0.5">
              Contact Annu Dhaneja at annudhaneja@gmail.com or WhatsApp +91 8527837527 for any delivery or customization updates.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl bg-[#F8FAFA] dark:bg-[#111A1E] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#2A3C40] text-[#102A36] dark:text-[#F4F8F8] font-bold text-xs flex items-center justify-center gap-2 border border-[#DCE7E7] dark:border-[#2A3C40] transition-all"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl btn-primary-cta font-black text-xs flex items-center justify-center gap-1 shadow-md hover:brightness-105 transition-all"
          >
            <span>Done</span>
          </button>
        </div>

      </div>
    </div>
  );
};
