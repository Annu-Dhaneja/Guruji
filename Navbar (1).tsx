import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Moon, Shield, ShoppingBag, Sun, User, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

/**
 * minTier = the desktop tier from which the link is shown inline.
 *   1 = lg (1024px+), 2 = xl (1280px+), 3 = 2xl (1536px+), null = always inside "More".
 * Any link not shown inline on the current screen is listed in the "More" dropdown,
 * so the navbar never overflows and text never needs to shrink.
 */
interface NavLink {
  id: string;
  label: string;
  badge?: string;
  minTier: 1 | 2 | 3 | null;
}

const NAV_LINKS: readonly NavLink[] = [
  { id: 'home', label: 'Home', minTier: 1 },
  { id: 'quick-services', label: 'Quick Fixes', badge: '₹49', minTier: 1 },
  { id: 'product/perfume', label: '3D Products', badge: '360°', minTier: 1 },
  { id: 'graphic-design', label: 'Graphic Design', minTier: 1 },
  { id: 'guruji-artwork', label: 'Guruji Artwork', minTier: 2 },
  { id: 'vantage-ecom', label: 'Vantage Ecom', minTier: 3 },
  { id: 'image-studio', label: 'Bulk Image Studio', badge: 'NEW', minTier: null },
  { id: 'photoshop-studio', label: 'AI Studio & Prompts', badge: 'AI', minTier: null },
  { id: 'book-design', label: 'Book Covers', minTier: null },
  { id: 'about', label: 'About Us', minTier: null },
  { id: 'contact', label: 'Contact', minTier: null },
];

