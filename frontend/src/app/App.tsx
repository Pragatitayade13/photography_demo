import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "../routes";
import { AuthProvider } from "../features/auth/context/AuthContext";
import { SiteConfigProvider } from "../features/public/context/SiteConfigContext";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SiteConfigProvider>
        <RouterProvider router={router} />
      </SiteConfigProvider>
    </AuthProvider>
  );
};

export default App;
