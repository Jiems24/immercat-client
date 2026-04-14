import "./App.css";
import { Routes, Route } from "react-router-dom";
import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import PropertyListPage from "./pages/property/PropertyListPage";
import PropertyCreatePage from "./pages/property/PropertyCreatePage";
import PropertyDetailsPage from "./pages/property/PropertyDetailsPage";
import PropertyEditPage from "./pages/property/PropertyEditPage";
import ClientListPage from "./pages/client/ClientListPage";
import ClientCreatePage from "./pages/client/ClientCreatePage";
import ClientDetailsPage from "./pages/client/ClientDetailsPage";
import ClientEditPage from "./pages/client/ClientEditPage";
import OwnerListPage from "./pages/owner/OwnerListPage";
import OwnerCreatePage from "./pages/owner/OwnerCreatePage";
import OwnerDetailsPage from "./pages/owner/OwnerDetailsPage";
import OwnerEditPage from "./pages/owner/OwnerEditPage";
import PublicPropertyListPage from "./pages/public/PublicPropertyListPage";
import PublicPropertyDetailsPage from "./pages/public/PublicPropertyDetailsPage";

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