import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AuthModal from "./components/AuthModal";
import Navbar from "./components/Navbar";
import StarfieldBackground from "./components/StarfieldBackground";
import { Toaster } from "./components/ui/sonner";
import { AuthModalProvider } from "./context/AuthModalContext";
import Applications from "./pages/Applications";
import CVForge from "./pages/CVForge";
import CoverLetter from "./pages/CoverLetter";
import Dashboard from "./pages/Dashboard";
import Oracle from "./pages/Oracle";
import Profile from "./pages/Profile";

const rootRoute = createRootRoute({
  component: () => (
    <AuthModalProvider>
      <StarfieldBackground />
      <Navbar />
      <main style={{ paddingTop: "80px", minHeight: "100vh" }}>
        <Outlet />
      </main>
      <Toaster theme="dark" position="top-right" />
      <AuthModal />
    </AuthModalProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const cvForgeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cv-forge",
  component: CVForge,
});

const oracleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/oracle",
  component: Oracle,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});

const coverLetterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cover-letter",
  component: CoverLetter,
});

const applicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/applications",
  component: Applications,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  cvForgeRoute,
  oracleRoute,
  profileRoute,
  coverLetterRoute,
  applicationsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
