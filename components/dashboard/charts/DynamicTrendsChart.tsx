"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DataPoint {
    month: string;
    value: number;
}

interface DynamicTrendsChartProps {
    data: DataPoint[];
    title: string;
    color: string;
    prefix?: string;
}

export function DynamicTrendsChart({ data, title, color, prefix = "" }: DynamicTrendsChartProps) {
    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                    <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(val) => `${prefix}${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                    />
                    <Tooltip 
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-background/90 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl">
                                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">{label}</p>
                                        <p className="text-lg font-black">
                                            {prefix}{(payload[0]?.value as number)?.toLocaleString() ?? '0'}
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={color} 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill={`url(#gradient-${color})`} 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
