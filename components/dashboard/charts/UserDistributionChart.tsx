"use client"

import * as React from "react"
import { Label, Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts"

const chartData = [
    { role: "Student", count: 850, fill: "#f43f5e" }, // Pink
    { role: "Teacher", count: 200, fill: "#3b82f6" }, // Blue
    { role: "Admin", count: 100, fill: "#f59e0b" },   // Orange
    { role: "Other", count: 50, fill: "#4b5563" },    // Grey
]

export function UserDistributionChart() {
    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.count, 0)
    }, [])

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Users</p>
                    <h3 className="text-3xl font-bold tracking-tight">{totalVisitors.toLocaleString()}</h3>
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="text-sm font-medium">1,500</p>
                </div>
            </div>

            {/* Chart Section */}
            <div className="flex-1 w-full min-h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl p-2 px-3 shadow-xl">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: payload[0].payload.fill }}
                                                />
                                                <span className="text-xs font-semibold text-foreground">
                                                    {payload[0].name}: {payload[0].value}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="role"
                            innerRadius={80}
                            outerRadius={100}
                            stroke="none"
                            cornerRadius={10}
                            paddingAngle={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    dy="0.1em"
                                                    className="fill-foreground text-4xl font-bold"
                                                >
                                                    85%
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Floating Badge (Visual only replication of the "1.200" tag) */}
                <div className="absolute top-[45%] right-[10%] bg-background text-foreground text-xs font-bold px-2 py-1 rounded-md shadow-lg border border-border/50 hidden sm:block">
                    {chartData[0].count}
                </div>
            </div>

            {/* Legend Section */}
            <div className="flex items-center justify-center gap-6 mt-4">
                {chartData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-sm font-medium text-muted-foreground">{item.role}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
