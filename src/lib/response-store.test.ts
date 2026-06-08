import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const insertMock = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({ insert: (payload: unknown) => insertMock(payload) }),
  },
}));

import { saveFunnelResponse, flushPendingResponses } from "@/lib/response-store";

const PENDING_KEY = "qf_pending_responses";

const basePayload = {
  funnelId: "funnel-1",
  sessionId: "sess-1",
  answers: { q1: "o1" },
  lead: { email: "lead@example.com", name: "Lead" },
  completedAt: "2026-06-07T12:00:00.000Z",
};

describe("saveFunnelResponse durability", () => {
  beforeEach(() => {
    insertMock.mockReset();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("returns true and leaves no pending queue when the insert succeeds", async () => {
    insertMock.mockResolvedValue({ error: null });

    const ok = await saveFunnelResponse(basePayload);

    expect(ok).toBe(true);
    expect(localStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it("queues the response for retry when the insert fails (no silent lead loss)", async () => {
    insertMock.mockResolvedValue({ error: { message: "network down" } });

    const ok = await saveFunnelResponse(basePayload);

    expect(ok).toBe(false);
    const queued = JSON.parse(localStorage.getItem(PENDING_KEY) ?? "[]");
    expect(queued).toHaveLength(1);
    expect(queued[0].lead.email).toBe("lead@example.com");
  });

  it("flushes queued responses once the backend recovers", async () => {
    insertMock.mockResolvedValueOnce({ error: { message: "network down" } });
    await saveFunnelResponse(basePayload);
    expect(JSON.parse(localStorage.getItem(PENDING_KEY) ?? "[]")).toHaveLength(1);

    insertMock.mockResolvedValue({ error: null });
    await flushPendingResponses();

    expect(localStorage.getItem(PENDING_KEY)).toBeNull();
  });
});
