import "./App.css";
import { Routes, Route } from "react-router-dom";
import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import PropertyListPage from "./pages/PropertyListPage";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<IsAnon><LoginPage /></IsAnon>} />
        <Route path="/admin" element={<IsPrivate><DashboardPage /></IsPrivate>} />
        <Route path="/admin/properties" element={<IsPrivate><PropertyListPage /></IsPrivate>} />
      </Routes>
    </div>
  );
}

export default App;