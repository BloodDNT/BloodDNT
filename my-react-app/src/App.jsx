import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

import Login from "./components/Login";
import Home from "./components/HomePage";
import Register from "./components/Register";
import BloodGuide from "./components/BloodGuide";
import News from "./components/News";
import Contact from "./components/Contact";
import BloodDonation from "./components/BloodDonation";
import Emergency from "./components/Emergency";
import UserProfile from "./components/UserProfile";

import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import BloodChartPage from "./admin/BloodChartPage";
import CombinedDonorChart from "./admin/chart/CombinedDonorChart";

import BloodInventoryTable from "./admin/table/BloodInventoryTable";
import RegisteredDonorsTable from "./admin/table/RegisteredDonorsTable";

export default function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bloodguide" element={<BloodGuide />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blood-donation" element={<BloodDonation />} />
        <Route path="/emergency-blood" element={<Emergency />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* Admin pages with persistent Sidebar */}
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="chart" element={<BloodChartPage />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
