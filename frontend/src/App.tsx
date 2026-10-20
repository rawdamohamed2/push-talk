import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login.tsx";
import Signup from "@/pages/Signup.tsx";
import ChannelsPage from "@/pages/ChannelsPage.tsx";
import AppLayout from "@/components/layout/AppLayout.tsx";
import ChannelRoomPage from "@/pages/ChannelRoomPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import GuestRoute from "@/components/auth/GuestRoute.tsx";
import NotFound from "@/pages/NotFound.tsx";
import { SessionProvider } from "@/hooks/useSession.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/" element={<Login />} />
              <Route path="/sign-up" element={<Signup />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/channels" element={<ChannelsPage />} />
                <Route path="/channels/:id" element={<ChannelRoomPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default App;
