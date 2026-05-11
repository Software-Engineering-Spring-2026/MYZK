import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProjectDetails from "./pages/ProjectDetails";
import CreateProject from "./pages/CreateProject";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import InstructorProfile from "./pages/InstructorProfile";

function App() {
  useEffect(() => {
    // 🧠 get users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 🧠 check if admin already exists
    const adminExists = users.some(
      (user) => user.email === "admin@guc.edu.eg"
    );

    // 🧠 if not → add admin
    if (!adminExists) {
      users.push({
        firstName: "Admin",
        lastName: "User",
        email: "admin@guc.edu.eg",
        password: "123456",
        role: "admin",
      });

      localStorage.setItem("users", JSON.stringify(users));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/create" element={<CreateProject />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/instructor/:email" element={<InstructorProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;