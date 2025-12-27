export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import CandidateContent from "@/components/candidate-content";
import Loader from "@/components/loader";
import { getCandidateDetails } from "@/services/cvServices";

type PageProps = {
    params: Promise<{ id: string }>;
};

export async function CandidateDetailContent({ params }: PageProps ) {
  const { id } = await params
  const data = await getCandidateDetails(id)

  return (
      <CandidateContent data={data} />
  )
}

export default function CandidateDetailPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div>
          <Loader />
        </div>
      }
    >
      <CandidateDetailContent {...props} />
    </Suspense>
  );
}
