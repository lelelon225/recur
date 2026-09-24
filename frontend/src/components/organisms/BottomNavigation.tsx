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
const PILL_INSET = "0.25rem";

function BottomNavigation({ destinations, activeValue }: BottomNavigationProps) {
  const activeIndex = destinations.findIndex((d) => d.path === activeValue);
  const columnWidth = `(100% / ${destinations.length})`;

  return (
    <nav
      className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-20 flex items-stretch rounded-full border bg-sidebar/95 shadow-lg backdrop-blur supports-backdrop-filter:bg-sidebar/80"
      aria-label="Hauptnavigation"
    >
      {/* Ein gemeinsames Pill-Element statt eines pro Tab: so gleitet es beim
          Tab-Wechsel per CSS-Transition zur neuen Position, statt einfach an
          der neuen Stelle zu erscheinen. Füllt die volle Nav-Höhe (inset-y
          statt eng um Icon+Label gewickelt). left/width statt transform, da
          transform: translateX(N * 100%) sich auf die (bereits verkleinerte)
          Pill-Breite selbst bezieht und bei einem festen inset sonst über
          mehrere Spalten hinweg driften würde.
      */}
      <div
        aria-hidden
        className={cn(
          "absolute rounded-full bg-sidebar-accent transition-[left,opacity] duration-300 ease-out",
          activeIndex === -1 && "opacity-0"
        )}
        style={{
          top: PILL_INSET,
          bottom: PILL_INSET,
          left: `calc(${columnWidth} * ${Math.max(activeIndex, 0)} + ${PILL_INSET})`,
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
