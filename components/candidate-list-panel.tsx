"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2, Eye, Trash2, Edit, TrendingUp, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { CandidateData, FileStatus } from "@/types"
import { useRouter } from "next/navigation"


interface CandidateListPanelProps {
  candidates: CandidateData[]
  onEditExtractedData: (candidate: CandidateData) => void
  onSaveCandidate: (candidate: CandidateData) => void | Promise<void> 
  onProcessEmployability: (candidate: CandidateData) => void | Promise<void>
  onViewDetails: (candidate: CandidateData) => void
  onDelete: (candidateId: string) => void
}

export function CandidateListPanel({
  candidates,
  onEditExtractedData,
  onSaveCandidate,
  onProcessEmployability,
  onViewDetails,
  onDelete,
}: CandidateListPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const router = useRouter();

  const getStatusInfo = (status: FileStatus) => {
    switch (status) {
      case "processing":
        return { label: "Procesando PLN", color: "bg-blue-500", textColor: "text-white" }
      case "ready_for_review":
        return { label: "Listo para Revisión", color: "bg-amber-500", textColor: "text-white" }
      case "saved":
        return { label: "Guardado", color: "bg-green-500", textColor: "text-white" }
      case "pending":
        return { label: "Evaluando Empleabilidad", color: "bg-purple-500", textColor: "text-white" }
      case "approved":
        return { label: "Completado", color: "bg-secondary", textColor: "text-white" }
      case "error":
        return { label: "Error", color: "bg-destructive", textColor: "text-white" }
      default:
        return { label: "Pendiente", color: "bg-muted", textColor: "text-muted-foreground" }
    }
  }

  // Filter candidates
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.cvFileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.extendedData?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Paginate
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage)
  const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Candidatos y Flujo de Procesamiento</CardTitle>
        <CardDescription>
          {filteredCandidates.length} candidato{filteredCandidates.length !== 1 ? "s" : ""} en proceso
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o archivo..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-200">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="processing">Procesando PLN</SelectItem>
              <SelectItem value="ready_for_review">Listo para Revisión</SelectItem>
              <SelectItem value="saved">Guardado</SelectItem>
              <SelectItem value="pending">Evaluando</SelectItem>
              <SelectItem value="approved">Completado</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Candidates List */}
        <div className="space-y-3">
          {paginatedCandidates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {candidates.length === 0
                ? "No hay candidatos. Sube un CV para comenzar."
                : "No se encontraron candidatos que coincidan con los filtros."}
            </div>
          ) : (
            paginatedCandidates.map((candidate) => {
              const statusInfo = getStatusInfo(candidate.status)
              return (
                <div
                  key={candidate.id}
                  className="p-4 rounded-lg border bg-card hover:bg-black/10 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <p className="font-semibold text-sm truncate">
                          {candidate.extendedData?.name || candidate.cvFileName}
                        </p>
                        <p className="text-xs text-muted-foreground">{candidate.cvFileName}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className={cn("text-xs", statusInfo.textColor)}>
                          {statusInfo.label}
                        </Badge>
                        {candidate.extendedData?.employabilityScore !== undefined && (
                          <Badge variant="outline" className="text-xs">
                            Score: {candidate.extendedData.employabilityScore}
                          </Badge>
                        )}
                        {candidate.extendedData?.topRecommendations &&
                          candidate.extendedData.topRecommendations.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {candidate.extendedData.topRecommendations.length} puestos recomendados
                            </Badge>
                          )}
                      </div>

                      {candidate.errorMessage && <p className="text-xs text-destructive">{candidate.errorMessage}</p>}
                    </div>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onDelete(candidate.id)}
                      className="shrink-0 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {candidate.status === "processing" && (
                      <Button variant="outline" size="sm" disabled className="gap-2 bg-transparent">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Extrayendo datos del CV...
                      </Button>
                    )}

                    {candidate.status === "ready_for_review" && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onEditExtractedData(candidate)}
                          className="gap-2"
                        >
                          <Edit className="w-3 h-3" />
                          Editar/Completar Datos
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSaveCandidate(candidate)}
                          className="gap-2"
                        >
                          <Save className="w-3 h-3" />
                          Guardar sin Editar
                        </Button>
                      </>
                    )}

                    {candidate.status === "saved" && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onProcessEmployability(candidate)}
                          className="gap-2"
                        >
                          <TrendingUp className="w-3 h-3" />
                          Evaluar Empleabilidad
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push("/candidates")}
                          className="gap-2"
                        >
                          <Edit className="w-3 h-3" />
                          Ver candidatos
                        </Button>
                      </>
                    )}

                    {candidate.status === "pending" && (
                      <Button variant="outline" size="sm" disabled className="gap-2 bg-transparent">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Procesando Empleabilidad...
                      </Button>
                    )}

                    {candidate.status === "approved" && (
                      <>
                        <Button variant="default" size="sm" onClick={() => onViewDetails(candidate)} className="gap-2">
                          <Eye className="w-3 h-3" />
                          Ver Detalles Completos
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push("/history")}
                          className="gap-2"
                        >
                          <Edit className="w-3 h-3" />
                          Ver procesamientos
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
