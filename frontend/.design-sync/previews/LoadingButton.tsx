import LoadingButton from "@/components/atoms/LoadingButton";

export const Default = () => <LoadingButton>Save changes</LoadingButton>;

export const Loading = () => (
  <LoadingButton loading>Save changes</LoadingButton>
);

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <LoadingButton variant="outline">Mark as done</LoadingButton>
    <LoadingButton variant="outline" loading>
      Mark as done
    </LoadingButton>
    <LoadingButton variant="destructive" loading>
      Delete habit
    </LoadingButton>
  </div>
);
