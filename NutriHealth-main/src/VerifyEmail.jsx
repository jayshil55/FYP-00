import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Activity, AlertCircle, ArrowRight, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { confirmSignup, loading } = useAuth();
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email) return setError('Email is required');
    if (!code) return setError('Verification code is required');

    try {
      await confirmSignup(email, code);
      navigate('/');
    } catch (authError) {
      setError(authError.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--nc-paper-warm)] p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -left-10 -top-10 h-[300px] w-[300px] rounded-full bg-[var(--nc-green)]/15 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-[300px] w-[300px] rounded-full bg-[var(--nc-green-light)]/15 blur-[80px]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="w-full max-w-lg bg-[var(--nc-paper)]/95 backdrop-blur-2xl rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-2xl border border-[var(--nc-line)] relative">
        <Link to="/" className="flex items-center justify-center gap-3 cursor-pointer group mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[var(--nc-green)] flex items-center justify-center shadow-lg shadow-[var(--nc-green)]/30"><Activity className="text-white w-6 h-6" /></div>
          <div><h1 className="nc-brand text-2xl font-bold tracking-tight text-[var(--nc-ink)]">NutriCare</h1><span className="text-[10px] font-semibold text-[var(--nc-muted)] tracking-wide uppercase flex items-center gap-1">Your health workspace <Sparkles className="w-2.5 h-2.5" /></span></div>
        </Link>
        <div className="text-center mb-8"><div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--nc-mint)] flex items-center justify-center"><Mail className="w-7 h-7 text-[var(--nc-green)]" /></div><h2 className="text-3xl font-bold text-[var(--nc-ink)] mb-3">Verify your email</h2><p className="text-[var(--nc-muted)] text-sm leading-relaxed">Enter the verification code sent to your email address to activate your account.</p></div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2"><label className="block text-xs font-bold text-[var(--nc-ink-light)] uppercase tracking-wider" htmlFor="email">Email Address</label><input type="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full px-4 py-3.5 bg-[var(--nc-paper-warm)] border border-[var(--nc-line)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--nc-green)]/40 transition-all text-sm text-[var(--nc-ink)]" placeholder="name@example.com" autoComplete="email" /></div>
          <div className="space-y-2"><label className="block text-xs font-bold text-[var(--nc-ink-light)] uppercase tracking-wider" htmlFor="code">Verification Code</label><input type="text" id="code" value={code} onChange={(event) => setCode(event.target.value)} className="w-full px-4 py-3.5 bg-[var(--nc-paper-warm)] border border-[var(--nc-line)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--nc-green)]/40 transition-all text-sm text-[var(--nc-ink)]" placeholder="Enter your code" autoComplete="one-time-code" /></div>
          {error && <p className="text-xs text-[var(--nc-error)] flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
          <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.98 }} className="w-full py-4 px-6 flex items-center justify-center gap-3 text-white font-bold text-base rounded-2xl bg-[var(--nc-green)] hover:bg-[var(--nc-green-dark)] shadow-xl shadow-[var(--nc-green)]/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed">{loading ? 'Verifying...' : <><span>Verify Email</span><ArrowRight className="w-5 h-5" /></>}</motion.button>
        </form>
        <div className="mt-6 pt-4 border-t border-[var(--nc-line)]"><div className="flex items-center justify-center gap-2 text-xs text-[var(--nc-muted)]"><ShieldCheck className="w-4 h-4 text-[var(--nc-green)]" /><span>Secure account verification</span></div></div>
      </motion.div>
    </div>
  );
}
