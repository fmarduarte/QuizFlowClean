import { useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { AppNavbar } from "@/components/dashboard/AppNavbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark min-h-screen bg-background text-foreground flex selection:bg-violet-500/30">
      <div className="hidden lg:block w-64 flex-shrink-0 fixed inset-y-0 left-0 z-40">
        <AppSidebar />
      </div>

      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-opacity duration-300",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-72 max-w-[85vw] transition-transform duration-300 ease-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <AppSidebar onNavigate={() => setSidebarOpen(false)} className="h-full" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 rounded-xl"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        <AppNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
