import { useEffect, useRef, useState } from "react";

export type AutosaveStatus = "idle" | "pending" | "saving" | "saved";

export function useAutosave<T>(
  value: T,
  onSave: (value: T) => void,
  delay = 800
): AutosaveStatus {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const onSaveRef = useRef(onSave);
  const isFirstRender = useRef(true);
  const valueRef = useRef(value);
  const resetTimerRef = useRef<number | null>(null);

  onSaveRef.current = onSave;
  valueRef.current = value;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setStatus("pending");
    const timer = window.setTimeout(() => {
      setStatus("saving");
      onSaveRef.current(valueRef.current);
      setStatus("saved");
      resetTimerRef.current = window.setTimeout(() => setStatus("idle"), 2000);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [value, delay]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  return status;
}
