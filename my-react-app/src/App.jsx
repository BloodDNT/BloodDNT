import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/HomeUserPage';
import Register from './components/Register';
import BloodGuide from './components/BloodGuide';
import News from './components/News';
import Contact from './components/Contact';
import BloodDonation from './components/BloodDonation';
import Emergency from './components/Emergency';
import UserProfile from './components/UserProfile';
import BloodKnowledge from './components/BloodKnowledge';
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import BloodChartPage from "./admin/BloodChartPage";
import BlogManagement from "./admin/BlogManagement";
import AboutUs from './components/AboutUs';
import CombinedDonorChart from "./admin/chart/CombinedDonorChart";
import BloodInventoryTable from "./admin/table/BloodInventoryTable";
import RegisteredDonorsTable from "./admin/table/RegisteredDonorsTable";
import RequestBloodPage from './components/RequestBloodPage';
import { UserProvider } from './context/UserContext';
import DonationHistoryPage from './components/DonationHistoryPage';
import RequestBlood from './components/RequestBlood';
import UserActivityPage from './components/UserActivityPage';
import RequestDetail from './components/RequestDetail';
import DonationDetail from './components/DonationDetail';
import EditRegisterDonate from './components/EditRegisterDonate';
import NotificationPage from './components/NotificationPage';
import EditRequestBlood from './components/EditRequestBlood';
import BloodCompatibility from './components/BloodCompatibility';
import News1 from './components/News1'
import News2 from './components/News2'
import News3 from './components/News3'
import News4 from './components/News4'
import News5 from './components/News5'
import News6 from './components/News6'

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bloodguide" element={<BloodGuide />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blood-donation" element={<BloodDonation />} />
        <Route path="/donation/edit/:id" element={<EditRegisterDonate />} />
        <Route path="/emergency-blood" element={<Emergency />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/bloodknowledge" element={<BloodKnowledge />} />
        <Route path="/blood-inventory" element={<BloodInventoryTable />} />
        <Route path="/registered-donors" element={<RegisteredDonorsTable />} />
        <Route path="/combined-donor-chart" element={<CombinedDonorChart />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/register/request-blood" element={<RequestBloodPage />} />
        <Route path="/history" element={<DonationHistoryPage />} />
        <Route path="/request-blood" element={<RequestBlood />} />
        <Route path="/my-activities" element={<UserActivityPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/request/:id" element={<RequestDetail />} />
        <Route path="/donation/:id" element={<DonationDetail />} />
        <Route path="/request/edit/:id" element={<EditRequestBlood />} />
        <Route path="/blood-compatibility" element={<BloodCompatibility />} />
        <Route path="/news-news1" element={<News1/>}/>
        <Route path="/news-news2" element={<News2/>}/>
        <Route path="/news-news3" element={<News3/>}/>
        <Route path="/news-news4" element={<News4/>}/> 
        <Route path="/news-news5" element={<News5/>}/>
                <Route path="/news-news6" element={<News6/>}/>

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
