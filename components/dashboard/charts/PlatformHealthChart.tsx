"use client"

import * as React from "react"
import { RadialBarChart, RadialBar, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
    { name: "Course Completion", value: 78, fill: "#10b981" },
    { name: "User Retention", value: 65, fill: "#3b82f6" },
    { name: "Student Satisfaction", value: 92, fill: "#8b5cf6" },
    { name: "Revenue Target", value: 84, fill: "#f59e0b" },
]

export function PlatformHealthChart() {
    return (
        <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="90%"
                    barSize={12}
                    data={data}
                    startAngle={180}
                    endAngle={-180}
                >
                    <RadialBar
                        background={{ fill: "var(--color-muted)", opacity: 0.2 }}
                        dataKey="value"
                        cornerRadius={10}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const item = payload[0].payload
                                return (
                                    <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl p-3 shadow-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: item.fill }}
                                            />
                                            <span className="font-semibold text-sm">{item.name}</span>
                                        </div>
                                        <p className="text-2xl font-bold">{item.value}%</p>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                </RadialBarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                        <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                        <span className="text-xs font-bold ml-auto">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
