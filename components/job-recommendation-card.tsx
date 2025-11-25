import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, ExternalLink } from "lucide-react"
import type { JobRecommendation } from "@/types/cv"

interface JobRecommendationCardProps {
  job: JobRecommendation
}

export function JobRecommendationCard({ job }: JobRecommendationCardProps) {
  const getCompatibilityColor = (compatibility: string) => {
    switch (compatibility) {
      case "Alta":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "Media":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
      case "Baja":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg bg-primary/10 mt-1">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-1 text-balance">{job.title}</CardTitle>
              {job.cluster && (
                <Badge variant="outline" className="text-xs">
                  {job.cluster}
                </Badge>
              )}
            </div>
          </div>
          <Badge className={getCompatibilityColor(job.compatibility)} variant="outline">
            {job.compatibility}
          </Badge>
        </div>
        <CardDescription className="mt-3 text-pretty">{job.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Habilidades Requeridas</h4>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <Button variant="outline" className="w-full gap-2 bg-transparent" size="sm">
          <ExternalLink className="w-4 h-4" />
          Ver Ofertas Disponibles
        </Button>
      </CardContent>
    </Card>
  )
}
