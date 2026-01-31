'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const POLL_INTERVAL = 5000;

interface EndpointState {
    endpoint_id: string;
    URL_endpoint: string;
    health_status: string;
    healthy_threshold: number;
    failure_threshold: number;
    streak: number;
    last_checked_at: number;
    latency?: number;
}

export default function DashboardTable() {
    const [data, setData] = useState<EndpointState[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const response = await axios.post("/api/state");

            const json = response.data;
            if (Array.isArray(json)) {
                setData(json);
            } else {
                setData([]);
            }
            setError(null);
        } catch (err: any) {
            console.error('Polling error:', err);
            if (data.length === 0) setError(err.response?.data?.error || err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'HEALTHY':
                return 'bg-green-900/40 text-green-400 border border-green-500 shadow-[0_0_10px_rgba(0,255,0,0.3)]';
            case 'UNHEALTHY':
                return 'bg-red-900/40 text-red-500 border border-red-500 shadow-[0_0_10px_rgba(255,0,0,0.3)]';
            default:
                return 'bg-gray-800 text-gray-400 border border-gray-600';
        }
    };

    const formatTime = (ts: number) => {
        if (!ts) return '-';
        // Cyberpunk style time? Just standard local is fine usually.
        return new Date(ts).toLocaleTimeString();
    };

    if (loading && data.length === 0) {
        return <div className="text-center py-20 text-cyan-600 animate-pulse tracking-widest uppercase">System Initializing...</div>;
    }

    if (error && data.length === 0) {
        return <div className="text-center py-20 text-red-500 border border-red-900 bg-red-900/10 rounded">{error}</div>;
    }

    return (
        <div className="bg-slate-900/90 rounded-lg shadow-[0_0_30px_rgba(0,243,255,0.15)] border border-cyan-500/50 overflow-hidden relative">
            {/* Scanner line animation attempt - simplified */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

            <div className="flex justify-between items-center p-4 border-b border-cyan-800 bg-black/40">
                <h2 className="text-xl font-bold text-neon-blue tracking-wider uppercase flex items-center gap-2">
                    <span className="w-2 h-2 bg-neon-blue rounded-full animate-ping"></span>
                    Live Feed
                </h2>
                <span className="text-xs text-cyan-700 font-mono border border-cyan-900 px-2 py-1 rounded">REFRESH_RATE: 5000ms</span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-cyan-900">
                    <thead className="bg-black/60">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-cyan-500 uppercase tracking-widest">Target</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-cyan-500 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-cyan-500 uppercase tracking-widest">Limits (H/F)</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-cyan-500 uppercase tracking-widest">Streak</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-cyan-500 uppercase tracking-widest">Latency</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-cyan-500 uppercase tracking-widest">Last Scan</th>
                        </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-cyan-900/30">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-600 font-mono">
                                    &gt; NO SIGNAL DETECTED
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.endpoint_id} className="hover:bg-cyan-900/10 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-100 font-mono truncate max-w-xs border-l-2 border-transparent hover:border-neon-pink pl-5" title={item.URL_endpoint}>
                                        {item.URL_endpoint}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded ${getStatusColor(item.health_status)}`}>
                                            {item.health_status || 'UNKNOWN'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-600 font-mono">
                                        [{item.healthy_threshold} / {item.failure_threshold}]
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neon-pink font-mono font-bold">
                                        x{item.streak}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-300 font-mono">
                                        {item.latency !== undefined ? `${item.latency}ms` : '---'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        {formatTime(item.last_checked_at)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
