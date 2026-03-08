import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/register", {
        name,
        email,
        password,
        role: "user"
      });

      alert("Registered successfully ✅");
      navigate("/login");

    } catch (err) {
      alert("User already exists ❌");
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Register</h2>
       
      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <br /><br />

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br /><br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br /><br />

      <button type="submit">Register</button>
    </form>
  );
}

export default Register;