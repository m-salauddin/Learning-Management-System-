"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.ComponentProps<"table"> & { as?: any }
>(({ className, as: Component = "table", ...props }, ref) => (
  <div data-slot="table-container" className="relative w-full overflow-hidden">
    <div className="overflow-x-auto">
      <Component
        ref={ref}
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"thead"> & { as?: any }
>(({ className, as: Component = "thead", ...props }, ref) => (
  <Component
    ref={ref}
    data-slot="table-header"
    className={cn("bg-muted/30", className)}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"tbody"> & { as?: any }
>(({ className, as: Component = "tbody", ...props }, ref) => (
  <Component
    ref={ref}
    data-slot="table-body"
    className={cn("", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"tfoot"> & { as?: any }
>(({ className, as: Component = "tfoot", ...props }, ref) => (
  <Component
    ref={ref}
    data-slot="table-footer"
    className={cn("bg-muted/30 font-medium", className)}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.ComponentProps<"tr"> & { as?: any }
>(({ className, as: Component = "tr", ...props }, ref) => (
  <Component
    ref={ref}
    data-slot="table-row"
    className={cn(
      "transition-colors hover:bg-primary/3 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<"th"> & { as?: any }
>(({ className, as: Component = "th", ...props }, ref) => (
  <Component
    ref={ref}
    data-slot="table-head"
    className={cn(
      "h-12 px-4 text-left align-middle font-semibold text-xs uppercase tracking-wide text-muted-foreground whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<"td"> & { as?: any }
>(({ className, as: Component = "td", ...props }, ref) => (
  <Component
    ref={ref}
    data-slot="table-cell"
    className={cn(
      "px-4 py-3 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.ComponentProps<"caption"> & { as?: any }
>(({ className, as: Component = "caption", ...props }, ref) => (
  <Component
    ref={ref}
    data-slot="table-caption"
    className={cn("text-muted-foreground mt-4 text-sm", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
