import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./components/Login/Login";
import Default from "./components/Default/Default";
import Register from "./components/Register/Register";
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
