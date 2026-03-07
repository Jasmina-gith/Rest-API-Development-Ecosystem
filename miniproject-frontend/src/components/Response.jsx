import { useEffect, useRef, useState } from "react";
import Editor from "../components/Editor";
import { cls } from "../utils/cls";

export default function Response({ response }) {

    const [ extension, setExtension ] = useState("txt")
    const [ showResponse, setShowResponse ] = useState("response")
    const [headers, setHeaders] = useState();
    const [ time, setTime ] = useState()
    const [showCopyTooltip, setShowCopyTooltip] = useState(false)
    
    const copyMessage = useRef()

    useEffect(()=>{
        setHeaders(response.headers)
    },[response])           

    function download() {
        if (!response?.headers) return;

        const contentType = response?.headers['content-type']
        const type = contentType?.split(';')[0].trim() || 'text/plain'
        const downloadData = new Blob([response.data], { type });
        const url = URL.createObjectURL(downloadData);

        const link = document.createElement('a');
        link.href = url;
        link.download = `response.${extension}`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 3. Clipboard & Developer Productivity - Enhanced copy with JSON formatting
    async function copy() {
        let textToCopy = response.data;
        
        // Try to parse and format as JSON for better readability
        try {
            if (typeof response.data === 'string') {
                const parsed = JSON.parse(response.data);
                textToCopy = JSON.stringify(parsed, null, 2);
            } else if (typeof response.data === 'object') {
                textToCopy = JSON.stringify(response.data, null, 2);
            }
        } catch (e) {
            // If parsing fails, use original data
            textToCopy = response.data;
        }
        
        navigator.clipboard.writeText(textToCopy)
        .then(() => {
            setShowCopyTooltip(true)
            setTimeout(() => setShowCopyTooltip(false), 2000)
        })
    }
    
    useEffect(() => {
        if (!response.headers) return;
        const contentType = response?.headers['content-type']
        const type = contentType?.split(';')[0].trim() || 'text/plain'
        const ext = type == 'application/json' ? 'json' : type =='text/html' ? 'html' : 'txt'
        setExtension(ext)
    }, [response])

    // 2. Professional Response Handling & Formatting - Get status badge color (Pill style)
    function getStatusBadgeColor(statusCode) {
        if (!statusCode) return 'bg-gray-500/20';
        if (statusCode >= 200 && statusCode < 300) return 'bg-emerald-500/20'; // Green for 2xx
        if (statusCode >= 400 && statusCode < 500) return 'bg-yellow-500/20';  // Yellow for 4xx
        if (statusCode >= 500) return 'bg-rose-500/20';                         // Red for 5xx
        return 'bg-gray-500/20';
    }

    // 2. Professional Response Handling & Formatting - Get status text color
    function getStatusTextColor(statusCode) {
        if (!statusCode) return 'text-gray-400';
        if (statusCode >= 200 && statusCode < 300) return 'text-emerald-400';
        if (statusCode >= 400 && statusCode < 500) return 'text-yellow-400';
        if (statusCode >= 500) return 'text-rose-400';
        return 'text-gray-400';
    }

    // 2. Professional Response Handling & Formatting - Format data for display
    function getFormattedData() {
        if (!response.data) return '';
        
        try {
            if (typeof response.data === 'string') {
                const parsed = JSON.parse(response.data);
                return JSON.stringify(parsed, null, 2);
            }
            return JSON.stringify(response.data, null, 2);
        } catch (e) {
            return response.data;
        }
    }

    return (
        <div className="pl-10 pt-4 w-full">
            {!response.error && 
            <div className="flex flex-col gap-1">
                {/* 2. Professional Response Handling & Formatting - Dynamic Status Badge (Pill Style) */}
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold select-none dark:text-zinc-400">Status</span>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusBadgeColor(response.statusCode)} border border-white/10`}>
                        <span className={cls("text-xs font-bold", getStatusTextColor(response.statusCode))}>
                            {response.statusCode}
                        </span>
                        <span className={cls("text-xs", getStatusTextColor(response.statusCode))}>
                            {response.statusText}
                        </span>
                    </div>
                    <span className="px-3 text-xs dark:text-zinc-500">{response.time && `${response.time} ms`}</span>
                </div>
                
                {/* SaaS-Grade Tab Navigation */}
                <div className="text-sm dark:text-zinc-400 mt-4 border-b border-white/10 pb-2">
                    <button onClick={()=>setShowResponse("response")}className={cls("mx-2 py-2 px-3 rounded-lg hover:bg-zinc-800 transition-all duration-200",(showResponse=="response")&&"bg-zinc-800 text-cyan-400")}>Response</button>
                    <button onClick={()=>setShowResponse("headers")}className={cls("mx-2 py-2 px-3 rounded-lg hover:bg-zinc-800 transition-all duration-200",(showResponse=="headers")&&"bg-zinc-800 text-cyan-400")}>Headers</button>
                </div>
                {showResponse=="response" && <div className="flex flex-col justify-between mt-4">
                    <div className="flex items-center gap-3 select-none justify-end mb-2">
                        <div className="flex-col relative">
                            <span onClick={copy} className="dark:text-zinc-500 text-xl dark:hover:text-cyan-400 duration-200 cursor-pointer material-symbols-outlined hover:scale-110 transition-all">content_copy</span>
                            {/* 3. Clipboard & Developer Productivity - Copy tooltip */}
                            {showCopyTooltip && (
                                <div className="absolute -top-8 right-0 bg-emerald-500 text-white text-xs px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
                                    Copied!
                                </div>
                            )}
                        </div>
                        <span onClick={download} className="dark:text-zinc-500 dark:hover:text-cyan-400 duration-200 cursor-pointer material-symbols-outlined hover:scale-110 transition-all">download</span>
                    </div>
                    {/* 2. Professional Response Handling & Formatting - Syntax Highlighting */}
                    <Editor value={getFormattedData()} language={extension} readOnly width="700px" height="450px"/>
                </div>}
                {showResponse=="headers" && <div className="flex flex-col justify-between mt-4">
                    <p className="mt-3 mb-3 text-xs font-bold border-b border-white/10 py-2 px-2 dark:text-zinc-400">Headers List</p>
                    {headers && Object.keys(headers).map((item)=>
                    <div className="flex gap-3 text-xs my-2">
                        <div className="font-semibold dark:text-zinc-300 border border-white/10 px-3 py-2 bg-zinc-900/50 rounded-lg w-[40%]">{item}</div>
                        <div className="border border-white/10 dark:text-zinc-400 px-3 py-2 bg-zinc-900/50 rounded-lg w-[80%]">{headers[item]}</div>
                    </div>)}
                </div>}

            </div>}

            {response.error &&
            <div className="flex justify-center items-center text-3xl text-gray-600 gap-3 h-[60%]">
                <span className="font-bold">Error:</span><span>{response.error?.message || "Unable to fetch endpoint"} :&#40;</span>
            </div>
            }
        </div>
    )
}

