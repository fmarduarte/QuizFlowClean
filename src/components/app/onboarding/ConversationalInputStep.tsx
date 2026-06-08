import { cn } from "@/lib/utils";

interface ConversationalInputStepProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  followUpQuestion?: string | null;
  followUpValue?: string;
  onFollowUpChange?: (value: string) => void;
  guidance?: string | null;
  disabled?: boolean;
  multiline?: boolean;
}

export function ConversationalInputStep({
  value,
  onChange,
  placeholder = "Type your answer…",
  followUpQuestion,
  followUpValue = "",
  onFollowUpChange,
  guidance,
  disabled,
  multiline = true,
}: ConversationalInputStepProps) {
  const InputTag = multiline ? "textarea" : "input";

  return (
    <div className="space-y-6 animate-fade-in">
      {guidance && (
        <p className="text-sm sm:text-base text-muted-foreground/60 leading-relaxed">{guidance}</p>
      )}

      <div className="relative">
        <InputTag
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={multiline ? 3 : undefined}
          className={cn(
            "w-full bg-transparent border-0 border-b border-white/[0.12] rounded-none",
            "text-lg sm:text-xl text-foreground placeholder:text-muted-foreground/30",
            "focus:outline-none focus:border-white/30 focus:ring-0",
            "transition-colors duration-200 resize-none py-3",
            multiline ? "min-h-[72px]" : "h-14"
          )}
          autoFocus
        />
      </div>

      {followUpQuestion && onFollowUpChange && (
        <div className="space-y-4 pt-2 animate-fade-in">
          <p className="text-base sm:text-lg text-foreground/90 leading-snug">{followUpQuestion}</p>
          <InputTag
            value={followUpValue}
            onChange={(e) => onFollowUpChange(e.target.value)}
            placeholder="Add more detail…"
            disabled={disabled}
            rows={2}
            className={cn(
              "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl",
              "text-base text-foreground placeholder:text-muted-foreground/30",
              "focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10",
              "transition-colors duration-200 resize-none px-4 py-3 min-h-[56px]"
            )}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
