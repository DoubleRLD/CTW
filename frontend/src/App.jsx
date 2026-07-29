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
import Favorites from "./pages/Favorites";
import Messages from "./pages/Messages";
import VerifyEmail from "./pages/VerifyEmail";
import Admin from "./pages/Admin";
import ActivityHistory from "./pages/ActivityHistory";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/housing" element={<HousingSearch />} />
        <Route path="/housing/:type/:id" element={<HousingDetails />} />
        <Route path="/roommate-profile" element={<RoommateProfile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/messages/:matchId" element={<Messages />} />
        <Route path="/matches" element={<RoommateMatches />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activity" element={<ActivityHistory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;