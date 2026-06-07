import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { QuizzesProvider } from "@/context/QuizzesContext";
import { router } from "@/routes/router";

export default function App() {
  return (
    <AuthProvider>
      <QuizzesProvider>
        <RouterProvider router={router} />
      </QuizzesProvider>
    </AuthProvider>
  );
}
