import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { PAGE_META } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  usePageMeta({ ...PAGE_META.notFound, canonical: undefined });

  return (
    <main
      id="main-content"
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
      <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button asChild className="mt-6 rounded-xl">
        <Link to={ROUTES.landing}>Back to homepage</Link>
      </Button>
    </main>
  );
}
