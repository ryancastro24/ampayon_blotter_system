import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage, { action as LoginAction } from "./pages/LoginPage";
import Dashboard, { loader as DashboardLoader } from "./pages/Dashboard";
import CasesPage, {
  action as CasePageAction,
  loader as CasePageLoader,
} from "./dashboardpages/CasesPage";
import { Provider } from "@/components/ui/provider";
import ArchivesPage from "./dashboardpages/ArchivesPage";
import ReportPage from "./dashboardpages/ReportPage";
import CaseDetails from "./systemComponents/CaseDetails";
import UsersPage, {
  action as UsersPageAction,
  loader as UserPageLoader,
} from "./dashboardpages/UsersPage";
import BarangayCases from "./systemComponents/BarangayCases";
import Settings, { loader as SettingsLoader } from "./pages/Settings";
import { action as deleteUser } from "./backendapi/deleteapi/destroyUser";
import { action as deleteCase } from "./backendapi/deleteapi/destroyCase";
import "./index.css";
import { redirect } from "react-router-dom";
import { isAuthenticated } from "./utils/auth";

// Loader to protect /landing page route
const landingPageLoader = () => {
  if (isAuthenticated()) {
    return redirect("/dashboard"); // Redirect to dashboard if already logged in
  }
  return null; // Proceed if not authenticated
};

// Router Configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    action: LoginAction,
    loader: landingPageLoader,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    loader: DashboardLoader,
    children: [
      {
        path: "cases",
        element: <CasesPage />,
        action: CasePageAction,
        loader: CasePageLoader,
        children: [
          {
            path: ":caseId/destroy",
            action: deleteCase,
          },
        ],
      },
      {
        path: "users",
        element: <UsersPage />,
        action: UsersPageAction,
        loader: UserPageLoader,
        children: [
          {
            path: ":userId/destroy",
            action: deleteUser,
          },
        ],
      },
      {
        path: "archives",
        element: <ArchivesPage />,
      },
      {
        path: "report",
        element: <ReportPage />,
      },
      {
        path: "barangayCases",
        element: <BarangayCases />,
      },
    ],
  },
  {
    path: "/settings",
    element: <Settings />,
    loader: SettingsLoader,
  },

  {
    path: "/casedetails/:id",
    element: <CaseDetails />,
  },
]);

// Render Application
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
