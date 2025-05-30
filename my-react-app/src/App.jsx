import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import Home from './HomePage'
import Register from './Register'
import BloodGuide from'./BloodGuide'
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/bloodguide" element={<BloodGuide/>} />
    </Routes>
  );
}
