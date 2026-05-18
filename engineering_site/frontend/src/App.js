import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

/* FRONT OFFICE */
import Accueil from "./frontpages/Accueil";
import Services from "./frontpages/Services";
import ProjetsPublic from "./frontpages/ProjetsPublic";
import Apropos from "./frontpages/Apropos";
import Contact from "./frontpages/Contact";
import Inscription from "./frontpages/Inscription";
/* FRONT COMPONENTS */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* LOGIN */
import Login from "./pages/login/Login";

/* DASHBOARD */
import Dashboard from "./pages/dashboard/Dashboard";

/* CLIENTS */
import ListClients from "./pages/clients/ListClients";
import CreateClient from "./pages/clients/CreateClient";
import EditClient from "./pages/clients/EditClient";
import ClientDashboard from "./pages/clients/ClientDashboard"; // ← JDID

/* PROJETS */
import Projets from "./pages/projets/Projets";
import CreateProjet from "./pages/projets/CreateProjet";
import EditProjet from "./pages/projets/EditProjet";
import MesProjets from "./pages/projets/MesProjets";

/* EMPLOYES */
import MesSuivi from './pages/suivi/MesSuivi';
import ListEmployes from "./pages/employes/ListEmployes";
import CreateEmploye from "./pages/employes/CreateEmploye";
import EditEmploye from "./pages/employes/EditEmploye";
import EmployeeLayout from "./components/EmployeeLayout";

/* MESSAGES */
import ListMessages from "./pages/messages/ListMessages";

/* DOCUMENTS */
import ListDocuments from "./pages/documents/ListDocuments";
import CreateDocument from "./pages/documents/CreateDocument";
import EditDocument from "./pages/documents/EditDocument";

/* SUIVI */
import ListSuivi from "./pages/suivi/ListSuivi";
import CreateSuivi from "./pages/suivi/CreateSuivi";
import EditSuivi from "./pages/suivi/EditSuivi";

import BackLayout from "./components/BackLayout";

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>

      {!user && <Navbar />}

      <Routes>

        {/* FRONT OFFICE */}
        <Route path="/" element={<Accueil />} />
        <Route path="/services" element={<Services />} />
        <Route path="/ProjetsPublic" element={<ProjetsPublic />} />
        <Route path="/apropos" element={<Apropos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/inscription" element={<Inscription />} />
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            !user
              ? <Login setUser={setUser} />
              : user.role === "Administrateur"
                ? <Navigate to="/dashboard" />
                : user.role === "client"
                  ? <Navigate to="/client-dashboard" />
                  : <Navigate to="/mes-projets" />
          }
        />

        {/* ADMIN */}
        {user?.role === "Administrateur" && (
          <>
            <Route path="/dashboard" element={<BackLayout onLogout={handleLogout}><Dashboard /></BackLayout>} />

            <Route path="/projets" element={<BackLayout onLogout={handleLogout}><Projets /></BackLayout>} />
            <Route path="/create-projet" element={<BackLayout onLogout={handleLogout}><CreateProjet /></BackLayout>} />
            <Route path="/edit-projet/:id" element={<BackLayout onLogout={handleLogout}><EditProjet /></BackLayout>} />

            <Route path="/clients" element={<BackLayout onLogout={handleLogout}><ListClients /></BackLayout>} />
            <Route path="/create-client" element={<BackLayout onLogout={handleLogout}><CreateClient /></BackLayout>} />
            <Route path="/edit-client/:id" element={<BackLayout onLogout={handleLogout}><EditClient /></BackLayout>} />

            <Route path="/employes" element={<BackLayout onLogout={handleLogout}><ListEmployes /></BackLayout>} />
            <Route path="/create-employe" element={<BackLayout onLogout={handleLogout}><CreateEmploye /></BackLayout>} />
            <Route path="/edit-employe/:id" element={<BackLayout onLogout={handleLogout}><EditEmploye /></BackLayout>} />

            <Route path="/messages" element={<BackLayout onLogout={handleLogout}><ListMessages /></BackLayout>} />

            <Route path="/documents" element={<BackLayout onLogout={handleLogout}><ListDocuments /></BackLayout>} />
            <Route path="/documents/create" element={<BackLayout onLogout={handleLogout}><CreateDocument /></BackLayout>} />
            <Route path="/documents/edit/:id" element={<BackLayout onLogout={handleLogout}><EditDocument /></BackLayout>} />

            <Route path="/suivi" element={<BackLayout onLogout={handleLogout}><ListSuivi /></BackLayout>} />
            <Route path="/create-suivi" element={<BackLayout onLogout={handleLogout}><CreateSuivi /></BackLayout>} />
            <Route path="/edit-suivi/:id" element={<BackLayout onLogout={handleLogout}><EditSuivi /></BackLayout>} />
          </>
        )}

        {/* EMPLOYE */}
        {user?.role === "Employé" && (
          <Route element={<EmployeeLayout />}>
            <Route path="/mes-projets" element={<MesProjets />} />
            <Route path="/edit-projet/:id" element={<EditProjet />} />
            <Route path="/create-projet" element={<CreateProjet />} />
            <Route path="/mes-create-projet" element={<CreateProjet />} />
            <Route path="/mes-suivi" element={<MesSuivi />} />
            <Route path="/create-suivi" element={<CreateSuivi />} />
            <Route path="/edit-suivi/:id" element={<EditSuivi />} />
          </Route>
        )}

        {/* CLIENT */}
        {user?.role === "client" && (
          <Route
            path="/client-dashboard"
            element={<ClientDashboard user={user} onLogout={handleLogout} />}
          />
        )}

      </Routes>

      {!user && <Footer />}

    </>
  );
}

export default App;