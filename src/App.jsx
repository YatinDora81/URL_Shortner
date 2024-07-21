import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App_layout from "./layouts/App_layout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Link from "./pages/Link";
import Auth from "./pages/Auth";
import Redirect_Link from "./pages/Redirect_Link";
import UrlProvider from "./context";
import Require_Auth from "./components/Require_Auth";
function App() {
  const router = createBrowserRouter([
    {
      element: <App_layout></App_layout>,
      children: [
        {
          path: "/",
          element: <Landing></Landing>,
        },
        {
          path: "/auth",
          element: <Auth></Auth>,
        },
        {
          path: "/dashboard", 
          element: (
            <Require_Auth>
              <Dashboard></Dashboard>
            </Require_Auth>
          ),
        },
        {
          path: "/link/:id", // all stats
          element: (
            <Require_Auth>
              <Link></Link>
            </Require_Auth>
          ),
        },
        {
          path: "/:id",
          element: <Redirect_Link></Redirect_Link>,
        },
      ],
    },
  ]);

  return (
    <UrlProvider>
      <RouterProvider router={router}></RouterProvider>
    </UrlProvider>
  );
}

export default App;
