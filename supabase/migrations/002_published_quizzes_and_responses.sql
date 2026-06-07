-- Published quizzes: public-readable snapshots for /q/:id
CREATE TABLE IF NOT EXISTS published_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  quiz_json JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'archived')),
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_published_quizzes_user_id ON published_quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_published_quizzes_status ON published_quizzes(status);

-- Quiz responses + lead capture
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  lead_email TEXT,
  lead_name TEXT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiz_responses_quiz_id ON quiz_responses(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_completed_at ON quiz_responses(completed_at DESC);

ALTER TABLE published_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Anyone can read published quizzes
CREATE POLICY "public_read_published_quizzes"
  ON published_quizzes FOR SELECT
  USING (status = 'published');

-- Owners manage their published quizzes
CREATE POLICY "owners_insert_published_quizzes"
  ON published_quizzes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "owners_update_published_quizzes"
  ON published_quizzes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "owners_delete_published_quizzes"
  ON published_quizzes FOR DELETE
  USING (auth.uid() = user_id);

-- Anyone can submit responses to published quizzes
CREATE POLICY "public_insert_quiz_responses"
  ON quiz_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM published_quizzes pq
      WHERE pq.quiz_id = quiz_responses.quiz_id AND pq.status = 'published'
    )
  );

-- Owners read responses for their quizzes
CREATE POLICY "owners_read_quiz_responses"
  ON quiz_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM published_quizzes pq
      WHERE pq.quiz_id = quiz_responses.quiz_id AND pq.user_id = auth.uid()
    )
  );
