"use client";
import * as React from "react";
import { format, startOfToday } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useDayPicker } from "react-day-picker";
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

// Custom caption that puts arrows right beside month/year
function CustomMonthCaption({ calendarMonth }: { calendarMonth: { date: Date }; displayIndex: number }) {
    const { goToMonth, previousMonth, nextMonth } = useDayPicker();
    const d = calendarMonth.date;

    return (
        <div className="flex items-center justify-center gap-1 h-9 mb-1">
            <button
                type="button"
                disabled={!previousMonth}
                onClick={() => previousMonth && goToMonth(previousMonth)}
                className="h-8 w-8 p-0 opacity-60 hover:opacity-100 hover:!bg-blue-600/10 disabled:opacity-25 transition-all rounded-lg flex items-center justify-center"
            >
                <ChevronLeft className="size-4" />
            </button>
            <div className="flex items-center gap-1.5 px-1 select-none">
                <span className="text-sm font-bold text-foreground">{format(d, "MMMM")}</span>
                <span className="text-sm font-normal text-muted-foreground">{format(d, "yyyy")}</span>
            </div>
            <button
                type="button"
                disabled={!nextMonth}
                onClick={() => nextMonth && goToMonth(nextMonth)}
                className="h-8 w-8 p-0 opacity-60 hover:opacity-100 hover:!bg-blue-600/10 disabled:opacity-25 transition-all rounded-lg flex items-center justify-center"
            >
                <ChevronRight className="size-4" />
            </button>
        </div>
    );
}

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
    const [open, setOpen] = React.useState(false);

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
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "group flex h-12 w-full items-center justify-between gap-2 rounded-xl bg-background px-4 text-sm font-medium transition-all duration-200 border border-border outline-none",
                        "hover:bg-muted/50 hover:border-blue-600/30",
                        "focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600/50",
                        "data-[state=open]:ring-2 data-[state=open]:ring-blue-600/20 data-[state=open]:border-blue-600/50",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <span className="truncate">
                        {date ? format(date, "MM/dd/yyyy hh:mm aa") : placeholder}
                    </span>
                    <CalendarIcon className="size-4 shrink-0 text-muted-foreground opacity-70 transition-colors group-hover:text-blue-600 group-data-[state=open]:text-blue-600 group-data-[state=open]:opacity-100" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] sm:w-auto p-0 bg-popover text-popover-foreground border-border shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl"
                align="start"
                sideOffset={8}
            >
                <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border">
                    <div className="p-3 w-full sm:w-auto">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={{ before: startOfToday() }}
                            initialFocus
                            className="w-full sm:w-auto"
                            classNames={{
                                root: "w-full sm:w-fit",
                                months: "w-full sm:w-auto",
                                month: "w-full sm:w-auto space-y-4 max-sm:flex max-sm:flex-col",
                                nav: "hidden",
                                table: "w-full border-collapse max-sm:flex max-sm:flex-col",
                                tbody: "w-full max-sm:flex max-sm:flex-col",
                                head: "w-full max-sm:flex max-sm:flex-col",
                                head_row: "flex w-full justify-between items-center",
                                row: "flex w-full mt-2 justify-between items-center",
                                today: "bg-blue-600/10 text-blue-600 border border-blue-600/20 rounded-lg",
                                selected: "bg-blue-600 text-white !rounded-lg !shadow-lg",
                                cell: "flex-1 text-center p-0 flex justify-center items-center",
                                day: cn(
                                    "flex aspect-square h-11 w-full max-w-[44px] sm:h-8 sm:w-8 items-center justify-center p-0 font-normal transition-all rounded-lg",
                                    "hover:!bg-blue-600/50 hover:!text-white",
                                    "data-[selected-single=true]:!bg-blue-600 data-[selected-single=true]:!text-white",
                                    "!focus-visible:ring-2 !focus-visible:ring-blue-600/50 !focus-visible:ring-offset-2",
                                    "aria-selected:!bg-blue-600 aria-selected:!text-white aria-selected:!opacity-100",
                                    "aria-selected:!rounded-lg"
                                ),
                                head_cell: "flex-1 text-center text-muted-foreground font-normal text-[0.8rem]",
                                weekday: "flex-1 text-center rounded-md text-[0.8rem] font-normal text-muted-foreground select-none",
                            }}
                            components={{
                                MonthCaption: CustomMonthCaption,
                            }}
                        />
                    </div>
                    <div className="p-4 flex flex-col gap-4 bg-muted/20 sm:min-w-[140px] w-full">
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest px-1">
                            <Clock className="w-3 h-3" />
                            Time
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground/40 ml-1">Hour</label>
                                    <Select
                                        value={get12Hour(selectedDate)}
                                        onValueChange={(v) => handleTimeChange("hours", v)}
                                    >
                                        <SelectTrigger className="h-9 bg-background border-border focus:ring-blue-600/20 rounded-lg text-xs px-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border max-h-[200px]">
                                            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => (
                                                <SelectItem key={h} value={h.toString()}>
                                                    {h.toString().padStart(2, "0")}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground/40 ml-1">Min</label>
                                    <Select
                                        value={selectedDate?.getMinutes().toString() || "0"}
                                        onValueChange={(v) => handleTimeChange("minutes", v)}
                                    >
                                        <SelectTrigger className="h-9 bg-background border-border focus:ring-blue-600/20 rounded-lg text-xs px-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border max-h-[200px]">
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
                                <label className="text-[10px] font-bold text-muted-foreground/40 ml-1">Period</label>
                                <div className="flex p-1 rounded-lg bg-background border border-border gap-1">
                                    {["AM", "PM"].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => handleTimeChange("ampm", p)}
                                            className={cn(
                                                "flex-1 py-1 rounded-md text-[10px] font-bold transition-all",
                                                getAMPM(selectedDate) === p
                                                    ? "bg-blue-600 text-white shadow-lg"
                                                    : "text-muted-foreground/60 hover:text-foreground hover:bg-muted"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto pt-4 border-t border-border space-y-3">
                            <div className="text-[10px] font-bold text-blue-600 text-center uppercase tracking-tighter">
                                {selectedDate ? format(selectedDate, "hh:mm aa") : "--:-- --"}
                            </div>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => setOpen(false)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] h-8 rounded-lg shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
