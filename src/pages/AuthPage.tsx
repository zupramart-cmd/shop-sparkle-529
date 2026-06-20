import { useState } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, RotateCcw } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings, bindReferral } from '@/hooks/useFirestoreData';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [isReset, setIsReset]     = useState(false);
  const [form, setForm]           = useState({ email: '', password: '' });
  const { login, register, resetPassword } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (isReset) {
        await resetPassword(form.email);
        setSuccess('পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে!');
      } else {
        try {
          await login(form.email, form.password);
          navigate('/');
        } catch (err: any) {
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
            try {
              const name = form.email.split('@')[0];
              await register(form.email, form.password, name);
              const currentUser = getAuth().currentUser;
              if (refCode && currentUser?.uid) {
                try { await bindReferral(currentUser.uid, refCode); } catch {}
              }
              navigate('/');
            } catch (regErr: any) {
              if (regErr.code === 'auth/email-already-in-use') {
                setError('ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।');
              } else {
                setError(regErr.message || 'কিছু ভুল হয়েছে।');
              }
            }
          } else if (err.code === 'auth/wrong-password') {
            setError('ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।');
          } else if (err.code === 'auth/too-many-requests') {
            setError('অনেক বেশি চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।');
          } else {
            setError(err.message || 'কিছু ভুল হয়েছে।');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'কিছু ভুল হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Top bar: Back button + Logo ── */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border/60">
        <Link
          to="/"
          className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-dotted border-border/70 bg-background hover:border-primary/50 hover:bg-muted active:scale-95 transition-all duration-150"
        >
          <ArrowLeft size={15} className="text-muted-foreground" />
        </Link>

        <img
          src="/icon.png"
          alt={settings.appName}
          className="h-7 object-contain"
          onError={e => { (e.target as HTMLImageElement).src = '/logo.jpg'; }}
        />

        {/* Spacer to keep logo centered */}
        <div className="w-9" />
      </div>

      {/* ── Center form area ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-sm mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.form
            key={isReset ? 'reset' : 'auth'}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">ইমেইল</label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  autoComplete="email"
                  className={[
                    'flex h-11 w-full rounded-xl border-2 border-dotted bg-background',
                    'pl-9 pr-3 text-sm outline-none transition-all duration-200',
                    'border-border/70 hover:border-primary/50',
                    'focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.12)]',
                    'placeholder:text-muted-foreground/60',
                  ].join(' ')}
                />
              </div>
            </div>

            {/* Password field (hidden in reset mode) */}
            {!isReset && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">পাসওয়ার্ড</label>
                  <button
                    type="button"
                    onClick={() => { setIsReset(true); setError(''); setSuccess(''); }}
                    className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    Forget Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    minLength={6}
                    required
                    autoComplete="current-password"
                    className={[
                      'flex h-11 w-full rounded-xl border-2 border-dotted bg-background',
                      'pl-9 pr-10 text-sm outline-none transition-all duration-200',
                      'border-border/70 hover:border-primary/50',
                      'focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.12)]',
                      'placeholder:text-muted-foreground/60',
                    ].join(' ')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* Error / Success messages */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-destructive bg-destructive/8 border border-destructive/20 rounded-xl px-3 py-2.5"
                >
                  {error}
                </motion.p>
              )}
              {success && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-green-600 bg-green-500/8 border border-green-500/20 rounded-xl px-3 py-2.5"
                >
                  {success}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Terms (shown in login/register mode only) */}
            {!isReset && (
              <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                Continue করলে আপনি আমাদের{' '}
                <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>{' '}
                ও{' '}
                <Link to="/terms" className="underline underline-offset-2 hover:text-primary transition-colors">
                  Terms
                </Link>{' '}
                মেনে নিচ্ছেন।
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : isReset ? (
                'রিসেট লিংক পাঠান'
              ) : (
                'Register / Login'
              )}
            </button>

            {/* Back to login (reset mode only) */}
            {isReset && (
              <button
                type="button"
                onClick={() => { setIsReset(false); setError(''); setSuccess(''); }}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft size={12} /> লগইনে ফিরে যান
              </button>
            )}

          </motion.form>
        </AnimatePresence>
      </div>

    </div>
  );
}
