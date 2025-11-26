// src/components/CVUploadSection.tsx
"use client"

import type React from "react"
import { useState, useCallback } from "react"
// ... (otras importaciones de shadcn/ui) ...
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


import type { ExtractedCVData, CandidateSummary, UploadedFile } from "@/types/cv"
import { extractCVDataAction, processCandidateDataAction } from "@/services/cvServices"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { AlertCircle, CheckCircle2, Eye, FileText, Loader2, Trash2, Upload, X } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { cn } from "@/lib/utils"


interface ExperienceItem {
  title: string
  company: string
  years: number
}

interface EducationItem {
  degree: string
  institution: string
  year?: number
}

interface LanguageItem {
  name: string
  level: string
}


export function CVUploadSection() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [showModalForFile, setShowModalForFile] = useState<UploadedFile | null>(null)
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  // Función para subir y extraer datos del CV (POST /extract_cv_data) usando Server Action
  const uploadAndExtractCVData = useCallback(async (fileToUpload: File, fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: "uploading", progress: 0 } : f)),
    )

    try {
      // Para un progreso de subida real con Server Actions es más complejo (generalmente vía streaming o un API Route)
      // Por ahora, lo marcamos como 100% subido y luego como "processing"
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress: 100 } : f)))
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "processing" } : f)))


      // Llama a la Server Action
      const result = await extractCVDataAction(fileToUpload)

      if (!result.success) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: "error", errorMessage: result.error } : f,
          ),
        )
        return
      }

      // Si la extracción es exitosa
      const extractedData = result.data! // Sabemos que existe por result.success
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "ready_for_review", extractedData: extractedData } : f,
        ),
      )

    } catch (error: any) {
      console.error("Error inesperado al llamar a extractCVDataAction:", error)
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "error", errorMessage: error.message || "Error desconocido" } : f,
        ),
      )
    }
  }, [])

  // Función para procesar los datos extraídos (POST /process_candidate_data) usando Server Action
  const processExtractedCandidateData = useCallback(async (fileId: string, dataToProcess: ExtractedCVData) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: "processing", errorMessage: undefined } : f)),
    )

    try {
      // Llama a la Server Action
      const result = await processCandidateDataAction(dataToProcess)

      if (!result.success) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: "error", errorMessage: result.error } : f,
          ),
        )
        return
      }

      const candidateSummary = result.data!
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "approved", candidateSummary: candidateSummary } : f,
        ),
      )
      console.log("Candidato aprobado y resumen final recibido:", candidateSummary)

    } catch (error: any) {
      console.error("Error inesperado al llamar a processCandidateDataAction:", error)
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "error", errorMessage: error.message || "Error desconocido" } : f,
        ),
      )
    }
  }, [])

  const processFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return

      const validExtensions = [".pdf", ".doc", ".docx", ".txt"]
      const filesToQueue: { id: string; file: File }[] = []

      Array.from(fileList).forEach((file) => {
        const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

        if (validExtensions.includes(extension)) {
          const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          filesToQueue.push({ id: fileId, file: file })

          setFiles((prev) => [
            ...prev,
            {
              id: fileId,
              file: file, // Guardamos la referencia al objeto File
              name: file.name,
              size: file.size,
              status: "uploading",
              progress: 0,
            },
          ])
        }
      })

      filesToQueue.forEach(({ id, file }) => {
        uploadAndExtractCVData(file, id)
      })
    },
    [uploadAndExtractCVData],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      processFiles(e.dataTransfer.files)
    },
    [processFiles],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files)
      e.target.value = ""
    },
    [processFiles],
  )

  const removeFile = useCallback(async (fileId: string) => {
    // Si tienes un Server Action para eliminar del backend real:
    // const result = await deleteCandidateAction(fileId);
    // if (result.success) {
    //   setFiles((prev) => prev.filter((f) => f.id !== fileId));
    //   setFileToDelete(null);
    // } else {
    //   console.error("Error al eliminar candidato:", result.error);
    //   // Mostrar un error al usuario
    // }

    // Por ahora, solo elimina del estado local
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    setFileToDelete(null)
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const handleApproveCandidate = () => {
    if (!showModalForFile || !showModalForFile.extractedData) return

    processExtractedCandidateData(showModalForFile.id, showModalForFile.extractedData)
    setShowModalForFile(null)
  }

  const getStatusDisplay = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return { text: "Subiendo...", color: "text-muted-foreground" }
      case "processing":
        return { text: "Procesando con PLN...", color: "text-blue-500" }
      case "ready_for_review":
        return { text: "Listo para Revisión", color: "text-amber-600" }
      case "approved":
        return { text: "Aprobado y en Proceso Final", color: "text-secondary" }
      case "error":
        return { text: "Error", color: "text-destructive" }
      default:
        return { text: "", color: "" }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Carga de Currículums</CardTitle>
          <CardDescription className="text-base">
            Sube los CVs de los candidatos para iniciar el proceso de extracción, revisión y evaluación de empleabilidad.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 md:p-12 transition-all duration-200 cursor-pointer",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
            )}
          >
            <input
              type="file"
              id="file-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileInput}
              accept=".pdf,.doc,.docx,.txt"
              multiple
            />

            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                  isDragging ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
                )}
              >
                <Upload className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">
                  {isDragging ? "¡Suelta el archivo aquí!" : "Arrastra y suelta tu CV aquí"}
                </p>
                <p className="text-sm text-muted-foreground">o haz clic para seleccionar un archivo</p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-background rounded-md border">PDF</span>
                <span className="px-2 py-1 bg-background rounded-md border">DOC</span>
                <span className="px-2 py-1 bg-background rounded-md border">DOCX</span>
                <span className="px-2 py-1 bg-background rounded-md border">TXT</span>
              </div>
            </div>
          </div>

          {/* Manual Upload Button */}
          <div className="flex justify-center">
            <Button size="lg" onClick={() => document.getElementById("file-upload")?.click()} className="gap-2">
              <Upload className="w-4 h-4" />
              Seleccionar CV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">CVs Cargados</CardTitle>
            <CardDescription>
              {files.filter((f) => f.status === "approved").length} de {files.length} archivos en proceso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => {
                const statusDisplay = getStatusDisplay(file.status)
                return (
                  <div
                    key={file.id}
                    className="flex flex-col gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{file.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          {statusDisplay.text && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <p className={cn("text-xs font-medium", statusDisplay.color)}>{statusDisplay.text}</p>
                            </>
                          )}
                          {file.status === "uploading" && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground">{Math.round(file.progress)}%</p>
                            </>
                          )}
                        </div>

                        {file.status === "uploading" && (
                          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                         {file.status === "error" && file.errorMessage && (
                          <p className="text-xs text-destructive mt-1 truncate">Error: {file.errorMessage}</p>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {(file.status === "uploading" || file.status === "processing") && (
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        )}
                        {file.status === "ready_for_review" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowModalForFile(file)}
                            className="gap-2 h-8"
                          >
                            <Eye className="w-4 h-4" />
                            Revisar Datos
                          </Button>
                        )}
                        {file.status === "approved" && (
                            <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setShowModalForFile(file)}
                            className="gap-2 h-8"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Ver Resumen
                          </Button>
                        )}
                        {file.status === "error" && <AlertCircle className="w-5 h-5 text-destructive" />}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setFileToDelete(file.id)}
                          className="h-8 w-8"
                        >
                          <X className="w-4 h-4" />
                          <span className="sr-only">Eliminar archivo</span>
                        </Button>
                      </div>
                    </div>
                  
                    {/* Mostrar summary si el estado es 'approved' */}
                    {file.status === "approved" && file.candidateSummary && (
                      <div className="border-t pt-3 mt-3 space-y-2 text-sm text-muted-foreground">
                        <p><strong>Candidato:</strong> {file.candidateSummary.name}</p>
                        <p><strong>Score Empleabilidad:</strong> <span className="font-bold text-primary">{file.candidateSummary.employability_score.toFixed(2)}</span></p>
                        <p><strong>Puestos Recomendados:</strong> {file.candidateSummary.top_recommendations.join(", ")}</p>
                        {file.candidateSummary.areas_for_development && file.candidateSummary.areas_for_development.length > 0 && (
                          <p><strong>Áreas de Desarrollo:</strong> {file.candidateSummary.areas_for_development.join(", ")}</p>
                        )}
                        {file.candidateSummary.interview_questions && file.candidateSummary.interview_questions.length > 0 && (
                          <p className="text-xs text-muted-foreground">Preguntas: {file.candidateSummary.interview_questions.slice(0, 3).join("... ") + (file.candidateSummary.interview_questions.length > 3 ? "..." : "")}</p>
                        )}
                         <p className="text-xs text-right text-muted-foreground">Procesado: {new Date(file.candidateSummary.last_processed).toLocaleString()}</p>
                      </div>
                    )}

                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal para Revisar Datos Extraídos (sin cambios significativos) */}
      <Dialog open={!!showModalForFile} onOpenChange={() => setShowModalForFile(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
                {showModalForFile?.status === "approved" ? "Resumen de Empleabilidad" : "Datos Extraídos del CV"}
            </DialogTitle>
            <DialogDescription>
              {showModalForFile?.name} - {showModalForFile?.status === "approved" ? "Información final del candidato" : "Revisa la información extraída por el sistema de PLN"}
            </DialogDescription>
          </DialogHeader>

          {showModalForFile?.status === "approved" && showModalForFile?.candidateSummary ? (
            <div className="space-y-6 py-4">
               {/* Resumen de Empleabilidad aquí */}
               <div className="space-y-3">
                <h3 className="font-semibold text-lg text-foreground">Score de Empleabilidad: <span className="text-primary">{showModalForFile.candidateSummary.employability_score.toFixed(2)}</span></h3>
                <p className="text-sm text-muted-foreground">Este score indica la probabilidad de que el candidato consiga un empleo, basado en sus habilidades, experiencia y educación.</p>
               </div>
               
               <div className="space-y-3">
                 <h3 className="font-semibold text-base text-foreground">Puestos Recomendados</h3>
                 <div className="flex flex-wrap gap-2">
                   {showModalForFile.candidateSummary.top_recommendations.map((rec, idx) => (
                     <Badge key={idx} variant="default" className="text-lg py-1 px-3">
                       {rec}
                     </Badge>
                   ))}
                 </div>
               </div>

               {showModalForFile.candidateSummary.areas_for_development && showModalForFile.candidateSummary.areas_for_development.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-semibold text-base text-foreground">Áreas de Desarrollo Sugeridas</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {showModalForFile.candidateSummary.areas_for_development.map((area, idx) => (
                            <li key={idx}>{area}</li>
                        ))}
                    </ul>
                </div>
               )}

               {showModalForFile.candidateSummary.interview_questions && showModalForFile.candidateSummary.interview_questions.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-semibold text-base text-foreground">Preguntas de Entrevista Sugeridas</h3>
                    <ul className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                        {showModalForFile.candidateSummary.interview_questions.map((q, idx) => (
                            <li key={idx}>{q}</li>
                        ))}
                    </ul>
                </div>
               )}

               <p className="text-xs text-right text-muted-foreground mt-4">Último procesamiento: {new Date(showModalForFile.candidateSummary.last_processed).toLocaleString()}</p>

            </div>
          ) : showModalForFile?.extractedData ? (
            <div className="space-y-6 py-4">
              {/* Personal Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base text-foreground">Información Personal</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Nombre</p>
                    <p className="text-sm font-medium">{showModalForFile.extractedData.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{showModalForFile.extractedData.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="text-sm font-medium">{showModalForFile.extractedData.phone || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base text-foreground">Experiencia Laboral</h3>
                <div className="space-y-3">
                  {showModalForFile.extractedData.experience.length > 0 ? (
                    showModalForFile.extractedData.experience.map((exp, idx) => (
                      <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-medium text-sm">{exp.title}</p>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">~{exp.years} años de experiencia</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">No se encontró experiencia laboral.</p>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base text-foreground">Formación Académica</h3>
                <div className="space-y-3">
                  {showModalForFile.extractedData.education.length > 0 ? (
                    showModalForFile.extractedData.education.map((edu, idx) => (
                      <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-medium text-sm">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        {edu.year && <p className="text-xs text-muted-foreground mt-1">Año: {edu.year}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">No se encontró formación académica.</p>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base text-foreground">Habilidades</h3>
                <div className="flex flex-wrap gap-2">
                  {showModalForFile.extractedData.skills.length > 0 ? (
                    showModalForFile.extractedData.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No se encontraron habilidades.</p>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base text-foreground">Idiomas</h3>
                <div className="flex flex-wrap gap-2">
                  {showModalForFile.extractedData.languages.length > 0 ? (
                    showModalForFile.extractedData.languages.map((lang, idx) => (
                      <Badge key={idx} variant="outline">
                        {lang.name} - {lang.level}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No se encontraron idiomas.</p>
                  )}
                </div>
              </div>

              {/* Summary */}
              {showModalForFile.extractedData.summary && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-base text-foreground">Resumen Profesional</h3>
                  <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                    {showModalForFile.extractedData.summary}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No hay datos extraídos disponibles para este CV.</p>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowModalForFile(null)}>
              Cerrar
            </Button>
            {showModalForFile?.status === "ready_for_review" && (
                <Button
                    variant="destructive"
                    onClick={() => {
                        if (showModalForFile) {
                        setFileToDelete(showModalForFile.id)
                        setShowModalForFile(null)
                        }
                    }}
                    className="gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    Eliminar Candidato
                </Button>
            )}
            {showModalForFile?.status === "ready_for_review" && (
                <Button onClick={handleApproveCandidate} className="gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Aprobar y Continuar
                </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!fileToDelete} onOpenChange={() => setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este CV?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el archivo y todos los datos asociados. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => fileToDelete && removeFile(fileToDelete)} className="bg-destructive">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}