import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateAdmin from "./pages/CreateAdmin";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BranchManager from "./pages/admin/BranchManager";
import YearManager from "./pages/admin/YearManager";
import SemesterManager from "./pages/admin/SemesterManager";
import SubjectManager from "./pages/admin/SubjectManager";
import UnitManager from "./pages/admin/UnitManager";
import PdfManager from "./pages/admin/PdfManager"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <CreateAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="user">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route path="/admin/branches" element={<BranchManager />} />
      <Route path="/admin/years" element={<YearManager />} />
      <Route path="/admin/semesters" element={<SemesterManager />} />
      <Route path="/admin/subjects" element={<SubjectManager />} />
      <Route path="/admin/units" element={<UnitManager />} />
      <Route path="/admin/pdfs" element={<PdfManager />} />
    </Routes>
  );
}

export default App;