import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../context/ThemeContext"
import ThemeSelector from "./ThemeSelector"
import Popup from "./Popup"
import AuthContext from "../context/AuthContext"
import Projects from "./Projects"
import { axiosJwt } from "../api/axios"
import { convertToOpenAPI, getCookie, getCurrentProject, removeCookie } from "../utils/utils"

export default function NavBar({ setLogin, projects, setTabs, setProjects, setCurrentTab, saveProject, newProject, setCollaborators, setRenameProject, setDeleteProject }) {
    const navigate = useNavigate()
    const { theme } = useContext(ThemeContext)
    const { user, logout, isLoading } = useContext(AuthContext)
    const [showProfile, setShowProfile] = useState(false)
    const [projectName, setProjectName] = useState()
    const [profile, setProfile] = useState(null)
    const [profileLoading, setProfileLoading] = useState(false)
    const profileRef = useRef(null)

    useEffect(() => {
        const currentProject = getCurrentProject(projects)
        if (!currentProject) return;
        setProjectName(currentProject?.projectName || "Untitled")
    }, [projects])

    useEffect(() => {
        const theme = document.querySelector('#theme')
        theme.animate([{ transform: 'rotate(60deg)' }, { transform: 'rotate(0deg)' }], { duration: 200, iterations: 1 })
    }, [theme])

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false)
            }
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setShowProfile(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [])

    useEffect(() => {
        if (!showProfile) return

        const authToken = localStorage.getItem("token") || localStorage.getItem("accessToken") || getCookie("auth")

        if (!authToken && !getCookie("auth")) {
            redirectToLogin()
            return
        }

        setProfileLoading(true)
        axiosJwt.get('/auth/me', authToken ? {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        } : undefined)
            .then(res => {
                setProfile(res.data || null)
            })
            .catch(err => {
                if (err?.response?.status === 401 || err?.response?.status === 403 || err?.code === "ERR_CANCELED") {
                    logoutUser(true)
                    return
                }

                setProfile({
                    username: user?.username || "",
                    email: user?.email || ""
                })
            })
            .finally(() => setProfileLoading(false))
    }, [showProfile])

    function redirectToLogin() {
        setShowProfile(false)
        navigate('/login')
    }

    function logoutUser(shouldRedirect = false) {
        setTabs([])
        setShowProfile(false)
        setProjects([])
        setProjectName("Untitled")
        setProfile(null)

        localStorage.removeItem("state")
        localStorage.removeItem("lastActiveProject")
        localStorage.removeItem("token")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        removeCookie('auth')
        removeCookie('ref')

        Promise.resolve(logout && logout()).finally(() => {
            if (shouldRedirect || true) {
                navigate('/login')
            }
        })
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

    const displayName = profile?.username || user?.username || "User"
    const displayEmail = profile?.email || user?.email || "No email available"
    const displayRole = profile?.role || user?.role

    return (
        <div className="h-[7svh] flex justify-between py-9 gap-6 items-center px-2 dark:text-zinc-400">
            {user && <div className="flex gap-5 items-center">
                <Popup collapsible title={<div className="flex items-center justify-center gap-1 px-3"><div className="dark:text-zinc-400 duration-150 hover:text-zinc-200 text-zinc-700 text-xl">{projectName}</div><span className="material-symbols-outlined">keyboard_arrow_down</span></div>}>
                    <Projects projects={projects} setProjectName={setProjectName} setTabs={setTabs} setCurrentTab={setCurrentTab} newProject={newProject} />
                </Popup>

                <button onClick={saveProject} className="dark:hover:text-zinc-200 dark:text-zinc-400"><span className="material-symbols-outlined text-2xl">save</span></button>
                <span onClick={() => setCollaborators(true)} className="material-symbols-outlined dark:text-zinc-400 flex text-2xl dark:hover:text-zinc-200 cursor-pointer">settings</span>

                <button onClick={exportProject}><span className="material-symbols-outlined text-2xl dark:hover:text-zinc-200 dark:text-zinc-400">file_export</span></button>
            </div>}

            {!user && <div></div>}

            <div className="flex gap-6 items-center select-none">
                {user && <div className="text-lg">Hello, {user.username}</div>}
                {!isLoading && !user && <button onClick={() => setLogin(true)} className="font-semibold px-3 py-4 flex items-center text-lg hover:text-zinc-400 duration-150">Login</button>}
                {!isLoading && user && <div ref={profileRef} className="flex flex-col items-center relative">
                    <div className="dark:hover:text-white dark:hover:border-white duration-150 rounded-full border-2 dark:border-zinc-400 border-gray-800 text-xl h-9 w-9 flex items-center justify-center cursor-pointer bg-white/5 backdrop-blur-md" onClick={() => setShowProfile(!showProfile)}>
                        {displayName[0]?.toUpperCase() || "U"}
                    </div>

                    {showProfile && <div className="mt-3 px-4 dark:border-zinc-700/80 border-zinc-300/70 shadow-2xl border rounded-2xl py-4 dark:bg-zinc-900/70 bg-white/80 backdrop-blur-xl z-50 absolute right-0 top-full min-w-[280px] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-white/5 to-violet-400/10 pointer-events-none"></div>

                        <div className="relative flex items-center gap-3 border-b dark:border-zinc-800/80 border-zinc-200/80 pb-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-[#021224] font-bold flex items-center justify-center text-lg shadow-lg">
                                {displayName[0]?.toUpperCase() || "U"}
                            </div>

                            <div className="min-w-0">
                                <p className="font-semibold text-zinc-800 dark:text-white truncate">{profileLoading ? "Loading..." : displayName}</p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-300 truncate">{profileLoading ? "Fetching profile..." : displayEmail}</p>
                                {displayRole && <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">{displayRole}</p>}
                            </div>
                        </div>

                        <div className="relative py-4 space-y-3">
                            <div className="rounded-xl border dark:border-zinc-800/80 border-zinc-200/80 dark:bg-white/5 bg-white/40 px-3 py-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-1">Username</p>
                                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 break-words">{profileLoading ? "Loading..." : displayName}</p>
                            </div>

                            <div className="rounded-xl border dark:border-zinc-800/80 border-zinc-200/80 dark:bg-white/5 bg-white/40 px-3 py-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-1">Email</p>
                                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 break-all">{profileLoading ? "Loading..." : displayEmail}</p>
                            </div>
                        </div>

                        <div className="relative flex flex-col gap-2">
                            <button onClick={() => { navigate('/profile'); setShowProfile(false) }} className="hover:text-cyan-500 dark:hover:text-cyan-300 duration-150 w-full flex items-center gap-2 p-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/10 text-left">
                                <span className="material-symbols-outlined">account_circle</span>
                                <p>Profile</p>
                            </button>
                            <button onClick={() => logoutUser()} className="hover:text-rose-500 dark:hover:text-rose-300 duration-150 w-full flex items-center gap-2 p-3 rounded-xl hover:bg-rose-500/10 text-left">
                                <span className="material-symbols-outlined">logout</span>
                                <p>Logout</p>
                            </button>
                        </div>
                    </div>}
                </div>}
                <Popup title={<span id="theme" className="material-symbols-outlined dark:text-zinc-400 text-zinc-700 hover:text-black text-2xl dark:hover:text-zinc-200">{theme == 'dark' ? 'dark_mode' : 'light_mode'}</span>}>
                    <ThemeSelector />
                </Popup>
            </div>
        </div>
    )
}