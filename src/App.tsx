import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/login/Login";
import QuoteList from "./components/quote-list/QuoteList";
import QuoteCreation from "./components/quote-creation/QuoteCreation";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/quote-list", element: <QuoteList /> },
  { path: "/quote-creation", element: <QuoteCreation /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
