import { cls } from '../utils/cls';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';

const ProfileView = ({ user, logout }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="overflow-hidden rounded-xl border border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-2xl dark:border-slate-700/50 dark:bg-slate-800/80"
    >
      <div className="p-4 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-sm text-white">person</span>
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white text-sm">User: {user?.username || 'Unknown'}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 capitalize">Role: {user?.role || 'User'}</div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 justify-center rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2 text-xs font-medium text-white transition-all shadow-sm hover:shadow-md"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Logout
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileView;

