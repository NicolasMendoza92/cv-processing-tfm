"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "uploading" | "success" | "error"
  progress: number
}

export function CVUploadSection() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return

    const validExtensions = [".pdf", ".doc", ".docx", ".txt"]
    const newFiles: UploadedFile[] = []

    Array.from(fileList).forEach((file) => {
      const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

      if (validExtensions.includes(extension)) {
        const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        newFiles.push({
          id: fileId,
          name: file.name,
          size: file.size,
          status: "uploading",
          progress: 0,
        })

        // Simulate upload progress
        simulateUpload(fileId)
      }
    })

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30

      if (progress >= 100) {
        clearInterval(interval)
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "success", progress: 100 } : f)))
      } else {
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f)))
      }
    }, 500)
  }

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

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Carga de Currículums</CardTitle>
          <CardDescription className="text-base">
            Sube los CVs de los candidatos para iniciar el proceso de evaluación de empleabilidad y recomendación de
            puestos.
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
              {files.filter((f) => f.status === "success").length} de {files.length} archivos procesados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      {file.status === "uploading" && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">Subiendo... {Math.round(file.progress)}%</p>
                        </>
                      )}
                      {file.status === "success" && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-xs text-secondary">Enviado a procesar</p>
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
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    {file.status === "uploading" && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                    {file.status === "success" && <CheckCircle2 className="w-5 h-5 text-secondary" />}
                    {file.status === "error" && <AlertCircle className="w-5 h-5 text-destructive" />}

                    <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="h-8 w-8">
                      <X className="w-4 h-4" />
                      <span className="sr-only">Eliminar archivo</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
