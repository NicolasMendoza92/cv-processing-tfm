"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  Target,

} from "lucide-react";
import {
  getCandidateDetails,
  getTopRecommendations,
} from "@/services/cvServices";
import { EmployabilityScoreCard } from "@/components/employability-score-card";
import type { CandidateDetails } from "@/types";
import { CandidateGeneralInfoCard } from "@/components/candidate-general-card";
import { CandidateAdditionalDataCard } from "@/components/candidate-aditional-card";
import { mapExtendedToDetails } from "@/utils";


export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<CandidateDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobRecommendations, setJobRecommendations] = useState<string[] | null>(
    null
  );
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCandidateDetails() {
      setIsLoading(true);
      setError(null);

      try {
        const id = params.id as string;
        const data = await getCandidateDetails(id);

        if (!data) {
          setError("No se encontraron detalles para este candidato");
        } else {
          const CandidateDetails = mapExtendedToDetails(data);
          setCandidate(CandidateDetails);
          loadJobRecommendations(id);
        }
      } catch (err) {
        console.error("[v0] Error loading candidate details:", err);
        setError("Error al cargar los detalles del candidato");
      } finally {
        setIsLoading(false);
      }
    }

    loadCandidateDetails();
  }, [params.id]);

  async function loadJobRecommendations(candidateId: string) {
    setIsLoadingJobs(true);
    setJobsError(null);

    try {
      const data = await getTopRecommendations(candidateId);

      if (!data) {
        setJobsError(
          "No se encontraron recomendaciones de puestos para este candidato"
        );
      } else {
        setJobRecommendations(data);
      }
    } catch (err) {
      console.error("[v0] Error loading job recommendations:", err);
      setJobsError("Error al cargar las recomendaciones de puestos");
    } finally {
      setIsLoadingJobs(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-center min-h-500px">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-lg">
              Cargando detalles del candidato...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Button
          variant="ghost"
          onClick={() => router.push("/candidates")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a candidatos
        </Button>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              {error || "Candidato no encontrado"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <Button
        variant="ghost"
        onClick={() => router.push("/candidates")}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a candidatos
      </Button>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
          Detalles del Candidato: {candidate.name}
        </h1>
        <p className="text-muted-foreground text-sm">
          Archivo: <span className="font-medium">{candidate.cvFileName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className="lg:col-span-2 space-y-6">
          <CandidateGeneralInfoCard candidate={candidate} />
          <CandidateAdditionalDataCard candidate={candidate} />
        </div>

        {/* Right Column - Employability Score */}
        <div className="lg:col-span-1">
          <EmployabilityScoreCard
            score={candidate.employabilityScore}
            isApt={candidate.isAptForEmployment}
            recommendations={candidate.topRecommendations}
          />
        </div>
      </div>
    </div>
  );
}
