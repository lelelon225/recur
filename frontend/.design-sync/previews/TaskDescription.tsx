import TaskDescription from "@/components/atoms/TaskDescription";

export const Default = () => (
  <div className="w-72">
    <TaskDescription description="3km around the park before breakfast, easy pace." />
  </div>
);

export const LongDescription = () => (
  <div className="w-72">
    <TaskDescription description="Full-body mobility routine focusing on hips, shoulders and spine. Keep it slow and controlled, no need to rush through the sets." />
  </div>
);
