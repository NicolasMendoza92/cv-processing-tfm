"use client";

import type React from "react";
import { useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type {
  CandidateFile,
  CandidateSaveData,
  CandidateToAnalyzeType,
  ExtractedCVData,
  UploadedFile,
} from "@/types";
import {
  extractCVDataAction,
  processCandidateDataAction,
} from "@/services/cvServices";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  FileText,
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { DataReviewModal } from "./data-review-modal";
import { toast } from "sonner";

export function CVUploadSection() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showModalForFile, setShowModalForFile] = useState<UploadedFile | null>(
    null
  );
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Función para subir y extraer datos del CV (POST /extract-cv-data) usando Server Action
  const uploadAndExtractCVData = useCallback(
    async (fileToUpload: File, fileId: string) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "uploading", progress: 0 } : f
        )
      );

      try {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: 100 } : f))
        );
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: "processing" } : f
          )
        );

        // Llama a la Server Action que es el MICROSERVICIO 1
        const result = await extractCVDataAction(fileToUpload);
        console.log("resultados extraidos del CV", result);

        if (!result.success) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? { ...f, status: "error", errorMessage: result.error }
                : f
            )
          );
          return;
        }

        // Si la extracción es exitosa
        const extractedData = result.data!;
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: "ready_for_review",
                  extractedData: extractedData,
                }
              : f
          )
        );
      } catch (error: any) {
        console.error(
          "Error inesperado al llamar a extractCVDataAction:",
          error
        );
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: "error",
                  errorMessage: error.message || "Error desconocido",
                }
              : f
          )
        );
      }
    },
    []
  );

  // Función para procesar los datos extraídos (POST /process-candidate-data) usando Server Action
  const processExtractedCandidateData = useCallback(
    async (fileId: string, dataToProcess: CandidateToAnalyzeType) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: "processing", errorMessage: undefined }
            : f
        )
      );

      try {
        // Llama a la Server Action MICROSERVICIO 2
        const result = await processCandidateDataAction(dataToProcess);
        console.log("resultados processados desde el backend", result);

        if (!result.success) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? { ...f, status: "error", errorMessage: result.error }
                : f
            )
          );
          return;
        }

        const candidateAnalysis = result.data!;
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: "approved",
                  candidateAnalysis: candidateAnalysis,
                }
              : f
          )
        );
        console.log(
          "Candidato aprobado y resumen final recibido:",
          candidateAnalysis
        );
      } catch (error: any) {
        console.error(
          "Error inesperado al llamar a processCandidateDataAction:",
          error
        );
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: "error",
                  errorMessage: error.message || "Error desconocido",
                }
              : f
          )
        );
      }
    },
    []
  );

  const processFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;

      const validExtensions = [".pdf", ".doc", ".docx", ".txt"];
      const filesToQueue: { id: string; file: File }[] = [];

      Array.from(fileList).forEach((file) => {
        const extension = file.name
          .substring(file.name.lastIndexOf("."))
          .toLowerCase();

        if (validExtensions.includes(extension)) {
          const fileId = `${Date.now()}-${Math.random()
            .toString(36)}`;
          filesToQueue.push({ id: fileId, file: file });

          setFiles((prev) => [
            ...prev,
            {
              id: fileId,
              file: file,
              name: file.name,
              size: file.size,
              status: "uploading",
              progress: 0,
            },
          ]);
        }
      });

      filesToQueue.forEach(({ id, file }) => {
        uploadAndExtractCVData(file, id);
      });
    },
    [uploadAndExtractCVData]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
      e.target.value = "";
    },
    [processFiles]
  );

  const removeFile = useCallback(async (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setFileToDelete(null);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // FUNCIONES HANDLE ACTIONS
  const handleAnalyzeCandidate = () => {
    if (!showModalForFile || !showModalForFile.extractedData) return;
    // processExtractedCandidateData(
    //   showModalForFile.id,
    //   showModalForFile.extractedData
    // );
    alert("Analizando candidato...");
    setShowModalForFile(null);
  };

  const handleDeleteFileFromModal = (fileId: string) => {
    setFileToDelete(fileId);
    setShowModalForFile(null);
  };

  const handleSaveCandidate = async (fileToSave: CandidateFile) => {
    console.log("Guardando candidato para el archivo:", fileToSave);
    if (
      fileToSave.status !== "approved" ||
      !fileToSave.extractedData ||
      !fileToSave.candidateAnalysis
    ) {
      console.error(
        "El archivo no está aprobado o le faltan datos para guardar."
      );
      toast.error(
        "No se puede guardar el candidato. Faltan datos o el estado no es 'aprobado'."
      );
      return;
    }

    // Prepara los datos que enviarás a tu API
    const dataToSend: CandidateSaveData = {
      name: fileToSave.candidateAnalysis.name,
      email: fileToSave.extractedData.email,
      phone: fileToSave.extractedData.phone,
      experience: fileToSave.extractedData.experience,
      education: fileToSave.extractedData.education,
      skills: fileToSave.extractedData.skills,
      languages: fileToSave.extractedData.languages,
      summary: fileToSave.extractedData.summary,
      rawText: fileToSave.extractedData.raw_text,
      employabilityScore: fileToSave.candidateAnalysis.employability_score,
      topRecommendations: fileToSave.candidateAnalysis.top_recommendations,
      lastProcessed: fileToSave.candidateAnalysis.last_processed,
      areasForDevelopment: fileToSave.candidateAnalysis.areas_for_development,
      interviewQuestions: fileToSave.candidateAnalysis.interview_questions,
      cvFileName: fileToSave.name,
    };

    try {
      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar el candidato");
      }

      const savedCandidate = await response.json();
      console.log("Candidato guardado exitosamente:", savedCandidate);
      toast.success(`Candidato "${savedCandidate.name}" guardado exitosamente!`);
       setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === fileToSave.id ? { ...f, isSaved: true } : f
        )
      );
    } catch (error) {
      console.error("Fallo al guardar el candidato:", error);
      toast.error(`Error al guardar el candidato: ${(error as Error).message}`);
    }
  };

  const getStatusDisplay = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return { text: "Subiendo...", color: "text-muted-foreground" };
      case "processing":
        return { text: "Procesando con PLN...", color: "text-blue-500" };
      case "ready_for_review":
        return { text: "Listo para Revisión", color: "text-amber-600" };
      case "approved":
        return { text: "Aprobado y en Proceso Final", color: "text-secondary" };
      case "error":
        return { text: "Error", color: "text-destructive" };
      default:
        return { text: "", color: "" };
    }
  };

  return (
    <div className=" mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Carga de Currículums</CardTitle>
          <CardDescription className="text-base">
            Sube los CVs de los candidatos para iniciar el proceso de
            extracción, revisión y evaluación de empleabilidad.
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
                : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
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
                  isDragging
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary"
                )}
              >
                <Upload className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">
                  {isDragging
                    ? "¡Suelta el archivo aquí!"
                    : "Arrastra y suelta tu CV aquí"}
                </p>
                <p className="text-sm text-muted-foreground">
                  o haz clic para seleccionar un archivo
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-background rounded-md border">
                  PDF
                </span>
                <span className="px-2 py-1 bg-background rounded-md border">
                  DOC
                </span>
                <span className="px-2 py-1 bg-background rounded-md border">
                  DOCX
                </span>
                <span className="px-2 py-1 bg-background rounded-md border">
                  TXT
                </span>
              </div>
            </div>
          </div>

          {/* Manual Upload Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="gap-2"
            >
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
              {files.filter((f) => f.status === "approved").length} de{" "}
              {files.length} archivos en proceso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => {
                const statusDisplay = getStatusDisplay(file.status);
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
                        <p className="font-medium text-sm text-foreground truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                          {statusDisplay.text && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <p
                                className={cn(
                                  "text-xs font-medium",
                                  statusDisplay.color
                                )}
                              >
                                {statusDisplay.text}
                              </p>
                            </>
                          )}
                          {file.status === "uploading" && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground">
                                {Math.round(file.progress)}%
                              </p>
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
                          <p className="text-xs text-destructive mt-1 truncate">
                            Error: {file.errorMessage}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {(file.status === "uploading" ||
                          file.status === "processing") && (
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
                        {file.status === "approved" && (
                          <Button
                            size="sm"
                            onClick={() => handleSaveCandidate(file)}
                            className="gap-2 h-8"
                            disabled={file.isSaved} // Disable if already saved
                          >
                            {file.isSaved ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                Guardado
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" /> {/* Use Save icon */}
                                Guardar informe
                              </>
                            )}
                          </Button>
                        )}
                        {file.status === "error" && (
                          <AlertCircle className="w-5 h-5 text-destructive" />
                        )}

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
                    {file.status === "approved" && file.candidateAnalysis && (
                      <div className="border-t pt-3 mt-3 space-y-2 text-sm text-muted-foreground">
                        <p>
                          <strong>Candidato:</strong>{" "}
                          {file.candidateAnalysis.name}
                        </p>
                        <p>
                          <strong>Score Empleabilidad:</strong>{" "}
                          <span className="font-bold text-primary">
                            {file.candidateAnalysis.employability_score.toFixed(
                              2
                            )}
                          </span>
                        </p>
                        <p>
                          <strong>Puestos Recomendados:</strong>{" "}
                          {file.candidateAnalysis.top_recommendations.join(
                            ", "
                          )}
                        </p>
                        {file.candidateAnalysis.areas_for_development &&
                          file.candidateAnalysis.areas_for_development.length >
                            0 && (
                            <p>
                              <strong>Áreas de Desarrollo:</strong>{" "}
                              {file.candidateAnalysis.areas_for_development.join(
                                ", "
                              )}
                            </p>
                          )}
                        {file.candidateAnalysis.interview_questions &&
                          file.candidateAnalysis.interview_questions.length >
                            0 && (
                            <p className="text-xs text-muted-foreground">
                              Preguntas:{" "}
                              {file.candidateAnalysis.interview_questions
                                .slice(0, 3)
                                .join("... ") +
                                (file.candidateAnalysis.interview_questions
                                  .length > 3
                                  ? "..."
                                  : "")}
                            </p>
                          )}
                        <p className="text-xs text-right text-muted-foreground">
                          Procesado:{" "}
                          {new Date(
                            file.candidateAnalysis.last_processed
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal para Revisar Datos Extraídos (sin cambios significativos) */}
      <DataReviewModal
        showModalForFile={showModalForFile}
        onClose={() => setShowModalForFile(null)}
        onAnalyzeCandidate={handleAnalyzeCandidate}
        onDeleteFile={handleDeleteFileFromModal}
      />
      <AlertDialog
        open={!!fileToDelete}
        onOpenChange={() => setFileToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este CV?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el archivo y todos los datos asociados. No
              se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => fileToDelete && removeFile(fileToDelete)}
              className="bg-destructive"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
