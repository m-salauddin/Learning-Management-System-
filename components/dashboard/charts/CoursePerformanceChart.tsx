"use client"

import * as React from "react"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"

const chartData = [
    { name: "Web Dev", students: 1234, rating: 4.8, completion: 78 },
    { name: "Python", students: 987, rating: 4.7, completion: 82 },
    { name: "React", students: 876, rating: 4.9, completion: 71 },
    { name: "Node.js", students: 654, rating: 4.6, completion: 68 },
    { name: "Data Science", students: 543, rating: 4.5, completion: 65 },
    { name: "UI/UX", students: 432, rating: 4.8, completion: 85 },
]

const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"]

export function CoursePerformanceChart() {
    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                    <XAxis
                        type="number"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        stroke="var(--color-muted-foreground)"
                        fontSize={12}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        stroke="var(--color-muted-foreground)"
                        fontSize={12}
                        width={80}
                    />
                    <Tooltip
                        cursor={{ fill: "var(--color-muted)", opacity: 0.1 }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                    <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl p-4 shadow-xl">
                                        <p className="font-semibold text-foreground mb-2">{data.name}</p>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between gap-4">
                                                <span className="text-muted-foreground">Students:</span>
                                                <span className="font-bold">{data.students.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <span className="text-muted-foreground">Rating:</span>
                                                <span className="font-bold">⭐ {data.rating}</span>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <span className="text-muted-foreground">Completion:</span>
                                                <span className="font-bold">{data.completion}%</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Bar
                        dataKey="students"
                        radius={[0, 8, 8, 0]}
                        barSize={24}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
