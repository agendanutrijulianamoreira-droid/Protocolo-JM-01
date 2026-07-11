"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-marrom-escuro/50 backdrop-blur-sm data-[state=open]:animate-fade-in" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-creme p-6 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm text-marrom-escuro/60 hover:text-marrom-escuro focus-visible:outline-none">
        <X className="h-5 w-5" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("font-serif text-xl font-semibold text-marrom-escuro pr-6", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export { Dialog, DialogTrigger, DialogContent, DialogTitle };
