"use client";

import { useEffect, useState } from "react";
import { Plus, FileUp, Loader2, Edit, Trash2, Search } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExcelUploadModal } from "@/components/excel-upload-modal";
import { ExcelRowData, JobOffer, JobOfferFormData } from "@/types";
import { toast } from "sonner";
import { JobOfferFormModal } from "@/components/job-offer-modal";
import {
  bulkCreateOffers,
  createOffer,
  deleteOffer,
  getOffers,
  updateOffer,
} from "@/services/offerServices";

export default function OfertasPage() {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<JobOffer | null>(null);
  const [loadingMatchingId, setLoadingMatchingId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const data = await getOffers();
      setOffers(data);
    } catch {
      toast.error("Error al cargar las ofertas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOffer = async (data: JobOfferFormData) => {
    setIsSaving(true);
    try {
      if (editingOffer) {
        const updated = await updateOffer(editingOffer.id, data);
        setOffers((prev) =>
          prev.map((o) => (o.id === editingOffer.id ? updated : o))
        );
        toast.success("Oferta actualizada");
      } else {
        const created = await createOffer(data);
        setOffers((prev) => [created, ...prev]);
        toast.success("Oferta creada");
      }
      setIsFormModalOpen(false);
      setEditingOffer(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExcelUpload = async (rows: ExcelRowData[]) => {
    try {
      const result = await bulkCreateOffers(rows); 
      toast.success(`${result.count} ofertas importadas`);
      await loadOffers();
      setIsExcelModalOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    const offerToUpdate = offers.find((o) => o.id === id);
    if (!offerToUpdate) return;

    try {
      const updated = await updateOffer(id, {
        ...offerToUpdate,
        activo: !current,
      });
      setOffers((prev) => prev.map((o) => (o.id === id ? updated : o)));
      toast.success("Estado actualizado");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleFindMatches = async (offerId: string) => {
    setLoadingMatchingId(offerId);

    // Simulate microservice call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setLoadingMatchingId(null);
    toast("Búsqueda completada");
  };

  const handleDeleteOffer = async (id: string) => {
    setIsDeleting((prev) => ({ ...prev, [id]: true }));
    try {
      await deleteOffer(id);
      setOffers((prev) => prev.filter((o) => o.id !== id));
      toast.success("Oferta eliminada");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleEditOffer = (offer: JobOffer) => {
    setEditingOffer(offer);
    setIsFormModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingOffer(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestión de Ofertas Laborales
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra las ofertas de trabajo y encuentra candidatos compatibles
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Añadir Oferta
          </Button>
          <Button
            onClick={() => setIsExcelModalOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <FileUp className="w-4 h-4" />
            Cargar CSV
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {offers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No hay ofertas activas
            </h3>
            <p className="text-muted-foreground mb-6">¡Añade la primera!</p>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="w-4 h-4" />
              Crear Primera Oferta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Ofertas Laborales</CardTitle>
            <CardDescription>
              {offers.length}{" "}
              {offers.length === 1
                ? "oferta registrada"
                : "ofertas registradas"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Puesto</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Fecha Fin</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">
                        {offer.puesto}
                      </TableCell>
                      <TableCell>{offer.empresa}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{offer.categoria}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={offer.activo ? "default" : "secondary"}>
                          {offer.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {offer.fechaInicio
                          ? format(offer.fechaInicio, "dd/MM/yyyy", {
                              locale: es,
                            })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {offer.fechaFin
                          ? format(offer.fechaFin, "dd/MM/yyyy", { locale: es })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Switch
                            checked={offer.activo}
                            onCheckedChange={() =>
                              handleToggleActive(offer.id, offer.activo)
                            }
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFindMatches(offer.id)}
                            disabled={loadingMatchingId === offer.id}
                            className="gap-1"
                          >
                            {loadingMatchingId === offer.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Buscando...
                              </>
                            ) : (
                              <>
                                <Search className="w-3 h-3" />
                                Buscar Matches
                              </>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditOffer(offer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteOffer(offer.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <JobOfferFormModal
        open={isFormModalOpen}
        onOpenChange={(open) => {
          setIsFormModalOpen(open);
          if (!open) setEditingOffer(null);
        }}
        onSave={handleSaveOffer}
        editingOffer={editingOffer}
      />

      <ExcelUploadModal
        open={isExcelModalOpen}
        onOpenChange={setIsExcelModalOpen}
        onUpload={handleExcelUpload}
      />
    </div>
  );
}
