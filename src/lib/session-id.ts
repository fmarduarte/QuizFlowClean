const SESSION_KEY = "quizflow_respondent_session";

export function getRespondentSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function hasRecordedEvent(funnelId: string, eventType: "view" | "start"): boolean {
  try {
    return sessionStorage.getItem(`quizflow_event_${funnelId}_${eventType}`) === "1";
  } catch {
    return false;
  }
}

export function markEventRecorded(funnelId: string, eventType: "view" | "start"): void {
  try {
    sessionStorage.setItem(`quizflow_event_${funnelId}_${eventType}`, "1");
  } catch {
    // sessionStorage unavailable
  }
}
