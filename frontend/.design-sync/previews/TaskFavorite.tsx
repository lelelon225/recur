import TaskFavorite from "@/components/atoms/TaskFavorite";

export const Favorited = () => (
  <TaskFavorite isFavorite onClick={() => {}} />
);

export const NotFavorited = () => (
  <TaskFavorite isFavorite={false} onClick={() => {}} />
);

export const BothStates = () => (
  <div className="flex items-center gap-3">
    <TaskFavorite isFavorite onClick={() => {}} />
    <TaskFavorite isFavorite={false} onClick={() => {}} />
  </div>
);
