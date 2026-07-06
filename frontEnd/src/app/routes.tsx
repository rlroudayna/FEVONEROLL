import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import { Forbidden } from "./pages/Forbidden";

import {
  Welcome,
  Login,
  SignUp,
  Dashboard,
  Users,
  Vehicules,
  LoisDeRoute,
  Calages,
  Cycles,
  Demandes,
  Planning,
  Validation,
  ValidationConducteur,
  ValidationCharge,
  ValidationDetail,
  Reporting,
  Profile,
  ForgotPassword,
  NotFound,
  Clients,
} from "./pages";
import { ResetPassword } from "./pages/ResetPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/app",
        element: <Layout />,
        children: [
          { index: true, element: <Dashboard /> },
          {
            element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
            children: [
              { path: "users", element: <Users /> },
              { path: "clients", element: <Clients /> },
            ],
          },
          { path: "vehicules", element: <Vehicules /> },
          { path: "lois-de-route", element: <LoisDeRoute /> },
          { path: "calages", element: <Calages /> },
          { path: "cycles", element: <Cycles /> },
          { path: "demandes", element: <Demandes /> },
          { path: "planning", element: <Planning /> },
          { path: "validation", element: <Validation /> },
          {
            path: "validation/conducteur/:id",
            element: <ValidationConducteur />,
          },
          {
            path: "validation/charge/:id",
            element: <ValidationCharge />,
          },

          {
            path: "validation/detail/:id",
            element: <ValidationDetail />,
          },

{
  element: <ProtectedRoute allowedRoles={["ADMIN", "CHARGE_ESSAI"]} />,
  children: [
    { path: "reporting", element: <Reporting /> },
  ],
},          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
