import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Default = () => (
  <Tabs defaultValue="today" className="w-72">
    <TabsList>
      <TabsTrigger value="today">Today</TabsTrigger>
      <TabsTrigger value="week">This week</TabsTrigger>
      <TabsTrigger value="all">All habits</TabsTrigger>
    </TabsList>
    <TabsContent value="today" className="px-1 py-2">
      <p className="text-sm text-muted-foreground">
        3 habits scheduled for today, including Morning run and Read 20 pages.
      </p>
    </TabsContent>
    <TabsContent value="week" className="px-1 py-2">
      <p className="text-sm text-muted-foreground">
        You&apos;ve completed 12 of 18 recurring tasks so far this week.
      </p>
    </TabsContent>
    <TabsContent value="all" className="px-1 py-2">
      <p className="text-sm text-muted-foreground">
        Showing every active habit across all categories.
      </p>
    </TabsContent>
  </Tabs>
);

export const LineVariant = () => (
  <Tabs defaultValue="daily" className="w-72">
    <TabsList variant="line">
      <TabsTrigger value="daily">Daily</TabsTrigger>
      <TabsTrigger value="weekly">Weekly</TabsTrigger>
      <TabsTrigger value="monthly">Monthly</TabsTrigger>
    </TabsList>
    <TabsContent value="daily" className="px-1 py-2">
      <p className="text-sm text-muted-foreground">
        Daily habits reset their progress every day at midnight.
      </p>
    </TabsContent>
    <TabsContent value="weekly" className="px-1 py-2">
      <p className="text-sm text-muted-foreground">
        Weekly habits track progress across a rolling 7-day window.
      </p>
    </TabsContent>
    <TabsContent value="monthly" className="px-1 py-2">
      <p className="text-sm text-muted-foreground">
        Monthly habits are great for goals like &quot;read one book&quot;.
      </p>
    </TabsContent>
  </Tabs>
);

export const Vertical = () => (
  <Tabs defaultValue="work" orientation="vertical" className="w-full max-w-sm">
    <TabsList>
      <TabsTrigger value="work">Work</TabsTrigger>
      <TabsTrigger value="personal">Personal</TabsTrigger>
      <TabsTrigger value="school">School</TabsTrigger>
    </TabsList>
    <TabsContent value="work" className="px-2 py-1">
      <p className="text-sm text-muted-foreground">
        Standup notes, sprint planning, and weekly retro reminders.
      </p>
    </TabsContent>
    <TabsContent value="personal" className="px-2 py-1">
      <p className="text-sm text-muted-foreground">
        Morning run, meditation, and evening journaling.
      </p>
    </TabsContent>
    <TabsContent value="school" className="px-2 py-1">
      <p className="text-sm text-muted-foreground">
        Review flashcards and submit the weekly problem set.
      </p>
    </TabsContent>
  </Tabs>
);
