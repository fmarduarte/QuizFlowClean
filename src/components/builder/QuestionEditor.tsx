import { Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Question } from "@/types/quiz";

interface QuestionEditorProps {
  question: Question | null;
  questionIndex: number;
  totalQuestions: number;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onOptionChange: (optionId: string, label: string) => void;
  onAddOption: () => void;
  onDeleteOption: (optionId: string) => void;
  onDeleteQuestion: () => void;
}

export function QuestionEditor({
  question,
  questionIndex,
  totalQuestions,
  onTitleChange,
  onDescriptionChange,
  onOptionChange,
  onAddOption,
  onDeleteOption,
  onDeleteQuestion,
}: QuestionEditorProps) {
  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-sm font-medium text-muted-foreground">Select a question to edit</p>
        <p className="text-xs text-muted-foreground/70 mt-1 max-w-xs">
          Choose a question from the list or add a new one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 sm:px-6 py-4 border-b border-hairline flex-shrink-0">
        <p className="text-[10px] font-mono text-muted-foreground tabular-nums">
          Question {questionIndex + 1} of {totalQuestions}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="question-title" className="text-xs text-muted-foreground">
            Question
          </Label>
          <Textarea
            id="question-title"
            value={question.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Type your question here…"
            className="min-h-[80px] text-base sm:text-lg font-medium resize-none bg-background/60 border-hairline rounded-xl leading-snug"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="question-desc" className="text-xs text-muted-foreground">
            Description <span className="text-muted-foreground/50">(optional)</span>
          </Label>
          <Input
            id="question-desc"
            value={question.description ?? ""}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Add helper text for respondents…"
            className="bg-background/60 border-hairline h-10 rounded-xl"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Answer options</Label>
            <span className="text-[10px] text-muted-foreground/60">
              {question.options.length} option{question.options.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-2">
            {question.options.map((option, i) => (
              <div key={option.id} className="flex items-center gap-2 group">
                <span className="flex-none h-7 w-7 rounded-lg bg-violet-500/15 text-violet-300 text-xs font-semibold flex items-center justify-center">
                  {String.fromCharCode(65 + i)}
                </span>
                <Input
                  value={option.label}
                  onChange={(e) => onOptionChange(option.id, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 bg-background/60 border-hairline h-10 rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onAddOption();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex-shrink-0"
                  onClick={() => onDeleteOption(option.id)}
                  disabled={question.options.length <= 1}
                  aria-label={`Delete option ${i + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onAddOption}
            className="w-full rounded-xl border-hairline border-dashed hover:border-violet-500/30 hover:bg-violet-500/5 text-sm"
          >
            <Plus className="h-4 w-4" />
            Add answer
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-6 border-t border-hairline flex-shrink-0">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete question
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl border-hairline">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this question?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove the question and all its answer options. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteQuestion}
                className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
