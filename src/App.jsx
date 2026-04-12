import "./App.css";
import { Routes, Route } from "react-router-dom";
import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import PropertyListPage from "./pages/PropertyListPage";
import PropertyCreatePage from "./pages/PropertyCreatePage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import PropertyEditPage from "./pages/PropertyEditPage";
import ClientListPage from "./pages/ClientListPage";
import ClientCreatePage from "./pages/ClientCreatePage";
import ClientDetailsPage from "./pages/ClientDetailsPage";
import ClientEditPage from "./pages/ClientEditPage";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<IsAnon><LoginPage /></IsAnon>} />
        <Route path="/admin" element={<IsPrivate><DashboardPage /></IsPrivate>} />
        <Route path="/admin/properties" element={<IsPrivate><PropertyListPage /></IsPrivate>} />
        <Route path="/admin/properties/create" element={<IsPrivate><PropertyCreatePage /></IsPrivate>} />
        <Route path="/admin/properties/:propertyId" element={<IsPrivate><PropertyDetailsPage /></IsPrivate>} />
        <Route path="/admin/properties/edit/:propertyId" element={<IsPrivate><PropertyEditPage /></IsPrivate>} />
        <Route path="/admin/clients" element={<IsPrivate><ClientListPage /></IsPrivate>} />
        <Route path="/admin/clients/create" element={<IsPrivate><ClientCreatePage /></IsPrivate>} />
        <Route path="/admin/clients/:clientId" element={<IsPrivate><ClientDetailsPage /></IsPrivate>} />
        <Route path="/admin/clients/edit/:clientId" element={<IsPrivate><ClientEditPage /></IsPrivate>} />
      </Routes>
    </div>
  );
}

export default App;