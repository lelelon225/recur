import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReactErrorBoundary from "@/components/error/ReactErrorBoundary";
import AppearanceSection from "@/components/organisms/settings/AppearanceSection";
import NotificationsSection from "@/components/organisms/settings/NotificationsSection";
import PrivacySection from "@/components/organisms/settings/PrivacySection";

const SECTIONS = [
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
      <Tabs defaultValue={SECTIONS[0].id}>
        <TabsList className="w-full overflow-x-auto">
          {SECTIONS.map(({ id, label }) => (
            <TabsTrigger key={id} value={id}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {SECTIONS.map(({ id, errorMessage, Component }) => (
          <TabsContent key={id} value={id} className="mt-6">
            <ReactErrorBoundary variant="inline" errorMessage={errorMessage}>
              <Component />
            </ReactErrorBoundary>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default SettingsPage;
