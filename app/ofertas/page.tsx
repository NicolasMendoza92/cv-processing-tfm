"use client"

import { useState } from "react"
import { Plus, FileUp, Loader2, Edit, Trash2, Search } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExcelUploadModal } from "@/components/excel-upload-modal"
import { ExcelRowData, JobOffer, JobOfferFormData } from "@/types"
import { toast } from "sonner"
import { JobOfferFormModal } from "@/components/job-offer-modal"

const mockOffers: JobOffer[] = [
  {
    id: "1",
    puesto: "Desarrollador Full Stack",
    categoria: "Desarrollo",
    empresa: "Tech Solutions S.A.",
    descripcion: "Buscamos desarrollador con experiencia en React y Node.js para proyecto innovador.",
    activo: true,
    fechaInicio: new Date("2024-01-15"),
    fechaFin: new Date("2024-06-30"),
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    puesto: "Diseñador UX/UI",
    categoria: "Diseño",
    empresa: "Creative Studio",
    descripcion: "Diseñador con portafolio sólido para proyectos de aplicaciones móviles y web.",
    activo: true,
    fechaInicio: new Date("2024-02-01"),
    fechaFin: null,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    puesto: "Especialista en Marketing Digital",
    categoria: "Marketing",
    empresa: "Marketing Plus",
    descripcion: "Gestión de campañas en redes sociales y SEO. Experiencia mínima 2 años.",
    activo: false,
    fechaInicio: new Date("2023-11-01"),
    fechaFin: new Date("2024-01-15"),
    createdAt: new Date("2023-10-15"),
  },
  {
    id: "4",
    puesto: "Ejecutivo de Ventas",
    categoria: "Ventas",
    empresa: "Retail Corp",
    descripcion: "Ventas B2B con enfoque en soluciones tecnológicas para empresas medianas.",
    activo: true,
    fechaInicio: new Date("2024-01-10"),
    fechaFin: new Date("2024-12-31"),
    createdAt: new Date("2024-01-05"),
  },
]

export default function OfertasPage() {
  const [offers, setOffers] = useState<JobOffer[]>(mockOffers)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<JobOffer | null>(null)
  const [loadingMatchingId, setLoadingMatchingId] = useState<string | null>(null)

  const handleSaveOffer = async (data: JobOfferFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (editingOffer) {
      setOffers(offers.map((offer) => (offer.id === editingOffer.id ? { ...offer, ...data } : offer)))
      toast( "Oferta actualizada")
    } else {
      const newOffer: JobOffer = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
      }
      setOffers([newOffer, ...offers])
      toast("Oferta creada")
    }
    setEditingOffer(null)
  }

  const handleExcelUpload = async (data: ExcelRowData[]) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newOffers: JobOffer[] = data.map((row) => ({
      id: Date.now().toString() + Math.random(),
      puesto: row.puesto,
      categoria: row.categoria as JobOffer["categoria"],
      empresa: row.empresa,
      descripcion: row.descripcion || "",
      activo: typeof row.activo === "boolean" ? row.activo : row.activo === "true" || row.activo === "1",
      fechaInicio: row.fecha_inicio ? new Date(row.fecha_inicio) : null,
      fechaFin: row.fecha_fin ? new Date(row.fecha_fin) : null,
      createdAt: new Date(),
    }))

    setOffers([...newOffers, ...offers])
    toast("Ofertas cargadas")
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setOffers(offers.map((offer) => (offer.id === id ? { ...offer, activo: !currentStatus } : offer)))
    toast("Estado actualizado")
  }

  const handleFindMatches = async (offerId: string) => {
    setLoadingMatchingId(offerId)

    // Simulate microservice call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setLoadingMatchingId(null)
    toast("Búsqueda completada")
  }

  const handleDeleteOffer = async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setOffers(offers.filter((offer) => offer.id !== id))
    toast.error("Oferta eliminada")
  }

  const handleEditOffer = (offer: JobOffer) => {
    setEditingOffer(offer)
    setIsFormModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingOffer(null)
    setIsFormModalOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Ofertas Laborales</h1>
          <p className="text-muted-foreground mt-1">
            Administra las ofertas de trabajo y encuentra candidatos compatibles
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Añadir Oferta
          </Button>
          <Button onClick={() => setIsExcelModalOpen(true)} variant="outline" className="gap-2">
            <FileUp className="w-4 h-4" />
            Cargar Excel
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
            <h3 className="text-xl font-semibold mb-2">No hay ofertas activas</h3>
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
              {offers.length} {offers.length === 1 ? "oferta registrada" : "ofertas registradas"}
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
                      <TableCell className="font-medium">{offer.puesto}</TableCell>
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
                        {offer.fechaInicio ? format(offer.fechaInicio, "dd/MM/yyyy", { locale: es }) : "-"}
                      </TableCell>
                      <TableCell>
                        {offer.fechaFin ? format(offer.fechaFin, "dd/MM/yyyy", { locale: es }) : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Switch
                            checked={offer.activo}
                            onCheckedChange={() => handleToggleActive(offer.id, offer.activo)}
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
                          <Button variant="ghost" size="icon" onClick={() => handleEditOffer(offer)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteOffer(offer.id)}>
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
          setIsFormModalOpen(open)
          if (!open) setEditingOffer(null)
        }}
        onSave={handleSaveOffer}
        editingOffer={editingOffer}
      />

      <ExcelUploadModal open={isExcelModalOpen} onOpenChange={setIsExcelModalOpen} onUpload={handleExcelUpload} />
    </div>
  )
}
