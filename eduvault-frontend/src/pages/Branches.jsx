
import { useEffect, useState } from "react";
import API from "../api/axios";

function Branches() {
  const [branches, setBranches] = useState([]);
  const [name, setName] = useState("");

  const fetchBranches = async () => {
    const res = await API.get("/branches");
    setBranches(res.data);
  };

  const addBranch = async () => {
    await API.post("/branches", { name });
    setName("");
    fetchBranches();
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div>
      <h2>Branches</h2>
      <input value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Branch Name" />
      <button onClick={addBranch}>Add</button>

      <ul>
        {branches.map((b) => (
          <li key={b.id}>{b.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Branches;