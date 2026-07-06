import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function Dialog({
  children,
  ...props
}: DialogPrimitive.DialogProps) {
  return (
    <DialogPrimitive.Root {...props}>
      {children}
    </DialogPrimitive.Root>
  );
}

// 1. Définition de l'interface personnalisée
interface CustomDialogContentProps
  extends DialogPrimitive.DialogContentProps {
  hideOverlay?: boolean;
}

// 2. Fonction unique corrigée
export function DialogContent({
  children,
  className = "",
  hideOverlay = false,
  ...props
}: CustomDialogContentProps) {
  // <-- Syntaxe TypeScript correcte ici
  return (
    <DialogPrimitive.Portal>
      {/* L'overlay change selon la prop hideOverlay */}
      <DialogPrimitive.Overlay
        className={`fixed inset-0 z-50 transition-all ${
          hideOverlay
            ? "bg-black/20 ackdrop-blur-[2px] " // <-- Noir très léger (20%) + flou faible
            : "bg-black/50 backdrop-blur-sm" // <-- Noir standard (50%) + flou normal
        }`}
      />

      <DialogPrimitive.Content
  className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card text-foreground rounded-xl shadow-xl p-6 z-50 border border-border outline-none ${className}`}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function DialogTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Title
      className={`text-2xl font-semibold ${className}`}
    >
      {children}
    </DialogPrimitive.Title>
  );
}