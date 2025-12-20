"use client";

import type React from "react";
import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { CandidateData, CandidateDataExtended } from "@/types";
import { extractCVDataAction } from "@/services/cvServices";

interface SimpleUploadPanelProps {
  onFileUploaded: (candidate: CandidateData) => void;
}

export function SimpleUploadPanel({ onFileUploaded }: SimpleUploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFileWithBackend = useCallback(
    async (file: File) => {
      const fileId = `cv_${Date.now()}_${Math.random().toString(16)}`;

      const initialCandidate: CandidateData = {
        id: fileId, // esto genera uno que despues no uso mas
        cvFileName: file.name,
        uploadDate: new Date().toISOString(),
        status: "processing",
      };

      onFileUploaded(initialCandidate);
      setIsUploading(true);

      try {
        const result = await extractCVDataAction(file);
        console.log("Resultado de extracción de CV:", result);

        if (!result.success) {
          const errorCandidate: CandidateData = {
            ...initialCandidate,
            status: "error",
            errorMessage: result.error || "Error en extracción de datos",
          };
          onFileUploaded(errorCandidate);
          return;
        }

        const finalCandidate: CandidateData = {
          ...initialCandidate,
          status: "ready_for_review",
          extendedData: result.data as CandidateDataExtended,
        };

        console.log("Candidato final después de extracción:", finalCandidate);

        onFileUploaded(finalCandidate);
      } catch (error: any) {
        console.error("Error al procesar CV:", error);
        const errorCandidate: CandidateData = {
          ...initialCandidate,
          status: "error",
          errorMessage: error.message || "Error inesperado",
        };
        onFileUploaded(errorCandidate);
      } finally {
        setIsUploading(false);
      }
    },
    [onFileUploaded]
  );

  const processFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || isUploading) return;

      const validExtensions = [".pdf", ".doc", ".docx", ".txt"];

      Array.from(fileList).forEach(async (file) => {
        const extension = file.name
          .substring(file.name.lastIndexOf("."))
          .toLowerCase();

        if (validExtensions.includes(extension)) {
          await processFileWithBackend(file);
        }
      });
    },
    [processFileWithBackend, isUploading]
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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Carga de CVs</CardTitle>
        <CardDescription>
          Sube currículums para iniciar el procesamiento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <input
            type="file"
            id="file-upload-simple"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileInput}
            accept=".pdf,.doc,.docx,.txt"
            multiple
          />

          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
                isDragging
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary"
              )}
            >
              <Upload className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <p className="font-medium text-foreground">
                {isDragging
                  ? "¡Suelta el archivo aquí!"
                  : "Arrastra y suelta tu CV"}
              </p>
              <p className="text-sm text-muted-foreground">
                o haz clic para seleccionar
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

        <div className="flex justify-center">
          <Button
            onClick={() =>
              document.getElementById("file-upload-simple")?.click()
            }
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Seleccionar CV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
