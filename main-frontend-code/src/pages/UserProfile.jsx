import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { cls } from '../utils/cls';
import { Loader2, User, Edit, Save, Calendar, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editingName, setEditingName] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    let channel = supabase
      .channel('activity_logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_logs',
          filter: `user_id=eq.${user?.id || ''}`
        },
        (payload) => {
          fetchActivityLogs(payload.new.user_id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        setFullName(supabaseUser.user_metadata?.full_name || '');
        fetchActivityLogs(supabaseUser.id);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('action_type, description, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setActivityLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setActivityLogs([]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName.trim(),
        },
      });
      if (error) throw error;
      import { logAction } from '../utils/activity';
      await logAction('Profile Update', `User changed their display name to "${fullName.trim()}"`);
      setEditingName(false);
    } catch (error) {
      console.error('Update error:', error.message);
      alert(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#020617] to-black p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-12 text-center"
        >
          User Profile
        </motion.h1>

        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl"
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <User className="h-12 w-12 text-white drop-shadow-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Welcome back!</h2>
              <p className="text-cyan-200/80 text-lg">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <label className="text-white font-semibold min-w-[120px]">Full Name</label>
              {editingName ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-cyan-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur transition-all"
                    placeholder="Enter full name"
                  />
                  <motion.button
                    type="submit"
                    disabled={updating || !fullName.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg flex items-center gap-2 transition-all"
                  >
                    {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>{updating ? 'Saving...' : 'Save'}</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setEditingName(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl shadow-lg transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              ) : (
                <div className="flex-1 flex items-center gap-4">
                  <span className="text-xl font-semibold text-white">{fullName || 'No name set'}</span>
                  <motion.button
                    onClick={() => setEditingName(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg flex items-center gap-1 transition-all"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </motion.button>
                </div>
              )}
            </div>
          </form>
        </motion.div>

        {/* Activity Logs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <Activity className="h-8 w-8 text-cyan-400" />
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Activity Logs
            </h3>
          </div>

          {activityLogs.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <p className="text-xl text-slate-400">No activity logs found</p>
              <p className="text-slate-500">Your actions will appear here</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-4">
              {activityLogs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group bg-slate-800/50 hover:bg-slate-700/50 p-6 rounded-xl border border-slate-700/50 transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-3 w-3 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-lg">{log.action_type}</span>
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">
                          Success
                        </span>
                      </div>
                      <p className="text-cyan-200/90 mb-2 leading-relaxed">{log.description}</p>
                      <p className="text-sm text-slate-400">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;

