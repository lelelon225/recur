import ProgressIndicator from "@/components/atoms/ProgressIndicator";

export const Default = () => <ProgressIndicator value={60} />;

export const Sweep = () => (
  <div className="flex flex-wrap items-center gap-4">
    <ProgressIndicator value={0} />
    <ProgressIndicator value={25} />
    <ProgressIndicator value={60} />
    <ProgressIndicator value={100} />
  </div>
);

export const Large = () => <ProgressIndicator value={80} size={72} strokeWidth={6} />;
