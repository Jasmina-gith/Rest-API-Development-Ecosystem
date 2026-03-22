import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';
import { axiosJwt } from '../api/axios';

const words = ["Let's build.", "Let's explore.", "Let's integrate.", "Let's create."];

export default function FixedLoginPage() {
  const [step, setStep] = useState('selection');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  const displayedTextRef = useRef('');
  const wordIndexRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const type = () => {
      const word = words[wordIndexRef.current];
      if (displayedTextRef.current.length < word.length) {
        displayedTextRef.current += word[displayedTextRef.current.length];
        setDisplayedText(displayedTextRef.current);
        timeoutRef.current = setTimeout(type, 80);
      } else {
        timeoutRef.current = setTimeout(deleteText, 1200);
      }
    };

    const deleteText = () => {
      if (displayedTextRef.current.length > 0) {
        displayedTextRef.current = displayedTextRef.current.slice(0, -1);
        setDisplayedText(displayedTextRef.current);
        timeoutRef.current = setTimeout(deleteText, 40);
      } else {
        wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
        timeoutRef.current = setTimeout(type, 200);
      }
    };

    type();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      await axiosJwt.post('/auth/login', { username: email, password });
      window.location.href = '/pro';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (email.length < 3) {
      setError('Email min 3 chars');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axiosJwt.post('/auth/register', { username: email, password });
      window.location.href = '/pro';
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const renderSelection = () => (
    <motion.div
      key="selection"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center space-y-8"
    >
      <motion.div
        className="space-y-4 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          Welcome to REST-API Ecosystem
        </h1>

        <motion.p
          className="text-2xl md:text-3xl font-bold text-white tracking-tight min-h-10"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {displayedText}
        </motion.p>

        <motion.div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-cyan-400 to-blue-500"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="space-y-4"
      >
        <motion.button
          className="w-full py-6 px-8 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-2 border-cyan-500/40 text-xl font-bold text-white backdrop-blur-xl shadow-2xl hover:shadow-[0_20px_40px_rgba(34,211,238,0.3)] transition-all duration-300 hover:from-cyan-500/40 hover:to-purple-500/40 hover:border-cyan-400/70 ring-1 ring-cyan-500/30 group"
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34,211,238,0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setError('');
            setStep('login');
          }}
        >
          <div className="flex items-center justify-center gap-3">
            Log In
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>

        <motion.button
          className="w-full py-6 px-8 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-green-500/20 border-2 border-emerald-500/40 text-xl font-bold text-white backdrop-blur-xl shadow-2xl hover:shadow-[0_20px_40px_rgba(34,197,94,0.3)] transition-all duration-300 hover:from-emerald-500/40 hover:to-green-500/40 hover:border-emerald-400/70 ring-1 ring-emerald-500/30 group"
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34,197,94,0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setError('');
            setStep('signup');
          }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </motion.div>
  );

  const renderLogin = () => (
    <motion.form
      key="login"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      onSubmit={handleLogin}
      className="space-y-6"
    >
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setError('');
          setStep('selection');
        }}
        className="flex items-center text-sm text-cyan-300 hover:text-cyan-200 p-2 rounded-lg hover:bg-white/10 transition-all"
      >
        ← Back
      </motion.button>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-cyan-200/80">Sign in to your account</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-cyan-200">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
            <input
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 backdrop-blur transition-all hover:border-white/30"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-cyan-200">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 backdrop-blur transition-all hover:border-white/30"
              required
            />
          </div>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-200 text-sm"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-lg shadow-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-2xl hover:-translate-y-px"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Signing In
          </>
        ) : (
          'Sign In'
        )}
      </motion.button>
    </motion.form>
  );

  const renderSignup = () => (
    <motion.form
      key="signup"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      onSubmit={handleSignup}
      className="space-y-6"
    >
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setError('');
          setStep('selection');
        }}
        className="flex items-center text-sm text-emerald-300 hover:text-emerald-200 p-2 rounded-lg hover:bg-white/10 transition-all"
      >
        ← Back
      </motion.button>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-emerald-200/80">Start building with your workspace</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-emerald-200">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 backdrop-blur transition-all hover:border-white/30"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-emerald-200">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 backdrop-blur transition-all hover:border-white/30"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-emerald-200">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 backdrop-blur transition-all hover:border-white/30"
              required
            />
          </div>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-200 text-sm"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-lg shadow-xl bg-gradient-to-r from-emerald-500 to-green-500 text-black hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-2xl hover:-translate-y-px"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Creating Account
          </>
        ) : (
          'Create Account'
        )}
      </motion.button>
    </motion.form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#020617] to-black p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="p-8 rounded-3xl bg-white/5 border border-white/20 backdrop-blur-xl shadow-2xl hover:shadow-[0_25px_50px_rgba(6,182,212,0.15)] transition-all duration-500 ring-1 ring-cyan-500/20">
          <AnimatePresence mode="wait">
            {step === 'selection' && renderSelection()}
            {step === 'login' && renderLogin()}
            {step === 'signup' && renderSignup()}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-xs text-cyan-300/50">
          By continuing you accept the production terms of service.
        </p>
      </motion.div>
    </div>
  );
}
