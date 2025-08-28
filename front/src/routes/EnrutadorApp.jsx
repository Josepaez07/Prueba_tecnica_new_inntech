import { lazy, Suspense } from "react";

const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const Login = lazy(() => import("../views/auth/Login"));
const Register = lazy(() => import("../views/auth/Register"));
const Dashboard = lazy(()=> import("../views/dashboard/dashboard"))
const VoterDashboard = lazy(()=> import("../views/dashboard/VoterDashboard"))
const CandidateDashboard = lazy(()=> import("../views/dashboard/CandidateDashboard"))
const AdminDashboard = lazy(()=> import("../views/dashboard/AdminDashboard"))



const BASE_PATH = "/new-inntech";

const EnrutadorApp = [
  {
    path: `${BASE_PATH}/login`,
    element: (
      <Suspense fallback={<div>Cargando...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: `${BASE_PATH}/register`,
    element: (
      <Suspense fallback={<div>Cargando...</div>}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: BASE_PATH,
    element: (
      <Suspense fallback={<div>Cargando...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: `${BASE_PATH}/dashboard`,
    element: (
      <Suspense fallback={<div>Cargando...</div>}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: `${BASE_PATH}/voter-dashboard`,
    element: (
      <Suspense fallback={<div>Cargando...</div>}>
        <VoterDashboard />
      </Suspense>
    ),
  },
  {
    path: `${BASE_PATH}/candidater-dashboard`,
    element: (
      <Suspense fallback={<div>Cargando...</div>}>
        <CandidateDashboard />
      </Suspense>
    ),
  },
  {
    path: `${BASE_PATH}/admin-dashboard`,
    element: (
      <Suspense fallback={<div>Cargando...</div>}>
        <AdminDashboard />
      </Suspense>
    ),
  },
];

export default EnrutadorApp;
