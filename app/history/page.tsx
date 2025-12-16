"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { deleteCandidate, getCVsStatus } from "@/services/cvServices";
import type { CVRecord } from "@/types";
import { cn } from "@/lib/utils";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export default function HistoryPage() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CVRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cvToDelete, setCvToDelete] = useState<CVRecord | null>(null);

  useEffect(() => {
    async function loadCVs() {
      setIsLoading(true);
      try {
        const data = await getCVsStatus();
        setCvs(data);
      } catch (error) {
        console.error("[v0] Error loading CVs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCVs();
  }, []);

  const filteredCvs = useMemo(() => {
    let filtered = [...cvs];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((cv) =>
        cv.fileName.toLowerCase().includes(query)
      );
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((cv) => new Date(cv.uploadDate) >= fromDate);
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((cv) => new Date(cv.uploadDate) <= toDate);
    }

    return filtered;
  }, [cvs, searchQuery, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredCvs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCvs = filteredCvs.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateFrom, dateTo]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status: CVRecord["status"]) => {
    switch (status) {
      case "Cargado":
        return (
          <Badge variant="secondary" className="gap-1.5">
            <Clock className="w-3 h-3" />
            Cargado
          </Badge>
        );
      case "Procesando...":
        return (
          <Badge className="gap-1.5 bg-amber-500 hover:bg-amber-600">
            <Loader2 className="w-3 h-3 animate-spin" />
            Procesando
          </Badge>
        );
      case "Procesado":
        return (
          <Badge className="gap-1.5 bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="w-3 h-3" />
            Procesado
          </Badge>
        );
      case "Error":
        return (
          <Badge variant="destructive" className="gap-1.5">
            <AlertCircle className="w-3 h-3" />
            Error
          </Badge>
        );
    }
  };

  const handleViewResults = (cv: CVRecord) => {
    if (cv.status === "Procesado" && cv.detailsLink) {
      router.push(`/cv-extracted/${cv.id}`);
    }
  };

  const handleDeleteClick = (cv: CVRecord) => {
    setCvToDelete(cv);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cvToDelete) return;

    setIsDeleting(true);
    try {
      const success = await deleteCandidate(cvToDelete.id);
      if (success) {
        toast.success(
          `Candidato "${cvToDelete.fileName}" eliminado exitosamente.`
        );
        setCvs((prevCvs) => prevCvs.filter((cv) => cv.id !== cvToDelete.id));
      } else {
        toast.error(
          `No se pudo eliminar el candidato "${cvToDelete.fileName}".`
        );
      }
    } catch (error: any) {
      console.error("Error al eliminar candidato:", error);
      toast.error(
        `Error al eliminar el candidato: ${
          error.message || "Error desconocido."
        }`
      );
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCvToDelete(null);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Cargando historial de CVs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
          Historial de Procesamiento de CVs
        </h1>
        <p className="text-muted-foreground text-lg text-pretty">
          Revisa el estado de tus cargas y accede a los detalles de los CVs
          procesados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CVs Registrados</CardTitle>
          <CardDescription>
            {filteredCvs.filter((cv) => cv.status === "Procesado").length} de{" "}
            {filteredCvs.length} CVs procesados completamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search input */}
              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="search">Buscar por nombre de archivo</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar CVs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              {/* Date range filters */}
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Desde</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  max={dateTo || undefined}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">Hasta</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  min={dateFrom || undefined}
                />
              </div>
            </div>

            {/* Active filters summary */}
            {(searchQuery || dateFrom || dateTo) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Mostrando {filteredCvs.length} resultados</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setDateFrom("");
                    setDateTo("");
                  }}
                  className="h-auto py-1 px-2"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>

          {/* CV List */}
          {paginatedCvs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No se encontraron CVs con los filtros aplicados.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedCvs.map((cv) => (
                <div
                  key={cv.id}
                  className={cn(
                    "flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border transition-colors",
                    cv.status === "Error"
                      ? "bg-destructive/5 border-destructive/20"
                      : "bg-card hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {cv.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(cv.uploadDate)}
                      </p>
                      {cv.status === "Error" && cv.errorMessage && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {cv.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4">
                    {getStatusBadge(cv.status)}

                    {cv.status === "Procesado" && cv.detailsLink && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 bg-transparent"
                        onClick={() => handleViewResults(cv)}
                      >
                        <Eye className="w-4 h-4" />
                        Ver Resultados
                      </Button>
                    )}

                    {cv.status !== "Procesado" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        className="gap-2 bg-transparent"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Resultados
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteClick(cv)}
                    >
                      {isDeleting && cvToDelete?.id === cv.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredCvs.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1}-
                {Math.min(endIndex, filteredCvs.length)} de {filteredCvs.length}{" "}
                resultados
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="gap-1 bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="gap-1 bg-transparent"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        fileName={cvToDelete?.fileName || ""}
      />
    </div>
  );
}
