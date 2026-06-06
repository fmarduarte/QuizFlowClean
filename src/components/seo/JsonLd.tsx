import { useEffect } from "react";

interface JsonLdProps {
  id: string;
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ id, data }: JsonLdProps) {
  useEffect(() => {
    const scriptId = `jsonld-${id}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => {
      script?.remove();
    };
  }, [id, data]);

  return null;
}
