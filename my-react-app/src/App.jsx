import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import Home from './HomePage'
import Register from './Register'
import BloodGuide from'./BloodGuide'
import News from './News'
import Contact from './Contact'
import BloodDonation from './BloodDonation'
import Emergency from './Emergency';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/bloodguide" element={<BloodGuide/>} />
      <Route path='/news' element={<News/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/blood-donation' element={<BloodDonation/>}/>
      <Route path="/emergency-blood" element={<Emergency />} />

    
    </Routes>
  );
}
