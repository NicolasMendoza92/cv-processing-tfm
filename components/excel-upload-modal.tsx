"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Papa from "papaparse"
import { Upload, FileSpreadsheet, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ExcelRowData } from "@/types"


interface ExcelUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (data: ExcelRowData[]) => Promise<void>
}

export function ExcelUploadModal({ open, onOpenChange, onUpload }: ExcelUploadModalProps) {
  const [parsedData, setParsedData] = useState<ExcelRowData[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState<string>("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setFileName(file.name)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data as ExcelRowData[])
      },
      error: (error) => {
        console.error("Error parsing file:", error)
      },
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxFiles: 1,
  })

  const handleUpload = async () => {
    setIsUploading(true)
    try {
      await onUpload(parsedData)
      setParsedData([])
      setFileName("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error uploading data:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setParsedData([])
    setFileName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cargar Excel de Ofertas</DialogTitle>
          <DialogDescription>
            Sube un archivo Excel o CSV con las columnas: puesto, categoria, empresa, descripcion, activo, fecha_inicio,
            fecha_fin
          </DialogDescription>
        </DialogHeader>

        {parsedData.length === 0 ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Suelta el archivo aquí...</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">Arrastra tu Excel con ofertas o haz clic para seleccionar</p>
                <p className="text-sm text-muted-foreground">Formatos aceptados: CSV, XLS, XLSX</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                <span className="font-medium">{fileName}</span>
                <Badge variant="secondary">{parsedData.length} registros</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setParsedData([])
                  setFileName("")
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Puesto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Fecha Fin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.slice(0, 10).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.puesto}</TableCell>
                      <TableCell>{row.categoria}</TableCell>
                      <TableCell>{row.empresa}</TableCell>
                      <TableCell>
                        <Badge variant={row.activo ? "default" : "secondary"}>{row.activo ? "Sí" : "No"}</Badge>
                      </TableCell>
                      <TableCell>{row.fecha_inicio}</TableCell>
                      <TableCell>{row.fecha_fin}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {parsedData.length > 10 && (
              <p className="text-sm text-muted-foreground text-center">Mostrando 10 de {parsedData.length} registros</p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
            Cancelar
          </Button>
          {parsedData.length > 0 && (
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Procesando..." : "Procesar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
