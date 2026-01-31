'use server';

import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://hyperverge-monitoring-alb-444601760.ap-south-1.elb.amazonaws.com';
const MONITOR_API_URL = `${API_BASE_URL}/monitor`;
const STATE_API_URL = `${API_BASE_URL}/state`;

export async function registerMonitor(data: any) {
    try {
        const response = await axios.post(MONITOR_API_URL, data, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000, // 10s timeout
        });

        return { success: true, data: response.data };
    } catch (error: any) {
        console.error('Register Monitor Error:', error.message);
        const errorMessage = error.response?.data?.error || error.response?.statusText || error.message || 'Failed to connect to backend';
        return { success: false, error: errorMessage };
    }
}

export async function getMonitorState() {
    try {
        const response = await axios.get(STATE_API_URL, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
            timeout: 5000
        });

        return { success: true, data: response.data };
    } catch (error: any) {
        console.error('Get State Error:', error.message);
        return { success: false, error: error.message || 'Failed to fetch state' };
    }
}
