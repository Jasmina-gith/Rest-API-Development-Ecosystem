import React from 'react';

const ApiTester = () => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-8 text-white">
      <div className="max-w-2xl w-full bg-[#0f172a]/80 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          API Tester
        </h1>
        <p className="text-center text-lg text-cyan-200 mb-8">
          API Tester Module - Ready for integration
        </p>
        <div className="space-y-4 text-sm">
          <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
            <h3 className="font-semibold mb-2">Status</h3>
            <p>Development placeholder active. No crashes.</p>
          </div>
          <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <h3 className="font-semibold mb-2">Next Steps</h3>
            <ul className="space-y-1 text-sm">
              <li>• Build request/response panels</li>
              <li>• Connect to backend APIs</li>
              <li>• Add method/body/headers support</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex gap-4 justify-center">
          <button 
            onClick={() => window.location.href = '/pro'}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-semibold transition-all"
          >
            ← Back to Dashboard
          </button>
          <button 
            onClick={() => window.location.href = '/learn'}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all"
          >
            API Wiki
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;

