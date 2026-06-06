import { useCallback } from "react";
import { useQuizBuilder } from "@/hooks/use-quiz-builder";
import { BuilderToolbar } from "@/components/builder/BuilderToolbar";
import { QuestionList } from "@/components/builder/QuestionList";
import { QuestionEditor } from "@/components/builder/QuestionEditor";
import { QuizLivePreview } from "@/components/builder/QuizLivePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Quiz } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizBuilderProps {
  quiz: Quiz;
  onSave: (quiz: Quiz) => void;
  onPublish?: (draft: Quiz) => void;
  isPublished?: boolean;
}

export function QuizBuilder({ quiz, onSave, onPublish, isPublished }: QuizBuilderProps) {
  const handleSave = useCallback(
    (draft: Quiz) => {
      onSave({
        ...draft,
        id: quiz.id,
        createdAt: quiz.createdAt,
        updatedAt: new Date().toISOString(),
      });
    },
    [onSave, quiz.id, quiz.createdAt]
  );

  const {
    draft,
    selectedQuestion,
    selectedQuestionId,
    selectedIndex,
    saveStatus,
    setSelectedQuestionId,
    updateTitle,
    updateQuestionTitle,
    updateQuestionDescription,
    updateOptionLabel,
    addQuestion,
    deleteQuestion,
    duplicateQuestion,
    moveQuestion,
    addOption,
    deleteOption,
  } = useQuizBuilder({
    quiz,
    onSave: handleSave,
  });

  return (
    <div className="flex flex-col -m-4 sm:-m-6 lg:-m-8 min-h-[calc(100vh-4rem)] bg-background">
      <BuilderToolbar
        title={draft.title}
        onTitleChange={updateTitle}
        saveStatus={saveStatus}
        onPublish={onPublish ? () => onPublish(draft) : undefined}
        isPublished={isPublished}
        canPublish={draft.questions.length > 0}
      />

      {/* Desktop: three-panel layout */}
      <div className="hidden xl:grid flex-1 grid-cols-[260px_1fr_300px] min-h-0">
        <aside className="border-r border-hairline bg-surface-subtle/30 min-h-0 overflow-hidden">
          <QuestionList
            questions={draft.questions}
            selectedQuestionId={selectedQuestionId}
            onSelect={setSelectedQuestionId}
            onAdd={addQuestion}
            onDelete={deleteQuestion}
            onDuplicate={duplicateQuestion}
            onMove={moveQuestion}
            quizTypeId={draft.brief?.funnelType}
          />
        </aside>

        <main className="min-h-0 overflow-hidden bg-background">
          <QuestionEditor
            question={selectedQuestion}
            questionIndex={selectedIndex}
            totalQuestions={draft.questions.length}
            onTitleChange={(title) =>
              selectedQuestionId && updateQuestionTitle(selectedQuestionId, title)
            }
            onDescriptionChange={(desc) =>
              selectedQuestionId && updateQuestionDescription(selectedQuestionId, desc)
            }
            onOptionChange={(optionId, label) =>
              selectedQuestionId && updateOptionLabel(selectedQuestionId, optionId, label)
            }
            onAddOption={() => selectedQuestionId && addOption(selectedQuestionId)}
            onDeleteOption={(optionId) =>
              selectedQuestionId && deleteOption(selectedQuestionId, optionId)
            }
            onDeleteQuestion={() => selectedQuestionId && deleteQuestion(selectedQuestionId)}
          />
        </main>

        <aside className="border-l border-hairline bg-surface-subtle/20 min-h-0 overflow-hidden">
          <QuizLivePreview quiz={draft} />
        </aside>
      </div>

      {/* Tablet: two-panel + preview tab */}
      <div className="hidden md:flex xl:hidden flex-1 min-h-0">
        <aside className="w-56 lg:w-64 border-r border-hairline bg-surface-subtle/30 flex-shrink-0 min-h-0 overflow-hidden">
          <QuestionList
            questions={draft.questions}
            selectedQuestionId={selectedQuestionId}
            onSelect={setSelectedQuestionId}
            onAdd={addQuestion}
            onDelete={deleteQuestion}
            onDuplicate={duplicateQuestion}
            onMove={moveQuestion}
            quizTypeId={draft.brief?.funnelType}
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
            <QuestionEditor
              question={selectedQuestion}
              questionIndex={selectedIndex}
              totalQuestions={draft.questions.length}
              onTitleChange={(title) =>
                selectedQuestionId && updateQuestionTitle(selectedQuestionId, title)
              }
              onDescriptionChange={(desc) =>
                selectedQuestionId && updateQuestionDescription(selectedQuestionId, desc)
              }
              onOptionChange={(optionId, label) =>
                selectedQuestionId && updateOptionLabel(selectedQuestionId, optionId, label)
              }
              onAddOption={() => selectedQuestionId && addOption(selectedQuestionId)}
              onDeleteOption={(optionId) =>
                selectedQuestionId && deleteOption(selectedQuestionId, optionId)
              }
              onDeleteQuestion={() => selectedQuestionId && deleteQuestion(selectedQuestionId)}
            />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
            <QuizLivePreview quiz={draft} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile: tabbed layout */}
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

        <TabsContent
          value="questions"
          className={cn("flex-1 min-h-0 mt-0 data-[state=inactive]:hidden")}
        >
          <QuestionList
            questions={draft.questions}
            selectedQuestionId={selectedQuestionId}
            onSelect={setSelectedQuestionId}
            onAdd={addQuestion}
            onDelete={deleteQuestion}
            onDuplicate={duplicateQuestion}
            onMove={moveQuestion}
            quizTypeId={draft.brief?.funnelType}
          />
        </TabsContent>

        <TabsContent value="edit" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
          <QuestionEditor
            question={selectedQuestion}
            questionIndex={selectedIndex}
            totalQuestions={draft.questions.length}
            onTitleChange={(title) =>
              selectedQuestionId && updateQuestionTitle(selectedQuestionId, title)
            }
            onDescriptionChange={(desc) =>
              selectedQuestionId && updateQuestionDescription(selectedQuestionId, desc)
            }
            onOptionChange={(optionId, label) =>
              selectedQuestionId && updateOptionLabel(selectedQuestionId, optionId, label)
            }
            onAddOption={() => selectedQuestionId && addOption(selectedQuestionId)}
            onDeleteOption={(optionId) =>
              selectedQuestionId && deleteOption(selectedQuestionId, optionId)
            }
            onDeleteQuestion={() => selectedQuestionId && deleteQuestion(selectedQuestionId)}
          />
        </TabsContent>

        <TabsContent value="preview" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
          <QuizLivePreview quiz={draft} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
