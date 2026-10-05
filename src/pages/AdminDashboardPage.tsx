import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Layers,
  ShoppingBag,
  Zap,
  Sparkles,
  Calendar,
  FileText,
  Settings,
  BookOpen,
  CheckCircle2,
  X,
  Phone,
  Mail,
  LayoutDashboard,
  Globe,
  Palette,
  Share2,
  Lock,
  LogOut,
  Key,
  AlertCircle,
  Loader2,
  ShieldAlert,
  Receipt,
  RotateCcw,
  Search,
  Filter,
  CreditCard,
  Tag,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  BarChart3,
  Users,
  ExternalLink,
  Image as ImageIcon,
  FolderKanban,
  ShoppingCart,
  Headphones,
  Sliders,
  Clock,
  Bell,
  ChevronRight,
  ChevronDown,
  UserCheck,
  Activity,
  Shield,
} from 'lucide-react';
import { AdminLoginView } from '../components/admin/AdminLoginView';
import { AdminSecurityCenter } from '../components/admin/AdminSecurityCenter';
import { InvoiceReceiptModal } from '../components/InvoiceReceiptModal';
import { ClientReviewModal } from '../components/ClientReviewModal';
import { AdminOverview } from '../components/admin/AdminOverview';
import { PageBuilderCMS } from '../components/admin/PageBuilderCMS';
import { ServicesCMS } from '../components/admin/ServicesCMS';
import { ProductsCMS } from '../components/admin/ProductsCMS';
import { SEOCMS } from '../components/admin/SEOCMS';
import { AppearanceCMS } from '../components/admin/AppearanceCMS';
import { SocialLinksCMS } from '../components/admin/SocialLinksCMS';
import { SecurityCMS } from '../components/admin/SecurityCMS';
import { SettingsCMS } from '../components/admin/SettingsCMS';
import { PaymentGatewayCMS } from '../components/admin/PaymentGatewayCMS';
import { HomePageCMS } from '../components/admin/page-managers/HomePageCMS';
import { WardrobePageCMS } from '../components/admin/page-managers/WardrobePageCMS';
import { GurujiArtworkCMS } from '../components/admin/page-managers/GurujiArtworkCMS';
import { VantageEcomCMS } from '../components/admin/page-managers/VantageEcomCMS';
import { BookCoverCMS } from '../components/admin/page-managers/BookCoverCMS';
import { AIPromptCMS } from '../components/admin/page-managers/AIPromptCMS';
import { AboutUsCMS } from '../components/admin/page-managers/AboutUsCMS';
import { ContactUsCMS } from '../components/admin/page-managers/ContactUsCMS';
import { PhotoshopStudioCMS } from '../components/admin/PhotoshopStudioCMS';
import { QuickDigitalServicesCMS } from '../components/admin/page-managers/QuickDigitalServicesCMS';
import { GraphicDesignCMS } from '../components/admin/page-managers/GraphicDesignCMS';
import { SalesLeadsCMS } from '../components/admin/SalesLeadsCMS';
import { ImageManagerCMS } from '../components/admin/ImageManagerCMS';
import { BulkImageStudioCMS } from '../components/admin/BulkImageStudioCMS';
import {
  AIPromptItem,
  WardrobeSubmission,
  OrderRecord,
  BookCoverProject,
  AdminUser,
} from '../types';
import { adminFetch, getAdminToken, setAdminToken, removeAdminToken } from '../utils/adminApi';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'sales-leads'
    | 'pages'
    | 'page-home'
    | 'page-wardrobe'
    | 'page-guruji'
    | 'page-vantage'
    | 'page-bookcover'
    | 'page-aiprompt'
    | 'page-about'
    | 'page-contact'
    | 'page-graphic-design'
    | 'services'
    | 'products'
    | 'prompts'
    | 'photoshop'
    | 'image-studio'
    | 'quick-services'
    | 'orders'
    | 'wardrobe'
    | 'book-covers'
    | 'seo'
    | 'theme'
    | 'images'
    | 'social-links'
    | 'security'
    | 'settings'
    | 'customers'
    | 'inquiries'
    | 'designs'
    | 'payments'
    | 'content'
    | 'media'
    | 'analytics'
    | 'users'
    | 'admin-users'
  >('overview');

  // Admin Server-Side Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isVerifyingSession, setIsVerifyingSession] = useState<boolean>(true);
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(null);

  // Modern Control Center UI States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(30 * 60); // 30 minutes in seconds

  // Session countdown timer
  useEffect(() => {
    if (!isAdminAuthenticated) return;
    const interval = setInterval(() => {
      setSessionTimeLeft((prev) => {
        if (prev <= 1) {
          handleAdminLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isAdminAuthenticated]);

  const handleRefreshSession = async () => {
    try {
      const res = await adminFetch('/api/admin/auth/session');
      if (res.ok) {
        setSessionTimeLeft(30 * 60);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Real-Time Admin Security Events
  const [recentSecurityEvent, setRecentSecurityEvent] = useState<{
    id: string;
    title: string;
    details: string;
    timestamp: string;
    type: string;
    severity?: string;
  } | null>(null);
  const [showSecurityNotification, setShowSecurityNotification] = useState<boolean>(true);

  useEffect(() => {
    if (!isAdminAuthenticated) return;
    const fetchLatestEvent = async () => {
      try {
        const res = await adminFetch('/api/admin/security/events');
        if (res.ok) {
          const events = await res.json();
          if (Array.isArray(events) && events.length > 0) {
            setRecentSecurityEvent(events[0]);
          }
        }
      } catch (err) {
        // silent
      }
    };
    fetchLatestEvent();
    const interval = setInterval(fetchLatestEvent, 25000);
    return () => clearInterval(interval);
  }, [isAdminAuthenticated]);

  // Login Form States (for backward compatibility if needed)
  const [adminEmail, setAdminEmail] = useState<string>('annudhaneja@gmail.com');
  const [adminPin, setAdminPin] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);

  // 2FA / MFA States
  const [requireMfa, setRequireMfa] = useState<boolean>(false);
  const [mfaChallengeToken, setMfaChallengeToken] = useState<string>('');
  const [mfaCode, setMfaCode] = useState<string>('');

  // Data States
  const [prompts, setPrompts] = useState<AIPromptItem[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [submissions, setSubmissions] = useState<WardrobeSubmission[]>([]);
  const [bookProjects, setBookProjects] = useState<BookCoverProject[]>([]);

  // Editing Modal States
  const [selectedBookProject, setSelectedBookProject] = useState<BookCoverProject | null>(null);
  const [previewUploadInput, setPreviewUploadInput] = useState<string>('');
  const [statusUpdate, setStatusUpdate] = useState<string>('');
  const [editingPrompt, setEditingPrompt] = useState<Partial<AIPromptItem> | null>(null);

  // Wardrobe Management States
  const [selectedWardrobe, setSelectedWardrobe] = useState<{ submission: WardrobeSubmission; index: number } | null>(null);
  const [wardrobeStatusUpdate, setWardrobeStatusUpdate] = useState<string>('Consultation Active');
  const [wardrobeLookbookInput, setWardrobeLookbookInput] = useState<string>('');
  const [wardrobeAdminNotesInput, setWardrobeAdminNotesInput] = useState<string>('');
  const [isNewWardrobeModalOpen, setIsNewWardrobeModalOpen] = useState<boolean>(false);
  const [wardrobeFilter, setWardrobeFilter] = useState<'all' | 'active' | 'curated' | 'completed'>('all');
  const [newWardrobeForm, setNewWardrobeForm] = useState<Partial<WardrobeSubmission>>({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    city: 'Rohini, Delhi',
    occasion: 'Corporate & Daily Outfit Styling',
    bodyType: 'Hourglass',
    preferredStyle: 'Smart Casual & Western Formal',
    colorPreferences: 'Navy, Black, Pastels',
    budgetRange: '₹5,000 - ₹10,000',
    notes: '',
  });

  // Verify stored session on mount
  useEffect(() => {
    const checkActiveSession = async () => {
      const token = getAdminToken();
      if (!token) {
        setIsVerifyingSession(false);
        return;
      }

      try {
        const res = await adminFetch('/api/admin/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.valid && data.user) {
            setCurrentAdminUser(data.user);
            setIsAdminAuthenticated(true);
          } else {
            removeAdminToken();
          }
        } else {
          removeAdminToken();
        }
      } catch (e) {
        console.error('Failed to verify admin session', e);
        removeAdminToken();
      } finally {
        setIsVerifyingSession(false);
      }
    };

    checkActiveSession();
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTimer]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAllData();
    }
  }, [isAdminAuthenticated]);

  const fetchAllData = () => {
    adminFetch('/api/prompts').then((r) => (r.ok ? r.json() : [])).then(setPrompts).catch(console.error);
    adminFetch('/api/admin/orders').then((r) => (r.ok ? r.json() : [])).then(setOrders).catch(console.error);
    adminFetch('/api/wardrobe/submissions').then((r) => (r.ok ? r.json() : [])).then(setSubmissions).catch(console.error);
    adminFetch('/api/admin/book-cover/projects').then((r) => (r.ok ? r.json() : [])).then(setBookProjects).catch(console.error);
  };

  // Server-Side Login Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPin.trim()) {
      setLoginError('Please provide both admin email and security PIN / password.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail.trim(),
          password: adminPin.trim(),
          pin: adminPin.trim(),
          device: navigator.userAgent,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setLockoutTimer(data.remainingSeconds || 900);
        setLoginError(data.error || 'Account temporarily locked due to failed attempts.');
        setLoginLoading(false);
        return;
      }

      if (!res.ok) {
        setLoginError(data.error || 'Authentication failed. Invalid admin credentials.');
        setLoginLoading(false);
        return;
      }

      if (data.requireMfa) {
        setRequireMfa(true);
        setMfaChallengeToken(data.challengeToken);
        setLoginLoading(false);
        return;
      }

      if (data.token) {
        setAdminToken(data.token);
        setCurrentAdminUser(data.user);
        setIsAdminAuthenticated(true);
        setLoginError('');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Network error connecting to security authentication service.');
    } finally {
      setLoginLoading(false);
    }
  };

  // 2FA / MFA Verification Handler
  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaCode.trim()) {
      setLoginError('Please enter your 6-digit security code.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeToken: mfaChallengeToken,
          mfaCode: mfaCode.trim(),
          device: navigator.userAgent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || 'Invalid 2FA security code.');
        setLoginLoading(false);
        return;
      }

      if (data.token) {
        setAdminToken(data.token);
        setCurrentAdminUser(data.user);
        setIsAdminAuthenticated(true);
        setRequireMfa(false);
        setLoginError('');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Network error verifying 2FA code.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout Handler
  const handleAdminLogout = async () => {
    try {
      await adminFetch('/api/admin/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    } finally {
      removeAdminToken();
      setIsAdminAuthenticated(false);
      setCurrentAdminUser(null);
      setAdminPin('');
      setMfaCode('');
      setRequireMfa(false);
    }
  };

  const handleUpdateWardrobeSubmission = async () => {
    if (!selectedWardrobe) return;
    const subId = selectedWardrobe.submission.id || String(selectedWardrobe.index);
    try {
      const res = await adminFetch(`/api/wardrobe/submissions/${subId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: wardrobeStatusUpdate,
          lookbookUrl: wardrobeLookbookInput,
          adminNotes: wardrobeAdminNotesInput,
        }),
      });
      if (res.ok) {
        setSelectedWardrobe(null);
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateWardrobeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/wardrobe/submit', {
        method: 'POST',
        body: JSON.stringify({
          ...newWardrobeForm,
          status: 'Consultation Active',
        }),
      });
      if (res.ok) {
        setIsNewWardrobeModalOpen(false);
        setNewWardrobeForm({
          clientName: '',
          clientPhone: '',
          clientEmail: '',
          city: 'Rohini, Delhi',
          occasion: 'Corporate & Daily Outfit Styling',
          bodyType: 'Hourglass',
          preferredStyle: 'Smart Casual & Western Formal',
          colorPreferences: 'Navy, Black, Pastels',
          budgetRange: '₹5,000 - ₹10,000',
          notes: '',
        });
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteWardrobeSubmission = async (idOrIndex: string | number) => {
    if (!confirm('Are you sure you want to delete this wardrobe consultation brief?')) return;
    await adminFetch(`/api/wardrobe/submissions/${idOrIndex}`, { method: 'DELETE' });
    fetchAllData();
  };

  // Book Project Update Handler
  const handleUpdateBookProject = async (projectId: string) => {
    if (!selectedBookProject) return;

    const newPreviews = [...(selectedBookProject.previewFiles || [])];
    if (previewUploadInput.trim()) {
      newPreviews.push(previewUploadInput.trim());
    }

    try {
      const res = await adminFetch(`/api/admin/book-cover/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: statusUpdate || selectedBookProject.status,
          previewFiles: newPreviews,
        }),
      });
      const data = await res.json();
      if (data.project) {
        setBookProjects((prev) => prev.map((p) => (p.id === data.project.id ? data.project : p)));
        setSelectedBookProject(null);
        setPreviewUploadInput('');
        alert('Book cover project updated successfully!');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating book cover project.');
    }
  };

  // AI Prompt Handlers
  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrompt) return;

    try {
      const url = editingPrompt.id ? `/api/prompts/${editingPrompt.id}` : '/api/prompts';
      const method = editingPrompt.id ? 'PUT' : 'POST';

      const res = await adminFetch(url, {
        method,
        body: JSON.stringify(editingPrompt),
      });

      if (res.ok) {
        setEditingPrompt(null);
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (!confirm('Are you sure you want to delete this AI prompt?')) return;
    await adminFetch(`/api/prompts/${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  // Order Management State & Handlers
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'paid' | 'pending' | 'failed' | 'refunded'>('all');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<OrderRecord | null>(null);
  const [refundModalOrder, setRefundModalOrder] = useState<OrderRecord | null>(null);
  const [refundAmountInput, setRefundAmountInput] = useState<number>(0);
  const [refundReasonInput, setRefundReasonInput] = useState<string>('Customer requested refund');
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  const [selectedOrderForStudioReview, setSelectedOrderForStudioReview] = useState<OrderRecord | null>(null);

  const handleUpdateStudioOrderStatus = async (orderId: string, studioOrderStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/studio-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: studioOrderStatus,
          actor: 'Admin (Creative Director)',
          note: `Studio status updated to ${studioOrderStatus}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      }
    } catch (e) {
      console.error('Error updating studio order status:', e);
    }
  };

  const handleAssignDesigner = async (orderId: string, designerName: string) => {
    if (!designerName.trim()) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/assign-designer`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designerName: designerName.trim(),
          assignedBy: 'Admin (Creative Director)',
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      }
    } catch (e) {
      console.error('Error assigning designer:', e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status?: string, paymentStatus?: string) => {
    try {
      const res = await adminFetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, paymentStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      } else {
        alert('Failed to update order status.');
      }
    } catch (e) {
      console.error('Error updating order:', e);
      alert('Error updating order.');
    }
  };

  const handleOpenRefundModal = (ord: OrderRecord) => {
    setRefundModalOrder(ord);
    setRefundAmountInput(ord.totalAmount);
    setRefundReasonInput('Customer cancellation requested');
  };

  const handleExecuteRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundModalOrder) return;

    setIsProcessingRefund(true);
    try {
      const res = await adminFetch(`/api/admin/orders/${refundModalOrder.id}/refund`, {
        method: 'POST',
        body: JSON.stringify({
          amount: refundAmountInput,
          reason: refundReasonInput,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) => prev.map((o) => (o.id === refundModalOrder.id ? data.order : o)));
        setRefundModalOrder(null);
        alert(`Refund of ₹${refundAmountInput} successfully processed.`);
      } else {
        alert(data.error || 'Failed to process refund.');
      }
    } catch (err: any) {
      alert(err.message || 'Refund processing failed.');
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Are you sure you want to permanently delete order ${orderId}?`)) return;
    try {
      const res = await adminFetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        alert('Failed to delete order.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting order.');
    }
  };

  if (isVerifyingSession) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold tracking-wide">
            Verifying Server-Side Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <AdminLoginView
        onSuccess={(user, token) => {
          setCurrentAdminUser(user);
          setIsAdminAuthenticated(true);
          setSessionTimeLeft(30 * 60);
          fetchAllData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E11] text-[#E2E8F0] flex flex-col antialiased selection:bg-[#0799A6]/30 selection:text-white">
      {/* ======================================================== */}
      {/* TOP SECURE ADMIN HEADER */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-30 h-16 w-full bg-[#0E1418]/95 backdrop-blur-xl border-b border-[#1E2B32] px-4 sm:px-6 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        {/* Left: Brand & Sidebar Collapse Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#141E24] text-[#94A3B8] hover:text-white border border-[#22333D] cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex p-2 rounded-xl bg-[#141E24] text-[#94A3B8] hover:text-white border border-[#22333D] cursor-pointer hover:border-[#25B4BD]/40 transition"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#25B4BD]" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-[#94A3B8]" />
            )}
          </button>

          {/* Brand Lockup */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-b from-[#182329] to-[#0E1519] border border-[#2B3C45] shadow-inner">
              <ShieldCheck className="w-5 h-5 text-[#25B4BD] drop-shadow-[0_0_8px_rgba(37,180,189,0.5)]" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-wider text-white">GURUCRAFTPRO</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-[#0799A6]/20 text-[#25B4BD] border border-[#0799A6]/40">
                  Control
                </span>
              </div>
              <p className="text-[10px] text-[#64748B] font-medium hidden sm:block">
                Enterprise Command Center · {activeTab.toUpperCase().replace('-', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Real-Time Security Event Banner / Ticker */}
        {recentSecurityEvent && showSecurityNotification && (
          <div className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#121A1F] border border-[#22333D] text-xs text-[#94A3B8] shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#25B4BD] animate-ping shrink-0" />
            <span className="font-bold text-white text-[11px] truncate max-w-[200px]">
              {recentSecurityEvent.title}
            </span>
            <span className="text-[#3A4D57]">|</span>
            <span className="text-[10px] text-[#8198A5] truncate max-w-[260px]">
              {recentSecurityEvent.details}
            </span>
            <button
              onClick={() => setShowSecurityNotification(false)}
              className="ml-1 text-[#64748B] hover:text-white text-xs"
              title="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* Right: Security Status, Session Timer & Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Security Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#121A1F] border border-[#22333D] text-[11px] font-medium text-[#8198A5]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden lg:inline">HMAC · RBAC</span>
            <span className="lg:hidden">Secured</span>
          </div>

          {/* Session Countdown Timer */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#121A1F] border border-[#22333D] text-xs text-[#A0AEC0]">
            <Clock className="w-3.5 h-3.5 text-[#25B4BD] shrink-0" />
            <span className="font-mono text-[11px] font-semibold text-white">
              {Math.floor(sessionTimeLeft / 60)}:{String(sessionTimeLeft % 60).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={handleRefreshSession}
              title="Renew Session Token"
              className="p-1 hover:text-[#25B4BD] transition cursor-pointer text-[#64748B]"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Admin User Profile Chip */}
          {currentAdminUser && (
            <div className="flex items-center gap-2 p-1 sm:pr-3 rounded-xl bg-[#121A1F] border border-[#22333D]">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0799A6] to-[#25B4BD] text-[#0A0E11] font-bold text-xs flex items-center justify-center shadow-sm">
                {currentAdminUser.name?.[0] || 'A'}
              </div>
              <div className="hidden sm:block text-left text-xs leading-none">
                <div className="font-bold text-white truncate max-w-[110px]">
                  {currentAdminUser.name || 'Admin'}
                </div>
                <div className="text-[10px] text-[#25B4BD] font-mono font-bold mt-0.5">
                  {currentAdminUser.role || 'SUPER_ADMIN'}
                </div>
              </div>
            </div>
          )}

          {/* Direct Security Center Button */}
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#0799A6]/20 border-[#25B4BD] text-[#25B4BD]'
                : 'bg-[#121A1F] border-[#22333D] text-[#8198A5] hover:text-white hover:border-[#25B4BD]/40'
            }`}
            title="Open Admin Security Center"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleAdminLogout}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#181F24] hover:bg-rose-950/40 border border-[#2B353D] hover:border-rose-500/40 text-[#94A3B8] hover:text-rose-300 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            title="Exit Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* BODY: SIDEBAR + MAIN WORKSPACE */}
      {/* ======================================================== */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Backdrop */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Collapsible Left Sidebar */}
        <aside
          className={`fixed lg:static top-16 bottom-0 z-40 bg-[#0E1418] border-r border-[#1E2B32] flex flex-col justify-between transition-all duration-300 overflow-y-auto ${
            isMobileSidebarOpen
              ? 'left-0 w-72 shadow-2xl'
              : '-left-72 lg:left-0 ' + (isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64')
          }`}
        >
          {/* Sidebar Navigation */}
          <div className="p-3 space-y-4">
            {/* Group 1: Command & Intelligence */}
            <div>
              {!isSidebarCollapsed && (
                <div className="px-3 pb-1.5 text-[10px] font-black tracking-wider uppercase text-[#52636A]">
                  Command & Analytics
                </div>
              )}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('overview');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40 shadow-sm'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Overview"
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0 text-[#25B4BD]" />
                  {!isSidebarCollapsed && <span>Overview</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('analytics');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'analytics'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40 shadow-sm'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Analytics"
                >
                  <BarChart3 className="w-4 h-4 shrink-0 text-cyan-400" />
                  {!isSidebarCollapsed && <span>Analytics</span>}
                </button>
              </div>
            </div>

            {/* Group 2: Commerce & Catalog */}
            <div>
              {!isSidebarCollapsed && (
                <div className="px-3 pb-1.5 text-[10px] font-black tracking-wider uppercase text-[#52636A]">
                  Commerce & Orders
                </div>
              )}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('products');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Products"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0 text-emerald-400" />
                  {!isSidebarCollapsed && <span>Products</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('services');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'services'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Services"
                >
                  <Zap className="w-4 h-4 shrink-0 text-amber-400" />
                  {!isSidebarCollapsed && <span>Services</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('orders');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Orders"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 shrink-0 text-teal-400" />
                    {!isSidebarCollapsed && <span>Orders</span>}
                  </div>
                  {!isSidebarCollapsed && orders.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1E2B32] text-[#94A3B8]">
                      {orders.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('payments');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'payments' || activeTab === 'payment-gateway'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Payments & Razorpay"
                >
                  <CreditCard className="w-4 h-4 shrink-0 text-indigo-400" />
                  {!isSidebarCollapsed && <span>Payments</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('quick-services');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'quick-services'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Quick Digital Services"
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                  {!isSidebarCollapsed && <span>Quick Services (40)</span>}
                </button>
              </div>
            </div>

            {/* Group 3: Creative & Design Studios */}
            <div>
              {!isSidebarCollapsed && (
                <div className="px-3 pb-1.5 text-[10px] font-black tracking-wider uppercase text-[#52636A]">
                  Creative & Studio
                </div>
              )}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('designs');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'designs' || activeTab === 'page-graphic-design'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Graphic Design Marketplace"
                >
                  <Palette className="w-4 h-4 shrink-0 text-rose-400" />
                  {!isSidebarCollapsed && <span>Designs</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('photoshop');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'photoshop'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Photoshop Studio Orders"
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
                  {!isSidebarCollapsed && <span>Photoshop Studio</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('image-studio');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'image-studio'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Bulk Image Processing Studio Admin"
                >
                  <Layers className="w-4 h-4 shrink-0 text-[#25B4BD]" />
                  {!isSidebarCollapsed && <span>Bulk Image Studio</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('book-covers');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'book-covers'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Book Cover Studio"
                >
                  <BookOpen className="w-4 h-4 shrink-0 text-purple-400" />
                  {!isSidebarCollapsed && <span>Book Covers</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('prompts');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'prompts'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="AI Prompt Library"
                >
                  <Zap className="w-4 h-4 shrink-0 text-amber-400" />
                  {!isSidebarCollapsed && <span>AI Prompts</span>}
                </button>
              </div>
            </div>

            {/* Group 4: Client & Relations */}
            <div>
              {!isSidebarCollapsed && (
                <div className="px-3 pb-1.5 text-[10px] font-black tracking-wider uppercase text-[#52636A]">
                  Client Operations
                </div>
              )}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('customers');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'customers'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Customers"
                >
                  <Users className="w-4 h-4 shrink-0 text-blue-400" />
                  {!isSidebarCollapsed && <span>Customers</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('inquiries');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'inquiries' || activeTab === 'sales-leads'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Inquiries & AI Leads"
                >
                  <Mail className="w-4 h-4 shrink-0 text-emerald-400" />
                  {!isSidebarCollapsed && <span>Inquiries</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('wardrobe');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'wardrobe'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Wardrobe Consultations"
                >
                  <Calendar className="w-4 h-4 shrink-0 text-purple-400" />
                  {!isSidebarCollapsed && <span>Wardrobe Briefs</span>}
                </button>
              </div>
            </div>

            {/* Group 5: Content & Publishing */}
            <div>
              {!isSidebarCollapsed && (
                <div className="px-3 pb-1.5 text-[10px] font-black tracking-wider uppercase text-[#52636A]">
                  Publishing & Media
                </div>
              )}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('content');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'content' || activeTab === 'pages'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Content & Page Builders"
                >
                  <Layers className="w-4 h-4 shrink-0 text-sky-400" />
                  {!isSidebarCollapsed && <span>Content</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('media');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'media' || activeTab === 'images'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Media & Banners"
                >
                  <ImageIcon className="w-4 h-4 shrink-0 text-teal-400" />
                  {!isSidebarCollapsed && <span>Media</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('seo');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'seo'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="SEO Control Center"
                >
                  <Globe className="w-4 h-4 shrink-0 text-emerald-400" />
                  {!isSidebarCollapsed && <span>SEO Engine</span>}
                </button>
              </div>
            </div>

            {/* Group 6: Security & Governance */}
            <div>
              {!isSidebarCollapsed && (
                <div className="px-3 pb-1.5 text-[10px] font-black tracking-wider uppercase text-[#52636A]">
                  Security & Access
                </div>
              )}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('security');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'security'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40 shadow-sm'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Admin Security Center"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#25B4BD]" />
                  {!isSidebarCollapsed && <span>Security</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('admin-users');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'admin-users'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Admin Team & Allowlist"
                >
                  <UserCheck className="w-4 h-4 shrink-0 text-cyan-400" />
                  {!isSidebarCollapsed && <span>Admin Users</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('users');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Customer Accounts"
                >
                  <Users className="w-4 h-4 shrink-0 text-slate-400" />
                  {!isSidebarCollapsed && <span>Users</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('settings');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-gradient-to-r from-[#0799A6]/20 to-[#25B4BD]/20 text-[#25B4BD] border border-[#0799A6]/40'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#141E24]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title="Settings"
                >
                  <Settings className="w-4 h-4 shrink-0 text-slate-400" />
                  {!isSidebarCollapsed && <span>Settings</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-[#1E2B32] space-y-2">
            {!isSidebarCollapsed && currentAdminUser && (
              <div className="p-2.5 rounded-xl bg-[#121A1F] border border-[#22333D] text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate">{currentAdminUser.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#0799A6]/20 text-[#25B4BD] font-bold border border-[#0799A6]/30">
                    {currentAdminUser.role}
                  </span>
                </div>
                <div className="text-[10px] text-[#8198A5] truncate">{currentAdminUser.email}</div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAdminLogout}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl bg-[#141E24] hover:bg-rose-950/40 text-[#94A3B8] hover:text-rose-300 text-xs font-semibold transition cursor-pointer ${
                isSidebarCollapsed ? 'justify-center' : 'justify-start'
              }`}
              title="Terminate Admin Session"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Exit Session</span>}
            </button>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* MAIN DASHBOARD WORKSPACE */}
        {/* ======================================================== */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#0A0E11] text-[#E2E8F0]">
          {/* Executive Overview */}
          {activeTab === 'overview' && <AdminOverview />}

          {/* Analytics View */}
          {activeTab === 'analytics' && <AdminOverview />}

          {/* Products View */}
          {activeTab === 'products' && <ProductsCMS />}

          {/* Services View */}
          {activeTab === 'services' && <ServicesCMS />}

          {/* Quick Digital Services */}
          {activeTab === 'quick-services' && <QuickDigitalServicesCMS />}

          {/* Designs & Studio Hub */}
          {activeTab === 'designs' && <GraphicDesignCMS />}
          {activeTab === 'page-graphic-design' && <GraphicDesignCMS />}

          {/* Publishing, Pages & Content */}
          {activeTab === 'content' && <PageBuilderCMS />}
          {activeTab === 'pages' && <PageBuilderCMS />}
          {activeTab === 'page-home' && <HomePageCMS />}
          {activeTab === 'page-wardrobe' && <WardrobePageCMS />}
          {activeTab === 'page-guruji' && <GurujiArtworkCMS />}
          {activeTab === 'page-vantage' && <VantageEcomCMS />}
          {activeTab === 'page-bookcover' && <BookCoverCMS />}
          {activeTab === 'page-aiprompt' && <AIPromptCMS />}
          {activeTab === 'page-about' && <AboutUsCMS />}
          {activeTab === 'page-contact' && <ContactUsCMS />}

          {/* Media & Banners */}
          {activeTab === 'media' && <ImageManagerCMS />}
          {activeTab === 'images' && <ImageManagerCMS />}

          {/* Payments & Razorpay */}
          {activeTab === 'payments' && <PaymentGatewayCMS adminFetch={adminFetch} />}
          {activeTab === 'payment-gateway' && <PaymentGatewayCMS adminFetch={adminFetch} />}

          {/* Customer Leads & Inquiries */}
          {activeTab === 'inquiries' && <SalesLeadsCMS />}
          {activeTab === 'sales-leads' && <SalesLeadsCMS />}
          {activeTab === 'users' && <SalesLeadsCMS />}
          {activeTab === 'customers' && <WardrobePageCMS />}

          {/* SEO, Appearance & Settings */}
          {activeTab === 'seo' && <SEOCMS />}
          {activeTab === 'theme' && <AppearanceCMS />}
          {activeTab === 'social-links' && <SocialLinksCMS />}
          {activeTab === 'settings' && <SettingsCMS />}

          {/* Security Center & Admin RBAC */}
          {activeTab === 'security' && (
            <AdminSecurityCenter currentUser={currentAdminUser} onLogoutSession={handleAdminLogout} />
          )}
          {activeTab === 'admin-users' && (
            <AdminSecurityCenter currentUser={currentAdminUser} onLogoutSession={handleAdminLogout} />
          )}

          {/* AI Prompts Panel */}
          {activeTab === 'prompts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" /> AI Prompt Library Management ({prompts.length})
                  </h2>
                  <p className="text-xs text-slate-400">Manage ChatGPT, Midjourney, Gemini, and DALL-E prompts.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingPrompt({
                      title: '',
                      category: 'Graphic Design',
                      tool: 'Midjourney',
                      difficulty: 'Beginner',
                      description: '',
                      fullPrompt: '',
                      copyCount: 0,
                      tags: ['AI', 'Prompt'],
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-purple-500 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add AI Prompt
                </button>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prompts.map((p) => (
                <div key={p.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-500/30">
                        {p.tool} • {p.difficulty}
                      </span>
                      <h3 className="font-bold text-base text-white mt-1.5">{p.title}</h3>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setEditingPrompt(p)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePrompt(p.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                  <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-teal-300 overflow-x-auto border border-slate-800">
                    {p.fullPrompt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photoshop Studio Management Panel */}
        {activeTab === 'photoshop' && (
          <PhotoshopStudioCMS />
        )}

        {/* Bulk Image Studio Management Panel */}
        {activeTab === 'image-studio' && (
          <BulkImageStudioCMS />
        )}

        {/* Quick Digital Services Management Panel */}
        {activeTab === 'quick-services' && (
          <QuickDigitalServicesCMS />
        )}

        {/* Book Covers Panel */}
        {activeTab === 'book-covers' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" /> Book Cover Studio Client Briefs ({bookProjects.length})
            </h2>

            <div className="space-y-4">
              {bookProjects.length === 0 ? (
                <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-500">
                  No book cover briefs submitted yet.
                </div>
              ) : (
                bookProjects.map((project) => (
                  <div key={project.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs font-bold text-purple-400 uppercase">
                          Project #{project.id} • {project.selectedPackageName} (₹{project.price})
                        </span>
                        <h3 className="text-lg font-bold text-white">{project.bookTitle}</h3>
                        <p className="text-xs text-slate-400">
                          Author: {project.authorName} • Email: {project.customerEmail} • Phone: {project.customerPhone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                          {project.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedBookProject(project);
                            setStatusUpdate(project.status);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-500"
                        >
                          Manage Brief & Previews
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
                      <p><strong>Genre:</strong> {project.bookType}</p>
                      <p><strong>Format:</strong> {project.bookFormat}</p>
                      <p><strong>Trim Size:</strong> {project.trimSize}</p>
                      <p><strong>Page Count:</strong> {project.pageCount}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Customer Orders Panel */}
        {activeTab === 'orders' && (() => {
          const totalPaidRevenue = orders
            .filter((o) => o.paymentStatus === 'paid')
            .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
          const paidCount = orders.filter((o) => o.paymentStatus === 'paid').length;
          const pendingCount = orders.filter((o) => o.paymentStatus === 'pending').length;
          const refundedCount = orders.filter((o) => o.paymentStatus === 'refunded').length;

          const filteredOrders = orders.filter((ord) => {
            const matchesFilter =
              orderStatusFilter === 'all' ||
              (orderStatusFilter === 'paid' && ord.paymentStatus === 'paid') ||
              (orderStatusFilter === 'pending' && ord.paymentStatus === 'pending') ||
              (orderStatusFilter === 'failed' && (ord.paymentStatus === 'failed' || ord.paymentStatus === 'cancelled')) ||
              (orderStatusFilter === 'refunded' && ord.paymentStatus === 'refunded');

            const query = orderSearchTerm.toLowerCase();
            const matchesSearch =
              !query ||
              ord.id.toLowerCase().includes(query) ||
              ord.customerName.toLowerCase().includes(query) ||
              ord.customerEmail.toLowerCase().includes(query) ||
              ord.customerPhone.toLowerCase().includes(query) ||
              (ord.razorpayPaymentId && ord.razorpayPaymentId.toLowerCase().includes(query)) ||
              (ord.razorpayOrderId && ord.razorpayOrderId.toLowerCase().includes(query));

            return matchesFilter && matchesSearch;
          });

          return (
            <div className="space-y-6">
              {/* Header & Metrics */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-teal-400" /> Razorpay Orders & Transaction Ledger ({orders.length})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time payment captures, server signature verification, itemized invoices, and refund management.
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Orders</span>
                  <div className="text-xl font-black text-white">{orders.length}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Paid & Captured</span>
                  <div className="text-xl font-black text-emerald-300">
                    {paidCount} <span className="text-xs text-slate-400 font-normal">(₹{totalPaidRevenue})</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Pending Verification</span>
                  <div className="text-xl font-black text-amber-300">{pendingCount}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-purple-400 uppercase">Refunded</span>
                  <div className="text-xl font-black text-purple-300">{refundedCount}</div>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex gap-1.5 overflow-x-auto text-xs font-semibold">
                  {(['all', 'paid', 'pending', 'failed', 'refunded'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setOrderStatusFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                        orderStatusFilter === filter
                          ? 'bg-purple-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search ID, customer, email, payment..."
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
                    No orders found matching the selected filter or search criteria.
                  </div>
                ) : (
                  filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs hover:border-slate-700 transition-all shadow-md"
                    >
                      {/* Top Row */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-purple-400">{ord.id}</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                ord.paymentStatus === 'paid'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : ord.paymentStatus === 'refunded'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : ord.paymentStatus === 'failed' || ord.paymentStatus === 'cancelled'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              Payment: {ord.paymentStatus}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold capitalize">
                              Fulfillment: {ord.status}
                            </span>
                          </div>
                          <h3 className="font-bold text-white text-sm mt-1">{ord.customerName}</h3>
                          <p className="text-slate-400 text-[11px]">
                            {ord.customerEmail} • {ord.customerPhone} • Placed on {new Date(ord.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-xl font-black text-amber-400">₹{ord.totalAmount}</div>
                          {ord.discount ? (
                            <span className="text-[10px] text-emerald-400 font-semibold block">
                              Coupon: {ord.couponCode || 'APPLIED'} (-₹{ord.discount})
                            </span>
                          ) : null}
                          <span className="text-[10px] text-teal-400 font-medium">
                            {ord.paymentMethod || 'Razorpay Gateway'}
                          </span>
                        </div>
                      </div>

                      {/* Items & Gateway Info */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Ordered Items Table */}
                        <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Ordered Items ({ord.items.length})
                          </span>
                          <div className="divide-y divide-slate-900">
                            {ord.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between py-1 text-[11px]">
                                <span className="text-slate-200">
                                  {item.name} <span className="text-slate-500">×{item.quantity}</span>
                                </span>
                                <span className="font-semibold text-slate-300">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Razorpay Gateway Audit */}
                        <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-[11px] space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Razorpay Gateway Metadata
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-slate-300">
                            <div>
                              <span className="text-slate-500 block text-[10px]">Payment ID</span>
                              <span className="font-mono text-teal-300 truncate block">{ord.razorpayPaymentId || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px]">Razorpay Order ID</span>
                              <span className="font-mono text-purple-300 truncate block">{ord.razorpayOrderId || 'N/A'}</span>
                            </div>
                            {ord.refundId && (
                              <div className="col-span-2">
                                <span className="text-purple-400 block text-[10px] font-bold">Refund ID</span>
                                <span className="font-mono text-purple-300">{ord.refundId} (₹{ord.refundAmount})</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Studio Pipeline & Brief Management */}
                      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-purple-900/40 pb-2">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              Studio Production Pipeline (12 Steps)
                            </span>
                            {ord.revisionCount !== undefined && ord.revisionCount > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                                {ord.revisionCount} Revision Requested
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] text-slate-400">Stage:</span>
                            <select
                              value={ord.studioOrderStatus || 'NEW ORDER'}
                              onChange={(e) => handleUpdateStudioOrderStatus(ord.id, e.target.value)}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-purple-500/40 text-[11px] font-bold text-cyan-300 focus:outline-none"
                            >
                              <option value="NEW ORDER">1. NEW ORDER</option>
                              <option value="PAYMENT CONFIRMED">2. PAYMENT CONFIRMED</option>
                              <option value="BRIEF RECEIVED">3. BRIEF RECEIVED</option>
                              <option value="ASSETS UPLOADED">4. ASSETS UPLOADED</option>
                              <option value="DESIGNER ASSIGNED">5. DESIGNER ASSIGNED</option>
                              <option value="IN PROGRESS">6. IN PROGRESS</option>
                              <option value="QUALITY CHECK">7. QUALITY CHECK</option>
                              <option value="READY FOR REVIEW">8. READY FOR REVIEW</option>
                              <option value="REVISION REQUESTED">9. REVISION REQUESTED</option>
                              <option value="APPROVED">10. APPROVED</option>
                              <option value="FINAL DELIVERY">11. FINAL DELIVERY</option>
                              <option value="COMPLETED">12. COMPLETED</option>
                            </select>
                          </div>
                        </div>

                        {/* Designer Assignment & Project Brief Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                          <div className="space-y-1.5">
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-400">Assigned Retoucher:</span>
                              <span className="font-bold text-purple-300">
                                {ord.assignedDesigner || 'Unassigned'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleAssignDesigner(ord.id, 'Vikram Joshi (Senior Photoshop Lead)')}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                              >
                                Assign Vikram
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAssignDesigner(ord.id, 'Pooja Verma (Catalog Retoucher)')}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                              >
                                Assign Pooja
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAssignDesigner(ord.id, 'Annu Dhaneja (Creative Director)')}
                                className="px-2 py-0.5 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-[10px]"
                              >
                                Assign Annu
                              </button>
                            </div>
                          </div>

                          {ord.projectBrief && (
                            <div className="space-y-1 text-slate-300">
                              <div>
                                <strong>Channel:</strong> {ord.projectBrief.marketplace} • <strong>Turnaround:</strong> {ord.projectBrief.deadlinePreference}
                              </div>
                              <div>
                                <strong>Specs:</strong> {ord.projectBrief.dimensions} | {ord.projectBrief.backgroundReq}
                              </div>
                              {ord.projectBrief.specialInstructions && (
                                <div className="text-slate-400 italic">
                                  "{ord.projectBrief.specialInstructions}"
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Proof Inspection & Modal Launcher */}
                        <div className="pt-2 flex items-center justify-between border-t border-purple-900/30 text-[11px]">
                          <span className="text-slate-400">
                            Assets: {ord.files?.length || ord.items.length} files attached
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForStudioReview(ord)}
                            className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center space-x-1"
                          >
                            <span>Inspect Proofs & Feedback</span>
                          </button>
                        </div>
                      </div>

                      {/* Controls & Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                        {/* Fulfillment update dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[11px]">Update Fulfillment:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs outline-none focus:border-purple-500"
                          >
                            <option value="received">Received</option>
                            <option value="in-progress">In-Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForInvoice(ord)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Receipt className="w-3.5 h-3.5 text-teal-400" /> Tax Invoice
                          </button>

                          {ord.paymentStatus === 'paid' && (
                            <button
                              type="button"
                              onClick={() => handleOpenRefundModal(ord)}
                              className="px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 font-bold flex items-center gap-1.5 transition-all"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Issue Refund
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="p-1.5 rounded-lg bg-slate-800/60 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })()}

        {/* Wardrobe Requests Panel */}
        {activeTab === 'wardrobe' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" /> 7-Day Wardrobe Consultation & Style Studio ({submissions.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Manage personal style consultations, client body measurements, custom 7-day capsule lookbooks & outfit plans by Annu Dhaneja.
                </p>
              </div>
              <button
                onClick={() => setIsNewWardrobeModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all"
              >
                <Plus className="w-4 h-4" /> Log New Consultation Brief
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Consultations</span>
                <div className="text-xl font-black text-white">{submissions.length}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Active Consults</span>
                <div className="text-xl font-black text-amber-300">
                  {submissions.filter((s) => !s.status || s.status === 'Consultation Active').length}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-teal-400 uppercase">Outfits Curated</span>
                <div className="text-xl font-black text-teal-300">
                  {submissions.filter((s) => s.status === 'Outfits Curated').length}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Completed Lookbooks</span>
                <div className="text-xl font-black text-emerald-300">
                  {submissions.filter((s) => s.status === 'Completed & Delivered').length}
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs font-medium overflow-x-auto">
              <button
                onClick={() => setWardrobeFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  wardrobeFilter === 'all' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Consultations ({submissions.length})
              </button>
              <button
                onClick={() => setWardrobeFilter('active')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  wardrobeFilter === 'active' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setWardrobeFilter('curated')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  wardrobeFilter === 'curated' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Curated
              </button>
              <button
                onClick={() => setWardrobeFilter('completed')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  wardrobeFilter === 'completed' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Completed & Delivered
              </button>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-500 space-y-2">
                  <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm">No wardrobe consultation briefs recorded yet.</p>
                  <p className="text-xs text-slate-600">Click "Log New Consultation Brief" above to create one.</p>
                </div>
              ) : (
                submissions
                  .filter((sub) => {
                    if (wardrobeFilter === 'active') return !sub.status || sub.status === 'Consultation Active';
                    if (wardrobeFilter === 'curated') return sub.status === 'Outfits Curated';
                    if (wardrobeFilter === 'completed') return sub.status === 'Completed & Delivered';
                    return true;
                  })
                  .map((sub, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-base">{sub.clientName}</h3>
                            <span className="text-xs text-slate-400">({sub.city})</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <a href={`mailto:${sub.clientEmail}`} className="flex items-center gap-1 hover:text-teal-300">
                              <Mail className="w-3.5 h-3.5" /> {sub.clientEmail}
                            </a>
                            <a href={`tel:${sub.clientPhone}`} className="flex items-center gap-1 hover:text-teal-300">
                              <Phone className="w-3.5 h-3.5" /> {sub.clientPhone}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              sub.status === 'Completed & Delivered'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : sub.status === 'Outfits Curated'
                                ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                                : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            }`}
                          >
                            {sub.status || 'Consultation Active'}
                          </span>

                          <button
                            onClick={() => {
                              setSelectedWardrobe({ submission: sub, index: i });
                              setWardrobeStatusUpdate(sub.status || 'Consultation Active');
                              setWardrobeLookbookInput(sub.lookbookUrl || '');
                              setWardrobeAdminNotesInput(sub.adminNotes || '');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1 transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" /> Manage Lookbook & Status
                          </button>

                          <a
                            href={`https://wa.me/91${(sub.clientPhone || '8527837527').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(sub.clientName)},%20this%20is%20Annu%20Dhaneja%20from%20GurucraftPro.%20I%20have%20an%20update%20regarding%20your%207-Day%20Wardrobe%20Styling%20Consultation!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 transition-all"
                          >
                            WhatsApp Client
                          </a>

                          <button
                            onClick={() => handleDeleteWardrobeSubmission(sub.id || i)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                            title="Delete Brief"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Brief Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Occasion</span>
                          <span className="font-semibold text-purple-300">{sub.occasion}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Body Type</span>
                          <span className="font-semibold text-slate-200">{sub.bodyType}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Preferred Style</span>
                          <span className="font-semibold text-slate-200">{sub.preferredStyle}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Budget Range</span>
                          <span className="font-semibold text-emerald-400">{sub.budgetRange}</span>
                        </div>
                      </div>

                      {sub.notes && (
                        <div className="text-xs text-slate-300 bg-slate-950/30 p-3 rounded-xl border border-slate-800/50">
                          <strong className="text-slate-400">Client Preferences / Notes:</strong> {sub.notes}
                        </div>
                      )}

                      {sub.adminNotes && (
                        <div className="text-xs text-teal-300 bg-teal-950/20 p-3 rounded-xl border border-teal-500/20">
                          <strong className="text-teal-400">Stylist Recommendations (Annu Dhaneja):</strong> {sub.adminNotes}
                        </div>
                      )}

                      {/* Uploaded Photos */}
                      {((sub.uploadedImages && sub.uploadedImages.length > 0) || (sub.uploadedPhotos && sub.uploadedPhotos.length > 0)) && (
                        <div>
                          <span className="text-xs font-bold text-slate-400 block mb-2">Uploaded Wardrobe Clothes & Photos:</span>
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {(sub.uploadedImages || sub.uploadedPhotos || []).map((img, imgIdx) => (
                              <img
                                key={imgIdx}
                                src={img}
                                alt="Wardrobe Upload"
                                className="w-16 h-16 object-cover rounded-lg border border-slate-700 bg-slate-800"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {sub.lookbookUrl && (
                        <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                          <span className="text-teal-400 font-semibold">Capsule Lookbook Guide Delivered</span>
                          <a
                            href={sub.lookbookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-[11px] font-bold"
                          >
                            View Lookbook Guide
                          </a>
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>

      {/* Book Project Modal */}
      {selectedBookProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-purple-500/40 p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">Manage Book Cover #{selectedBookProject.id}</h3>
              <button onClick={() => setSelectedBookProject(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Update Status</label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                >
                  <option value="Brief Received">Brief Received</option>
                  <option value="Design Research">Design Research</option>
                  <option value="First Concept">First Concept</option>
                  <option value="Revision Requested">Revision Requested</option>
                  <option value="Final Design">Final Design</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Add Designer Preview Cover File URL</label>
                <input
                  type="text"
                  value={previewUploadInput}
                  onChange={(e) => setPreviewUploadInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedBookProject(null)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateBookProject(selectedBookProject.id)}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold"
                >
                  Update & Notify Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROMPT MODAL */}
      {editingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-purple-500/40 p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">
                {editingPrompt.id ? 'Edit AI Prompt' : 'Add New AI Prompt'}
              </h3>
              <button onClick={() => setEditingPrompt(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrompt} className="space-y-4 text-xs">
              <div>
                <label className="block mb-1 font-bold text-slate-300">Prompt Title</label>
                <input
                  type="text"
                  required
                  value={editingPrompt.title || ''}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-bold text-slate-300">AI Tool</label>
                  <select
                    value={editingPrompt.tool || 'Midjourney'}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, tool: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  >
                    <option value="Midjourney">Midjourney</option>
                    <option value="ChatGPT">ChatGPT</option>
                    <option value="Gemini">Gemini</option>
                    <option value="DALL-E 3">DALL-E 3</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-bold text-slate-300">Difficulty</label>
                  <select
                    value={editingPrompt.difficulty || 'Beginner'}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, difficulty: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-300">Full AI Prompt Copy</label>
                <textarea
                  rows={4}
                  required
                  value={editingPrompt.fullPrompt || ''}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, fullPrompt: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-300">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingPrompt.description || ''}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPrompt(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Save Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE WARDROBE SUBMISSION MODAL */}
      {selectedWardrobe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-purple-500/40 p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">
                Manage Consultation for {selectedWardrobe.submission.clientName}
              </h3>
              <button onClick={() => setSelectedWardrobe(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-4">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Update Consultation Status</label>
                <select
                  value={wardrobeStatusUpdate}
                  onChange={(e) => setWardrobeStatusUpdate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 outline-none"
                >
                  <option value="Consultation Active">Consultation Active</option>
                  <option value="Outfits Curated">Outfits Curated</option>
                  <option value="Completed & Delivered">Completed & Delivered</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold font-sans">Stylist Recommendation & Outfit Notes</label>
                <textarea
                  rows={3}
                  value={wardrobeAdminNotesInput}
                  onChange={(e) => setWardrobeAdminNotesInput(e.target.value)}
                  placeholder="e.g. Recommend pairing dark navy blazer with cream chinos and tan loafers for executive meetings..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Capsule Lookbook PDF / Style Guide URL</label>
                <input
                  type="text"
                  value={wardrobeLookbookInput}
                  onChange={(e) => setWardrobeLookbookInput(e.target.value)}
                  placeholder="https://drive.google.com/... or image link"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedWardrobe(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateWardrobeSubmission}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold"
                >
                  Save Lookbook & Update Brief
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW WARDROBE BRIEF MODAL */}
      {isNewWardrobeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-purple-500/40 p-6 text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">Log New Wardrobe Consultation Brief</h3>
              <button onClick={() => setIsNewWardrobeModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWardrobeSubmission} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Client Name</label>
                  <input
                    type="text"
                    required
                    value={newWardrobeForm.clientName || ''}
                    onChange={(e) => setNewWardrobeForm({ ...newWardrobeForm, clientName: e.target.value })}
                    placeholder="e.g. Meenakshi Sundaram"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">City / Location</label>
                  <input
                    type="text"
                    required
                    value={newWardrobeForm.city || ''}
                    onChange={(e) => setNewWardrobeForm({ ...newWardrobeForm, city: e.target.value })}
                    placeholder="e.g. Rohini, Delhi"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newWardrobeForm.clientPhone || ''}
                    onChange={(e) => setNewWardrobeForm({ ...newWardrobeForm, clientPhone: e.target.value })}
                    placeholder="+91 85278 37527"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newWardrobeForm.clientEmail || ''}
                    onChange={(e) => setNewWardrobeForm({ ...newWardrobeForm, clientEmail: e.target.value })}
                    placeholder="client@example.com"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Occasion</label>
                  <input
                    type="text"
                    required
                    value={newWardrobeForm.occasion || ''}
                    onChange={(e) => setNewWardrobeForm({ ...newWardrobeForm, occasion: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Body Type</label>
                  <select
                    value={newWardrobeForm.bodyType || 'Hourglass'}
                    onChange={(e) => setNewWardrobeForm({ ...newWardrobeForm, bodyType: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  >
                    <option value="Hourglass">Hourglass</option>
                    <option value="Pear Shape">Pear Shape</option>
                    <option value="Athletic / Rectangle">Athletic / Rectangle</option>
                    <option value="Inverted Triangle">Inverted Triangle</option>
                    <option value="Apple Shape">Apple Shape</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Preferred Style</label>
                  <input
                    type="text"
                    required
                    value={newWardrobeForm.preferredStyle || ''}
                    onChange={(e) => setNewWardrobeForm({ ...newWardrobeForm, preferredStyle: e.target.value })}
                    placeholder="e.g. Smart Casual, Ethnic Fusion"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Budget Range</label>
                  <select
                    value={newWardrobeForm.budgetRange || '₹5,000 - ₹10,000'}
                    onChange={(e) => setNewWardrobeForm({ ...newWardrobeForm, budgetRange: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                  >
                    <option value="Under ₹5,000">Under ₹5,000</option>
                    <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
                    <option value="₹10,000 - ₹20,000">₹10,000 - ₹20,000</option>
                    <option value="₹20,000+ Premium">₹20,000+ Premium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Color Preferences & Client Notes</label>
                <textarea
                  rows={2}
                  value={newWardrobeForm.notes || ''}
                  onChange={(e) => setNewWardrobeForm({ ...newWardrobeForm, notes: e.target.value })}
                  placeholder="e.g. Prefers navy blue and emerald green. Avoids bright yellow."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewWardrobeModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold"
                >
                  Create Brief
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Razorpay Refund Modal */}
      {refundModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-3xl p-6 text-white space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-purple-400" /> Issue Razorpay Refund
              </h3>
              <button
                type="button"
                onClick={() => setRefundModalOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div><strong className="text-slate-400">Order ID:</strong> {refundModalOrder.id}</div>
              <div><strong className="text-slate-400">Customer:</strong> {refundModalOrder.customerName} ({refundModalOrder.customerEmail})</div>
              <div><strong className="text-slate-400">Razorpay Payment ID:</strong> <span className="font-mono text-teal-300">{refundModalOrder.razorpayPaymentId}</span></div>
              <div><strong className="text-slate-400">Total Captured:</strong> <span className="text-amber-400 font-bold">₹{refundModalOrder.totalAmount}</span></div>
            </div>

            <form onSubmit={handleExecuteRefund} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-bold">Refund Amount (₹)</label>
                <input
                  type="number"
                  min={1}
                  max={refundModalOrder.totalAmount}
                  required
                  value={refundAmountInput}
                  onChange={(e) => setRefundAmountInput(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">Reason / Note for Customer</label>
                <input
                  type="text"
                  required
                  value={refundReasonInput}
                  onChange={(e) => setRefundReasonInput(e.target.value)}
                  placeholder="e.g. Project cancelled on customer request"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isProcessingRefund}
                  onClick={() => setRefundModalOrder(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingRefund}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-lg"
                >
                  {isProcessingRefund ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Process Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal */}
      <InvoiceReceiptModal
        isOpen={!!selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
        order={selectedOrderForInvoice}
      />

      {/* Studio Client Review Modal for Admin Preview & QA */}
      {selectedOrderForStudioReview && (
        <ClientReviewModal
          isOpen={!!selectedOrderForStudioReview}
          order={selectedOrderForStudioReview}
          onClose={() => {
            setSelectedOrderForStudioReview(null);
            fetchAllData();
          }}
          onStatusUpdated={() => {
            fetchAllData();
          }}
        />
      )}
    </div>
  );
};
