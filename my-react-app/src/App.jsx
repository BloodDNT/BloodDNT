import { Routes, Route } from 'react-router-dom'
import Login from './components/Login';
import Home from './components/HomeUserPage';
import Register from './components/Register';
import BloodGuide from './components/BloodGuide';
import News from './components/News';
import Contact from './components/Contact';
import BloodDonation from './components/BloodDonation';
import Emergency from './components/Emergency';
import UserProfile  from './components/UserProfile';
import RequestBloodPage from './components/RequestBloodPage';
import { UserProvider } from './context/UserContext';
import DonationHistoryPage from './components/DonationHistoryPage';
import RequestBlood from './components/RequestBlood';

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
      <Route path="/register/request-blood" element={<RequestBloodPage />} />
      <Route path="/history" element={<DonationHistoryPage/>}/>
      <Route path="/request-blood" element={<RequestBlood />} />
      {/* Add more routes as needed */}
    </Routes>
    </UserProvider>
  );
}
