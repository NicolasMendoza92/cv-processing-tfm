"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, CircuitBoard } from "lucide-react";
import {
  getExtractedData,
  processCandidateDataAction,
  updateCandidate,
} from "@/services/cvServices";
import type {
  CandidateDataExtended,
  CandidateDetails,
  CandidateExtractedData,
} from "@/types";
import { ExtractedDataDisplay } from "@/components/extracted-data-display";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  mapCandidateExtractedDataToDetails,
  mapExtractedDataToCandidateToAnalyze,
} from "@/utils";

export default function ExtractedContent({ id }: { id: string }) {
  const router = useRouter();

  const [originalExtractedData, setOriginalExtractedData] =
    useState<CandidateExtractedData | null>(null);
  const [candidateDetails, setCandidateDetails] =
    useState<CandidateDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadCandidateData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getExtractedData(id);
      if (data) {
        setOriginalExtractedData(data);
        const mappedDetails = mapCandidateExtractedDataToDetails(data);
        setCandidateDetails(mappedDetails);
      } else {
        setError("No se encontraron datos extraídos para este CV.");
      }
    } catch (err) {
      console.error("[v0] Error loading extracted data:", err);
      setError("Error al cargar los datos extraídos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadCandidateData();
    }
  }, [id]);

  const handleReAnalyzeCandidate = async () => {
    if (!originalExtractedData || !candidateDetails) {
      toast.error("Datos incompletos");
      return;
    }
    setIsSaving(true);
    try {
      console.log(
        "Starting re-analysis for candidate ID:",
        originalExtractedData,
      );
      // ✅ Payload: datos ORIGINALES del CV (no edits)
      const payload = mapExtractedDataToCandidateToAnalyze(
        originalExtractedData,
      );
      console.log("Re-analyzing con datos extraídos:", payload);

      const res = await processCandidateDataAction(payload);
      console.log("Nuevo análisis:", res);

      if (res.success && res.data) {
        // ✅ UPDATE: combina original + nuevo análisis
        const updatedData: CandidateDataExtended = {
          ...originalExtractedData, // ID, experience, etc.
          employabilityScore: res.data?.employability_score,
          topRecommendations: res.data?.top_recommendations,
          lastProcessed: res.data?.last_processed,
          areasForDevelopment: res.data?.areas_for_development,
          interviewQuestions: res.data?.interview_questions,
          cvFileName: candidateDetails.cvFileName,
        };

        console.log("Updating candidate with:", updatedData);
        console.log("Original extracted data ID:", originalExtractedData.id);
        await updateCandidate(originalExtractedData.id, updatedData);

        toast.success(
          `Empleabilidad actualizada: ${(res.data.employability_score || 0).toFixed(2)}`,
        );
        await loadCandidateData(); // ← Recarga con datos nuevos de DB
      } else {
        toast.error(res.error || "Error en análisis");
      }
    } catch (e: any) {
      console.error("Re-analyze error:", e);
      toast.error(e.message || "Error inesperado");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-center min-h-40vh">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Cargando datos extraídos del CV...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !candidateDetails) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Button
          variant="ghost"
          onClick={() => router.push("/history")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Historial
        </Button>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>
              {error || "No se pudieron cargar los datos."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Button
        variant="ghost"
        onClick={() => router.push("/history")}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al Historial
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
          Datos de: {candidateDetails.name}
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-lg text-pretty">
            Revisa la información analizada.
          </p>
          <Button
            onClick={handleReAnalyzeCandidate}
            variant="outline"
            className=" gap-2 bg-transparent"
            disabled={isSaving}
          >
            <CircuitBoard className="w-4 h-4" />
            Re-Analizar empleabilidad
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          <ExtractedDataDisplay data={candidateDetails} />
        </div>
      </div>
    </div>
  );
}
