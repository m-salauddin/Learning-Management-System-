"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"

const chartData = [
    { month: "Jan", enrollments: 234, completions: 180, revenue: 12500 },
    { month: "Feb", enrollments: 356, completions: 220, revenue: 18900 },
    { month: "Mar", enrollments: 412, completions: 310, revenue: 22300 },
    { month: "Apr", enrollments: 378, completions: 290, revenue: 19800 },
    { month: "May", enrollments: 489, completions: 380, revenue: 28500 },
    { month: "Jun", enrollments: 534, completions: 420, revenue: 32100 },
    { month: "Jul", enrollments: 612, completions: 490, revenue: 38700 },
    { month: "Aug", enrollments: 589, completions: 510, revenue: 36200 },
    { month: "Sep", enrollments: 678, completions: 560, revenue: 42800 },
    { month: "Oct", enrollments: 723, completions: 610, revenue: 48500 },
    { month: "Nov", enrollments: 812, completions: 690, revenue: 54200 },
    { month: "Dec", enrollments: 890, completions: 750, revenue: 62300 },
]

export function EnrollmentTrendChart() {
    return (
        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        stroke="var(--color-muted-foreground)"
                        fontSize={12}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        stroke="var(--color-muted-foreground)"
                        fontSize={12}
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl p-4 shadow-xl">
                                        <p className="mb-3 font-semibold text-foreground">{label}</p>
                                        {payload.map((entry, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm mb-1">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: entry.color }}
                                                />
                                                <span className="text-muted-foreground">{entry.name}:</span>
                                                <span className="font-bold">{entry.value?.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-sm text-muted-foreground ml-1">{value}</span>}
                    />
                    <Line
                        type="monotone"
                        dataKey="enrollments"
                        name="Enrollments"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="completions"
                        name="Completions"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
