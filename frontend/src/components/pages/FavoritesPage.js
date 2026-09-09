import Empty from "@/components/molecules/Empty";
import { OctagonXIcon } from "lucide-react";
import { useTasksContext } from "@/contexts/TasksContext";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TaskCardGrid from "@/components/molecules/TaskCardGrid";
import TaskCardGridSkeleton from "../molecules/TaskCardGridSkeleton";
function FavoritesPage() {
    const navigate = useNavigate();
    const { loading, favoriteTasks, handleToggleFavorite, handleToggleArchive, handleDelete, } = useTasksContext();
    const handlers = useMemo(() => ({
        onToggleFavorite: handleToggleFavorite,
        onToggleArchive: handleToggleArchive,
        onDelete: handleDelete,
    }), [handleToggleFavorite, handleToggleArchive, handleDelete]);
    if (loading) {
        return <TaskCardGridSkeleton count={6} direction="row"/>;
    }
    if (favoriteTasks.length === 0) {
        return (<Empty icon={() => <OctagonXIcon className="w-12 h-12 text-gray-400"/>} title="Keine favorisierten Habits" description="Es gibt derzeit keine favorisierten Habits." buttonText="Zurück zu den Habits" onButtonClick={() => navigate("/")}/>);
    }
    return (<div>
      <TaskCardGrid sortedTasks={favoriteTasks} handlers={handlers} direction="row"/>
    </div>);
}
export default FavoritesPage;
