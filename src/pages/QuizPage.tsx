import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { QuizCard } from "@/components/quiz/QuizCard";

export default function QuizPage() {
  return (
    <AppLayout>
      <PageHeader kicker="assessment" title="OS Knowledge Check" subtitle="8 questions across the syllabus. +10 XP per correct, +50 bonus on completion." />
      <QuizCard />
    </AppLayout>
  );
}
