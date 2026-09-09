import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Default = () => (
  <Card className="w-80">
    <CardHeader>
      <CardTitle>Morgenroutine</CardTitle>
      <CardDescription>3km laufen, dann 10 Minuten dehnen.</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        Aktuelle Serie: 12 Tage in Folge. Weiter so!
      </p>
    </CardContent>
  </Card>
);

export const WithFooter = () => (
  <Card className="w-80">
    <CardHeader>
      <CardTitle>Wöchentlicher Rückblick</CardTitle>
      <CardDescription>5 von 7 Gewohnheiten abgeschlossen</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        Du liegst über deinem Durchschnitt der letzten 4 Wochen.
      </p>
    </CardContent>
    <CardFooter className="justify-end gap-2">
      <Button variant="outline" size="sm">
        Details
      </Button>
      <Button size="sm">Teilen</Button>
    </CardFooter>
  </Card>
);

export const WithAction = () => (
  <Card className="w-80">
    <CardHeader>
      <CardTitle>Meditieren</CardTitle>
      <CardDescription>Täglich, 10 Minuten</CardDescription>
      <CardAction>
        <Button variant="ghost" size="sm">
          Bearbeiten
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        Nächste Erinnerung heute um 21:00 Uhr.
      </p>
    </CardContent>
  </Card>
);

export const SmallSize = () => (
  <Card size="sm" className="w-64">
    <CardHeader>
      <CardTitle>Wasser trinken</CardTitle>
      <CardDescription>8 Gläser pro Tag</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">4 von 8 heute geschafft.</p>
    </CardContent>
  </Card>
);
