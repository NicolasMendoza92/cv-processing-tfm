"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import type { FeedbackData } from "@/types/cv"

interface FeedbackModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidateId: string
  candidateName: string
  onSubmit: (data: FeedbackData) => Promise<void>
}

export function FeedbackModal({ open, onOpenChange, candidateId, candidateName, onSubmit }: FeedbackModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gotJob, setGotJob] = useState<boolean | null>(null)
  const [jobTitle, setJobTitle] = useState("")
  const [hireDate, setHireDate] = useState("")
  const [wasRecommended, setWasRecommended] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [additionalComments, setAdditionalComments] = useState("")
  const [predictionAccuracy, setPredictionAccuracy] = useState("")

  const resetForm = () => {
    setGotJob(null)
    setJobTitle("")
    setHireDate("")
    setWasRecommended(null)
    setRejectionReason("")
    setAdditionalComments("")
    setPredictionAccuracy("")
  }

  const handleSubmit = async () => {
    if (gotJob === null || !predictionAccuracy) {
      return
    }

    setIsSubmitting(true)
    try {
      const feedbackData: FeedbackData = {
        candidateId,
        candidateName,
        gotJob,
        predictionAccuracy,
        additionalComments: additionalComments || undefined,
      }

      if (gotJob) {
        feedbackData.jobTitle = jobTitle || undefined
        feedbackData.hireDate = hireDate || undefined
        feedbackData.wasRecommended = wasRecommended === "yes" ? true : wasRecommended === "no" ? false : null
      } else {
        feedbackData.rejectionReason = rejectionReason || undefined
      }

      await onSubmit(feedbackData)
      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error submitting feedback:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Registrar Feedback Laboral para: {candidateName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Candidato</Label>
            <Input value={candidateName} disabled className="bg-muted" />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">¿Conectó con un Empleo?</Label>
            <RadioGroup
              value={gotJob === null ? "" : gotJob ? "yes" : "no"}
              onValueChange={(value) => setGotJob(value === "yes")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="job-yes" />
                <Label htmlFor="job-yes" className="font-normal cursor-pointer">
                  Sí
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="job-no" />
                <Label htmlFor="job-no" className="font-normal cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {gotJob === true && (
            <div className="space-y-4 pl-4 border-l-2 border-primary/30">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Puesto Conseguido</Label>
                <Input
                  id="jobTitle"
                  placeholder="Ej. Dependiente de Tienda, Operario de Fábrica"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hireDate">Fecha de Contratación</Label>
                <Input id="hireDate" type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} />
              </div>

              <div className="space-y-3">
                <Label className="text-base">¿Fue un puesto recomendado por la aplicación?</Label>
                <RadioGroup value={wasRecommended || ""} onValueChange={setWasRecommended}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="recommended-yes" />
                    <Label htmlFor="recommended-yes" className="font-normal cursor-pointer">
                      Sí
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="recommended-no" />
                    <Label htmlFor="recommended-no" className="font-normal cursor-pointer">
                      No
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="na" id="recommended-na" />
                    <Label htmlFor="recommended-na" className="font-normal cursor-pointer">
                      No aplica
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {gotJob === false && (
            <div className="space-y-2 pl-4 border-l-2 border-primary/30">
              <Label htmlFor="rejectionReason">Motivo Principal</Label>
              <Select value={rejectionReason} onValueChange={setRejectionReason}>
                <SelectTrigger id="rejectionReason">
                  <SelectValue placeholder="Seleccione un motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lack-experience">Falta de experiencia</SelectItem>
                  <SelectItem value="low-interview">Bajas calificaciones en entrevista</SelectItem>
                  <SelectItem value="transport-issues">Problemas de transporte</SelectItem>
                  <SelectItem value="low-demand">Demanda baja en el área</SelectItem>
                  <SelectItem value="other">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comments">Comentarios Adicionales</Label>
            <Textarea
              id="comments"
              placeholder="Agregue cualquier información adicional que considere relevante..."
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Precisión de la Predicción de Empleabilidad</Label>
            <RadioGroup value={predictionAccuracy} onValueChange={setPredictionAccuracy}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-inaccurate" id="acc-very-inaccurate" />
                <Label htmlFor="acc-very-inaccurate" className="font-normal cursor-pointer">
                  Muy Imprecisa
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inaccurate" id="acc-inaccurate" />
                <Label htmlFor="acc-inaccurate" className="font-normal cursor-pointer">
                  Imprecisa
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="correct" id="acc-correct" />
                <Label htmlFor="acc-correct" className="font-normal cursor-pointer">
                  Correcta
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="accurate" id="acc-accurate" />
                <Label htmlFor="acc-accurate" className="font-normal cursor-pointer">
                  Precisa
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-accurate" id="acc-very-accurate" />
                <Label htmlFor="acc-very-accurate" className="font-normal cursor-pointer">
                  Muy Precisa
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || gotJob === null || !predictionAccuracy}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Feedback"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
