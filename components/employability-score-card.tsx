"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmployabilityScoreCardProps {
  score: number
  isApt: boolean
  recommendations: string[]
}

export function EmployabilityScoreCard({ score, isApt, recommendations }: EmployabilityScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 0.70) return "text-green-600"
    if (score >= 0.50) return "text-amber-600"
    return "text-red-600"
  }

  const getProgressColor = (score: number) => {
    if (score >= 0.70) return "bg-green-600"
    if (score >= 0.50) return "bg-amber-600"
    return "bg-red-600"
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Evaluación de Empleabilidad
        </CardTitle>
        <CardDescription>Análisis predictivo basado en el perfil del candidato</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Probabilidad de Conseguir Empleo</span>
            <span className={cn("text-3xl font-bold", getScoreColor(score))}>{score*100}%</span>
          </div>
          <Progress value={score*100} className="h-3" indicatorClassName={getProgressColor(score)} />
        </div>

        {/* Apt Badge */}
        <div className="flex items-center justify-center py-4">
          {isApt ? (
            <Badge className="gap-2 px-6 py-2 text-base bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-5 h-5" />
              APTO PARA EL EMPLEO
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-2 px-6 py-2 text-base">
              <XCircle className="w-5 h-5" />
              NO APTO PARA EL EMPLEO
            </Badge>
          )}
        </div>

        {/* Recommendations */}
        {recommendations?.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Áreas de Desarrollo Recomendadas</h4>
            <div className="flex flex-wrap gap-2">
              {recommendations.map((rec, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1.5 text-xs font-normal">
                  {rec}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
