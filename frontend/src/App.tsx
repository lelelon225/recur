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


    </Routes>
  )
}

export default App