import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ShoppingPage } from "./pages/ShoppingPage";
import { DiningPage } from "./pages/DiningPage";
import { DiningDetailPage } from "./pages/DiningDetailPage";
import { EntertainmentPage } from "./pages/EntertainmentPage";
import { PartyPage } from "./pages/PartyPage";
import { MedicalPage } from "./pages/MedicalPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shopping" element={<ShoppingPage />} />
        <Route path="/dining" element={<DiningPage />} />
        <Route path="/dining/:id" element={<DiningDetailPage />} />
        <Route path="/entertainment" element={<EntertainmentPage />} />
        <Route path="/party" element={<PartyPage />} />
        <Route path="/medical" element={<MedicalPage />} />
      </Routes>
    </Router>
  );
}
