"use server";

import { ExcelRowData, JobOffer, JobOfferFormData } from "@/types";

const API_BASE_URL = process.env.API_BASE_URL;
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Función que recupera todos los candidatos
export async function getOffers(): Promise<JobOffer[]> {
  const response = await fetch(`${baseUrl}/api/offers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Fallo al obtener los candidatos");
  }

  const offers = await response.json();
  return offers;
}

export async function createOffer(data: JobOfferFormData): Promise<JobOffer> {
  const response = await fetch(`${baseUrl}/api/offers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear el candidato");
  }

  return response.json();
}

export async function updateOffer(
  id: string,
  updatedData: JobOfferFormData
): Promise<JobOffer> {
  console.log("Actualizando candidato con id:", id);
  try {
    const response = await fetch(`${baseUrl}/api/offers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.errors?.length) {
        const details = errorData.errors
          .map((e: any) => `${e.path.join(".")}: ${e.message}`) // ➜ muestra campo + mensaje
          .join(" | ");
        throw new Error(`Errores de validación: ${details}`);
      }
      throw new Error(errorData.message || "Error al actualizar el candidato.");
    }
    return response.json();
  } catch (error) {
    console.error(`Fallo al actualizar oferta con ID ${id}:`, error);
    throw error;
  }
}

export async function deleteOffer(id: string) {
  try {
    const response = await fetch(`${baseUrl}/api/offers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al borrar el candidato.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Fallo al borrar candidato con ID ${id}:`, error);
    throw error;
  }
}

/* ---------- BULK CREATE FROM EXCEL ---------- */
export async function bulkCreateOffers(
  rows: ExcelRowData[]
): Promise<{ count: number }> {
  const payload = rows.map((r) => ({
    puesto: r.puesto,
    categoria: r.categoria,
    empresa: r.empresa,
    descripcion: r.descripcion || "",
    activo:true,
    fechaInicio: r.fecha_inicio ? new Date(r.fecha_inicio) : null,
    fechaFin: r.fecha_fin ? new Date(r.fecha_fin) : null,
  }));

  const res = await fetch(`${baseUrl}/api/offers/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ offers: payload }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al crear ofertas masivas");
  }
  return res.json();
}
