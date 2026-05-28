import { useEffect, useState } from "react";
import type { AppSectionId } from "@/lib/routes";

const SECTION_IDS: AppSectionId[] = ["overview", "generator", "saved", "settings", "billing"];

export function useActiveSection() {
  const [active, setActive] = useState<AppSectionId>("overview");

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id as AppSectionId);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}
