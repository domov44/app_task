import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/protected/HomeScreen';
import DashBoardScreen from "./pages/protected/DashBoardScreen";
import LoginScreen from "./pages/open/LoginScreen";
import DataBaseView from "./pages/protected/DataBaseView";
import AppLog from "./pages/protected/AppLog";
import CreateModule from "./pages/protected/CreateModule";
import EditModule from "./pages/protected/EditModule";
import Setting from "./pages/protected/Setting";
import Profil from "./pages/protected/Profil";
import Test from "./pages/protected/Test";
import ProtectedRoute from './hooks/login-gestion/ProtectedRoute';
import NotFound from "./pages/error/NotFound";
import Error429 from "./pages/error/Error429"; 
import Error500 from "./pages/error/Error500";
import NewBlackListIp from './pages/protected/NewBlackListIp';
import Blacklistview from './pages/protected/BlacklistView';

function App() {
  return (
    <Routes>
      {/*Début des routes publiques à partir d'ici */}
      <Route path="/se-connecter" element={<LoginScreen />} /> {/* Page de connexion */}
      {/* Fin des routes publiques */}

      {/*Début des routes protégées à partir d'ici */}
      <Route path="/" element={<ProtectedRoute element={<HomeScreen />} allowedRoles={["1", "2", "3"]} />} /> {/* Page d'accueil */}
      <Route path="/parametres" element={<ProtectedRoute element={<Setting />} allowedRoles={["1", "2"]} />} /> {/* Page de réglages utilisateur */}
      <Route path="/profil" element={<ProtectedRoute element={<Profil />} allowedRoles={["1", "2"]} />} /> {/* Page de profil utilisateur */}
      <Route path="/admin/comptes" element={<ProtectedRoute element={<DataBaseView />} allowedRoles="1" />} /> {/* Page de pour gérer la database de l'app */}
      <Route path="/admin/requetes-log" element={<ProtectedRoute element={<AppLog />} allowedRoles="1" />} />
      <Route path="/admin/comptes/creer-compte" element={<ProtectedRoute element={<CreateModule />} allowedRoles="1" />} /> {/* Page pour ajouter un utlisateur */}
      <Route path="/admin/compte/modifier/:id" element={<ProtectedRoute element={<EditModule />} allowedRoles="1" />} /> {/* Page pour modifier un utlisateur */}
      <Route path="/admin/blacklist/ajouter-ip" element={<ProtectedRoute element={<NewBlackListIp />} allowedRoles="1" />} /> {/* Page ajouter une nouvelle ip à bloquer */}
      <Route path="/admin/blacklist" element={<ProtectedRoute element={<Blacklistview />} allowedRoles="1" />} /> {/* Page ajouter une nouvelle ip à bloquer */}
      <Route path="/test" element={<ProtectedRoute element={<Test />} allowedRoles={["1", "2", "3"]} />} /> {/* Page de test */}
      {/* Fin des routes protégées */}

      {/* Routes pour gérer les erreurs spécifiques */}
      <Route path="*" element={<NotFound />} /> {/* Page erreur 404 */}
      <Route path="/erreur-429" element={<Error429 />} /> {/* Page erreur 429 */}
      <Route path="/erreur-500" element={<Error500 />} /> {/* Page erreur 500 */}
    </Routes>
  );
}

export default App;
