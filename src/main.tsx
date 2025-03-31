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
import ArchivesPage, {
  loader as ArchivesPageLoader,
  action as ArchivesPageAction,
} from "./dashboardpages/ArchivesPage";
import ReportPage, {
  loader as ReportPageLoader,
} from "./dashboardpages/ReportPage";
import CaseDetails, {
  action as CaseDetailsAction,
  loader as CaseDetailsLoader,
} from "./systemComponents/CaseDetails";
import UsersPage, {
  action as UsersPageAction,
  loader as UserPageLoader,
} from "./dashboardpages/UsersPage";
import BarangayCases, {
  loader as BarangayCasesLoader,
} from "./systemComponents/BarangayCases";
import Settings, {
  loader as SettingsLoader,
  action as SettingsAction,
} from "./pages/Settings";
import { action as deleteUser } from "./backendapi/deleteapi/destroyUser";
import { action as deleteCase } from "./backendapi/deleteapi/destroyCase";
import "./index.css";
import IndexPage, {
  loader as IndexPageLoader,
} from "./systemComponents/IndexPage";
import { redirect } from "react-router-dom";
import { isAuthenticated } from "./utils/auth";
import { Box } from "@chakra-ui/react";

import ErrorComponent from "./systemComponents/ErrorComponent";
import OverallReport, {
  loader as OverallReportLoader,
} from "./dashboardpages/OverallReport";
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
    errorElement: <ErrorComponent />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    loader: DashboardLoader,
    children: [
      {
        index: true,
        element: <IndexPage />,
        loader: IndexPageLoader,
      },
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
        loader: ArchivesPageLoader,
        action: ArchivesPageAction,
      },
      {
        path: "report",
        element: <ReportPage />,
        loader: ReportPageLoader,
      },
      {
        path: "barangayCases/:id",
        element: <BarangayCases />,
        loader: BarangayCasesLoader,
      },

      {
        path: "overallreport",
        element: <OverallReport />,
        loader: OverallReportLoader,
      },
    ],
  },
  {
    path: "/settings",
    element: <Settings />,
    loader: SettingsLoader,
    action: SettingsAction,
  },

  {
    path: "/casedetails/:id",
    element: <CaseDetails />,
    action: CaseDetailsAction,
    loader: CaseDetailsLoader,
  },
]);

// Render Application
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <Box fontFamily={"Poppins"}>
        <RouterProvider router={router} />
      </Box>
    </Provider>
  </StrictMode>
);
