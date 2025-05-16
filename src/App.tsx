import { useRoutes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Navigation from "./components/Navigation";

const routes = [
  { path: "/", element: <Dashboard /> },
  { path: "/history", element: <History /> }
];

function App() {
  const children = useRoutes(routes);

  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <Navigation />
      </div>
    </>
  );
}

export default App;
