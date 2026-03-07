import Method from "../components/Method";
import { request } from "../utils/request";
import Popup from "../components/Popup"
import { useEffect, useState, useRef } from "react"
import { parseJson, parseKeyValPairs, updateState } from "../utils/utils";
import { cls } from "../utils/cls";
import KeyValue from './KeyValue'
import Body from "./Body";
import ContentType from "./ContentType";

export default function Request({ tabId, displayResponse, setProxy, proxy, updateTabs }) {

    const [ active, setActive ] = useState("Body")
    const [ method, setMethod ] = useState("GET")
    const [ url, setUrl ] = useState("")
    const [ body, setBody ] = useState()

    const [ headers, setHeaders ] = useState([])
    const [ parameters, setParameters ] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)
    const [ controller, setController ] = useState()

    const [ content, setContent ] = useState()
    const [ isLoadingPage, setIsLoadingPage ] = useState(true)

    // 3. Clipboard & Developer Productivity - Copy URL tooltip ref
    const copyUrlRef = useRef(null)
    const [showCopyTooltip, setShowCopyTooltip] = useState(false)

    useEffect(() => {
        const { method, url, body, content, headers, parameters } = getTabState()
        setIsLoadingPage(false)
        
        setMethod(method || "GET")
        setUrl(url || "")
        setBody(body || "")
        setHeaders(headers || [])
        setParameters(parameters || [])
        setContent(content || "application/json")
    }, [tabId])

    
    useEffect(() => {
        if (isLoadingPage) return;

        saveTabState()
    }, [method, url, body, content, headers, parameters])
    
    async function sendRequest() {
        let input = url.trim()
        if(!input) {
            setUrl("")
            return;
        }
        
        if(!input.startsWith("http://") && !input.startsWith("https://")) input = "https://" + url;
        setUrl(input)
        const reqHeaders = { ...parseKeyValPairs(headers), 'content-type': content }
        const reqParams = parseKeyValPairs(parameters)
        setIsLoading(true)

        const controller = new AbortController()
        setController(controller)

        const savedTabId = tabId
        const response = await request(input, method, body, reqHeaders, reqParams, controller, proxy).finally(() => setIsLoading(false))
        if (!response.ok && response.error?.name == "AbortError") return;

        displayResponse(savedTabId, response)
    }

    function saveTabState() {
        if (!tabId) return;
        
        updateState(({ tabs }) => {
            let found = false
            tabs = tabs.map(item => {
                if (item.tabId === tabId) {
                    found = true
                    item = { ...item, method, url, body, content, headers, parameters }
                }
                return item
            })
            
            if(!found) tabs.push({ tabId, method, url, body, content, headers, parameters });
            return { tabs }
        })

        updateTabs()
    }

    function getTabState() {
        const { data } = parseJson(localStorage.getItem("state"))
        if (!data) return {};
        
        return data.tabs?.find(item => item?.tabId==tabId) || {}
    }

    function handleButtonClick() {
        if(!isLoading) {
            sendRequest()
        } else {
            abortRequest()
        }
    }

    function handleKeyBinding(evt) {
        if(evt.code=='Enter') {
            sendRequest()
        }
    }

    function abortRequest() {
        if(!controller){
            console.error("Couldn't find controller")
            return;
        }
        controller.abort()
        setIsLoading(false)
    }

    // 3. Clipboard & Developer Productivity - Copy URL function
    async function copyUrl() {
        if (!url) return;
        
        try {
            await navigator.clipboard.writeText(url)
            setShowCopyTooltip(true)
            setTimeout(() => setShowCopyTooltip(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    // SaaS-Grade UI styling
    const methodButton =<div className="py-2 px-4 rounded-lg dark:hover:bg-zinc-800 duration-200 dark:border-zinc-600 border-zinc-300 border-[1px] flex flex-col justify-center w-28 bg-zinc-800/50 font-medium">{method}</div>
    const contentType =<div className="dark:text-zinc-400 rounded-sm dark:hover:bg-zinc-800 duration-200 flex gap-2 items-center justify-center bg-zinc-800/50 px-3 py-2 text-sm">{content}<span className="material-symbols-outlined">arrow_drop_down</span></div>
    
    return (
        <div className="w-fit px-6 mt-4 border-r-[1px] border-white/10">
            <div className="flex gap-3 mb-4">
                <Popup collapsible title={methodButton}>
                    <Method setMethod={setMethod}/>
                </Popup>
                <div className="relative flex items-center">
                    <input 
                        onChange={(evt) => setUrl(evt.target.value)} 
                        value={url} 
                        onKeyDown={handleKeyBinding} 
                        type="text" 
                        placeholder="Enter request URL"
                        className="rounded-lg text-sm py-2.5 w-[520px] dark:border-zinc-700 outline-none px-4 border border-white/10 dark:bg-zinc-900/60 bg-zinc-100/50 text-zinc-200 placeholder-zinc-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    />
                    {/* 3. Clipboard & Developer Productivity - Copy URL Button */}
                    {url && (
                        <div className="relative">
                            <button 
                                onClick={copyUrl}
                                className="absolute right-12 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-zinc-800 transition-all duration-200"
                                title="Copy URL"
                            >
                                <span className="material-symbols-outlined text-lg dark:text-zinc-500 dark:hover:text-zinc-300">content_copy</span>
                            </button>
                            {showCopyTooltip && (
                                <div className="absolute -top-8 right-10 bg-emerald-500 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                                    Copied!
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <button 
                    onClick={handleButtonClick} 
                    disabled={!url?.trim()} 
                    className="font-medium rounded-lg py-2.5 px-6 text-white border border-transparent bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all shadow-lg shadow-cyan-500/20"
                >
                    {isLoading ? "Cancel" : "Send"}
                </button>
            </div>
            <div className="flex text-sm dark:text-zinc-400 justify-between border-b border-white/10 pb-2">
                <div className="flex gap-1">
                    <button onClick={()=> setActive("Parameters")} className={cls("mx-3 py-2 px-2 rounded-lg hover:bg-zinc-800 transition-all duration-200",(active=="Parameters")&&"bg-zinc-800 text-cyan-400")}>Parameters</button>
                    <button onClick={()=> setActive("Body")} className={cls("mx-3 py-2 px-2 rounded-lg hover:bg-zinc-800 transition-all duration-200",(active=="Body")&&"bg-zinc-800 text-cyan-400")}>Body</button>
                    <button onClick={()=> setActive("Headers")} className={cls("mx-3 py-2 px-2 rounded-lg hover:bg-zinc-800 transition-all duration-200",(active=="Headers")&&"bg-zinc-800 text-cyan-400")}>Headers</button>
                </div>
                <div className="flex gap-4 mr-5 items-center">
                    <div className="flex items-center">
                        <Popup collapsible title={contentType}>
                            <ContentType setContent={setContent}/>
                        </Popup>
                    </div>
                    <div className="flex gap-2 items-center px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/5">
                        <input 
                            type="checkbox" 
                            checked={proxy || false} 
                            onChange={()=>{setProxy((proxy)=>!proxy)}}
                            className="rounded border-zinc-600 bg-zinc-800 text-cyan-500 focus:ring-cyan-500/30"
                        />
                        <label className="text-sm text-zinc-400">Proxy</label>
                    </div>
                </div>
            </div>  
            <div className="mt-4">
                {(active=="Headers")&& <KeyValue item="Headers" setEntries={setHeaders} entries={headers}/>}
                {(active=="Parameters")&& <KeyValue item="Parameters" setEntries={setParameters} entries={parameters}/>}
                {(active=="Body")&& <Body value={body} language={"json"} setValue={setBody}/>}
            </div>
        </div>
    )
}

