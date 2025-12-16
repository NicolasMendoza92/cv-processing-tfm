"use client"

import { useEffect, useState } from "react"
import { Loader2, Users } from "lucide-react"
import { getCandidatesSummary, deleteCandidate, sendFeedback } from "@/services/cvServices"
import type { CandidateExtractedData, FeedbackData } from "@/types"
import { CandidateCard } from "@/components/candidate-card"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { FeedbackModal } from "@/components/feedback-modal"
import {  toast } from 'sonner'
import { useRouter } from "next/navigation"


export default function CandidatesPage() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<CandidateExtractedData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [candidateToDelete, setCandidateToDelete] = useState<CandidateExtractedData | null>(null)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [candidateForFeedback, setCandidateForFeedback] = useState<CandidateExtractedData | null>(null)

  useEffect(() => {
    async function loadCandidates() {
      setIsLoading(true)
      try {
        const data = await getCandidatesSummary()
        setCandidates(data)
      } catch (error) {
        console.error("[v0] Error loading candidates:", error)
        toast("No se pudieron cargar los candidatos.")
      } finally {
        setIsLoading(false)
      }
    }

    loadCandidates()
  }, [toast])

  const handleViewDetails = (id: string) => {
    router.push(`/candidate/${id}`)
  }

  const handleDeleteClick = (id: string) => {
    const candidate = candidates.find((c) => c.id === id)
    if (candidate) {
      setCandidateToDelete(candidate)
      setDeleteDialogOpen(true)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!candidateToDelete) return

    try {
      await deleteCandidate(candidateToDelete.id)
      setCandidates((prev) => prev.filter((c) => c.id !== candidateToDelete.id))
      toast( `${candidateToDelete.name} ha sido eliminado correctamente.`)
    } catch (error) {
      console.error("[v0] Error deleting candidate:", error)
      toast("No se pudo eliminar el candidato.")
    } finally {
      setDeleteDialogOpen(false)
      setCandidateToDelete(null)
    }
  }

  const handleFeedbackClick = (id: string) => {
    const candidate = candidates.find((c) => c.id === id)
    if (candidate) {
      setCandidateForFeedback(candidate)
      setFeedbackModalOpen(true)
    }
  }

  const handleFeedbackSubmit = async (feedbackData: FeedbackData) => {
    try {
      const response = await sendFeedback(feedbackData.candidateId, feedbackData)
      toast("Feedback enviado")
    } catch (error) {
      console.error("[v0] Error sending feedback:", error)
      toast("No se pudo enviar el feedback.")
    }
  }

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
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">Mis Candidatos</h1>
        <p className="text-muted-foreground text-lg text-pretty">
          Vista detallada de candidatos procesados y sus recomendaciones de empleo.
        </p>
      </div>

      {candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-40vh text-center">
          <Users className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No hay candidatos procesados</h2>
          <p className="text-muted-foreground max-w-md">
            Los candidatos aparecerán aquí después de aprobar sus datos extraídos desde el historial de procesamiento.
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
            />
          ))}
        </div>
      )}

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        fileName={candidateToDelete?.name || ""}
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
  )
}
