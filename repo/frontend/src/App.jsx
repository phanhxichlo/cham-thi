import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InputAnswer from "./pages/InputAnswer";
import Scan from "./pages/Scan";
import Review from "./pages/Review";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/input" element={<InputAnswer />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/review" element={<Review />} />
      </Routes>
    </BrowserRouter>
  );
}