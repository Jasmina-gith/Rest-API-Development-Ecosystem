import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';
import axios from 'axios';

const words = ["Let's build.", "Let's explore.", "Let's integrate.", "Let's create."];

export default function LoginPage() {
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
      const res = await axios.post('http://localhost:5000/api/auth/login', { username: email, password });
      if (!res?.data) {
        console.error('No response data from login');
        setError('Server Offline');
        return;
      }
      if (res.data.error) {
        setError(res.data.error);
        return;
      }
      if (!res.data.accessToken || !res.data.refreshToken) {
        console.error('No tokens received:', res.data);
        setError('No tokens received from server');
        return;
      }
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      window.location.href = '/dashboard';
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
      const res = await axios.post('http://localhost:5000/api/auth/register', { username: email, password });
      if (!res?.data) {
        console.error('No response data from register');
        setError('Server Offline');
        return;
      }
      if (res.data.error) {
        setError(res.data.error);
        return;
      }
      if (!res.data.accessToken || !res.data.refreshToken) {
        console.error('No tokens received:', res.data);
        setError('No tokens received from server');
        return;
      }
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      window.location.href = '/dashboard';
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
          Let's Build, Let's Create
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
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34,211,238,0.4)' }}
          whileTap={{ scale: 0.95 }}
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
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34,197,94,0.4)' }}
          whileTap={{ scale: 0.95 }}
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
    <motion.div
      key="login"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-md mx-auto bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
    >
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400">Sign in to your account</p>
      </motion.div>

      <motion.form
        onSubmit={handleLogin}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {error && (
          <motion.div
            className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent backdrop-blur-sm"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent backdrop-blur-sm"
              required
            />
          </div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center justify-center gap-3">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </div>
        </motion.button>
      </motion.form>

      <motion.div
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={() => setStep('selection')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Back to selection
        </button>
      </motion.div>
    </motion.div>
  );

  const renderSignup = () => (
    <motion.div
      key="signup"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="max-w-md mx-auto bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
    >
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2">Join The Amazing Interface</h2>
        <p className="text-gray-400">Create your account</p>
      </motion.div>

      <motion.form
        onSubmit={handleSignup}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {error && (
          <motion.div
            className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent backdrop-blur-sm"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent backdrop-blur-sm"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent backdrop-blur-sm"
              required
            />
          </div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center justify-center gap-3">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </div>
        </motion.button>
      </motion.form>

      <motion.div
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={() => setStep('selection')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Back to selection
        </button>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-3xl max-h-3xl bg-gradient-to-tr from-cyan-500/50 via-purple-500/30 to-blue-500/40 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      </div>
      <div className="container mx-auto px-4 py-24 max-w-4xl relative z-10">
        <AnimatePresence mode="wait">
          {step === 'selection' && renderSelection()}
          {step === 'login' && renderLogin()}
          {step === 'signup' && renderSignup()}
        </AnimatePresence>
      </div>
    </div>
  );
}
