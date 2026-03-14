import { useState, useEffect } from "react";
import cls from '../utils/cls';

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

const RENDER_BASE_URL = "https://rest-api-ecosystem-backend.onrender.com/api/dashboard";

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
    { id: "logs", label: "Logs", icon: ActivityIcon },
    { id: "wiki", label: "Learning Wiki", icon: BookOpenIcon, href: "/learn" }
  ];

  return (
    <div className={cls("min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-all duration-300")}>
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,200,140,0.1),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(100,150,200,0.05),transparent)]" />
      </div>

      {/* Sidebar */}
      <aside className={cls(
        "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 transition-all duration-300 md:block",
        sidebarCollapsed && "w-16"
      )}>
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500">
            <ZapIcon />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">REST API</span>
              <span className="text-xs text-slate-500">Ecosystem</span>
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
              <item.icon />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="m-3 flex items-center justify-center rounded-lg py-2 text-slate-500 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </aside>

      {/* Main */}
      <main className={cls(
        "min-h-screen pt-16 transition-all md:ml-64",
        sidebarCollapsed && "md:ml-16"
      )}>
        <div className="p-4 md:p-6 pb-24 md:pb-6">
          <h1 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {activeSection === 'health' ? 'System Health' : activeSection === 'playground' ? 'API Playground' : 'Services'}
          </h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Monitor your API infrastructure and services in real-time
          </p>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>

          {/* Content */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {activeSection === 'playground' && <ApiPlayground playground={playground} setPlayground={setPlayground} onRun={handleRun} />}
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
      "group relative overflow-hidden rounded-xl border p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg",
      "border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-800/50 hover:border-blue-300 hover:bg-white/80 dark:hover:border-blue-500 dark:hover:bg-slate-800/80"
    )}>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className={cls(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            status === "success" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
            status === "error" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
            "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          )}>
            <Icon />
          </div>
          {trend && (
            <div className={cls(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              trend.direction === "up" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : "bg-red-100 text-red-700 dark:bg-red-900/30"
            )}>
              {trend.direction === "up" ? <TrendingUp /> : <TrendingDown />}
              {trend.value}
            </div>
          )}
        </div>
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
        {subValue && <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{subValue}</p>}
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
