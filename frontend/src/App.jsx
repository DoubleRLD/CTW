import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

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
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/housing" element={<HousingSearch />} />
        <Route path="/housing-details" element={<HousingDetails />} />
        <Route path="/roommate-profile" element={<RoommateProfile />} />
        <Route path="/matches" element={<RoommateMatches />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;