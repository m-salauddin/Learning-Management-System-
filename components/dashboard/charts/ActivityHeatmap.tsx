"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Generate demo activity data for last 12 weeks
const generateActivityData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const weeks = 12
    const data: { day: string; week: number; value: number }[] = []

    for (let week = 0; week < weeks; week++) {
        for (let day = 0; day < 7; day++) {
            data.push({
                day: days[day],
                week,
                value: Math.floor(Math.random() * 100),
            })
        }
    }
    return data
}

const activityData = generateActivityData()

const getIntensityClass = (value: number) => {
    if (value === 0) return "bg-muted/30"
    if (value < 25) return "bg-emerald-500/20"
    if (value < 50) return "bg-emerald-500/40"
    if (value < 75) return "bg-emerald-500/60"
    return "bg-emerald-500"
}

export function ActivityHeatmap() {
    const weeks = 12
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    return (
        <div className="w-full">
            <div className="flex gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-1 pr-2 text-xs text-muted-foreground">
                    {days.map((day, i) => (
                        <div key={day} className="h-4 flex items-center">
                            {i % 2 === 0 ? day : ""}
                        </div>
                    ))}
                </div>

                {/* Heatmap grid */}
                <div className="flex gap-1 flex-1 overflow-x-auto">
                    {Array.from({ length: weeks }).map((_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {days.map((day, dayIndex) => {
                                const cell = activityData.find(
                                    (d) => d.week === weekIndex && d.day === day
                                )
                                return (
                                    <div
                                        key={`${weekIndex}-${dayIndex}`}
                                        className={cn(
                                            "w-4 h-4 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary/50",
                                            getIntensityClass(cell?.value || 0)
                                        )}
                                        title={`${day}: ${cell?.value || 0} activities`}
                                    />
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-muted/30" />
                    <div className="w-3 h-3 rounded-sm bg-emerald-500/20" />
                    <div className="w-3 h-3 rounded-sm bg-emerald-500/40" />
                    <div className="w-3 h-3 rounded-sm bg-emerald-500/60" />
                    <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                </div>
                <span>More</span>
            </div>
        </div>
    )
}
