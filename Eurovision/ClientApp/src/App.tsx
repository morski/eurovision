import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./components/login/login";
import Default from "./components/default/default";
import Register from "./components/register/register";
import './App.css';

const router = createBrowserRouter([
  {
    path: "*",
    element: <Default />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
