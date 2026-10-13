import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Activity, AlertCircle, ArrowRight, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { loading, forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--nc-paper-warm)] p-4 sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute -left-10 -top-10 h-[300px] w-[300px] rounded-full bg-[var(--nc-green)]/15 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-[300px] w-[300px] rounded-full bg-[var(--nc-green-light)]/15 blur-[80px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md rounded-[2rem] border border-[var(--nc-line)] bg-[var(--nc-paper)] p-8 shadow-2xl"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--nc-green)] text-white shadow-lg shadow-[var(--nc-green)]/30">
            <Mail className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-[var(--nc-ink)]" style={{ fontFamily: 'var(--nc-font-display)' }}>Check your email</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--nc-muted)]">
            We've sent a password reset link to {email}. Please check your inbox and follow the instructions to reset your password.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/login"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--nc-green)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--nc-green)]/25 transition-all hover:bg-[var(--nc-green-dark)]"
            >
              <span>Back to sign in</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setSuccess(false)}
              className="text-sm text-[var(--nc-muted)] underline-offset-4 hover:underline"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--nc-paper-warm)] p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -left-10 -top-10 h-[300px] w-[300px] rounded-full bg-[var(--nc-green)]/15 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-[300px] w-[300px] rounded-full bg-[var(--nc-green-light)]/15 blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex w-full flex-col items-center justify-center px-4 text-center lg:w-1/2 lg:items-start lg:px-0 lg:text-left"
      >
        <div className="mb-8 lg:mb-12">
          <Link to="/" className="group flex cursor-pointer items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--nc-green)] shadow-lg shadow-[var(--nc-green)]/30 transition-all group-hover:shadow-[var(--nc-green)]/50">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--nc-ink)] lg:text-3xl" style={{ fontFamily: 'var(--nc-font-display)' }}>NutriCare</h1>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--nc-green)]">
                AI healthcare platform <Sparkles className="h-2.5 w-2.5" />
              </span>
            </div>
          </Link>
        </div>

        <div className="mb-8 lg:mb-12">
          <h2 className="mb-4 text-3xl font-bold leading-tight text-[var(--nc-ink)] sm:text-4xl">
            Forgot your password?
            <span className="mt-1 block text-[var(--nc-green)]">Let's get you back in</span>
          </h2>
          <p className="mx-auto max-w-md leading-relaxed text-[var(--nc-muted)] lg:mx-0">Enter your email address and we'll send you a link to reset your password.</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="w-full rounded-[2rem] border border-[var(--nc-line)] bg-[var(--nc-paper)]/95 p-6 shadow-2xl backdrop-blur-2xl lg:w-1/2 sm:p-8 lg:p-10"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--nc-ink-light)]" htmlFor="email">Email address</label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--nc-muted-light)] transition-colors group-focus-within:text-[var(--nc-green)]">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-2xl border bg-[var(--nc-paper-warm)] py-3.5 pl-12 pr-4 text-sm text-[var(--nc-ink)] placeholder:text-[var(--nc-muted-light)] transition-all focus:outline-none focus:ring-2 ${error ? 'border-[var(--nc-error)]/30 focus:ring-[var(--nc-error)]/40' : 'border-[var(--nc-line)] focus:ring-[var(--nc-green)]/40'}`}
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-[var(--nc-error)]">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--nc-green)] px-6 py-4 text-base font-bold text-white shadow-xl shadow-[var(--nc-green)]/25 transition-all disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Sending reset link...' : (
              <>
                <span>Send reset link</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-xs text-[var(--nc-muted)]">
          Remember your password?
          <Link to="/login" className="font-semibold text-[var(--nc-green)] underline-offset-4 hover:underline">
            Sign in
          </Link>
        </div>

        <div className="mt-6 border-t border-[var(--nc-line)] pt-4">
          <div className="flex items-center justify-center gap-2 text-xs text-[var(--nc-muted)]">
            <ShieldCheck className="h-4 w-4 text-[var(--nc-green)]" />
            <span>Secure sign-in with your account</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}