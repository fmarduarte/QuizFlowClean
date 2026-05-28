import { Outlet } from "react-router-dom";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export function MarketingLayout() {
  return (
    <div className="dark min-h-screen bg-background text-foreground selection:bg-violet-500/30">
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
}
