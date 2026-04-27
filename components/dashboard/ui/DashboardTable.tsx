import * as React from "react"
import { cn } from "@/lib/utils"

export const DashboardTableContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[2.5rem] border border-border/80 bg-card/30 backdrop-blur-xl",
      className
    )}
    {...props}
  />
))
DashboardTableContainer.displayName = "DashboardTableContainer"

export const DashboardTableToolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-6 border-b border-border/40 flex flex-col lg:flex-row gap-4 justify-between items-center bg-muted/5",
      className
    )}
    {...props}
  />
))
DashboardTableToolbar.displayName = "DashboardTableToolbar"

export const DashboardTableWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("overflow-x-auto overflow-y-visible min-w-full dashboard-scrollbar", className)}
  >
    <div className="inline-block min-w-full align-middle" {...props} />
  </div>
))
DashboardTableWrapper.displayName = "DashboardTableWrapper"

export const DashboardTableHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid px-8 py-5 bg-muted/5 border-b border-border/40 items-center whitespace-nowrap",
      className
    )}
    {...props}
  />
))
DashboardTableHeader.displayName = "DashboardTableHeader"

export const DashboardTableHead = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60",
      className
    )}
    {...props}
  />
))
DashboardTableHead.displayName = "DashboardTableHead"

export const DashboardTableBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("divide-y divide-border/20", className)}
    {...props}
  />
))
DashboardTableBody.displayName = "DashboardTableBody"

export const DashboardTableRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid px-8 py-5 items-center hover:bg-primary/5 transition-all duration-300 group relative",
      className
    )}
    {...props}
  />
))
DashboardTableRow.displayName = "DashboardTableRow"

export const DashboardTableCell = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-4", className)}
    {...props}
  />
))
DashboardTableCell.displayName = "DashboardTableCell"
