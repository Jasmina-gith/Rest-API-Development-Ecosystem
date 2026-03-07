import { useState, useEffect, useCallback } from "react";
import { getAuditLogs } from "../api/logs";
import { cls } from "../utils/cls";

// Slide-in animation keyframes
const slideInKeyframes = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;

export default function AuditLogs({ onClose }) {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionFilter, setActionFilter] = useState("");
    
    // 4. Audit Log Intelligence - Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce the search term (wait 500ms after user stops typing)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch logs when filters change (including debounced search)
    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const filters = {
                user: debouncedSearch,
                action: actionFilter,
                limit: 100
            };
            const data = await getAuditLogs(filters);
            setLogs(data);
        } catch (error) {
            console.error("Failed to fetch audit logs:", error);
            setLogs([]);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, actionFilter]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // Get unique actions for filter dropdown
    const uniqueActions = [...new Set(logs.map(log => log.action).filter(Boolean))];

    return (
        <>
            <style>{slideInKeyframes}</style>
            <div className="flex h-svh w-full justify-center items-center bg-black/70 backdrop-blur-sm absolute z-50">
                {/* SaaS-Grade Modal with Glassmorphism and Slide-in Animation */}
                <div 
                    className="border border-white/10 w-[900px] dark:bg-zinc-900/90 bg-white/95 backdrop-blur-xl h-[85%] rounded-2xl flex flex-col py-6 px-6 gap-4 shadow-2xl"
                    style={{ animation: 'slideIn 0.3s ease-out' }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <h2 className="text-xl font-bold dark:text-zinc-100 text-zinc-800 flex items-center gap-2">
                            <span className="material-symbols-outlined text-cyan-400">history</span>
                            Audit Logs
                        </h2>
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-lg dark:text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 duration-200"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Search and Filter Bar - SaaS Style */}
                    <div className="flex gap-3">
                        {/* 4. Audit Log Intelligence - Search Input */}
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-500">search</span>
                            <input
                                type="text"
                                placeholder="Search by username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-white/10 dark:bg-zinc-800/60 dark:text-zinc-200 px-10 py-2.5 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all bg-zinc-100/50"
                            />
                        </div>
                        
                        {/* Action Filter Dropdown */}
                        <select
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                            className="rounded-xl border border-white/10 dark:bg-zinc-800/60 dark:text-zinc-200 px-4 py-2.5 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all bg-zinc-100/50 min-w-[180px]"
                        >
                            <option value="">All Actions</option>
                            {uniqueActions.map(action => (
                                <option key={action} value={action}>{action}</option>
                            ))}
                        </select>
                    </div>

                    {/* Loading State - SaaS Style */}
                    {isLoading && (
                        <div className="flex justify-center items-center h-40">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-zinc-500">Loading logs...</span>
                            </div>
                        </div>
                    )}

                    {/* Logs Table - SaaS Style */}
                    {!isLoading && (
                        <div className="flex-1 overflow-y-auto rounded-xl border border-white/10">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 dark:bg-zinc-800/80 bg-zinc-50 backdrop-blur-md">
                                    <tr className="text-left">
                                        <th className="px-4 py-3 font-semibold dark:text-zinc-400 text-zinc-600">Timestamp</th>
                                        <th className="px-4 py-3 font-semibold dark:text-zinc-400 text-zinc-600">Action</th>
                                        <th className="px-4 py-3 font-semibold dark:text-zinc-400 text-zinc-600">User</th>
                                        <th className="px-4 py-3 font-semibold dark:text-zinc-400 text-zinc-600">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-12 text-center text-zinc-500">
                                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                                                <p>No audit logs found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.map((log, index) => (
                                            <tr key={index} className="border-b border-white/5 dark:border-zinc-800 hover:bg-cyan-500/5 transition-colors">
                                                <td className="px-4 py-3 dark:text-zinc-400 text-zinc-600 font-mono text-xs">
                                                    {log.created_at ? new Date(log.created_at).toLocaleString() : '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={cls(
                                                        "px-3 py-1 rounded-full text-xs font-medium border",
                                                        log.action?.includes('CREATE') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        log.action?.includes('DELETE') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                        log.action?.includes('UPDATE') ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                        'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                                                    )}>
                                                        {log.action || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 dark:text-zinc-300 text-zinc-700">{log.username || '-'}</td>
                                                <td className="px-4 py-3 dark:text-zinc-500 text-zinc-600 max-w-xs truncate text-xs">
                                                    {log.details ? (() => {
                                                        try {
                                                            return JSON.stringify(JSON.parse(log.details), null, 2).substring(0, 100);
                                                        } catch {
                                                            return log.details;
                                                        }
                                                    })() : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer with count - SaaS Style */}
                    <div className="flex justify-between items-center text-xs text-zinc-500 pt-2 border-t border-white/10">
                        <span>Showing {logs.length} log entries</span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            Live
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

