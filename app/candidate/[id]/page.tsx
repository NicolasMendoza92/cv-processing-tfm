"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Loader2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Languages,
  Download,
  Send,
  Target,
  MessageSquare,
} from "lucide-react"
import { getCandidateDetails, getJobRecommendations } from "@/services/cv-service"
import { EmployabilityScoreCard } from "@/components/employability-score-card"
import { JobRecommendationCard } from "@/components/job-recommendation-card"
import type { CandidateDetails, JobRecommendationsResponse } from "@/types/cv"


export default function CandidateDetailPage() {
  const params = useParams()
   const router = useRouter()
  const [candidate, setCandidate] = useState<CandidateDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [jobRecommendations, setJobRecommendations] = useState<JobRecommendationsResponse | null>(null)
  const [isLoadingJobs, setIsLoadingJobs] = useState(false)
  const [jobsError, setJobsError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCandidateDetails() {
      setIsLoading(true)
      setError(null)

      try {
        const id = params.id as string
        const data = await getCandidateDetails(id)

        if (!data) {
          setError("No se encontraron detalles para este candidato")
        } else {
          setCandidate(data)
          loadJobRecommendations(id)
        }
      } catch (err) {
        console.error("[v0] Error loading candidate details:", err)
        setError("Error al cargar los detalles del candidato")
      } finally {
        setIsLoading(false)
      }
    }

    loadCandidateDetails()
  }, [params.id])

  async function loadJobRecommendations(candidateId: string) {
    setIsLoadingJobs(true)
    setJobsError(null)

    try {
      const data = await getJobRecommendations(candidateId)

      if (!data) {
        setJobsError("No se encontraron recomendaciones de puestos para este candidato")
      } else {
        setJobRecommendations(data)
      }
    } catch (err) {
      console.error("[v0] Error loading job recommendations:", err)
      setJobsError("Error al cargar las recomendaciones de puestos")
    } finally {
      setIsLoadingJobs(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground text-lg">Cargando detalles del candidato...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !candidate) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Button variant="ghost" onClick={() => router.push("/history")} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver al Historial
        </Button>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error || "Candidato no encontrado"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <Button variant="ghost" onClick={() => router.push("/history")} className="mb-6 gap-2">
        <ArrowLeft className="w-4 h-4" />
        Volver al Historial
      </Button>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
          Detalles del Candidato: {candidate.name}
        </h1>
        <p className="text-muted-foreground text-sm">
          Archivo: <span className="font-medium">{candidate.cvFileName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Información General del Candidato
              </CardTitle>
              <CardDescription>Datos extraídos del CV mediante procesamiento de lenguaje natural</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="font-medium">Email</span>
                  </div>
                  <p className="text-sm text-foreground pl-6">{candidate.email}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">Teléfono</span>
                  </div>
                  <p className="text-sm text-foreground pl-6">{candidate.phone}</p>
                </div>
              </div>

              <Separator />

              {/* Work Experience */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  Último Puesto de Trabajo
                </div>
                <p className="text-sm text-foreground pl-6">{candidate.lastJob}</p>
                <p className="text-xs text-muted-foreground pl-6">
                  Experiencia laboral: {candidate.workExperienceYears}{" "}
                  {candidate.workExperienceYears === 1 ? "año" : "años"}
                </p>
              </div>

              <Separator />

              {/* Education */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  Última Formación Académica
                </div>
                <p className="text-sm text-foreground pl-6">{candidate.lastEducation}</p>
                <p className="text-xs text-muted-foreground pl-6">
                  Años de educación formal: {candidate.formalEducationYears}
                </p>
              </div>

              <Separator />

              {/* Skills */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Habilidades Clave</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Languages */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Languages className="w-4 h-4" />
                  Idiomas
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidate.languages.map((lang, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {lang.name} - {lang.level}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Additional Dataset Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Datos Adicionales del Dataset</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Discapacidad:</span>
                    <Badge variant={candidate.disability === "Sí" ? "default" : "secondary"}>
                      {candidate.disability}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">Situación de Reclusión Previa:</span>
                    <Badge variant={candidate.previousIncarceration === "Sí" ? "default" : "secondary"}>
                      {candidate.previousIncarceration}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Disponibles</CardTitle>
              <CardDescription>Funcionalidades para gestionar el candidato</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" className="gap-2 justify-start bg-transparent">
                  <Target className="w-4 h-4" />
                  Ver Puestos Recomendados
                </Button>
                <Button variant="outline" className="gap-2 justify-start bg-transparent">
                  <MessageSquare className="w-4 h-4" />
                  Generar Entrevista Simulada
                </Button>
                <Button variant="outline" className="gap-2 justify-start bg-transparent">
                  <Download className="w-4 h-4" />
                  Exportar Reporte
                </Button>
                <Button variant="outline" className="gap-2 justify-start bg-transparent">
                  <Send className="w-4 h-4" />
                  Enviar a Empresa/Voluntario
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Employability Score */}
        <div className="lg:col-span-1">
          <EmployabilityScoreCard
            score={candidate.employabilityScore}
            isApt={candidate.isAptForEmployment}
            recommendations={candidate.developmentRecommendations}
          />
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Puestos de Trabajo Recomendados
            </CardTitle>
            <CardDescription>
              Basado en el perfil del candidato, estos son los roles que mejor se ajustan a sus habilidades y
              experiencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingJobs ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-muted-foreground text-sm">Analizando perfil y generando recomendaciones...</p>
                </div>
              </div>
            ) : jobsError ? (
              <div className="text-center py-8">
                <p className="text-destructive text-sm">{jobsError}</p>
              </div>
            ) : jobRecommendations && jobRecommendations.recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobRecommendations.recommendations.map((job) => (
                  <JobRecommendationCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No hay recomendaciones disponibles para este candidato</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
