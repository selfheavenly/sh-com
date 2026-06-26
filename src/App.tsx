import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";
import { MayPage } from "./pages/MayPage";

export function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/admin" || path.startsWith("/admin/")) return <AdminPage />;
  if (path === "/may") return <MayPage />;
  return <HomePage />;
}
