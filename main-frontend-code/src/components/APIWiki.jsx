import React from 'react';
import { cls } from '../utils/cls';

// SVG Icons (consistent with ModernDashboard - pure SVG, no lucide-react)
const GlobeIcon = () => (
  <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TerminalIcon = () => (
  <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138A3.42 3.42 0 0012 21a3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946A3.42 3.42 0 019 4.697z" />
  </svg>
);

const BookOpenIcon = () => (
  <svg className="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const APIWiki = () => {
  const topics = [
    {
      title: "REST Architecture",
      icon: GlobeIcon,
      desc: "REpresentational State Transfer. It uses standard HTTP methods to interact with data objects.",
      details: ["Stateless: Each request contains all info needed.", "Cacheable: Improves performance.", "Client-Server: Separates UI from Data."]
    },
    {
      title: "HTTP Methods",
      icon: TerminalIcon,
      desc: "The 'verbs' of the internet that tell the server what to do.",
      details: ["GET: Fetch data", "POST: Create new records", "PUT: Update existing data", "DELETE: Remove records"]
    },
    {
      title: "JWT Authentication",
      icon: ShieldIcon,
      desc: "JSON Web Tokens are used to securely transmit information between parties as a JSON object.",
      details: ["Header: Algorithm type", "Payload: User data/permissions", "Signature: Ensures the token isn't faked"]
    },
    {
      title: "API Endpoints",
      icon: BookOpenIcon,
      desc: "Our ecosystem's core endpoints for building and testing APIs.",
      details: ["/pro: Live monitoring dashboard", "/projects: CRUD operations", "/auth: Secure login", "/api/dashboard: Health & stats"]
    }
  ];

  return (
    <div className={cls("min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8")}>
      {/* Background pattern */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.1),transparent)]" />
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300 mb-4">
            API Learning Wiki
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Master the fundamentals of REST APIs, HTTP methods, authentication, and our ecosystem
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {topics.map((topic, i) => (
            <div key={i} className={cls(
              "group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-md p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-300 dark:border-slate-800/50 dark:bg-slate-800/60",
              "hover:bg-white/90 dark:hover:bg-slate-800/80"
            )}>
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0 p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-blue-200/50 dark:border-blue-800/50">
                  {topic.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{topic.title}</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{topic.desc}</p>
                </div>
              </div>
              
              <ul className="space-y-2">
                {topic.details.map((detail, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex-shrink-0" />
                    <span className="text-sm">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-emerald-500/50 hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Ready to build? Start a new project!
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIWiki;

