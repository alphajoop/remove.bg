"use client";

import { Kbd, KbdGroup } from "@/components/ui/kbd";

export function KeyboardShortcuts() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="p-6 text-card-foreground">
        <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Process all images</span>
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <span>+</span>
              <Kbd>Enter</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Open file selector</span>
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <span>+</span>
              <Kbd>O</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Clear all images</span>
            <KbdGroup>
              <Kbd>Esc</Kbd>
            </KbdGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
