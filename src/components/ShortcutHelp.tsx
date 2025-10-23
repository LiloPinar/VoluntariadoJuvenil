import React from "react";
import { SHORTCUTS } from "@/config/shortcuts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export const ShortcutHelp: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atajos de teclado</DialogTitle>
          <DialogDescription>Accesos rápidos para moverte por la plataforma.</DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <ul className="space-y-3">
            {SHORTCUTS.map((s, i) => (
              <li key={i} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{s.label}</div>
                  {s.description && <div className="text-sm text-muted-foreground">{s.description}</div>}
                </div>
                <div className="ml-4">
                  <kbd className="rounded bg-muted px-2 py-1 text-sm">{s.combo}</kbd>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-end">
            <DialogClose asChild>
              <button className="px-3 py-1 rounded bg-primary text-primary-foreground">Cerrar</button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutHelp;
