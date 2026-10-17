import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login.tsx";
import Signup from "@/pages/Signup.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
