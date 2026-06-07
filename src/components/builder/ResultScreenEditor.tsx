import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FunnelResultScreen } from "@/types/quiz";

interface ResultScreenEditorProps {
  result: FunnelResultScreen;
  onChange: (result: FunnelResultScreen) => void;
}

export function ResultScreenEditor({ result, onChange }: ResultScreenEditorProps) {
  function update(field: keyof FunnelResultScreen, value: string) {
    onChange({ ...result, [field]: value });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 sm:px-6 py-4 border-b border-hairline flex-shrink-0">
        <p className="text-[10px] font-mono text-muted-foreground tabular-nums">Result screen</p>
        <h2 className="text-base font-semibold tracking-tight mt-1">Thank you & CTA</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Shown after the last question. Included in every published snapshot.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="result-title">Thank you title</Label>
          <Input
            id="result-title"
            value={result.thankYouTitle}
            onChange={(e) => update("thankYouTitle", e.target.value)}
            className="rounded-xl border-hairline bg-background/40"
            placeholder="Thank you!"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="result-message">Thank you message</Label>
          <Textarea
            id="result-message"
            value={result.thankYouMessage}
            onChange={(e) => update("thankYouMessage", e.target.value)}
            rows={3}
            className="rounded-xl border-hairline bg-background/40 resize-none min-h-[88px]"
            placeholder="Your answers have been submitted."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="result-cta-label">CTA button label</Label>
            <Input
              id="result-cta-label"
              value={result.ctaLabel}
              onChange={(e) => update("ctaLabel", e.target.value)}
              className="rounded-xl border-hairline bg-background/40"
              placeholder="Book a call"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="result-cta-url">Redirect URL</Label>
            <Input
              id="result-cta-url"
              type="url"
              value={result.ctaUrl}
              onChange={(e) => update("ctaUrl", e.target.value)}
              className="rounded-xl border-hairline bg-background/40"
              placeholder="https://calendly.com/..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
