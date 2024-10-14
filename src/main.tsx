import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ManualUpload from "./ManualUpload.tsx";
import Results from "./Results.tsx";
import UploadImage from "./UploadImage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/manual",
    element: <ManualUpload />,
  },
  {
    path: "/upload",
    element: <UploadImage />,
  },
  {
    path: "/results",
    element: <Results />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
