"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DataPoint {
    month: string;
    value: number;
}

interface DynamicLineChartProps {
    data: DataPoint[];
    color?: string;
    prefix?: string;
}

export function DynamicLineChart({ data, color = "#3b82f6", prefix = "" }: DynamicLineChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No trend data available
            </div>
        );
    }

    return (
        <div className="w-full h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                    <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700 }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700 }}
                        tickFormatter={(val) => `${prefix}${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                    />
                    <Tooltip 
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-background/90 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">{label}</p>
                                        <p className="text-lg font-black">{prefix}{(payload[0]?.value as number)?.toLocaleString() ?? '0'}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={color} 
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: color }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
