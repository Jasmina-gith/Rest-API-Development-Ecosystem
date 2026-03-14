import React from 'react';
import { cls } from '../utils/cls';
import { Terminal, ChevronLeft } from 'lucide-react';

const SystemLogs = () => {
  const logs = [
    { time: '12:41 PM', level: 'INFO', service: 'API Gateway', message: 'Health check passed - 200 OK' },
    { time: '12:40 PM', level: 'WARN', service: 'Database', message: 'Connection pool low - 3 active' },
    { time: '12:39 PM', level: 'INFO', service: 'Auth', message: 'JWT refreshed for user jasmi@company.com' },
    { time: '12:38 PM', level: 'ERROR', service: 'Proxy', message: 'Timeout on external call to proxy.target' },
    { time: '12:37 PM', level: 'INFO', service: 'Projects', message: 'Project #42 forked successfully' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => window.location.href = '/pro'}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ChevronLeft className="h-4 w-4" />
          Return to Dashboard
        </button>
      </div>

      {/* Logs Container */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-[rgba(15,23,42,0.8)] border border-slate-800 rounded-2xl backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Terminal className="h-6 w-6 text-green-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">System Logs</h1>
                <p className="text-sm text-slate-400">Real-time production logs</p>
              </div>
            </div>
            <div className="flex gap-2 text-sm">
              <button className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">1h</button>
              <button className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">24h</button>
              <button className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors font-semibold">Live</button>
            </div>
          </div>

          {/* Logs List */}
          <div className="max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="p-4 border-b border-slate-800 hover:bg-slate-900/50 transition-colors last:border-b-0">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-24 text-xs text-slate-500">{log.time}</div>
                  <div className={cls(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    log.level === 'INFO' ? 'bg-green-900/50 text-green-400 border border-green-500/30' :
                    log.level === 'WARN' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30' :
                    'bg-red-900/50 text-red-400 border border-red-500/30'
                  )}>
                    {log.level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-slate-300 font-medium">{log.service}</span>
                    </div>
                    <p className="text-sm text-slate-200 break-words">{log.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;

