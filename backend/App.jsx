import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import HousingDetails from "./pages/HousingDetails";
import HousingSearch from "./pages/HousingSearch";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoommateMatches from "./pages/RoommateMatches";
import RoommateProfile from "./pages/RoommateProfile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/housing" element={<HousingSearch />} />
          <Route path="/housing/:type/:id" element={<HousingDetails />} />
          {/* :type is "dorm" or "listing" so the details page knows which
              API endpoint to call — dorms and listings are different tables */}
          <Route path="/roommate-profile" element={<RoommateProfile />} />
          <Route path="/matches" element={<RoommateMatches />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
