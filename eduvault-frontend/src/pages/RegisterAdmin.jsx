import { useState } from "react";
import axios from "axios";

function RegisterAdmin() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/register-admin",
        data
      );
      alert("Admin Created Successfully");
    } catch (err) {
      alert("Error creating admin");
    }
  };

  return (
    <div>
      <h2>Register Admin</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" onChange={handleChange} />

      <button onClick={handleSubmit}>Create Admin</button>
    </div>
  );
}

export default RegisterAdmin;