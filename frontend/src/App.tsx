import HomePage from "./components/pages/HomePage";
import FavoritesPage from "./components/pages/FavoritesPage";
import { Route, Routes } from "react-router-dom";
import ArchivePage from "./components/pages/ArchivePage";
import DefaultLayout from "./components/templates/DefaulLayout";
import ErrorPage from "./components/pages/ErrorPage";
import ReactErrorBoundary from "./components/error/ReactErrorBoundary";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
        <Routes>
          <Route
            path="/"
            element={
              <DefaultLayout pageTitle="Deine Habits">
                <ReactErrorBoundary errorMessage="Deine Habits konnten nicht angezeigt werden.">
                  <HomePage />
                </ReactErrorBoundary>
              </DefaultLayout>
            }
          />

          <Route
            path="/favorites"
            element={
              <DefaultLayout pageTitle="Deine Favoriten">
                <ReactErrorBoundary errorMessage="Deine Favoriten konnten nicht angezeigt werden.">
                  <FavoritesPage />
                </ReactErrorBoundary>
              </DefaultLayout>
            }
          />

          <Route
            path="/archive"
            element={
              <DefaultLayout pageTitle="Dein Archiv">
                <ReactErrorBoundary errorMessage="Dein Archiv konnte nicht angezeigt werden.">
                  <ArchivePage />
                </ReactErrorBoundary>
              </DefaultLayout>
            }
          />

          <Route
            path="/*"
            element={
              <DefaultLayout>
                <ErrorPage errorCode={404} errorMessage="Seite nicht gefunden" buttonText="Zurück zur Startseite" resetErrorBoundary={() => navigate("/")} />
              </DefaultLayout>
            }
          />
        </Routes>
  );
}

export default App;