import React, { useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { axiosJwt } from '../api/axios';
import { translateOutput, getLanguage } from '../utils/translator';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cls } from '../utils/cls';
import { motion } from 'framer-motion';
import Layout from './layout/Layout';

const MethodSelect = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  >
    <option>GET</option>
    <option>POST</option>
    <option>PUT</option>
    <option>PATCH</option>
    <option>DELETE</option>
  </select>
);

const ModernDashboard = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { user } = useContext(AuthContext);

  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState({ 'Content-Type': 'application/json' });
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contentType, setContentType] = useState('application/json');

  const runProxy = async () => {
    setLoading(true);
    try {
      const proxyReq = {
        url,
        method,
        headers,
        body
      };
      const res = await axiosJwt.post('/api/proxy', proxyReq);
      setResponse(res.data);
      setContentType(res.headers?.['content-type'] || 'text/plain');
    } catch (err) {
      setResponse({ error: err.response?.data || err.message });
      setContentType('text/plain');
    } finally {
      setLoading(false);
    }
  };

  const prettyResponse = response?.error ? JSON.stringify(response, null, 2) : translateOutput(JSON.stringify(response), contentType);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-4">
              Proxy Playground
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Bypass CORS with backend proxy. Test APIs securely with syntax-highlighted responses.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Playground Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50 p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-blue-500">code</span>
                Request
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50 dark:bg-slate-900/50 text-lg"
                    placeholder="https://api.example.com/endpoint"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Method</label>
                    <MethodSelect value={method} onChange={setMethod} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Headers (JSON)</label>
                  <textarea
                    value={JSON.stringify(headers, null, 2)}
                    onChange={(e) => {
                      try {
                        setHeaders(JSON.parse(e.target.value));
                      } catch {}
                    }}
                    className="w-full h-24 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-vertical font-mono text-sm"
                    placeholder='{"Content-Type": "application/json"}'
                  />
                </div>

                {method !== 'GET' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Body</label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full h-32 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-vertical font-mono"
                      placeholder="Raw JSON, form data, etc."
                    />
                  </div>
                )}

                <button
                  onClick={runProxy}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Proxying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined">rocket_launch</span>
                      Send Request
                    </span>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Response Right - Proxy View */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50 p-8"
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-emerald-500">check_circle</span>
                Response
              </h2>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : response ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Status: <span className="font-mono bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-full text-emerald-800 dark:text-emerald-200">200 OK</span></span>
                    <span className="text-slate-600 dark:text-slate-400">Type: <span className="font-mono capitalize">{contentType.split(';')[0]}</span></span>
                  </div>
                  <div className="h-96 bg-slate-900/50 rounded-2xl p-4 overflow-auto">
                    <SyntaxHighlighter
                      language={getLanguage(contentType)}
                      style={tomorrow}
                      customStyle={{ margin: 0, borderRadius: '1rem' }}
                      codeTagProps={{ style: { fontSize: '14px' } }}
                    >
                      {prettyResponse}
                    </SyntaxHighlighter>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-6xl mb-4 opacity-50">preview</span>
                  <p className="text-lg mb-2">Proxy response will appear here</p>
                  <p className="text-sm">Click "Send Request" to test external APIs</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ModernDashboard;
