import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useFirestoreData';
import TrustBadges from './TrustBadges';
import { Mail, Phone, ChevronRight } from 'lucide-react';

export default function Footer() {
  const { settings } = useSettings();

  const quickLinks = [
    { label: 'Categories', to: '/category' },
    { label: 'Deals', to: '/search' },
    { label: 'Track Order', to: '/orders' },
  ];

  const policyLinks = [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Return Policy', to: '/return-policy' },
    { label: 'Terms & Conditions', to: '/terms' },
  ];

  return (
    <footer className="mt-8 bg-muted/30 border-t border-border/60 pb-[calc(var(--nav-height,56px)+env(safe-area-inset-bottom,0px))] lg:pb-0">

      {/* ── Main grid ── */}
      <div className="max-w-screen-xl mx-auto px-5 pt-6 pb-5 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">


        {/* Brand col */}
        <div className="col-span-2 sm:col-span-2 lg:col-span-1">
          <img
            src="/icon.png"
            alt={settings.appName}
            className="h-12 max-w-[130px] object-contain mb-3"
            onError={e => { (e.target as HTMLImageElement).src = '/logo.jpg'; }}
          />
          <p className="text-xs leading-relaxed text-muted-foreground max-w-[200px]">
            আপনার বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম — দ্রুত ডেলিভারি, সেরা মূল্য।
          </p>

          {/* Contact info inline under brand on mobile */}
          {(settings.email || settings.phone) && (
            <div className="mt-4 space-y-1.5 lg:hidden">
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
                >
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail size={11} className="text-primary" />
                  </span>
                  {settings.email}
                </a>
              )}
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
                >
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Phone size={11} className="text-primary" />
                  </span>
                  {settings.phone}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {quickLinks.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors group"
                >
                  <ChevronRight
                    size={11}
                    className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 text-primary"
                  />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policy */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-3">
            Policy
          </h4>
          <ul className="space-y-2">
            {policyLinks.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors group"
                >
                  <ChevronRight
                    size={11}
                    className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 text-primary"
                  />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact — desktop only */}
        <div className="hidden lg:block">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-3">
            Contact
          </h4>
          <ul className="space-y-2.5">
            {settings.email && (
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
                >
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail size={11} className="text-primary" />
                  </span>
                  {settings.email}
                </a>
              </li>
            )}
            {settings.phone && (
              <li>
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
                >
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Phone size={11} className="text-primary" />
                  </span>
                  {settings.phone}
                </a>
              </li>
            )}
            <li>
              <Link
                to="/support"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors group"
              >
                <ChevronRight
                  size={11}
                  className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 text-primary"
                />
                Help Center
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-border/60">
        <div className="max-w-screen-xl mx-auto px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground/70 order-2 sm:order-1">
            Developed by{' '}
            <a
              href="/developer.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              OnonnoBit
            </a>
          </p>
          <div className="order-1 sm:order-2">
            <TrustBadges />
          </div>
        </div>
      </div>

    </footer>
  );
}
