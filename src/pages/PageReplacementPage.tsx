import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { PageReplacementSimulator } from "@/components/simulators/PageReplacementSimulator";

export default function PageReplacementPage() {
  return (
    <AppLayout>
      <PageHeader
        kicker="level 08 · simulator"
        title="Page Replacement"
        subtitle="Feed in a reference string, choose your frame count, and beat the algorithm. Compare FIFO, LRU and Optimal head-to-head — and uncover Belady's anomaly."
      />
      <PageReplacementSimulator />
    </AppLayout>
  );
}
