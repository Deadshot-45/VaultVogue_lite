"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutDialog({
  isOpen,
  onClose,
  onConfirm,
}: LogoutDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[350px] mx-auto rounded-3xl border border-border/40 bg-background/80 p-10 shadow-2xl backdrop-blur-xl sm:rounded-[2.5rem]">
        <DialogHeader className="flex flex-col items-center gap-6 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: "var(--gold-glow)" }}
          >
            <LogOut className="h-8 w-8" style={{ color: "var(--gold)" }} />
          </div>
          <div className="space-y-4">
            <DialogTitle className="font-cormorant text-4xl font-light text-foreground">
              Sign Out
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-muted-foreground">
              Are you sure you want to end your current session? You can return anytime to resume your experience.
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="gold-divider mx-auto my-8 w-12" />

        <DialogFooter className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <button
            onClick={onClose}
            className="rounded-full border border-border/60 px-8 py-2.5 text-sm font-medium transition-colors hover:bg-muted/50 sm:min-w-[140px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full px-8 py-2.5 text-sm font-medium text-white shadow-lg transition-all active:scale-95 sm:min-w-[140px]"
            style={{ background: "var(--gold)" }}
          >
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
