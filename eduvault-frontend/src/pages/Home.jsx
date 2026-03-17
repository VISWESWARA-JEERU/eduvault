import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const role = "user";

  return (
    <div className="home-page">
      <div className="home-card">
        <h1 className="home-title">EduVault 📚</h1>

        <p className="home-subtitle">
          A centralized academic hub of <b>JNTUA College of Engineering</b> where you can explore branch-wise,
          semester-wise, and subject-wise learning resources — all in one
          colorful place.
        </p>

        <div className="home-actions">
          <button
            className="home-button home-button-primary"
            onClick={() => navigate("/login", { state: { role } })}
          >
            Login
          </button>

          <button
            className="home-button home-button-outline"
            onClick={() => navigate("/register", { state: { role } })}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;