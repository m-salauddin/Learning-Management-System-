"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip, YAxis } from "recharts"

const chartData = [
    { day: "Mon", current: 4000, previous: 2400 },
    { day: "Tue", current: 9310, previous: 1398 },
    { day: "Wed", current: 5500, previous: 9800 },
    { day: "Thu", current: 10378, previous: 3908 },
    { day: "Fri", current: 5000, previous: 4800 },
    { day: "Sat", current: 16745, previous: 3800 },
    { day: "Sun", current: 10000, previous: 4300 },
]

export function RevenueChart() {
    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex items-start justify-between mb-6 px-2">
                <div className="flex gap-12">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">This week:</p>
                        <h3 className="text-3xl font-bold text-blue-500">৳28,745</h3>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Previous week:</p>
                        <h3 className="text-3xl font-bold text-muted-foreground/50">৳12,980</h3>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-medium text-muted-foreground">this week</span>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 10,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="var(--color-border)" opacity={0.3} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={15}
                            stroke="var(--color-muted-foreground)"
                            fontSize={12}
                        />
                        <YAxis
                            hide={true} // Hide Y axis to match clean look
                            domain={[0, 'auto']}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl p-3 shadow-xl">
                                            <p className="mb-2 font-medium">{payload[0].payload.day}</p>
                                            {payload.map((entry, index) => (
                                                <div key={index} className="flex items-center gap-2 text-sm">
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: entry.color }}
                                                    />
                                                    <span className="text-muted-foreground capitalize">{entry.name}:</span>
                                                    <span className="font-bold">৳{entry.value?.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="previous"
                            stroke="#94a3b8"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fill="transparent"
                            dot={false}
                            activeDot={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="current"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorCurrent)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "white", stroke: "#3b82f6", strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: "#3b82f6", stroke: "white", strokeWidth: 2 }}
                        >
                        </Area>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
