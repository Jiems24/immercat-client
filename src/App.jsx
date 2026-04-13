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
import OwnerListPage from "./pages/OwnerListPage";
import OwnerCreatePage from "./pages/OwnerCreatePage";
import OwnerDetailsPage from "./pages/OwnerDetailsPage";
import OwnerEditPage from "./pages/OwnerEditPage";
import PublicPropertyListPage from "./pages/PublicPropertyListPage";
import PublicPropertyDetailsPage from "./pages/PublicPropertyDetailsPage";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PublicPropertyListPage />} />
        <Route path="/properties/:propertyId" element={<PublicPropertyDetailsPage />} />
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
        <Route path="/admin/owners" element={<IsPrivate><OwnerListPage /></IsPrivate>} />
        <Route path="/admin/owners/create" element={<IsPrivate><OwnerCreatePage /></IsPrivate>} />
        <Route path="/admin/owners/:ownerId" element={<IsPrivate><OwnerDetailsPage /></IsPrivate>} />
        <Route path="/admin/owners/edit/:ownerId" element={<IsPrivate><OwnerEditPage /></IsPrivate>} />
      </Routes>
    </div>
  );
}

export default App;