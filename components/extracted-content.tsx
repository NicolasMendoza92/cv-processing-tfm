"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, CircuitBoard } from "lucide-react";
import { getExtractedData, processCandidateDataAction, updateCandidate } from "@/services/cvServices";
import type {
  CandidateDataExtended,
  CandidateDetails,
  CandidateExtractedData,
} from "@/types";
import { ExtractedDataDisplay } from "@/components/extracted-data-display";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { mapCandidateExtractedDataToDetails, mapDetailsToCandidateToAnalyze } from "@/utils";

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

 /*--------- Re-análisis ---------- */
  const handleReAnalyzeCandidate = async () => {
    if (!candidateDetails) return;
    setIsSaving(true);
    try {
      const payload = mapDetailsToCandidateToAnalyze(candidateDetails);
      const res = await processCandidateDataAction(payload);

      if (res.success && res.data) {
        toast.success("Análisis de empleabilidad actualizado");
        await loadCandidateData();
      } else {
        toast.error(res.error || "Error al analizar");
      }
    } catch (e: any) {
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
