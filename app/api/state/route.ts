import { NextResponse } from "next/server";
import axios from 'axios';

export async function POST() {
    try {
        const baseUrl = process.env.API_BASE_URL || 'http://hyperverge-monitoring-alb-444601760.ap-south-1.elb.amazonaws.com';
        const response = await axios.get(
            `${baseUrl}/state`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Proxy Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to fetch state" },
            { status: error.response?.status || 500 }
        );
    }
}
