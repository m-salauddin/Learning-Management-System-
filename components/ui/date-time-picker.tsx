"use client";

import * as React from "react";
import { format, startOfToday } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
    date?: Date;
    setDate: (date: Date | undefined) => void;
    className?: string;
    placeholder?: string;
}

export function DateTimePicker({
    date,
    setDate,
    className,
    placeholder = "Pick a date",
}: DateTimePickerProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);

    React.useEffect(() => {
        if (date) {
            setSelectedDate(date);
        }
    }, [date]);

    const handleDateSelect = (newDate: Date | undefined) => {
        if (!newDate) return;
        
        const updatedDate = new Date(newDate);
        if (selectedDate) {
            updatedDate.setHours(selectedDate.getHours());
            updatedDate.setMinutes(selectedDate.getMinutes());
        }
        
        setSelectedDate(updatedDate);
        setDate(updatedDate);
    };

    const handleTimeChange = (type: "hours" | "minutes" | "ampm", value: string) => {
        const updatedDate = new Date(selectedDate || new Date());
        if (type === "hours") {
            const isPM = updatedDate.getHours() >= 12;
            let h = parseInt(value);
            if (isPM && h < 12) h += 12;
            if (!isPM && h === 12) h = 0;
            updatedDate.setHours(h);
        } else if (type === "minutes") {
            updatedDate.setMinutes(parseInt(value));
        } else if (type === "ampm") {
            let h = updatedDate.getHours();
            if (value === "PM" && h < 12) h += 12;
            if (value === "AM" && h >= 12) h -= 12;
            updatedDate.setHours(h);
        }
        setSelectedDate(updatedDate);
        setDate(updatedDate);
    };

    const get12Hour = (date: Date | undefined) => {
        if (!date) return "12";
        const h = date.getHours() % 12;
        return (h === 0 ? 12 : h).toString();
    };

    const getAMPM = (date: Date | undefined) => {
        if (!date) return "AM";
        return date.getHours() >= 12 ? "PM" : "AM";
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "group flex h-12 w-full items-center justify-between gap-2 rounded-xl bg-input-dark px-4 text-sm font-medium transition-all duration-200 border border-input-dark-border outline-none",
                        "hover:bg-input-dark-hover hover:border-input-dark-border",
                        "focus:shadow-[0_0_0_2px_var(--input-dark-glow)] focus:border-input-dark-border",
                        "data-[state=open]:shadow-[0_0_0_2px_var(--input-dark-glow)] data-[state=open]:border-input-dark-border",
                        !date && "text-input-dark-text",
                        className
                    )}
                >
                    <span className="truncate">
                        {date ? format(date, "MM/dd/yyyy hh:mm aa") : placeholder}
                    </span>
                    <CalendarIcon className="size-4 shrink-0 text-input-dark-text opacity-70 transition-colors group-hover:text-primary group-data-[state=open]:text-primary group-data-[state=open]:opacity-100" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-950/95 backdrop-blur-2xl border-white/10 shadow-2xl rounded-2xl overflow-hidden" align="start">
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10">
                    <div className="p-3">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={{ before: startOfToday() }}
                            initialFocus
                        />
                    </div>
                    <div className="p-4 flex flex-col gap-4 bg-white/3 min-w-[140px]">
                        <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest px-1">
                            <Clock className="w-3 h-3" />
                            Time
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-white/20 ml-1">Hour</label>
                                    <Select
                                        value={get12Hour(selectedDate)}
                                        onValueChange={(v) => handleTimeChange("hours", v)}
                                    >
                                        <SelectTrigger className="h-9 bg-white/5 border-white/10 focus:ring-blue-500/20 rounded-lg text-xs px-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 max-h-[200px]">
                                            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => (
                                                <SelectItem key={h} value={h.toString()}>
                                                    {h.toString().padStart(2, "0")}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-white/20 ml-1">Min</label>
                                    <Select
                                        value={selectedDate?.getMinutes().toString() || "0"}
                                        onValueChange={(v) => handleTimeChange("minutes", v)}
                                    >
                                        <SelectTrigger className="h-9 bg-white/5 border-white/10 focus:ring-blue-500/20 rounded-lg text-xs px-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 max-h-[200px]">
                                            {Array.from({ length: 60 }).map((_, i) => (
                                                <SelectItem key={i} value={i.toString()}>
                                                    {i.toString().padStart(2, "0")}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-white/20 ml-1">Period</label>
                                <div className="flex p-1 rounded-lg bg-white/5 border border-white/10 gap-1">
                                    {["AM", "PM"].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => handleTimeChange("ampm", p)}
                                            className={cn(
                                                "flex-1 py-1 rounded-md text-[10px] font-bold transition-all",
                                                getAMPM(selectedDate) === p 
                                                    ? "bg-blue-500 text-white shadow-lg" 
                                                    : "text-white/40 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto pt-4 border-t border-white/5">
                            <div className="text-[10px] font-bold text-blue-400 text-center uppercase tracking-tighter">
                                {selectedDate ? format(selectedDate, "hh:mm aa") : "--:-- --"}
                            </div>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
