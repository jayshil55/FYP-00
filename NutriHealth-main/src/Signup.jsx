import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { loading, signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!formData.email) {
      nextErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      await signup(formData.email, formData.password);
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (error) {
      setErrors({ form: error.message });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--nc-paper-warm)] p-4 sm:p-6 lg:flex-row lg:p-8">
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
            Create your health account
            <span className="mt-1 block text-[var(--nc-green)]">Start your personalized health journey</span>
          </h2>
          <p className="mx-auto max-w-md leading-relaxed text-[var(--nc-muted)] lg:mx-0">Create an account to keep your reports, nutrition preferences, and health goals together.</p>
        </div>

        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row lg:mb-0">
          <div className="flex items-center gap-2 text-xs text-[var(--nc-muted)]">
            <ShieldCheck className="h-4 w-4 text-[var(--nc-green)]" />
            <span>Secure sign-in</span>
          </div>
          <div className="hidden items-center gap-2 text-xs text-[var(--nc-muted)] sm:flex">
            <div className="h-2 w-2 rounded-full bg-[var(--nc-green-light)]" />
            <span>Nutrition &amp; lab insights</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--nc-muted)]">
            <HeartPulse className="h-4 w-4 text-[var(--nc-green)]" />
            <span>AI-powered analysis</span>
          </div>
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
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--nc-ink-light)]" htmlFor="name">Full name</label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--nc-muted-light)] transition-colors group-focus-within:text-[var(--nc-green)]">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-paper-warm)] py-3.5 pl-12 pr-4 text-sm text-[var(--nc-ink)] placeholder:text-[var(--nc-muted-light)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--nc-green)]/40"
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>
          </div>

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
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-2xl border bg-[var(--nc-paper-warm)] py-3.5 pl-12 pr-4 text-sm text-[var(--nc-ink)] placeholder:text-[var(--nc-muted-light)] transition-all focus:outline-none focus:ring-2 ${errors.email ? 'border-[var(--nc-error)]/30 focus:ring-[var(--nc-error)]/40' : 'border-[var(--nc-line)] focus:ring-[var(--nc-green)]/40'}`}
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="flex items-center gap-1.5 text-xs text-[var(--nc-error)]">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--nc-ink-light)]" htmlFor="password">Password</label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--nc-muted-light)] transition-colors group-focus-within:text-[var(--nc-green)]">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-2xl border bg-[var(--nc-paper-warm)] py-3.5 pl-12 pr-12 text-sm text-[var(--nc-ink)] placeholder:text-[var(--nc-muted-light)] transition-all focus:outline-none focus:ring-2 ${errors.password ? 'border-[var(--nc-error)]/30 focus:ring-[var(--nc-error)]/40' : 'border-[var(--nc-line)] focus:ring-[var(--nc-green)]/40'}`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--nc-muted-light)] transition-colors hover:text-[var(--nc-green)]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="flex items-center gap-1.5 text-xs text-[var(--nc-error)]">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--nc-ink-light)]" htmlFor="confirmPassword">Confirm password</label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--nc-muted-light)] transition-colors group-focus-within:text-[var(--nc-green)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full rounded-2xl border bg-[var(--nc-paper-warm)] py-3.5 pl-12 pr-12 text-sm text-[var(--nc-ink)] placeholder:text-[var(--nc-muted-light)] transition-all focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-[var(--nc-error)]/30 focus:ring-[var(--nc-error)]/40' : 'border-[var(--nc-line)] focus:ring-[var(--nc-green)]/40'}`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--nc-muted-light)] transition-colors hover:text-[var(--nc-green)]"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="flex items-center gap-1.5 text-xs text-[var(--nc-error)]">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.form && (
            <p className="flex items-center gap-1.5 text-xs text-[var(--nc-error)]">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.form}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--nc-green)] px-6 py-4 text-base font-bold text-white shadow-xl shadow-[var(--nc-green)]/25 transition-all disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : (
              <>
                <span>Create account</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-xs text-[var(--nc-muted)]">
          Already have an account?
          <Link to="/login" className="font-semibold text-[var(--nc-green)] underline-offset-4 hover:underline">
            Sign in
          </Link>
        </div>

        <div className="mt-6 border-t border-[var(--nc-line)] pt-4">
          <div className="flex items-center justify-center gap-2 text-xs text-[var(--nc-muted)]">
            <ShieldCheck className="h-4 w-4 text-[var(--nc-green)]" />
            <span>Sign in securely with your account</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}