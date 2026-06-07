import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question } from "@/types/quiz";
import { RESULT_EDITOR_ID } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuestionListProps {
  questions: Question[];
  selectedQuestionId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
}

function SortableQuestionItem({
  question,
  index,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}: {
  question: Question;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-start gap-1 rounded-xl border transition-all duration-200",
        isSelected
          ? "border-violet-500/30 bg-violet-500/10 shadow-sm"
          : "border-transparent hover:border-hairline hover:bg-surface-elevated/60",
        isDragging && "opacity-60 shadow-elevated z-10"
      )}
    >
      <button
        type="button"
        className="mt-2.5 ml-1 p-1 rounded-md text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing touch-none"
        aria-label={`Reorder question ${index + 1}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onSelect}
        className="flex-1 min-w-0 text-left px-2 py-2.5"
      >
        <span className="text-[10px] font-mono text-muted-foreground/60 tabular-nums">
          Q{index + 1}
        </span>
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
  onSelect,
  onAdd,
  onDelete,
  onDuplicate,
  onReorder,
}: QuestionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id));
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-hairline flex-shrink-0">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Questions
        </h2>
        <p className="text-[11px] text-muted-foreground/70 mt-0.5">
          Drag to reorder · {questions.length} total
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            {questions.map((question, index) => (
              <SortableQuestionItem
                key={question.id}
                question={question}
                index={index}
                isSelected={selectedQuestionId === question.id}
                onSelect={() => onSelect(question.id)}
                onDelete={() => onDelete(question.id)}
                onDuplicate={() => onDuplicate(question.id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {questions.length === 0 && (
          <div className="rounded-xl border border-dashed border-hairline p-6 text-center">
            <p className="text-sm text-muted-foreground">No questions yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Add your first question below</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => onSelect(RESULT_EDITOR_ID)}
          className={cn(
            "w-full flex items-start gap-2 rounded-xl border px-3 py-3 text-left transition-all duration-200 mt-2",
            selectedQuestionId === RESULT_EDITOR_ID
              ? "border-violet-500/30 bg-violet-500/10 shadow-sm"
              : "border-transparent hover:border-hairline hover:bg-surface-elevated/60"
          )}
        >
          <Sparkles className="h-4 w-4 text-violet-300/80 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-[10px] font-mono text-muted-foreground/60">Result</span>
            <p className="text-sm font-medium mt-0.5">Thank you screen</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">CTA & redirect</p>
          </div>
        </button>
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
