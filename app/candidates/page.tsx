"use client";

import { useEffect, useState } from "react";
import { Loader2, Users } from "lucide-react";
import {
  getCandidatesSummary,
  deleteCandidate,
  sendFeedback,
  updateCandidate,
} from "@/services/cvServices";
import type {
  CandidateDataExtended,
  CandidateExtractedData,
  FeedbackData,
} from "@/types";
import { CandidateCard } from "@/components/candidate-card";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { FeedbackModal } from "@/components/feedback-modal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EditCandidateModal } from "@/components/edit-candidate-modal";

export default function CandidatesPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<CandidateDataExtended[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] =
    useState<CandidateDataExtended | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [candidateForFeedback, setCandidateForFeedback] =
    useState<CandidateDataExtended | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [candidateToEdit, setCandidateToEdit] =
    useState<CandidateDataExtended | null>(null);

  useEffect(() => {
    async function loadCandidates() {
      setIsLoading(true);
      try {
        const data = await getCandidatesSummary();
        setCandidates(data);
      } catch (error) {
        console.error("[v0] Error loading candidates:", error);
        toast("No se pudieron cargar los candidatos.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCandidates();
  }, [toast]);

  const handleViewDetails = (id: string) => {
    router.push(`/candidate/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    const candidate = candidates.find((c) => c.id === id);
    if (candidate) {
      setCandidateToDelete(candidate);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!candidateToDelete) return;

    try {
      await deleteCandidate(candidateToDelete.id);
      setCandidates((prev) =>
        prev.filter((c) => c.id !== candidateToDelete.id)
      );
      toast(`${candidateToDelete.name} ha sido eliminado correctamente.`);
    } catch (error) {
      console.error("[v0] Error deleting candidate:", error);
      toast("No se pudo eliminar el candidato.");
    } finally {
      setDeleteDialogOpen(false);
      setCandidateToDelete(null);
    }
  };

  const handleFeedbackClick = (id: string) => {
    const candidate = candidates.find((c) => c.id === id);
    if (candidate) {
      setCandidateForFeedback(candidate);
      setFeedbackModalOpen(true);
    }
  };

  const handleFeedbackSubmit = async (feedbackData: FeedbackData) => {
    try {
      const response = await sendFeedback(
        feedbackData.candidateId,
        feedbackData
      );
      toast("Feedback enviado");
    } catch (error) {
      console.error("[v0] Error sending feedback:", error);
      toast("No se pudo enviar el feedback.");
    }
  };

  const handleEditClick = (id: string) => {
    const candidate = candidates.find((c) => c.id === id);
    if (candidate) {
      setCandidateToEdit(candidate);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCandidateToEdit(null);
  };

  const handleEditCandidate = async (
    id: string,
    data: CandidateDataExtended
  ): Promise<void> => {
    try {
      const updated = await updateCandidate(id, data);
      if (!updated) return;
      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
      );

      toast("Candidato actualizado correctamente.");
      handleCloseEditModal();
    } catch (error: any) {
      console.error("[v0] Error updating candidate:", error);
      toast(
        error?.message ||
          "No se pudo actualizar el candidato. Revisá los datos."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-center min-h-40vh">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Cargando candidatos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
          Mis Candidatos
        </h1>
        <p className="text-muted-foreground text-lg text-pretty">
          Vista detallada de candidatos procesados y sus recomendaciones de
          empleo.
        </p>
      </div>

      {candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-40vh text-center">
          <Users className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            No hay candidatos procesados
          </h2>
          <p className="text-muted-foreground max-w-md">
            Los candidatos aparecerán aquí después de aprobar sus datos
            extraídos desde el historial de procesamiento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onViewDetails={handleViewDetails}
              onDelete={handleDeleteClick}
              onFeedback={handleFeedbackClick}
              onEdit={handleEditClick}
            />
          ))}
        </div>
      )}

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        cvFileName={candidateToDelete?.name || ""}
      />

       {/* Modal de edición */}
      <EditCandidateModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        candidate={candidateToEdit}
        onEdit={handleEditCandidate}
      />

      {candidateForFeedback && (
        <FeedbackModal
          open={feedbackModalOpen}
          onOpenChange={setFeedbackModalOpen}
          candidateId={candidateForFeedback.id}
          candidateName={candidateForFeedback.name}
          onSubmit={handleFeedbackSubmit}
        />
      )}

    </div>
  );
}
