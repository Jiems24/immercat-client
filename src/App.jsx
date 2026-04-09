import "./App.css";
import { Routes, Route } from "react-router-dom";
import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";

// Pages - Auth
import LoginPage from "./pages/LoginPage";

// Pages - Private
import DashboardPage from "./pages/DashboardPage";

// Pages - Public
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />

        {/* Auth */}
        <Route path="/login" element={<IsAnon><LoginPage /></IsAnon>} />

        {/* Private */}
        <Route path="/admin" element={<IsPrivate><DashboardPage /></IsPrivate>} />
      </Routes>
    </div>
  );
}

export default App;