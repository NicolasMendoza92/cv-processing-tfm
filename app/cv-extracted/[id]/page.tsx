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
import { Loader2, Edit, ArrowLeft } from "lucide-react";
import { getExtractedData, updateCandidate } from "@/services/cvServices";
import type { CandidateDetails, CandidateExtractedData } from "@/types";
import { ExtractedDataDisplay } from "@/components/extracted-data-display";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { mapCandidateExtractedDataToDetails } from "@/utils/candidateMapper";
import { EditCandidateModal } from "@/components/edit-candidate-modal";

export default function ExtractedDataPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [originalExtractedData, setOriginalExtractedData] = useState<CandidateExtractedData | null>(null);
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

   const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false); 
  };

    const handleSaveEditedCandidate = async (candidateId: string, updatedData: CandidateExtractedData) => {
    setIsSaving(true);
    try {
      await updateCandidate(candidateId, updatedData);
      toast.success("Candidato actualizado exitosamente.");
      // Recargar los datos para que la UI refleje los cambios
      await loadCandidateData();
    } catch (error: any) {
      console.error("Fallo al guardar los cambios del candidato:", error);
      toast.error(`Error al guardar los cambios: ${error.message || "Error desconocido."}`);
      throw error; // Re-lanza para que el modal también pueda manejar el error
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
          Datos Extraídos del CV: {candidateDetails.cvFileName}
        </h1>
        <p className="text-muted-foreground text-lg text-pretty">
          Revisa la información extraída por el sistema de procesamiento de
          lenguaje natural (PLN).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExtractedDataDisplay data={candidateDetails} />
        </div>

        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Acciones</CardTitle>
              <CardDescription>
                Decide qué hacer con estos datos extraídos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleEdit}
                variant="outline"
                className="w-full gap-2 bg-transparent"
                disabled={isSaving}
              >
                <Edit className="w-4 h-4" />
                Editar Datos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Renderiza el modal de edición */}
      <EditCandidateModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        candidate={originalExtractedData} 
        onSave={handleSaveEditedCandidate}
      />
    </div>
  );
}
