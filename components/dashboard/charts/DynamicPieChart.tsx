"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface DataPoint {
    name: string;
    value: number;
}

interface DynamicPieChartProps {
    data: DataPoint[];
}

const COLORS = ["#8b5cf6", "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#ec4899"];

export function DynamicPieChart({ data }: DynamicPieChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No category data available
            </div>
        );
    }

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-background/90 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl">
                                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">{payload[0].name}</p>
                                        <p className="text-lg font-black">
                                            {(payload[0]?.value as number)?.toLocaleString() ?? '0'} Courses
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
