import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Search from './pages/Search';
import AdminUsers from './pages/AdminUsers';
// import './App.css';
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/search" element={<Search />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}