import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login.tsx";
import Signup from "@/pages/Signup.tsx";
import ChannelsPage from "@/pages/ChannelsPage.tsx";
import AppLayout from "@/components/layout/AppLayout.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route element={<AppLayout />}>
          <Route path="/channels" element={<ChannelsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
