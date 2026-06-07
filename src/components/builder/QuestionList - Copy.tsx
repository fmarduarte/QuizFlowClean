import { ChevronDown, ChevronUp, Copy, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQuestionTypeLabel } from "@/lib/quiz-question-types";
import type { Question } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuestionListProps {
  questions: Question[];
  selectedQuestionId: string | null;
  quizTypeId?: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (id: string, offset: -1 | 1) => void;
}

function QuestionItem({
  question,
  index,
  total,
  quizTypeId,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onMove,
}: {
  question: Question;
  index: number;
  total: number;
  quizTypeId?: string;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (offset: -1 | 1) => void;
}) {
  const typeLabel = getQuestionTypeLabel(index, total, quizTypeId);

  return (
    <div
      className={cn(
        "group flex items-start gap-1 rounded-xl border transition-all duration-200",
        isSelected
          ? "border-violet-500/30 bg-violet-500/10 shadow-sm"
          : "border-transparent hover:border-hairline hover:bg-surface-elevated/60"
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex-1 min-w-0 text-left px-3 py-2.5"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground/60 tabular-nums">
            Q{index + 1}
          </span>
          <span className="text-[10px] text-violet-300/60 truncate">{typeLabel}</span>
        </div>
        <p className="text-sm font-medium truncate mt-0.5">
          {question.title || "Untitled question"}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {question.options.length} answer{question.options.length !== 1 ? "s" : ""}
        </p>
      </button>

      <div className="flex flex-col gap-0.5 pr-1.5 pt-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
          disabled={index === 0}
          onClick={(e) => {
            e.stopPropagation();
            onMove(-1);
          }}
          aria-label="Move question up"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
          disabled={index >= total - 1}
          onClick={(e) => {
            e.stopPropagation();
            onMove(1);
          }}
          aria-label="Move question down"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          aria-label="Duplicate question"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete question"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function QuestionList({
  questions,
  selectedQuestionId,
  quizTypeId,
  onSelect,
  onAdd,
  onDelete,
  onDuplicate,
  onMove,
}: QuestionListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-hairline flex-shrink-0">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Questions
        </h2>
        <p className="text-[11px] text-muted-foreground/70 mt-0.5">
          {questions.length} question{questions.length !== 1 ? "s" : ""} · use arrows to reorder
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {questions.map((question, index) => (
          <QuestionItem
            key={question.id}
            question={question}
            index={index}
            total={questions.length}
            quizTypeId={quizTypeId}
            isSelected={selectedQuestionId === question.id}
            onSelect={() => onSelect(question.id)}
            onDelete={() => onDelete(question.id)}
            onDuplicate={() => onDuplicate(question.id)}
            onMove={(offset) => onMove(question.id, offset)}
          />
        ))}

        {questions.length === 0 && (
          <div className="rounded-xl border border-dashed border-hairline p-6 text-center">
            <p className="text-sm text-muted-foreground">No questions yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Add your first quiz question</p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-hairline flex-shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          className="w-full rounded-xl border-hairline border-dashed hover:border-violet-500/30 hover:bg-violet-500/5 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add question
        </Button>
      </div>
    </div>
  );
}
