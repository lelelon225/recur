import DetailDialog from "@/components/molecules/DetailDialog";

export const Default = () => (
  <DetailDialog open onClose={() => {}} title="Morgenlauf">
    <span className="text-sm text-muted-foreground">
      <div className="mt-2" style={{ wordWrap: "break-word" }}>
        <strong>Beschreibung:</strong> 3km rund um den Park vor dem
        Frühstück, lockeres Tempo.
      </div>
      <div className="mt-2">
        <strong>Dauer:</strong> 30 Minuten
      </div>
      <div className="mt-2">
        <strong>Uhrzeit:</strong> 07:00
      </div>
      <div className="mt-2">
        <strong>Endzeit:</strong> 31.12.2026
      </div>
    </span>
  </DetailDialog>
);

export const NoTitle = () => (
  <DetailDialog open onClose={() => {}}>
    <span className="text-sm text-muted-foreground">
      <div className="mt-2">
        <strong>Beschreibung:</strong> Wöchentliches Meal-Prep für die
        Arbeitswoche.
      </div>
    </span>
  </DetailDialog>
);

export const TitleOnly = () => (
  <DetailDialog open onClose={() => {}} title="Yoga Session" />
);
