import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CasesPage, {
  action as CasePageAction,
} from "./dashboardpages/CasesPage";
import ArchivesPage from "./dashboardpages/ArchivesPage";
import ReportPage from "./dashboardpages/ReportPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "/dashboard",
        element: <CasesPage />,
        index: true,
        action: CasePageAction,
      },
      {
        path: "archives",
        element: <ArchivesPage />,
      },
      {
        path: "report",
        element: <ReportPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
