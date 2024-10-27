import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// import Photo from "./Photo.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ManualUpload from "./ManualUpload.tsx";
import Results from "./Results.tsx";
import UploadAndDisplayImage from "./UploadImage.tsx";

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
    element: <UploadAndDisplayImage />,
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
