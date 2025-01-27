import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CasesPage, {
  action as CasePageAction,
} from "./dashboardpages/CasesPage";
import { Provider } from "@/components/ui/provider";
import ArchivesPage from "./dashboardpages/ArchivesPage";
import ReportPage from "./dashboardpages/ReportPage";
import "./index.css";
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
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
