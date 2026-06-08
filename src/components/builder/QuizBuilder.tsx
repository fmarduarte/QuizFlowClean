import { useCallback } from "react";
import { useQuizBuilder } from "@/hooks/use-quiz-builder";
import { BuilderToolbar } from "@/components/builder/BuilderToolbar";
import { QuestionList } from "@/components/builder/QuestionList";
import { QuestionEditor } from "@/components/builder/QuestionEditor";
import { ResultScreenEditor } from "@/components/builder/ResultScreenEditor";
import { QuizLivePreview } from "@/components/builder/QuizLivePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Quiz } from "@/types/quiz";
import { RESULT_EDITOR_ID } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizBuilderProps {
  quiz: Quiz;
  onSave: (quiz: Quiz) => void;
  onPublish: (draft: Quiz) => void;
  onCopyLink?: () => void;
  isPublishing?: boolean;
  publishErrors?: string[];
  copied?: boolean;
}

export function QuizBuilder({
  quiz,
  onSave,
  onPublish,
  onCopyLink,
  isPublishing = false,
  publishErrors = [],
  copied = false,
}: QuizBuilderProps) {
  const handleSave = useCallback(
    (draft: Quiz) => {
      onSave({
        ...draft,
        id: quiz.id,
        createdAt: quiz.createdAt,
        status: quiz.status,
        published: quiz.published,
        publishedAt: quiz.publishedAt,
        publicSlug: quiz.publicSlug,
        publishedSnapshot: quiz.publishedSnapshot,
        updatedAt: new Date().toISOString(),
      });
    },
    [onSave, quiz]
  );

  const {
    draft,
    selectedQuestion,
    selectedQuestionId,
    selectedIndex,
    saveStatus,
    setSelectedQuestionId,
    updateTitle,
    updateResult,
    updateQuestionTitle,
    updateQuestionDescription,
    updateOptionLabel,
    addQuestion,
    deleteQuestion,
    duplicateQuestion,
    reorderQuestions,
    addOption,
    deleteOption,
  } = useQuizBuilder({
    quiz,
    onSave: handleSave,
  });

  const editorPanel = (
    <BuilderEditorPanel
      selectedQuestionId={selectedQuestionId}
      selectedQuestion={selectedQuestion}
      selectedIndex={selectedIndex}
      totalQuestions={draft.questions.length}
      result={draft.result}
      onResultChange={updateResult}
      onTitleChange={(title) =>
        selectedQuestionId &&
        selectedQuestionId !== RESULT_EDITOR_ID &&
        updateQuestionTitle(selectedQuestionId, title)
      }
      onDescriptionChange={(desc) =>
        selectedQuestionId &&
        selectedQuestionId !== RESULT_EDITOR_ID &&
        updateQuestionDescription(selectedQuestionId, desc)
      }
      onOptionChange={(optionId, label) =>
        selectedQuestionId &&
        selectedQuestionId !== RESULT_EDITOR_ID &&
        updateOptionLabel(selectedQuestionId, optionId, label)
      }
      onAddOption={() =>
        selectedQuestionId &&
        selectedQuestionId !== RESULT_EDITOR_ID &&
        addOption(selectedQuestionId)
      }
      onDeleteOption={(optionId) =>
        selectedQuestionId &&
        selectedQuestionId !== RESULT_EDITOR_ID &&
        deleteOption(selectedQuestionId, optionId)
      }
      onDeleteQuestion={() =>
        selectedQuestionId &&
        selectedQuestionId !== RESULT_EDITOR_ID &&
        deleteQuestion(selectedQuestionId)
      }
    />
  );

  return (
    <div className="flex flex-col -m-4 sm:-m-6 lg:-m-8 min-h-[calc(100vh-4rem)] bg-background">
      <BuilderToolbar
        quiz={draft}
        title={draft.title}
        onTitleChange={updateTitle}
        saveStatus={saveStatus}
        onPublish={() => onPublish(draft)}
        onCopyLink={onCopyLink}
        isPublishing={isPublishing}
        canPublish={draft.questions.length > 0}
        copied={copied}
      />

      {publishErrors.length > 0 && (
        <div
          className="mx-4 sm:mx-6 mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3"
          role="alert"
        >
          <p className="text-sm font-medium text-amber-100/90 mb-1">Fix before publishing</p>
          <ul className="text-sm text-amber-100/70 list-disc pl-4 space-y-0.5">
            {publishErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="hidden xl:grid flex-1 grid-cols-[260px_1fr_300px] min-h-0">
        <aside className="border-r border-hairline bg-surface-subtle/30 min-h-0 overflow-hidden">
          <QuestionList
            questions={draft.questions}
            selectedQuestionId={selectedQuestionId}
            onSelect={setSelectedQuestionId}
            onAdd={addQuestion}
            onDelete={deleteQuestion}
            onDuplicate={duplicateQuestion}
            onReorder={reorderQuestions}
          />
        </aside>
        <main className="min-h-0 overflow-hidden bg-background">{editorPanel}</main>
        <aside className="border-l border-hairline bg-surface-subtle/20 min-h-0 overflow-hidden">
          <QuizLivePreview quiz={draft} />
        </aside>
      </div>

      <div className="hidden md:flex xl:hidden flex-1 min-h-0">
        <aside className="w-56 lg:w-64 border-r border-hairline bg-surface-subtle/30 flex-shrink-0 min-h-0 overflow-hidden">
          <QuestionList
            questions={draft.questions}
            selectedQuestionId={selectedQuestionId}
            onSelect={setSelectedQuestionId}
            onAdd={addQuestion}
            onDelete={deleteQuestion}
            onDuplicate={duplicateQuestion}
            onReorder={reorderQuestions}
          />
        </aside>
        <Tabs defaultValue="edit" className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-4 mt-3 w-auto self-start rounded-xl bg-surface-subtle/80 border border-hairline p-1">
            <TabsTrigger value="edit" className="rounded-lg text-xs px-4">
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="rounded-lg text-xs px-4">
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
            {editorPanel}
          </TabsContent>
          <TabsContent value="preview" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
            <QuizLivePreview quiz={draft} />
          </TabsContent>
        </Tabs>
      </div>

      <Tabs defaultValue="questions" className="flex md:hidden flex-1 flex-col min-h-0">
        <TabsList className="mx-3 mt-3 grid grid-cols-3 rounded-xl bg-surface-subtle/80 border border-hairline p-1 flex-shrink-0">
          <TabsTrigger value="questions" className="rounded-lg text-xs">
            Questions
          </TabsTrigger>
          <TabsTrigger value="edit" className="rounded-lg text-xs">
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="rounded-lg text-xs">
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="questions" className={cn("flex-1 min-h-0 mt-0 data-[state=inactive]:hidden")}>
          <QuestionList
            questions={draft.questions}
            selectedQuestionId={selectedQuestionId}
            onSelect={setSelectedQuestionId}
            onAdd={addQuestion}
            onDelete={deleteQuestion}
            onDuplicate={duplicateQuestion}
            onReorder={reorderQuestions}
          />
        </TabsContent>
        <TabsContent value="edit" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
          {editorPanel}
        </TabsContent>
        <TabsContent value="preview" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
          <QuizLivePreview quiz={draft} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface BuilderEditorPanelProps {
  selectedQuestionId: string | null;
  selectedQuestion: Quiz["questions"][number] | null;
  selectedIndex: number;
  totalQuestions: number;
  result: Quiz["result"];
  onResultChange: (result: Quiz["result"]) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (desc: string) => void;
  onOptionChange: (optionId: string, label: string) => void;
  onAddOption: () => void;
  onDeleteOption: (optionId: string) => void;
  onDeleteQuestion: () => void;
}

function BuilderEditorPanel({
  selectedQuestionId,
  selectedQuestion,
  selectedIndex,
  totalQuestions,
  result,
  onResultChange,
  onTitleChange,
  onDescriptionChange,
  onOptionChange,
  onAddOption,
  onDeleteOption,
  onDeleteQuestion,
}: BuilderEditorPanelProps) {
  if (selectedQuestionId === RESULT_EDITOR_ID) {
    return <ResultScreenEditor result={result} onChange={onResultChange} />;
  }

  return (
    <QuestionEditor
      question={selectedQuestion}
      questionIndex={selectedIndex}
      totalQuestions={totalQuestions}
      onTitleChange={onTitleChange}
      onDescriptionChange={onDescriptionChange}
      onOptionChange={onOptionChange}
      onAddOption={onAddOption}
      onDeleteOption={onDeleteOption}
      onDeleteQuestion={onDeleteQuestion}
    />
  );
}
