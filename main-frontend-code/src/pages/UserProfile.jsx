import { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Mail, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { axiosJwt } from '../api/axios';
import { getCookie } from '../utils/utils';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fallbackProfile = useMemo(
    () => ({
      username: user?.username || 'User',
      email: user?.email || 'No email available',
      role: user?.role || 'USER',
    }),
    [user]
  );

  useEffect(() => {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      getCookie('auth');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    setLoadingProfile(true);

    axiosJwt
      .get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfile(res.data || fallbackProfile);
      })
      .catch(() => {
        if (user) {
          setProfile(fallbackProfile);
          return;
        }

        navigate('/login', { replace: true });
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  }, [fallbackProfile, navigate, user]);

  if (isLoading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#020617] to-black">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  const displayProfile = profile || fallbackProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#020617] to-black p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              User Profile
            </h1>
            <p className="mt-2 text-cyan-200/75">
              Your account overview for the professional workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/pro')}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl backdrop-blur-xl"
        >
          <div className="border-b border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 text-[#031425] shadow-xl">
                <User className="h-10 w-10" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  {displayProfile.username || 'User'}
                </h2>
                <p className="mt-1 text-cyan-200/80">
                  Manage your account details and stay in flow.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-8 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="mb-3 flex items-center gap-3 text-cyan-300">
                <User className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                  Username
                </span>
              </div>
              <p className="break-words text-lg font-semibold text-white">
                {displayProfile.username || 'User'}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="mb-3 flex items-center gap-3 text-cyan-300">
                <Mail className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                  Email
                </span>
              </div>
              <p className="break-all text-lg font-semibold text-white">
                {displayProfile.email || 'No email available'}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="mb-3 flex items-center gap-3 text-cyan-300">
                <Shield className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                  Role
                </span>
              </div>
              <p className="text-lg font-semibold text-white">
                {displayProfile.role || 'USER'}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 px-8 py-6">
            <p className="text-sm text-cyan-200/70">
              Use the profile button in the dashboard sidebar/top bar to quickly view these details without leaving your current work context.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
