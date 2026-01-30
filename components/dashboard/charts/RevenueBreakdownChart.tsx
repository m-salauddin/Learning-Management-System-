"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
    { name: "Course Sales", value: 68500, color: "#8b5cf6" },
    { name: "Subscriptions", value: 32400, color: "#3b82f6" },
    { name: "Certificates", value: 12300, color: "#10b981" },
    { name: "Merchandise", value: 8900, color: "#f59e0b" },
    { name: "Workshops", value: 15200, color: "#ec4899" },
]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return percent > 0.05 ? (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xs font-bold"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    ) : null
}

export function RevenueBreakdownChart() {
    const total = data.reduce((sum, item) => sum + item.value, 0)

    return (
        <div className="w-full h-[300px] flex flex-col">
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={100}
                            innerRadius={60}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const item = payload[0].payload
                                    return (
                                        <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl p-3 shadow-xl">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="font-semibold">{item.name}</span>
                                            </div>
                                            <p className="text-lg font-bold">৳{item.value.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {((item.value / total) * 100).toFixed(1)}% of total
                                            </p>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 mt-2">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-sm">
                        <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground truncate">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
