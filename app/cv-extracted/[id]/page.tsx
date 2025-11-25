"use client"

import { useEffect, useState } from "react"
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, Edit, ArrowLeft } from "lucide-react"
import { getExtractedData, saveCandidate } from "@/services/cv-service"
import type { CandidateDetails } from "@/types/cv"
import { ExtractedDataDisplay } from "@/components/extracted-data-display"
import {  toast } from 'sonner'
import { useRouter } from "next/navigation"

export default function ExtractedDataPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [extractedData, setExtractedData] = useState<CandidateDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadExtractedData() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getExtractedData(id)
        if (data) {
          setExtractedData(data)
        } else {
          setError("No se encontraron datos extraídos para este CV.")
        }
      } catch (err) {
        console.error("[v0] Error loading extracted data:", err)
        setError("Error al cargar los datos extraídos.")
      } finally {
        setIsLoading(false)
      }
    }

    loadExtractedData()
  }, [id])

  const handleApprove = async () => {
    if (!extractedData) return

    setIsSaving(true)
    try {
      await saveCandidate(extractedData)
      toast("Los datos han sido guardados y el candidato está siendo evaluado.")
      // Redirect to candidates list after a short delay
      setTimeout(() => {
        router.push("/candidates")
      }, 1500)
    } catch (err) {
      console.error("[v0] Error saving candidate:", err)
      toast("No se pudo guardar el candidato. Intenta nuevamente.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleReject = () => {
    toast("El CV ha sido eliminado del historial.")
    setTimeout(() => {
      router.push("/history")
    }, 1000)
  }

  const handleEdit = () => {
    toast("La edición de datos estará disponible próximamente.")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Cargando datos extraídos del CV...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !extractedData) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Button variant="ghost" onClick={() => router.push("/history")} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver al Historial
        </Button>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error || "No se pudieron cargar los datos."}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Button variant="ghost" onClick={() => router.push("/history")} className="mb-6 gap-2">
        <ArrowLeft className="w-4 h-4" />
        Volver al Historial
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
          Datos Extraídos del CV: {extractedData.cvFileName}
        </h1>
        <p className="text-muted-foreground text-lg text-pretty">
          Revisa la información extraída por el sistema de procesamiento de lenguaje natural (PLN).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExtractedDataDisplay data={extractedData} />
        </div>

        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Acciones</CardTitle>
              <CardDescription>Decide qué hacer con estos datos extraídos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleApprove} disabled={isSaving} className="w-full gap-2" size="lg">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Aprobar y Continuar
                  </>
                )}
              </Button>

              <Button
                onClick={handleEdit}
                variant="outline"
                className="w-full gap-2 bg-transparent"
                disabled={isSaving}
              >
                <Edit className="w-4 h-4" />
                Editar Datos
              </Button>

              <Button onClick={handleReject} variant="destructive" className="w-full gap-2" disabled={isSaving}>
                <XCircle className="w-4 h-4" />
                Rechazar CV
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Al aprobar, los datos serán enviados al sistema de evaluación de empleabilidad para calcular el score y
                generar recomendaciones de puestos.
              </p>
              <p className="font-medium text-foreground">Este proceso puede tomar unos segundos.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
