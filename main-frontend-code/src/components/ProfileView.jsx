import { cls } from '../utils/cls';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';

const ProfileView = ({ user, logout }) => {
  const activityLogs = [
    { time: '1:15 PM', action: 'API Health Check', status: 'Success' },
    { time: '1:14 PM', action: 'Playground Test', status: 'Success' },
    { time: '1:12 PM', action: 'Wiki View', status: 'Success' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="overflow-hidden rounded-xl border border-slate-200/50 bg-white/5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-800/30"
    >
      <div className="border-b border-slate-200/50 bg-white/10 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/20">
        <h3 className="text-lg font-semibold text-white">User Account</h3>
        <p className="mt-1 text-sm text-cyan-200/70">Manage your profile and activity</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <User className="h-8 w-8 text-[#021224]" />
          </div>
          <div>
            <div className="text-xl font-semibold text-white">{user?.email || 'user@example.com'}</div>
            <div className="text-sm text-cyan-300/70">API Developer</div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Recent Activity</h4>
          <div className="space-y-2">
            {activityLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{log.action}</div>
                  <div className="text-xs text-cyan-300/70">{log.status}</div>
                </div>
                <div className="text-xs text-slate-400">{log.time}</div>
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 justify-center rounded-lg bg-red-600 hover:bg-red-700 px-6 py-3 text-sm font-medium text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileView;

