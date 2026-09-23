import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ReactErrorBoundary from "@/components/error/ReactErrorBoundary";
import AccountSection from "@/components/organisms/settings/AccountSection";
import AppearanceSection from "@/components/organisms/settings/AppearanceSection";
import NotificationsSection from "@/components/organisms/settings/NotificationsSection";
import PrivacySection from "@/components/organisms/settings/PrivacySection";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    id: "account",
    label: "Account",
    errorMessage: "Dein Account konnte nicht angezeigt werden.",
    Component: AccountSection,
  },
  {
    id: "notifications",
    label: "Benachrichtigungen",
    errorMessage:
      "Die Benachrichtigungs-Einstellungen konnten nicht angezeigt werden.",
    Component: NotificationsSection,
  },
  {
    id: "appearance",
    label: "Erscheinungsbild",
    errorMessage:
      "Die Erscheinungsbild-Einstellungen konnten nicht angezeigt werden.",
    Component: AppearanceSection,
  },
  {
    id: "privacy",
    label: "Privatsphäre",
    errorMessage: "Die Privatsphäre-Einstellungen konnten nicht angezeigt werden.",
    Component: PrivacySection,
  },
] as const;

function SettingsPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <nav className="mb-6 flex flex-wrap gap-1">
        {SECTIONS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="flex flex-col gap-8">
        {SECTIONS.map(({ id, label, errorMessage, Component }, index) => (
          <section key={id} id={id} className="scroll-mt-4">
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              {label}
            </h2>
            <ReactErrorBoundary
              variant="inline"
              errorMessage={errorMessage}
            >
              <Component />
            </ReactErrorBoundary>
            {index < SECTIONS.length - 1 && <Separator className="mt-8" />}
          </section>
        ))}
      </div>
    </div>
  );
}

export default SettingsPage;
