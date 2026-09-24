import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { NavigationDestination } from "@/hooks/useNavigationBar";
import { cn } from "@/lib/utils";

type BottomNavigationProps = {
  destinations: NavigationDestination[];
  activeValue: string;
};

// Ein einziger Inset-Wert für alle vier Seiten (nicht separat x/y!): nur
// wenn der horizontale und vertikale Abstand exakt gleich sind, verläuft die
// Pill-Rundung konzentrisch zur äusseren rounded-full-Kurve der Nav-Bar -
// sonst entsteht bei der ersten/letzten Spalte ein ungleichmässiger Spalt
// genau in der Ecke, selbst wenn oben/unten/rechts für sich passen.
const PILL_INSET_REM = 0.25;
const PILL_INSET = `${PILL_INSET_REM}rem`;
const REM_IN_PX = 16;

function BottomNavigation({ destinations, activeValue }: BottomNavigationProps) {
  const activeIndex = destinations.findIndex((d) => d.path === activeValue);
  const columnWidth = `(100% / ${destinations.length})`;
  const navRef = useRef<HTMLElement>(null);
  // null = nicht am Ziehen -> Pill folgt activeIndex per CSS-Transition.
  // Während des Ziehens: exakte Pixel-Position, 1:1 dem Finger/Cursor folgend,
  // ohne Transition (sonst hinkt sie spürbar hinterher).
  const [dragLeftPx, setDragLeftPx] = useState<number | null>(null);

  const updateDragPosition = (clientX: number) => {
    const nav = navRef.current;
    if (!nav) return;
    const rect = nav.getBoundingClientRect();
    const insetPx = PILL_INSET_REM * REM_IN_PX;
    const pillWidth = rect.width / destinations.length - insetPx * 2;
    const relativeX = clientX - rect.left;
    const rawLeft = relativeX - pillWidth / 2;
    const clamped = Math.min(Math.max(rawLeft, insetPx), rect.width - insetPx - pillWidth);
    setDragLeftPx(clamped);
  };

  const columnIndexAt = (clientX: number): number => {
    const nav = navRef.current;
    if (!nav) return activeIndex;
    const rect = nav.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const colWidth = rect.width / destinations.length;
    return Math.min(Math.max(Math.floor(relativeX / colWidth), 0), destinations.length - 1);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateDragPosition(event.clientX);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragLeftPx === null) return;
    updateDragPosition(event.clientX);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragLeftPx === null) return;
    const index = columnIndexAt(event.clientX);
    setDragLeftPx(null);
    const target = destinations[index];
    if (target && target.path !== activeValue) {
      target.navigate();
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-20 flex touch-none items-stretch rounded-full border bg-sidebar/95 shadow-lg backdrop-blur supports-backdrop-filter:bg-sidebar/80"
      aria-label="Hauptnavigation"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Ein gemeinsames Pill-Element statt eines pro Tab: so gleitet es beim
          Tab-Wechsel per CSS-Transition zur neuen Position, statt einfach an
          der neuen Stelle zu erscheinen. Füllt die volle Nav-Höhe (inset-y
          statt eng um Icon+Label gewickelt). left/width statt transform, da
          transform: translateX(N * 100%) sich auf die (bereits verkleinerte)
          Pill-Breite selbst bezieht und bei einem festen inset sonst über
          mehrere Spalten hinweg driften würde. Während des Ziehens (dragLeftPx
          gesetzt) wird die Transition abgeschaltet, damit die Pill dem
          Finger/Cursor ohne Verzögerung 1:1 folgt statt hinterherzuhinken. */}
      <div
        aria-hidden
        className={cn(
          "absolute rounded-full bg-sidebar-accent",
          dragLeftPx === null && "transition-[left,opacity] duration-300 ease-out",
          activeIndex === -1 && dragLeftPx === null && "opacity-0"
        )}
        style={{
          top: PILL_INSET,
          bottom: PILL_INSET,
          left:
            dragLeftPx !== null
              ? `${dragLeftPx}px`
              : `calc(${columnWidth} * ${Math.max(activeIndex, 0)} + ${PILL_INSET})`,
          width: `calc(${columnWidth} - 2 * ${PILL_INSET})`,
        }}
      />
      {destinations.map(({ path, label, icon: Icon, navigate }) => {
        const isActive = activeValue === path;
        return (
          <button
            key={path}
            type="button"
            onClick={navigate}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative z-10 flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors",
              isActive
                ? "font-semibold text-sidebar-accent-foreground"
                : "font-medium text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNavigation;
