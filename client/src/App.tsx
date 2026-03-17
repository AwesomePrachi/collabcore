import { BrowserRouter, Routes, Route } from "react-router-dom"

import DashboardPage from "./pages/DashboardPage"
import DocumentPage from "./pages/DocumentPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>

        <Route
          path="/doc/:publicId"
          element={<DocumentPage />}
        />

      </Routes>

    </BrowserRouter>

  )

}