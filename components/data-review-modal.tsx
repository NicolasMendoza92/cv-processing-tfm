"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle2, Trash2 } from "lucide-react";
import type { UploadedFile } from "@/types";

interface DataReviewModalProps {
  showModalForFile: UploadedFile | null;
  onClose: () => void;
  onAnalyzeCandidate: () => void;
  onDeleteFile: (fileId: string) => void;
}

export function DataReviewModal({
  showModalForFile,
  onClose,
  onAnalyzeCandidate,
  onDeleteFile,
}: DataReviewModalProps) {
  if (!showModalForFile) {
    return null;
  }

  const isApproved = showModalForFile.status === "approved";
  const isReadyForReview = showModalForFile.status === "ready_for_review";

  return (
    <Dialog open={!!showModalForFile} onOpenChange={onClose}>
      <DialogContent className="min-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isApproved
              ? "Resumen de Empleabilidad"
              : "Datos Extraídos del CV"}
          </DialogTitle>
          <DialogDescription>
            {showModalForFile?.name} -{" "}
            {isApproved
              ? "Información final del candidato"
              : "Revisa la información extraída por el sistema de PLN"}
          </DialogDescription>
        </DialogHeader>

        {isApproved && showModalForFile?.candidateAnalysis ? (
          <div className="space-y-6 py-4">
            {/* Resumen de Empleabilidad aquí */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-foreground">
                Score de Empleabilidad:{" "}
                <span className="text-primary">
                  {showModalForFile.candidateAnalysis.employability_score.toFixed(
                    2
                  )}
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Este score indica la probabilidad de que el candidato consiga
                un empleo, basado en sus habilidades, experiencia y educación.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-base text-foreground">
                Puestos Recomendados
              </h3>
              <div className="flex flex-wrap gap-2">
                {showModalForFile.candidateAnalysis.top_recommendations.map(
                  (rec, idx) => (
                    <Badge
                      key={idx}
                      variant="default"
                      className="text-lg py-1 px-3"
                    >
                      {rec}
                    </Badge>
                  )
                )}
              </div>
            </div>

            {showModalForFile.candidateAnalysis.areas_for_development &&
              showModalForFile.candidateAnalysis.areas_for_development.length >
                0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-base text-foreground">
                    Áreas de Desarrollo Sugeridas
                  </h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {showModalForFile.candidateAnalysis.areas_for_development.map(
                      (area, idx) => (
                        <li key={idx}>{area}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {showModalForFile.candidateAnalysis.interview_questions &&
              showModalForFile.candidateAnalysis.interview_questions.length >
                0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-base text-foreground">
                    Preguntas de Entrevista Sugeridas
                  </h3>
                  <ul className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    {showModalForFile.candidateAnalysis.interview_questions.map(
                      (q, idx) => (
                        <li key={idx}>{q}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

            <p className="text-xs text-right text-muted-foreground mt-4">
              Último procesamiento:{" "}
              {new Date(
                showModalForFile.candidateAnalysis.last_processed
              ).toLocaleString()}
            </p>
          </div>
        ) : showModalForFile?.extractedData ? (
          <div className="space-y-6 py-4">
            {/* Personal Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-foreground">
                Información Personal
              </h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Nombre</p>
                  <p className="text-sm font-medium">
                    {showModalForFile.extractedData.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">
                    {showModalForFile.extractedData.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="text-sm font-medium">
                    {showModalForFile.extractedData.phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-foreground">
                Experiencia Laboral
              </h3>
              <div className="space-y-3">
                {showModalForFile.extractedData.experience.length > 0 ? (
                  showModalForFile.extractedData.experience.map((exp, idx) => (
                    <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">{exp.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {exp.company}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ~{exp.years} años de experiencia
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                    No se encontró experiencia laboral.
                  </p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-foreground">
                Formación Académica
              </h3>
              <div className="space-y-3">
                {showModalForFile.extractedData.education.length > 0 ? (
                  showModalForFile.extractedData.education.map((edu, idx) => (
                    <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground">
                        {edu.institution}
                      </p>
                      {edu.year && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Año: {edu.year}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                    No se encontró formación académica.
                  </p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-foreground">
                Habilidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {showModalForFile.extractedData.skills.length > 0 ? (
                  showModalForFile.extractedData.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No se encontraron habilidades.
                  </p>
                )}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-foreground">
                Idiomas
              </h3>
              <div className="flex flex-wrap gap-2">
                {showModalForFile.extractedData.languages.length > 0 ? (
                  showModalForFile.extractedData.languages.map((lang, idx) => (
                    <Badge key={idx} variant="outline">
                      {lang.name} - {lang.level}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No se encontraron idiomas.
                  </p>
                )}
              </div>
            </div>

            {/* Summary */}
            {showModalForFile.extractedData.summary && (
              <div className="space-y-3">
                <h3 className="font-semibold text-base text-foreground">
                  Resumen Profesional
                </h3>
                <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                  {showModalForFile.extractedData.summary}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay datos extraídos disponibles para este CV.
          </p>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {isReadyForReview && (
            <Button
              variant="destructive"
              onClick={() => showModalForFile && onDeleteFile(showModalForFile.id)}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </Button>
          )}
          {isReadyForReview && (
            <Button onClick={onAnalyzeCandidate} className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Analizar candidato
            </Button>
          )}

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}