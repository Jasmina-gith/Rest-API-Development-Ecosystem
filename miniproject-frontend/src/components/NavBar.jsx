import { useContext, useEffect, useState, useRef } from "react"
import { ThemeContext } from "../context/ThemeContext"
import ThemeSelector from "./ThemeSelector"
import Popup from "./Popup"
import AuthContext from "../context/AuthContext"
import Projects from "./Projects"
import { convertToOpenAPI, getCurrentProject } from "../utils/utils"
import AuditLogs from "./AuditLogs"

export default function NavBar({ setLogin, projects, setTabs, setProjects, setCurrentTab, saveProject, newProject, setCollaborators, setRenameProject, setDeleteProject }) {

    const { theme } = useContext(ThemeContext)
    const { user, logout, isLoading } = useContext(AuthContext)
    const [ showProfile ,setShowProfile ] = useState(false)
    const [ projectName, setProjectName ] = useState()
    const [ showAuditLogs, setShowAuditLogs ] = useState(false)
    
    // 1. Infrastructure Health & Monitoring - System Status State
    const [ healthStatus, setHealthStatus ] = useState({ status: 'CHECKING', db: '...', latency: '...' })
    const [ isHealthLoading, setIsHealthLoading ] = useState(true)
    const healthCheckRef = useRef(null)

    useEffect(() => {
        // 1. Infrastructure Health & Monitoring - Health Check Function
        async function checkHealth() {
            setIsHealthLoading(true)
            const start = performance.now()
            try {
                const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000'
                const response = await fetch(`${baseURL}/api/health`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })
                const data = await response.json()
                const latency = Math.round(performance.now() - start)
                
                setHealthStatus({
                    status: data.status || 'UNKNOWN',
                    db: data.db || 'UNKNOWN',
                    latency: `${latency}ms`
                })
            } catch (error) {
                setHealthStatus({
                    status: 'DOWN',
                    db: 'ERROR',
                    latency: '0ms'
                })
            } finally {
                setIsHealthLoading(false)
            }
        }

        // Initial health check
        checkHealth()

        // Set up periodic health checks every 30 seconds
        healthCheckRef.current = setInterval(checkHealth, 30000)

        return () => {
            if (healthCheckRef.current) {
                clearInterval(healthCheckRef.current)
            }
        }
    }, [])

    useEffect(() => {
        const currentProject = getCurrentProject(projects)
        if (!currentProject) return;
        setProjectName(currentProject?.projectName || "Untitled")
    }, [projects])
    
    useEffect(() => {
        const theme = document.querySelector('#theme')
        theme.animate([ { transform: 'rotate(60deg)' }, { transform: 'rotate(0deg)' } ], { duration: 200, iterations: 1 })
    }, [theme])

    function logoutUser() {
        setTabs([])
        setShowProfile(false)
        setProjects([])
        setProjectName("Untitled")

        localStorage.removeItem("state")
        localStorage.removeItem("lastActiveProject")
        logout()
    }

    function exportProject() {
        const type = 'application/json'
        const tabs = JSON.parse(localStorage.getItem("state")).tabs
        const downloadData = new Blob([convertToOpenAPI(tabs)], { type });
        const url = URL.createObjectURL(downloadData);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${projectName}.json`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Helper function to get status badge color with glow effect
    function getStatusColor(status) {
        if (status === 'UP') return 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]'
        if (status === 'DOWN') return 'bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.6)]'
        return 'bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.6)]'
    }

    // Helper function to get DB status color
    function getDbColor(db) {
        if (db === 'CONNECTED') return 'text-emerald-400'
        if (db === 'DISCONNECTED') return 'text-rose-400'
        return 'text-yellow-400'
    }

    // Shimmer animation for loading state
    const shimmerKeyframes = `
        @keyframes shimmer {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
        }
    `

   return (
        <>
            <style>{shimmerKeyframes}</style>
            <div className="h-[7svh] flex justify-between py-9 gap-6 items-center px-6 dark:text-zinc-300 bg-zinc-950/80 backdrop-blur-md border-b border-white/10">
                {showAuditLogs && <AuditLogs onClose={() => setShowAuditLogs(false)} />}
                
                {user && <div className="flex gap-4 items-center">
                    <Popup collapsible title={
                        <div className="flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-white/10 transition-all duration-200 hover:scale-[1.02]">
                            <div className="dark:text-zinc-200 text-zinc-700 font-medium">{projectName}</div>
                            <span className="material-symbols-outlined text-xl">keyboard_arrow_down</span>
                        </div>
                    }>
                        <Projects projects={projects} setProjectName={setProjectName} setTabs={setTabs} setCurrentTab={setCurrentTab} newProject={newProject} />
                    </Popup>

                    <button onClick={saveProject} className="p-2 rounded-lg hover:bg-zinc-800 transition-all duration-200 hover:scale-105 dark:hover:text-zinc-200 dark:text-zinc-400">
                        <span className="material-symbols-outlined text-2xl">save</span>
                    </button>
                    <span onClick={() => setCollaborators(true)} className="p-2 rounded-lg hover:bg-zinc-800 transition-all duration-200 hover:scale-105 material-symbols-outlined dark:text-zinc-400 flex text-2xl dark:hover:text-zinc-200 cursor-pointer">settings</span>

                    {/* 4. Audit Log Intelligence - Button to open Audit Logs */}
                    <button 
                        onClick={() => setShowAuditLogs(true)} 
                        className="p-2 rounded-lg hover:bg-zinc-800 transition-all duration-200 hover:scale-105 dark:hover:text-zinc-200 dark:text-zinc-400"
                        title="Audit Logs"
                    >
                        <span className="material-symbols-outlined text-2xl">history</span>
                    </button>

                    <button onClick={exportProject} className="p-2 rounded-lg hover:bg-zinc-800 transition-all duration-200 hover:scale-105">
                        <span className="material-symbols-outlined text-2xl dark:hover:text-zinc-200 dark:text-zinc-400">file_export</span>
                    </button>
                </div>}

                {!user && <div></div> }

                <div className="flex gap-6 items-center select-none">
                    {/* 1. Infrastructure Health & Monitoring - System Status Badge with Glassmorphism */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 backdrop-blur-md border border-white/10 shadow-lg">
                        {/* Shimmer loading effect */}
                        {isHealthLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-cyan-400" style={{ animation: 'shimmer 1.5s infinite' }}></div>
                                <span className="text-xs font-medium text-cyan-400">Checking...</span>
                            </div>
                        ) : (
                            <>
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(healthStatus.status)}`}></div>
                                <span className="text-xs font-medium">System:</span>
                                <span className={`text-xs font-bold ${getDbColor(healthStatus.db)}`}>{healthStatus.db}</span>
                                <span className="text-xs text-zinc-600">|</span>
                                <span className="text-xs text-zinc-400">Latency: {healthStatus.latency}</span>
                            </>
                        )}
                    </div>
                    
                    {user && <div className="text-lg font-medium">Hello, {user.username}</div>}
                    {!isLoading && !user && <button onClick={()=>setLogin(true)} className="font-semibold px-4 py-2 flex items-center text-lg hover:text-cyan-400 duration-150 hover:scale-105 transition-all rounded-lg hover:bg-zinc-800">Login</button>}
                    {!isLoading && user && <div className="flex flex-col items-center">
                        <div onClick={()=>setShowProfile(!showProfile)} className="p-1 dark:hover:text-white hover: dark:hover:border-cyan-400 duration-150 rounded-full border-2 dark:border-zinc-600 border-gray-800 text-xl h-10 w-10 flex items-center justify-center cursor-pointer bg-gradient-to-br from-cyan-500 to-violet-600 text-white font-bold shadow-lg hover:scale-105 transition-all">{user?.username[0].toUpperCase()}</div>
                        {showProfile && <div className="mt-14 px-4 py-3 dark:border-zinc-700 border-zinc-400 shadow-xl border-[1px] rounded-xl py-4 w-fit dark:bg-zinc-900/90 bg-slate-200/90 backdrop-blur-md z-50 absolute">
                           <button onClick={logoutUser} className="hover:text-rose-400 duration-150 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800/50 w-full"><span className="material-symbols-outlined">logout</span><p>Logout</p></button> 
                        </div>}
                    </div>}
                    <Popup title={<span id="theme" className="material-symbols-outlined dark:text-zinc-400 text-zinc-700 hover:text-cyan-400 text-2xl dark:hover:text-zinc-200 hover:scale-110 transition-all duration-200">{ theme=='dark' ? 'dark_mode' : 'light_mode'}</span>}>
                        <ThemeSelector/>
                    </Popup>
                </div>
            </div>
        </>
    )
}
