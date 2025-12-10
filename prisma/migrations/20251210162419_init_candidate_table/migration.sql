-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "experience" JSONB NOT NULL DEFAULT '[]',
    "education" JSONB NOT NULL DEFAULT '[]',
    "skills" TEXT[],
    "languages" JSONB NOT NULL DEFAULT '[]',
    "summary" TEXT,
    "raw_text" TEXT,
    "employabilityScore" DOUBLE PRECISION NOT NULL,
    "top_recommendations" TEXT[],
    "last_processed" TIMESTAMP(3) NOT NULL,
    "areas_for_development" TEXT[],
    "interview_questions" TEXT[],
    "last_job" TEXT,
    "last_education" TEXT,
    "disability" TEXT,
    "previous_incarceration" TEXT,
    "formal_education_years" INTEGER,
    "work_experience_years" INTEGER,
    "is_apt_for_employment" BOOLEAN,
    "cv_file_name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");
