import { Suspense } from "react";
import CandidateContent from "@/components/candidate-content";
import Loader from "@/components/loader";
import ExtractedContent from "@/components/extracted-content";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function ExtractedDetailPage({ params }: PageProps ) {
  const { id } = await params

  return (
    <Suspense fallback={<Loader />}>
      <ExtractedContent id={id} />
    </Suspense>
  )
}
