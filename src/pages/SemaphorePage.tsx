import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { SemaphoreSimulator } from "@/components/simulators/SemaphoreSimulator";

export default function SemaphorePage() {
  return (
    <AppLayout>
      <PageHeader
        kicker="level 03 · simulator"
        title="Producer–Consumer"
        subtitle="A live bounded-buffer with empty / full / mutex semaphores. Watch wait() and signal() in motion across multiple producers and consumers."
      />
      <SemaphoreSimulator />
    </AppLayout>
  );
}