const DESKTOP_QUERIES = [
  '(min-width: 1024px)',
  '(min-width: 1280px)',
  '(min-width: 1536px)',
] as const;

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0799A6] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-[#25B4BD] dark:focus-visible:ring-offset-[#0B1114]';

const ICON_BUTTON =
  'shrink-0 p-2 rounded-full bg-[#F8FAFA] dark:bg-[#182429] hover:bg-[#DDF3F4]/60 dark:hover:bg-[#173D40]/50 border border-[#DCE7E7] dark:border-[#2A3C40] text-[#52636A] dark:text-[#B7C6C8] hover:text-[#102A36] dark:hover:text-[#F4F8F8] transition-colors';

const isLinkActive = (id: string, activePage: string): boolean =>
  activePage === id || (id === 'photoshop-studio' && activePage === 'learn-ai-prompts');

/** 0 = below lg (mobile/tablet), 1 = lg, 2 = xl, 3 = 2xl+ */
const getDesktopTier = (): number => {
  if (typeof window === 'undefined') return 0;
  return DESKTOP_QUERIES.reduce((tier, query) => (window.matchMedia(query).matches ? tier + 1 : tier), 0);
};

const useDesktopTier = (): number => {
  const [tier, setTier] = useState<number>(getDesktopTier);

  useEffect(() => {
    const lists = DESKTOP_QUERIES.map((query) => window.matchMedia(query));
    const update = () => setTier(getDesktopTier());
    lists.forEach((list) => list.addEventListener('change', update));
    update();
    return () => lists.forEach((list) => list.removeEventListener('change', update));
  }, []);

  return tier;
};

const Badge: React.FC<{ text: string }> = ({ text }) => (
  <span className="px-1.5 py-px rounded-full text-[10px] leading-4 font-bold bg-[#FDE2DE] dark:bg-[#533735] text-[#A8434C] dark:text-[#F2A39A] border border-[#F5A39A]/50">
    {text}
  </span>
);

interface NavItemProps {
  link: NavLink;
  active: boolean;
  onSelect: (id: string) => void;
  variant: 'pill' | 'row';
}

const NavItem: React.FC<NavItemProps> = ({ link, active, onSelect, variant }) => {
  const base =
    variant === 'pill'
      ? 'shrink-0 whitespace-nowrap px-2.5 xl:px-3 py-1.5 rounded-full text-[13px] xl:text-sm gap-1.5 justify-center'
      : 'w-full text-left px-4 py-2.5 rounded-xl text-sm justify-between';
  const state = active
    ? 'bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD] font-bold border border-[#0799A6]/30'
    : 'border border-transparent font-semibold text-[#52636A] dark:text-[#B7C6C8] hover:text-[#0799A6] dark:hover:text-[#25B4BD] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#173D40]/30';

  return (
    <button
      type="button"
      onClick={() => onSelect(link.id)}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center transition-colors duration-200 ${FOCUS_RING} ${base} ${state}`}
    >
      <span>{link.label}</span>
      {link.badge && <Badge text={link.badge} />}
    </button>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate, onOpenCart, onOpenAuth }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { items } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const tier = useDesktopTier();
  const headerRef = useRef<HTMLElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isDark = theme === 'dark';

  // Scroll detection (state only changes when the threshold is crossed)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when the layout switches between mobile and desktop or between desktop tiers
  useEffect(() => {
    setMoreOpen(false);
    if (tier >= 1) setMobileOpen(false);
  }, [tier]);

  // Escape + outside click for the More dropdown and the mobile menu
  useEffect(() => {
    if (!mobileOpen && !moreOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (moreOpen) {
        setMoreOpen(false);
        moreButtonRef.current?.focus();
      }
      if (mobileOpen) {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (moreOpen && !moreRef.current?.contains(target)) setMoreOpen(false);
      if (mobileOpen && !headerRef.current?.contains(target)) setMobileOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [mobileOpen, moreOpen]);

  const go = useCallback(
    (page: string) => {
      onNavigate(page);
      setMobileOpen(false);
      setMoreOpen(false);
    },
    [onNavigate]
  );

  const handleAccountClick = () => {
    if (user) {
      go(user.role === 'admin' ? 'admin' : 'dashboard');
    } else {
      setMobileOpen(false);
      onOpenAuth();
    }
  };

  const inlineLinks = NAV_LINKS.filter((link) => link.minTier !== null && tier >= link.minTier);
  const moreLinks = NAV_LINKS.filter((link) => link.minTier === null || tier < link.minTier);
  const moreActive = moreLinks.some((link) => isLinkActive(link.id, activePage));
  const firstName = user ? user.name.trim().split(/\s+/)[0] : '';

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 w-full border-b bg-white dark:bg-[#0B1114] transition-[padding,box-shadow,background-color] duration-300 ${
        scrolled
          ? 'py-2 bg-white/95 dark:bg-[#0B1114]/95 backdrop-blur-md border-[#DCE7E7] dark:border-[#2A3C40] shadow-[0_6px_20px_-14px_rgba(16,42,54,0.45)]'
          : 'py-3 border-[#DCE7E7]/80 dark:border-[#2A3C40]/80'
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-6 xl:px-8">
        {/* Brand */}
        <button
          type="button"
          onClick={() => go('home')}
          aria-label="GurucraftPro – go to home page"
          title="GurucraftPro – Home"
          className={`group flex min-w-0 items-center gap-2 sm:gap-3 rounded-full text-left ${FOCUS_RING}`}
        >
          <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#087581] to-[#0799A6] p-0.5 transition-transform group-hover:scale-105">
            <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white dark:bg-[#0B1114]">
              <img
                src={isDark ? '/favicon-dark.jpg' : '/favicon-light.jpg'}
                alt="GurucraftPro logo"
                width={40}
                height={40}
                referrerPolicy="no-referrer"
                className="h-full w-full rounded-full object-cover"
              />
            </span>
          </span>
          <span className="min-w-0">
            <span className="flex items-center whitespace-nowrap text-base sm:text-lg font-extrabold leading-none tracking-tight text-[#102A36] dark:text-[#F4F8F8]">
              Gurucraft
              <span className="text-[#0799A6] dark:text-[#25B4BD]">Pro</span>
            </span>
            <span className="mt-0.5 hidden 2xl:block whitespace-nowrap text-[10px] font-medium tracking-tight text-[#52636A] dark:text-[#819396]">
              By Annu Dhaneja • Rohini, Delhi
            </span>
          </span>
        </button>

        {/* Desktop navigation */}
        <nav aria-label="Main navigation" className="hidden lg:flex min-w-0 items-center gap-1">
          {inlineLinks.map((link) => (
            <NavItem
              key={link.id}
              link={link}
              variant="pill"
              active={isLinkActive(link.id, activePage)}
              onSelect={go}
            />
          ))}

          {moreLinks.length > 0 && (
            <div ref={moreRef} className="relative shrink-0">
              <button
                ref={moreButtonRef}
                type="button"
                onClick={() => setMoreOpen((open) => !open)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                aria-controls="more-nav-menu"
                title="More pages"
                className={`flex items-center gap-1 rounded-full border px-2.5 xl:px-3 py-1.5 text-[13px] xl:text-sm transition-colors duration-200 ${FOCUS_RING} ${
                  moreActive
                    ? 'bg-[#DDF3F4] dark:bg-[#173D40] text-[#087581] dark:text-[#25B4BD] font-bold border-[#0799A6]/30'
                    : 'border-transparent font-semibold text-[#52636A] dark:text-[#B7C6C8] hover:text-[#0799A6] dark:hover:text-[#25B4BD] hover:bg-[#DDF3F4]/50 dark:hover:bg-[#173D40]/30'
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {moreOpen && (
                <div
                  id="more-nav-menu"
                  className="absolute right-0 top-full z-50 mt-2 w-64 space-y-0.5 rounded-2xl border border-[#DCE7E7] dark:border-[#2A3C40] bg-white dark:bg-[#111A1E] p-1.5 shadow-lg"
                >
                  {moreLinks.map((link) => (
                    <NavItem
                      key={link.id}
                      link={link}
                      variant="row"
                      active={isLinkActive(link.id, activePage)}
                      onSelect={go}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className={`${ICON_BUTTON} hidden min-[400px]:inline-flex ${FOCUS_RING}`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-[#F2A39A]" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className={`${ICON_BUTTON} relative text-[#102A36] dark:text-[#F4F8F8] ${FOCUS_RING}`}
            title="View cart"
            aria-label={cartCount > 0 ? `View shopping cart, ${cartCount} items` : 'View shopping cart'}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F5A39A] dark:bg-[#F2A39A] px-1 text-[10px] font-black text-[#102A36] dark:text-[#0B1114] shadow-md">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {user ? (
            <button
              type="button"
              onClick={handleAccountClick}
              title={user.role === 'admin' ? 'Open admin console' : 'Open my dashboard'}
              aria-label={`${user.role === 'admin' ? 'Admin console' : 'Dashboard'} – ${firstName}`}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border border-[#DCE7E7] dark:border-[#2A3C40] bg-[#F8FAFA] dark:bg-[#182429] p-2 text-xs font-bold text-[#102A36] dark:text-[#F4F8F8] transition-colors hover:bg-[#DDF3F4]/60 dark:hover:bg-[#173D40]/50 sm:px-3.5 lg:p-2 xl:px-3.5 ${FOCUS_RING}`}
            >
              <User className="h-4 w-4 text-[#0799A6] dark:text-[#25B4BD]" aria-hidden="true" />
              <span className="hidden max-w-[96px] truncate sm:inline lg:hidden xl:inline">{firstName}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAccountClick}
              title="Sign in to your account"
              className={`shrink-0 whitespace-nowrap rounded-full bg-[#F5A39A] dark:bg-[#F2A39A] px-3.5 py-2 text-xs font-extrabold text-[#102A36] dark:text-[#0B1114] transition-all hover:brightness-105 active:scale-95 sm:px-5 ${FOCUS_RING}`}
            >
              Sign In
            </button>
          )}

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className={`${ICON_BUTTON} lg:hidden ${FOCUS_RING}`}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
          >
            {mobileOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile / tablet dropdown – opens below the navbar, never covers the full screen */}
      <div
        id="mobile-nav-menu"
        aria-hidden={!mobileOpen}
        className={`absolute inset-x-0 top-full grid transition-[grid-template-rows,opacity,visibility] duration-200 ease-out lg:hidden ${
          mobileOpen ? 'visible grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav
            aria-label="Mobile navigation"
            className="max-h-[calc(100dvh-4.5rem)] space-y-1 overflow-y-auto border-b border-[#DCE7E7] dark:border-[#2A3C40] bg-white dark:bg-[#111A1E] px-3 py-3 shadow-lg sm:px-6"
          >
            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.id}
                link={link}
                variant="row"
                active={isLinkActive(link.id, activePage)}
                onSelect={go}
              />
            ))}

            <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#DCE7E7] dark:border-[#2A3C40] px-1 pt-3">
              <button
                type="button"
                onClick={() => go('admin')}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-[#0799A6] dark:text-[#25B4BD] ${FOCUS_RING}`}
              >
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>Admin Console</span>
              </button>

              {/* Theme toggle fallback for very narrow phones where the header button is hidden */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-[#52636A] dark:text-[#B7C6C8] min-[400px]:hidden ${FOCUS_RING}`}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-[#F2A39A]" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
