import { RouterProvider } from "react-router-dom";
import { QuizzesProvider } from "@/context/QuizzesContext";
import { router } from "@/routes/router";

export default function App() {
  return (
    <QuizzesProvider>
      <RouterProvider router={router} />
    </QuizzesProvider>
  );
}
