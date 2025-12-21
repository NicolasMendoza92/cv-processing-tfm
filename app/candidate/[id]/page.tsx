import { Suspense } from "react";
import CandidateContent from "@/components/candidate-content";
import Loader from "@/components/loader";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function CandidateDetailPage({ params }: PageProps ) {
  const { id } = await params

  return (
    <Suspense fallback={<Loader />}>
      <CandidateContent id={id} />
    </Suspense>
  )
}
