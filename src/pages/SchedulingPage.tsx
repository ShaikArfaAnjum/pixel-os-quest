import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { SchedulingSimulator } from "@/components/simulators/SchedulingSimulator";

export default function SchedulingPage() {
  return (
    <AppLayout>
      <PageHeader
        kicker="level 02 · simulator"
        title="CPU Scheduling"
        subtitle="Configure processes, pick an algorithm, and watch the Gantt chart unfold. Compare waiting and turnaround times across FCFS, SJF, Round Robin, and Priority scheduling."
      />
      <SchedulingSimulator />
    </AppLayout>
  );
}
