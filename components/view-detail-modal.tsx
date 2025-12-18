"use client";

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
import { CandidateData } from "@/types";

interface ViewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateData | null;
}

export function ViewDetailModal({ isOpen, onClose, candidate }: ViewDetailModalProps) {
  if (!candidate?.extendedData) return null;

  const extendedData = candidate.extendedData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles Completos del Candidato</DialogTitle>
          <DialogDescription>
            Información consolidada del proceso completo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Score Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-semibold text-sm mb-2 text-muted-foreground">
                Score de Empleabilidad
              </h3>
              <p className="text-4xl font-bold text-primary">
                {extendedData.employabilityScore ? (extendedData.employabilityScore * 100).toFixed(0) : "N/A"}
              </p>
              {extendedData.employabilityScore !== undefined && (
                <Badge
                  className="mt-2"
                  variant={
                    candidate.employabilityResults?.isApt
                      ? "destructive"
                      : "default"
                  }
                >
                  {candidate.employabilityResults?.isApt
                    ? "APTO"
                    : "NO APTO"}
                </Badge>
              )}
            </div>
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-semibold text-sm mb-2 text-muted-foreground">
                Puestos Recomendados
              </h3>
              <p className="text-4xl font-bold text-primary">
                {extendedData.topRecommendations?.length || 0}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="font-semibold">Información Personal</h3>
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Nombre</p>
                <p className="font-medium">{extendedData.name}</p>
              </div>
              {extendedData.email && (
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{extendedData.email}</p>
                </div>
              )}
              {extendedData.phone && (
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{extendedData.phone}</p>
                </div>
              )}
              {extendedData.age && (
                <div>
                  <p className="text-xs text-muted-foreground">Edad</p>
                  <p className="font-medium">{extendedData.age} años</p>
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          {extendedData.experience.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Experiencia Laboral</h3>
              <div className="space-y-2">
                {extendedData.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-muted/50 rounded-lg text-sm"
                  >
                    <p className="font-medium">{exp.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {exp.company} • {exp.years} años
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {extendedData.skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {extendedData.skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Top Recommendations */}
          {extendedData.topRecommendations &&
            extendedData.topRecommendations.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Puestos Recomendados</h3>
                <div className="space-y-2">
                  {extendedData.topRecommendations.map((job, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-muted/50 rounded-lg text-sm"
                    >
                      <p className="font-medium">{job}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Development Areas */}
          {extendedData.areasForDevelopment &&
            extendedData.areasForDevelopment.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Áreas de Desarrollo</h3>
                <ul className="space-y-1">
                  {extendedData.areasForDevelopment.map((area, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary">•</span>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
