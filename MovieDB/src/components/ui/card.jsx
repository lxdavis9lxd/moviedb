import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, children, ...props }) {
  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props}>
      {children}
    </div>
  )
}
Card.displayName = "Card"

function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </div>
  )
}
CardHeader.displayName = "CardHeader"

function CardTitle({ className, children, ...props }) {
  return (
    <div className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </div>
  )
}
CardTitle.displayName = "CardTitle"

function CardDescription({ className, children, ...props }) {
  return (
    <div className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </div>
  )
}
CardDescription.displayName = "CardDescription"

function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
}
CardContent.displayName = "CardContent"

function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
}
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
