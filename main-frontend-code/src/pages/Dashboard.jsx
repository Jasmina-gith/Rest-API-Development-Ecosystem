import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { getMyProjects } from '../api/projects';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color = 'cyan' }) => {
  const colorGradients = {
    cyan: 'from-cyan-400 to-blue-500',
    pink: 'from-pink-400 to-rose-500',
    purple: 'from-purple-400 to-indigo-500',
    emerald: 'from-emerald-400 to-teal-500'
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-3xl border border-white/20 rounded-3xl p-6 shadow-2xl ring-1 ring-white/10"
    >
      <div className="flex items-center">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorGradients[color]} text-white shadow-lg`}>
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-4xl font-bold text-white mt-1">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. AUTH CHECK
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/';
      return;
    }
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      // 2. FETCH TIMEOUT GUARD
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('TIMEOUT')), 5000);
      });

      const data = await Promise.race([getMyProjects(), timeoutPromise]);
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading API projects:', error);
      
      // 4. ERROR HANDLING 401
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
      }
      
      // If TIMEOUT or any other error occurs, don't crash the UI and set empty projects
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[85vh] bg-[#020617] relative p-8 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center">
          <div className="absolute inset-0 -z-10">
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0ea5e9]/30 rounded-full blur-[100px] animate-pulse" 
            />
          </div>
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full shadow-[0_0_30px_rgba(14,165,233,0.5)]"
            />
            <p className="text-cyan-400 font-medium text-lg mt-6 animate-pulse">Synchronizing Workspace...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const recentProjects = projects.slice(0, 3);

  return (
    <Layout>
      <div className="min-h-[85vh] bg-[#020617] relative p-4 sm:p-8 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        
        {/* Glassmorphism Orbs for Dashboard background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0ea5e9]/10 rounded-full blur-[100px]"
            animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#ec4899]/10 rounded-full blur-[100px]"
            animate={{ y: [0, 20, 0], scale: [1, 0.95, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="relative z-10 space-y-10">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-2xl ring-1 ring-cyan-500/20">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 tracking-tight mb-2">
                REST API Ecosystem
              </h1>
              <p className="text-slate-300 text-lg font-light">
                Welcome back, {user?.username || user?.email || 'Architect'}. Let's Build.
              </p>
            </div>
            
            <Link
              to="/projects"
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all flex items-center justify-center gap-2 group"
            >
              <span className="material-symbols-outlined transition-transform group-hover:rotate-90">add</span>
              New Project
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Projects" value={projects.length} icon="folder" color="cyan" />
            <StatCard title="Active APIs" value={projects.filter(p => p.isActive !== false).length} icon="check_circle" color="emerald" />
            <StatCard title="Test Scenarios" value="0" icon="biotech" color="pink" />
            <StatCard title="Team Members" value="1" icon="group" color="purple" />
          </div>

          {/* Recent Projects Section */}
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl ring-1 ring-white/5">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-pink-500">history</span>
                Recent Projects
              </h2>
              <Link to="/projects" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors border-b border-transparent hover:border-cyan-400">
                View all Catalog →
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <div className="text-center py-16 bg-black/20 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10">
                  <span className="material-symbols-outlined text-5xl text-slate-500">folder_off</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Active Architecture Found</h3>
                <p className="text-slate-400 text-lg mb-8 max-w-sm">
                  Initialize your first project infrastructure to begin testing your REST services.
                </p>
                <Link
                  to="/projects"
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all"
                >
                  Configure Workspace
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={project.projectId} 
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-cyan-500/30 transition-all cursor-pointer shadow-lg"
                  >
                    <div className="flex items-center mb-4 sm:mb-0">
                      <div className="p-4 bg-cyan-500/10 rounded-xl mr-5 text-cyan-400 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">api</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-white mb-1 tracking-wide">{project.name}</h3>
                        <p className="text-sm text-slate-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          Deployed {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/api-testing?project=${project.projectId}`}
                      className="w-full sm:w-auto text-center px-8 py-3 bg-white/5 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-white font-bold rounded-xl transition-all shadow-[0_0_10px_rgba(14,165,233,0.1)] hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]"
                    >
                      Connect Interface
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
