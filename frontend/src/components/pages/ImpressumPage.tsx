import { useRouter } from "next/navigation";
import LegalPageLayout from "@/components/templates/LegalPageLayout";

function ImpressumPage() {
  const router = useRouter();

  return (
    <LegalPageLayout title="Impressum" lastUpdated="[TODO: Datum einfügen]">
      <p className="text-muted-foreground">
        Angaben gemäss Art. 3 UWG (Schweiz) sowie § 5 TMG (Deutschland).
      </p>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground">
          Anbieter
        </h2>
        <p>
          [TODO: Firmenname / Name der verantwortlichen Person]
          <br />
          [TODO: Strasse und Hausnummer]
          <br />
          [TODO: PLZ und Ort]
          <br />
          [TODO: Land]
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground">
          Vertretungsberechtigte Person
        </h2>
        <p>[TODO: Vor- und Nachname]</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground">Kontakt</h2>
        <p>
          E-Mail: [TODO: kontakt@example.com]
          <br />
          Telefon: [TODO: optional]
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground">
          Handelsregister- / UID-Nummer
        </h2>
        <p>
          [TODO: falls vorhanden, z.B. UID-Nummer (CH) oder
          Handelsregisternummer (DE) — sonst diesen Abschnitt entfernen]
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground">
          Haftungsausschluss
        </h2>
        <p>
          Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen
          Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und
          Vollständigkeit der Informationen auf dieser Website.
          Haftungsansprüche gegen den Anbieter wegen Schäden materieller
          oder immaterieller Art, welche aus dem Zugriff oder der Nutzung
          bzw. Nichtnutzung der veröffentlichten Informationen, durch
          Missbrauch der Verbindung oder durch technische Störungen
          entstanden sind, werden ausgeschlossen.
        </p>
        <p>
          Alle Angebote sind unverbindlich. Der Anbieter behält es sich
          ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne
          gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder
          die Veröffentlichung zeitweise oder endgültig einzustellen.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground">
          Haftung für Links
        </h2>
        <p>
          Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres
          Verantwortungsbereichs. Es wird jegliche Verantwortung für solche
          Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten
          erfolgen auf eigene Gefahr des jeweiligen Nutzers.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground">
          Urheberrechte
        </h2>
        <p>
          Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos
          oder anderen Dateien auf dieser Website gehören ausschliesslich
          [TODO: Firmenname/Name] oder den speziell genannten
          Rechteinhabern. Für die Reproduktion jeglicher Elemente ist die
          schriftliche Zustimmung des Urheberrechtsträgers im Voraus
          einzuholen.
        </p>
      </section>

      <button
        type="button"
        className="self-start text-sm text-primary hover:underline"
        onClick={() => router.push("/datenschutz")}
      >
        Zur Datenschutzerklärung
      </button>
    </LegalPageLayout>
  );
}

export default ImpressumPage;
