import { Routes, Route } from 'react-router-dom'
import Login from './components/Login';
import Home from './components/HomePage';
import Register from './components/Register';
import BloodGuide from './components/BloodGuide';
import News from './components/News';
import Contact from './components/Contact';
import BloodDonation from './components/BloodDonation';
import Emergency from './components/Emergency';
import UserProfile  from './components/UserProfile';
import BloodKnowledge from './components/BloodKnowledge';
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import BloodChartPage from "./admin/BloodChartPage";

import BlogManagement from "./admin/BlogManagement";

import AboutUs from './components/AboutUs';

import { UserProvider } from './context/UserContext';
      
import CombinedDonorChart from "./admin/chart/CombinedDonorChart";


import BloodInventoryTable from "./admin/table/BloodInventoryTable";
import RegisteredDonorsTable from "./admin/table/RegisteredDonorsTable";

export default function App() {
  return (
    <UserProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/bloodguide" element={<BloodGuide/>} />
      <Route path='/news' element={<News/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/blood-donation' element={<BloodDonation/>}/>
      <Route path="/emergency-blood" element={<Emergency />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/bloodknowledge" element={<BloodKnowledge />} />
      <Route path="/blood-inventory" element={<BloodInventoryTable />} />
      <Route path="/registered-donors" element={<RegisteredDonorsTable />} /> 
      <Route path="/combined-donor-chart" element={<CombinedDonorChart />} />
      <Route path="/about" element={<AboutUs />} />
      {/* Admin routes */}
      <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="chart" element={<BloodChartPage />} />

          <Route path="blogs" element={<BlogManagement />} />
        </Route>
      </Routes>

    </UserProvider>
  );
}
