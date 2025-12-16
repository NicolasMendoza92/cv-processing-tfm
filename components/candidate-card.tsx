"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CandidateExtractedData } from "@/types"
import { Eye, Trash2, MessageSquare, TrendingUp, Briefcase, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface CandidateCardProps {
  candidate: CandidateExtractedData
  onViewDetails: (id: string) => void
  onDelete: (id: string) => void
  onFeedback: (id: string) => void
}

export function CandidateCard({ candidate, onViewDetails, onDelete, onFeedback }: CandidateCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 0.70) return "secondary"
    if (score >= 0.50) return "default"
    return "destructive"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 0.70) return "secondary"
    if (score >= 0.50) return "default"
    return "destructive"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{candidate.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(candidate.lastProcessed)}</span>
            </div>
          </div>
          <Badge variant={getScoreBadgeVariant(candidate.employabilityScore)} className="text-base px-3 py-1">
            {candidate.employabilityScore}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium">Score de Empleabilidad</p>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div
              className={cn("h-2.5 rounded-full transition-all", {
                "bg-green-600": candidate.employabilityScore >= 0.70,
                "bg-amber-500": candidate.employabilityScore >= 0.50 && candidate.employabilityScore < 0.70,
                "bg-red-600": candidate.employabilityScore < 0.50,
              })}
              style={{ width: `${candidate.employabilityScore}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium">Puestos Recomendados</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {candidate.topRecommendations.slice(0, 2).map((job, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {job}
              </Badge>
            ))}
            {candidate.topRecommendations.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{candidate.topRecommendations.length - 2} más
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={() => onViewDetails(candidate.id)} className="w-full gap-2" size="sm">
            <Eye className="w-4 h-4" />
            Ver Detalles
          </Button>
          <div className="flex gap-2">
            <Button onClick={() => onFeedback(candidate.id)} variant="outline" className="flex-1 gap-2" size="sm">
              <MessageSquare className="w-4 h-4" />
              Registrar Feedback
            </Button>
            <Button
              onClick={() => onDelete(candidate.id)}
              variant="outline"
              size="sm"
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
