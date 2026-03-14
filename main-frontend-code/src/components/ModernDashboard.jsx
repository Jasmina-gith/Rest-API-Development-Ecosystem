import { useState, useEffect } from "react";
import { cls } from '../utils/cls';
import { Activity, Database, Zap, Clock, User as UserIcon, Terminal, BookOpen } from 'lucide-react'


// SVG Icons (pure, no external deps)
const ClockIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DatabaseIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ZapIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.665z" />
  </svg>
);

const ChevronLeft = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const TrendingUp = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendingDown = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const CheckCircle = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircle = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BookOpenIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

// Axios for Render backend (health + playground)
import axios from 'axios';

const RENDER_BASE_URL = `${import.meta.env.VITE_API_URL}/dashboard`;

function createHealthAxios() {
  return axios.create({ baseURL: RENDER_BASE_URL });
}

export default function ModernDashboard() {
  const [activeSection, setActiveSection] = useState("health");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [healthStatus, setHealthStatus] = useState("Checking...");
  const [services, setServices] = useState([]);
  const [playground, setPlayground] = useState({
    method: "GET",
    url: "/api/health",
    body: "",
    response: null,
    loading: false
  });

  const axiosHealth = createHealthAxios();

  // Live health check
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await axiosHealth.get("/health");
        setHealthStatus(res.data.status === "UP" ? "Healthy" : res.data.status === "DOWN" ? "Down" : "Degraded");
        setServices(res.data.services || res.data.servicesStatus || [
          { name: "API Gateway", status: "operational", latency: "12ms" },
          { name: "Database", status: "operational", latency: "24ms" },
          { name: "Auth Service", status: "operational", latency: "8ms" }
        ]);
      } catch (err) {
        setHealthStatus("Down");
        setServices([{ name: "API Gateway", status: "degraded", latency: "N/A" }]);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000); // 10s poll
    return () => clearInterval(interval);
  }, []);

  // Playground Run
  const handleRun = async () => {
    setPlayground(p => ({ ...p, loading: true, response: null }));
    try {
      let res;
      if (playground.method === "GET") {
        res = await axiosHealth.get(playground.url);
      } else {
        res = await axiosHealth.post(playground.url, JSON.parse(playground.body || "{}"));
      }
      setPlayground(p => ({ ...p, response: res.data, loading: false }));
    } catch (err) {
      setPlayground(p => ({ ...p, response: err.response?.data || { error: err.message }, loading: false }));
    }
  };

  const stats = [
    {
      icon: ClockIcon,
      label: "System Health",
      value: healthStatus,
      subValue: services[0]?.latency || "N/A",
      status: healthStatus === "Healthy" ? "success" : "error",
    },
    {
      icon: DatabaseIcon,
      label: "Database Status",
      value: "Connected",
      subValue: "PostgreSQL v16.2",
      status: "success"
    },
    {
      icon: ActivityIcon,
      label: "Requests Today",
      value: "1.2M",
      subValue: "Peak: 2.4k/sec",
      status: "success",
      trend: { direction: "up", value: "8.3%" }
    },
    {
      icon: ZapIcon,
      label: "Uptime",
      value: "99.98%",
      subValue: "Last 30 days",
      status: "success"
    }
  ];

  const navItems = [
    { id: "health", label: "System Health", icon: ActivityIcon },
    { id: "playground", label: "API Playground", icon: PlayIcon },
    { id: "services", label: "Services", icon: DatabaseIcon },
{ id: "logs", label: "System Logs", icon: Terminal, href: "/logs" },

    { id: "wiki", label: "Learning Wiki", icon: BookOpenIcon, href: "/learn" }
  ];

  return (
    <div className={cls("min-h-screen bg-[#020617] text-white transition-all duration-300")}>
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_10%,rgba(6,182,212,0.06),transparent)]" />
      </div>

      {/* Sidebar */}
      <aside className={cls(
        "fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-transparent bg-[#070a12]/80 backdrop-blur-md transition-all duration-300 md:block",
        sidebarCollapsed && "w-20"
      )}>
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500 text-[#021224]">
            <ZapIcon />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Professional Dashboard</span>
                <span className="text-xs text-cyan-300/60">Production v1.0</span>

            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.href ? window.location.href = item.href : setActiveSection(item.id)}
              className={cls(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                activeSection === item.id
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              )}
            >
              <item.icon className="text-cyan-300" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4">
          <div className="mt-4 border-t border-slate-800 pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center text-[#021224]">
                <UserIcon />
              </div>
              <div>
                <div className="text-sm font-semibold">Jasmina Joshy T</div>
                <div className="text-xs text-cyan-300/60">Product</div>
              </div>
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="mt-3 w-full rounded-md py-2 text-sm bg-[#0f172a] border border-cyan-700/20 text-cyan-200"
            >
              {sidebarCollapsed ? 'Expand' : 'Collapse'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className={cls(
        "min-h-screen pt-16 transition-all md:ml-72",
        sidebarCollapsed && "md:ml-20"
      )}>
        <div className="p-6 md:p-8 pb-24 md:pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-semibold">{activeSection === 'health' ? 'System Health' : activeSection === 'playground' ? 'API Playground' : 'Services'}</h1>
              <p className="text-sm text-cyan-300/60">Monitor your API infrastructure and services</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">Jasmina Joshy T</div>
                <div className="text-xs text-cyan-300/60">Production Environment</div>

              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3 my-8">
            {stats.slice(0,3).map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {activeSection === 'playground' && <ApiPlayground playground={playground} setPlayground={setPlayground} onRun={handleRun} />}
              {/* Activity table placeholder */}
              <div className="rounded-xl border border-transparent bg-[#0f172a] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Recent Activity</h3>
                </div>
                <div className="mt-3 text-xs text-cyan-200/80">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-cyan-300/60">
                        <th className="py-2">Time</th>
                        <th className="py-2">Event</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-[#021224]">
                        <td className="py-2">12:04</td>
                        <td className="py-2">GET /api/health</td>
                        <td className="py-2 text-cyan-300">200 OK</td>
                      </tr>
                      <tr className="border-t border-[#021224]">
                        <td className="py-2">11:59</td>
                        <td className="py-2">POST /api/run</td>
                        <td className="py-2 text-amber-400">202</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <SystemHealth services={services} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subValue, status, trend }) {
  return (
    <div className={cls(
      "group relative overflow-hidden rounded-xl border p-5 transition-all duration-300",
      "border-transparent bg-[#0f172a] hover:shadow-[0_8px_30px_rgba(6,182,212,0.06)]"
    )}>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className={cls(
            "flex h-10 w-10 items-center justify-center rounded-lg bg-[#071226] text-cyan-300"
          )}>
            <Icon />
          </div>
          {trend && (
            <div className={cls(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-cyan-300"
            )}>
              {trend.direction === "up" ? <TrendingUp /> : <TrendingDown />}
              {trend.value}
            </div>
          )}
        </div>
        <p className="mt-3 text-sm font-medium text-cyan-200">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
        {subValue && <p className="mt-1 text-xs text-cyan-300/70">{subValue}</p>}
      </div>
    </div>
  );
}

function ApiPlayground({ playground, setPlayground, onRun }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/50 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-800/50">
      <div className="flex items-center justify-between border-b border-slate-200/50 bg-white/30 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/30">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">API Playground</h3>
        <div className="flex items-center gap-2 text-xs text-slate-500">Live connection to Render backend</div>
      </div>
      <div className="p-4 space-y-4">
        {/* Method & URL */}
        <div className="flex gap-2">
          <select
            value={playground.method}
            onChange={(e) => setPlayground(p => ({ ...p, method: e.target.value }))}
            className="flex-0 w-20 rounded border border-slate-200 px-2 py-1 text-sm bg-white dark:bg-slate-800 dark:border-slate-700"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <input
            value={playground.url}
            onChange={(e) => setPlayground(p => ({ ...p, url: e.target.value }))}
            placeholder="/api/health"
            className="flex-1 rounded border border-slate-200 px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Body */}
        {playground.method !== "GET" && (
          <textarea
            value={playground.body}
            onChange={(e) => setPlayground(p => ({ ...p, body: e.target.value }))}
            placeholder='{"key": "value"}'
            rows={3}
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
          />
        )}
        {/* Run Button */}
        <button
          onClick={onRun}
          disabled={playground.loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <PlayIcon />
          {playground.loading ? "Running..." : "Run Request"}
        </button>
        {/* Response */}
        {playground.response && (
          <div className="pt-4 border-t border-slate-200/50">
            <pre className={cls(
              "rounded-lg p-4 overflow-auto text-xs",
              "bg-slate-900 text-emerald-400 border border-slate-700/50"
            )}>
              {JSON.stringify(playground.response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function SystemHealth({ services }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "operational": return "bg-emerald-400";
      case "degraded": return "bg-yellow-400";
      case "down": return "bg-red-400";
      default: return "bg-slate-400";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/50 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-800/50">
      <div className="border-b border-slate-200/50 bg-white/30 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/30">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Service Status</h3>
      </div>
      <div className="p-4 space-y-3 max-h-96 overflow-auto">
        {services.map((service, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{service.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{service.description || "Core service"}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={cls("h-3 w-3 rounded-full", getStatusColor(service.status))} />
              <span className="text-sm font-medium text-slate-900 dark:text-white">{service.status}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{service.latency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
