import HomePage from "./components/pages/HomePage"
import DefaultLayout from "./components/templates/DefaulLayout"
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <DefaultLayout>
          <HomePage />
        </DefaultLayout>
      } />

      <Route path="/*" element={
        <DefaultLayout>
          <h1>404 - Page Not Found</h1>
        </DefaultLayout>
      } />


    </Routes>
  )
}

export default App