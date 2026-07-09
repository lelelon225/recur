import HomePage from "./components/pages/HomePage";
import FavoritesPage from "./components/pages/FavoritesPage";
import { Route, Routes } from "react-router-dom";
import ArchivePage from "./components/pages/ArchivePage";
import { TasksProvider } from "./contexts/TasksContext";
import DefaultLayout from "./components/templates/DefaulLayout";

function App() {
  return (
    <TasksProvider>
      <Routes>
        <Route
          path="/"
          element={
            <DefaultLayout pageTitle="Deine Habits">
              <HomePage />
            </DefaultLayout>
          }
        />

        <Route
          path="/favorites"
          element={
            <DefaultLayout pageTitle="Deine Favoriten">
              <FavoritesPage />
            </DefaultLayout>
          }
        />

        <Route
          path="/archive"
          element={
            <DefaultLayout pageTitle="Dein Archiv">
              <ArchivePage />
            </DefaultLayout>
          }
        />

        <Route
          path="/*"
          element={
            <DefaultLayout>
              <h1>404 - Page Not Found</h1>
            </DefaultLayout>
          }
        />
      </Routes>
    </TasksProvider>
  );
}

export default App;