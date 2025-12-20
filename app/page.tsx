"use client";

import { useState } from "react";
import { SimpleUploadPanel } from "@/components/simple-upload-panel"; // OK
import { ExtendedDataModal } from "@/components/extended-data-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { CandidateListPanel } from "@/components/candidate-list-panel";
import { CandidateData, CandidateDataExtended } from "@/types";
import {
  createCandidate,
  deleteCandidate,
  processCandidateDataAction,
  updateCandidate,
} from "@/services/cvServices";
import { candidateSchema } from "@/schemas";
import { transformToCandidateToAnalyze } from "@/utils/transformCandidate";
import { ViewDetailModal } from "@/components/view-detail-modal";

export default function Home() {
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [activeModal, setActiveModal] = useState<{
    type: "edit_extended" | "details" | null;
    candidate: CandidateData | null;
  }>({ type: null, candidate: null });
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(
    null
  );

  const handleFileUploaded = (candidate: CandidateData) => {
    setCandidates((prev) => {
      const existing = prev.find((c) => c.id === candidate.id);
      if (existing) {
        return prev.map((c) => (c.id === candidate.id ? candidate : c));
      }
      return [...prev, candidate];
    });
  };

  const handleSaveExtendedData = async (
    extendedData: CandidateDataExtended
  ) => {
    if (!activeModal.candidate) return;
    const candidateData = candidateSchema.safeParse({
      employabilityScore: extendedData.employabilityScore || 0,
      lastProcessed: extendedData.lastProcessed || new Date().toISOString(),
      ...extendedData,
    });
    console.log("Datos validados del candidato:", candidateData);

    if (!candidateData.success) {
      toast.error("Datos inválidos: " + candidateData.error.errors[0].message);
      return;
    }

    const dataToSend = {
      ...candidateData.data,
      createdAt: extendedData.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log("Datos a enviar al backend:", dataToSend);

    try {
      const saved = await createCandidate(dataToSend);
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === activeModal.candidate!.id
            ? { ...c, id: saved.id, status: "saved", extendedData: saved }
            : c
        )
      );
      console.log("Candidato guardado correctamente:", saved);

      toast.success(`Candidato “${extendedData.name}” guardado exitosamente!`);
      setActiveModal({ type: null, candidate: null });
    } catch (error) {
      console.error("Fallo al guardar el candidato:", error);
      toast.error(`Error al guardar: ${(error as Error).message}`);
    }
  };

  const handleSaveWithoutEditing = async (candidate: CandidateData) => {
    if (!candidate.extendedData) {
      toast.error("No hay datos para guardar");
      return;
    }

    await handleSaveExtendedData(candidate.extendedData);
  };

  const handleProcessEmployability = async (candidate: CandidateData) => {
    if (!candidate?.extendedData) {
      toast.error("El candidato no tiene datos extendidos completos");
      return;
    }

    console.log("Procesando empleabilidad para candidato:", candidate);

    const candidateToAnalyze = transformToCandidateToAnalyze(
      candidate.extendedData,
      candidate.id
    );
    console.log(
      "Datos transformados para análisis de empleabilidad:",
      candidateToAnalyze
    );
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidate.id ? { ...c, status: "pending" } : c))
    );

    try {
      const result = await processCandidateDataAction(candidateToAnalyze);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Error en análisis de empleabilidad");
      }

      console.log("Resultado del análisis de empleabilidad:", result.data);

      const updatedExtendedData: CandidateDataExtended = {
        ...candidate.extendedData,
        employabilityScore: result.data.employability_score,
        topRecommendations: result.data.top_recommendations,
        lastProcessed: result.data.last_processed,
        areasForDevelopment: result.data.areas_for_development,
        interviewQuestions: result.data.interview_questions,
        cvFileName: candidate.cvFileName ?? '',
      };
      console.log(
        "Datos extendidos actualizados de candidatos:",
        updatedExtendedData
      );

      // 1) Actualizar en el backend
      await updateCandidate(candidate.id, updatedExtendedData);

      // 2) Actualizar en el estado local
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidate.id
            ? {
                ...c,
                status: "approved",
                extendedData: updatedExtendedData,
              }
            : c
        )
      );
      toast.success("Evaluación completada");
    } catch (error) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidate.id
            ? { ...c, status: "saved", errorMessage: (error as Error).message }
            : c
        )
      );
      toast.error("Error en evaluación");
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    setCandidateToDelete(null);
    // try {
    //   await deleteCandidate(id);
    //   toast.success(`Candidato ha sido eliminado correctamente.`);
    // } catch (error) {
    //   console.error("Error deleting candidate:", error);
    //   toast.error("No se pudo eliminar el candidato.");
    // } finally {
    //   setCandidateToDelete(null);
    // }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
            Sistema de Gestión de Empleabilidad
          </h1>
          <p className="text-muted-foreground mt-1">
            Plataforma para fundaciones de inclusión social
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SimpleUploadPanel onFileUploaded={handleFileUploaded} />
          </div>
          <div className="lg:col-span-2">
            <CandidateListPanel
              candidates={candidates}
              onEditExtractedData={(candidate) =>
                setActiveModal({ type: "edit_extended", candidate })
              }
              onSaveCandidate={handleSaveWithoutEditing}
              onProcessEmployability={handleProcessEmployability}
              onViewDetails={(candidate) =>
                setActiveModal({ type: "details", candidate })
              }
              onDelete={(id) => setCandidateToDelete(id)}
            />
          </div>
        </div>
      </div>

      {/* Extended Data Edit Modal */}
      <ExtendedDataModal
        isOpen={activeModal.type === "edit_extended"}
        onClose={() => setActiveModal({ type: null, candidate: null })}
        candidateData={activeModal.candidate?.extendedData || null}
        onSave={handleSaveExtendedData}
      />

      {/* Details Modal */}
      <ViewDetailModal
        isOpen={activeModal.type === "details"}
        onClose={() => setActiveModal({ type: null, candidate: null })}
        candidate={activeModal.candidate}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!candidateToDelete}
        onOpenChange={() => setCandidateToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este candidato?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El candidato será eliminado
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                candidateToDelete && handleDeleteCandidate(candidateToDelete)
              }
              className="bg-destructive"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
