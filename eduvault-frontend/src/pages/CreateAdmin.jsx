
import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function CreateAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (form.role === "admin") {
        const res = await API.post("/register-admin", {
          name: form.name,
          email: form.email,
          password: form.password
        });
        alert(res.data.message);
      } else {
        const res = await API.post("/register", {
          name: form.name,
          email: form.email,
          password: form.password
        });
        alert(res.data.message);
      }

      // after creation, go back to admin dashboard
      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div>
      <h2>Create Account</h2>

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <br />
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <br />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <br />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />

      <br />
      <button onClick={handleSubmit}>Create</button>
    </div>
  );
}

export default CreateAdmin;