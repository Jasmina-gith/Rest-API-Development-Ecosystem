import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { setCookie } from '../utils/utils';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const displayedTextRef = useRef('');
  const timeoutRef = useRef(null);
  const words = ["Let's Build", "Let's Create", "Let's Integrate"];

  // Strict Password validation logic
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  const isPasswordValid = passwordRegex.test(password);
  const passwordsMatch = password === confirmPassword;

  useEffect(() => {
    const type = () => {
      const word = words[currentWordIndex];
      if (displayedTextRef.current.length < word.length) {
        displayedTextRef.current += word[displayedTextRef.current.length];
        setDisplayedText(displayedTextRef.current);
        timeoutRef.current = setTimeout(type, 100);
      } else {
        setIsTypingComplete(true);
        timeoutRef.current = setTimeout(deleteText, 2000);
      }
    };

    const deleteText = () => {
      if (displayedTextRef.current.length > 0) {
        displayedTextRef.current = displayedTextRef.current.slice(0, -1);
        setDisplayedText(displayedTextRef.current);
        timeoutRef.current = setTimeout(deleteText, 50);
      } else {
        setIsTypingComplete(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        timeoutRef.current = setTimeout(type, 500);
      }
    };

    type();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentWordIndex]);

  const API_URL = 'http://127.0.0.1:5000/api/auth';

  const handleAuth = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (isSignup) {
      if (!isPasswordValid) {
        setError('Password must contain at least 8 characters, 1 letter, 1 number, 1 symbol');
        return;
      }
      if (!passwordsMatch) {
        setError("Passwords don't match");
        return;
      }
      if (email.length < 3) {
        setError('Username min 3 chars');
        return;
      }
    }

    setLoading(true);
    setError('');

    const endpoint = isSignup ? '/register' : '/login';
    console.log('Sending to:', API_URL + endpoint);

    try {
      const res = await axios.post(`${API_URL}${endpoint}`, { username: email, password }, {
        timeout: 5000,
        headers: { Authorization: 'Bearer JASMINA_SECRET_2026' }
      });
      
      if (res.data.error) {
        setError(res.data.error);
        return;
      }
      
      setCookie('auth', res.data.accessToken);
      setCookie('ref', res.data.refreshToken);
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      window.location.href = '/dashboard';
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        setError('Account Verified. Redirecting...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else if (err.response?.status === 404) {
        if (err.response?.data === 'User not found') {
          setError('User not found. Please switch to Sign Up to create your account first!');
        } else {
          setError(`Error 404: Check if Backend Route matches /api/auth${endpoint}`);
        }
      } else {
        const errData = err.response?.data;
        setError(typeof errData === 'string' ? errData : (errData?.error || (isSignup ? 'Signup failed' : 'Login failed')));
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { level: 0, color: 'bg-gray-600' };
    if (!isPasswordValid) return { level: 1, color: 'bg-orange-500' };
    return { level: 2, color: 'bg-emerald-500' };
  };

  const getCanSubmitSignup = () => {
      return isPasswordValid && passwordsMatch && email && password && confirmPassword;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0ea5e9]/20 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#ec4899]/20 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], scale: [1, 0.95, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#a855f7]/20 rounded-full blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>
      
      <div className="container mx-auto px-4 py-24 max-w-md relative z-10">
        <motion.div
          className="bg-white/5 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 shadow-2xl ring-1 ring-gradient-to-r from-cyan-400/30 to-pink-400/30 shadow-[0_0_60px_rgba(14,165,233,0.15),0_0_60px_rgba(236,72,153,0.15)]"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              {displayedText}
              {!isTypingComplete && (
                <motion.span
                  className="inline-block w-px bg-gradient-to-b from-cyan-400 to-pink-400 h-10 ml-2"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </h1>
            <p className="text-slate-300 text-lg font-light">
              The professional ecosystem for REST API development.
            </p>
          </div>

          <div className="flex bg-white/5 backdrop-blur-xl rounded-xl p-1 mb-8 border border-white/10">
            <button
              type="button"
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all backdrop-blur-sm ${!isSignup ? 'bg-white/20 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              onClick={() => { setError(''); setIsSignup(false); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all backdrop-blur-sm ${isSignup ? 'bg-white/20 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              onClick={() => { setError(''); setIsSignup(true); }}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isSignup ? 'signup' : 'login'}
              onSubmit={handleAuth}
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {error && (
                <div className="bg-red-500/15 border border-red-500/40 text-red-200 px-5 py-4 rounded-2xl backdrop-blur-sm text-center font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Username or Email"
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-b border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-[#00f5ff] transition-all duration-300 text-lg"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-12 pr-14 py-4 bg-transparent border-b border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-[#00f5ff] transition-all duration-300 text-lg"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00f5ff] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Password strength</span>
                    </div>
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((index) => {
                        const strength = getPasswordStrength();
                        const isActive = index <= strength.level;
                        return (
                          <div
                            key={index}
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${isActive ? strength.color : 'bg-slate-700'}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {isSignup && (
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full pl-12 pr-14 py-4 bg-transparent border-b border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-[#00f5ff] transition-all duration-300 text-lg"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00f5ff] transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {confirmPassword && (
                      <span className={`text-sm mt-2 block font-medium ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                        {passwordsMatch ? 'Passwords match ✓' : 'Passwords do not match'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || (isSignup && !getCanSubmitSignup())}
                className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 shadow-[0_0_30px_rgba(14,165,233,0.4)] hover:shadow-[0_0_50px_rgba(14,165,233,0.5)] active:scale-[0.98]"
              >
                <div className="flex items-center justify-center gap-2">
                  {loading && <Loader2 className="h-6 w-6 animate-spin" />}
                  <span>{loading ? (isSignup ? 'Creating account...' : 'Signing in...') : (isSignup ? 'Create Account' : 'Sign In')}</span>
                </div>
              </button>
            </motion.form>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
